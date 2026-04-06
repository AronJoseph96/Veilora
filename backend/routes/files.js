import express from 'express'
import { supabase } from '../supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

const QUOTA = 40 * 1024 * 1024 // 40 MB

router.post('/upload-url', requireAuth, async (req, res) => {
  const { name, size, mimeType, iv, salt } = req.body
  if (!name || !iv || !salt) return res.status(400).json({ error: 'Missing fields' })

  const { data: usage, error: usageErr } = await supabase
    .from('files')
    .select('size')
    .eq('owner_id', req.user.id)

  if (usageErr) return res.status(500).json({ error: usageErr.message })

  const totalUsed = usage.reduce((sum, f) => sum + (f.size || 0), 0)

  if (totalUsed + (size || 0) > QUOTA) {
    return res.status(403).json({
      error: 'Storage quota exceeded. You have a 40 MB free limit.',
      used: totalUsed,
      quota: QUOTA,
    })
  }

  const storagePath = `${req.user.id}/${uuidv4()}`

  const { data: file, error } = await supabase
    .from('files')
    .insert({ owner_id: req.user.id, name, size, mime_type: mimeType, storage_path: storagePath, iv, salt })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  const { data: upload, error: uploadErr } = await supabase.storage
    .from('encrypted-files')
    .createSignedUploadUrl(storagePath)

  if (uploadErr) return res.status(500).json({ error: uploadErr.message })

  res.json({ file, signedUrl: upload.signedUrl, token: upload.token })
})

router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('owner_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.delete('/:id', requireAuth, async (req, res) => {
  const { data: file, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', req.params.id)
    .eq('owner_id', req.user.id)
    .single()

  if (error || !file) return res.status(404).json({ error: 'File not found' })

  await supabase.storage.from('encrypted-files').remove([file.storage_path])
  await supabase.from('files').delete().eq('id', req.params.id)

  res.json({ success: true })
})

router.get('/:id/download-url', requireAuth, async (req, res) => {
  const { data: file, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', req.params.id)
    .eq('owner_id', req.user.id)
    .single()

  if (error || !file) return res.status(404).json({ error: 'File not found' })

  const { data: download, error: urlErr } = await supabase.storage
    .from('encrypted-files')
    .createSignedUrl(file.storage_path, 60)

  if (urlErr) return res.status(500).json({ error: urlErr.message })

  res.json({ signedUrl: download.signedUrl })
})

router.patch('/:id', requireAuth, async (req, res) => {
  const { name } = req.body
  if (!name || typeof name !== 'string' || !name.trim())
    return res.status(400).json({ error: 'Invalid name' })
 
  const { data: file, error } = await supabase
    .from('files')
    .update({ name: name.trim() })
    .eq('id', req.params.id)
    .eq('owner_id', req.user.id)
    .select()
    .single()
 
  if (error || !file) return res.status(404).json({ error: 'File not found' })
  res.json(file)
})

export default router