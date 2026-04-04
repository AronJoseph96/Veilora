import express from 'express'
import { supabase } from '../supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

router.post('/upload-url', requireAuth, async (req, res) => {
  const { name, size, mimeType, iv, salt } = req.body
  if (!name || !iv || !salt) return res.status(400).json({ error: 'Missing fields' })

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

export default router