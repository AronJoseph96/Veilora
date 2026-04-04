import express from 'express'
import { supabase } from '../supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

router.post('/', requireAuth, async (req, res) => {
  const { fileId, expiresInHours } = req.body

  const { data: file } = await supabase
    .from('files')
    .select('*')
    .eq('id', fileId)
    .eq('owner_id', req.user.id)
    .single()

  if (!file) return res.status(404).json({ error: 'File not found' })

  const token = uuidv4()
  const expires_at = expiresInHours
    ? new Date(Date.now() + expiresInHours * 3600 * 1000).toISOString()
    : null

  const { data: link, error } = await supabase
    .from('share_links')
    .insert({ file_id: fileId, token, expires_at })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(link)
})

router.get('/:token', async (req, res) => {
  const { data: link } = await supabase
    .from('share_links')
    .select('*, files(*)')
    .eq('token', req.params.token)
    .single()

  if (!link) return res.status(404).json({ error: 'Invalid link' })
  if (link.revoked) return res.status(403).json({ error: 'Link revoked' })
  if (link.expires_at && new Date(link.expires_at) < new Date())
    return res.status(410).json({ error: 'Link expired' })

  const { data: download } = await supabase.storage
    .from('encrypted-files')
    .createSignedUrl(link.files.storage_path, 300)

  res.json({ file: link.files, downloadUrl: download.signedUrl })
})

router.delete('/:id', requireAuth, async (req, res) => {
  await supabase
    .from('share_links')
    .update({ revoked: true })
    .eq('id', req.params.id)
  res.json({ success: true })
})

export default router