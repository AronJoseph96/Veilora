import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '../supabase'
import api from '../api'
import { encryptFile, decryptFile } from '../crypto'

export default function Dashboard() {
  const [files, setFiles] = useState([])
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [shareLinks, setShareLinks] = useState({})
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [user, setUser] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    loadFiles()
  }, [])

  async function loadFiles() {
    try {
      const { data } = await api.get('/api/files')
      setFiles(data)
    } catch {}
  }

  const onDrop = useCallback(async (accepted) => {
    if (!password) return setMsg({ text: 'Enter an encryption password before uploading.', type: 'error' })
    const file = accepted[0]
    setUploading(true)
    setMsg({ text: '', type: '' })
    try {
      const { encryptedBlob, iv, salt } = await encryptFile(file, password)
      const { data } = await api.post('/api/files/upload-url', {
        name: file.name, size: file.size, mimeType: file.type, iv, salt
      })
      await fetch(data.signedUrl, {
        method: 'PUT',
        body: encryptedBlob,
        headers: { 'Content-Type': 'application/octet-stream', 'x-upsert': 'true' }
      })
      setMsg({ text: `"${file.name}" encrypted and uploaded successfully.`, type: 'success' })
      loadFiles()
    } catch (e) {
      setMsg({ text: 'Upload failed: ' + e.message, type: 'error' })
    }
    setUploading(false)
  }, [password])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  async function downloadFile(file) {
    const pw = prompt(`Enter decryption password for "${file.name}"`)
    if (!pw) return
    try {
      // Get signed URL from backend instead of direct Supabase call
      const { data } = await api.get(`/api/files/${file.id}/download-url`)
      const res = await fetch(data.signedUrl)
      const buf = await res.arrayBuffer()
      const blob = await decryptFile(buf, pw, file.iv, file.salt, file.mime_type)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = file.name; a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('Decryption failed. Wrong password?')
    }
  }

  async function createShareLink(fileId) {
    const hours = prompt('Expire after how many hours? (leave blank = never)')
    const { data } = await api.post('/api/share', {
      fileId, expiresInHours: hours ? parseInt(hours) : null
    })
    const link = `${window.location.origin}/share/${data.token}`
    setShareLinks(prev => ({ ...prev, [fileId]: link }))
  }

  async function deleteFile(id) {
    if (!confirm('Delete this file permanently?')) return
    setDeletingId(id)
    await api.delete(`/api/files/${id}`)
    setFiles(prev => prev.filter(f => f.id !== id))
    setDeletingId(null)
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const d = dark

  return (
    <div className={`min-h-screen transition-colors duration-300 ${d ? 'bg-gray-950 text-white' : 'bg-slate-50 text-gray-900'}`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-10 border-b backdrop-blur-md ${d ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <span className={`font-bold text-lg ${d ? 'text-white' : 'text-gray-900'}`}>Veilora</span>
          </div>
          <div className="flex items-center gap-3">
            {user && <span className={`text-sm hidden sm:block ${d ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</span>}
            <button onClick={() => setDark(!d)}
              className={`p-2 rounded-xl border transition-all ${d ? 'bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {d ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM5.78 4.22a1 1 0 010 1.42l-.7.7A1 1 0 113.66 4.92l.7-.7a1 1 0 011.42 0zM4 10a1 1 0 110 2H3a1 1 0 110-2h1zm1.07 4.93a1 1 0 011.42 0l.7.7a1 1 0 11-1.42 1.42l-.7-.7a1 1 0 010-1.42zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm4.93-1.07a1 1 0 010 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7a1 1 0 011.42 0zM10 6a4 4 0 100 8 4 4 0 000-8z"/></svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>
              )}
            </button>
            <button onClick={() => supabase.auth.signOut()}
              className={`text-sm px-4 py-1.5 rounded-xl border font-medium transition-all ${d ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Stats bar */}
        <div className={`rounded-2xl p-5 border flex items-center gap-6 ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div>
            <p className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>{files.length}</p>
            <p className={`text-xs mt-0.5 ${d ? 'text-gray-400' : 'text-gray-500'}`}>Encrypted files</p>
          </div>
          <div className={`w-px h-10 ${d ? 'bg-gray-700' : 'bg-gray-200'}`}/>
          <div>
            <p className={`text-2xl font-bold ${d ? 'text-white' : 'text-gray-900'}`}>{formatSize(files.reduce((a, f) => a + (f.size || 0), 0))}</p>
            <p className={`text-xs mt-0.5 ${d ? 'text-gray-400' : 'text-gray-500'}`}>Total stored</p>
          </div>
          <div className={`w-px h-10 ${d ? 'bg-gray-700' : 'bg-gray-200'}`}/>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <p className={`text-sm ${d ? 'text-gray-300' : 'text-gray-600'}`}>End-to-end encrypted</p>
          </div>
        </div>

        {/* Encryption password */}
        <div className={`rounded-2xl p-5 border ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
            <p className={`text-sm font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Encryption key</p>
          </div>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'}
              placeholder="Password to encrypt / decrypt your files"
              className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all ${d ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20' : 'bg-slate-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'}`}
              value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${d ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              )}
            </button>
          </div>
          <p className={`text-xs mt-2 ${d ? 'text-gray-500' : 'text-gray-400'}`}>
             This password never leaves your browser — the server has zero knowledge of it.
          </p>
        </div>

        {/* Drop zone */}
        <div {...getRootProps()}
          className={`rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/5 scale-[1.01]'
              : d ? 'border-gray-700 hover:border-gray-600 bg-gray-900' : 'border-gray-200 hover:border-gray-300 bg-white shadow-sm'
          }`}>
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              <p className={`text-sm font-medium ${d ? 'text-gray-300' : 'text-gray-600'}`}>Encrypting and uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${d ? 'bg-gray-800' : 'bg-slate-100'}`}>
                <svg className={`w-7 h-7 ${isDragActive ? 'text-blue-500' : d ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
              </div>
              <div>
                <p className={`text-sm font-semibold ${d ? 'text-gray-200' : 'text-gray-700'}`}>
                  {isDragActive ? 'Drop to encrypt & upload' : 'Drag & drop your file here'}
                </p>
                <p className={`text-xs mt-1 ${d ? 'text-gray-500' : 'text-gray-400'}`}>or click to browse — encrypted before leaving your device</p>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        {msg.text && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm border ${
            msg.type === 'success'
              ? d ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
              : d ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {msg.type === 'success'
              ? <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              : <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>}
            {msg.text}
          </div>
        )}

        {/* File list */}
        <div className={`rounded-2xl border overflow-hidden ${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className={`px-5 py-4 border-b flex items-center justify-between ${d ? 'border-gray-800' : 'border-gray-100'}`}>
            <h2 className={`text-sm font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>Your files</h2>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${d ? 'bg-gray-800 text-gray-400' : 'bg-slate-100 text-gray-500'}`}>{files.length} files</span>
          </div>

          {files.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${d ? 'bg-gray-800' : 'bg-slate-100'}`}>
                <svg className={`w-6 h-6 ${d ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"/></svg>
              </div>
              <p className={`text-sm ${d ? 'text-gray-500' : 'text-gray-400'}`}>No files uploaded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-opacity-50">
              {files.map(file => (
                <div key={file.id} className={`px-5 py-4 transition-colors ${d ? 'divide-gray-800 hover:bg-gray-800/50' : 'divide-gray-100 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    {/* File icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${d ? 'bg-gray-800' : 'bg-slate-100'}`}>
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${d ? 'text-white' : 'text-gray-900'}`}>{file.name}</p>
                      <p className={`text-xs mt-0.5 ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatSize(file.size)} · {new Date(file.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => downloadFile(file)}
                        className={`p-2 rounded-xl transition-all ${d ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-gray-500 hover:text-gray-900'}`}
                        title="Download & decrypt">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      </button>
                      <button onClick={() => createShareLink(file.id)}
                        className={`p-2 rounded-xl transition-all ${d ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' : 'hover:bg-blue-50 text-gray-500 hover:text-blue-600'}`}
                        title="Create share link">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                      </button>
                      <button onClick={() => deleteFile(file.id)} disabled={deletingId === file.id}
                        className={`p-2 rounded-xl transition-all ${d ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-500 hover:text-red-500'}`}
                        title="Delete file">
                        {deletingId === file.id
                          ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
                      </button>
                    </div>
                  </div>
                  {shareLinks[file.id] && (
                    <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${d ? 'bg-gray-800 text-gray-400' : 'bg-slate-50 text-gray-500 border border-gray-100'}`}>
                      <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                      <span className="truncate flex-1">{shareLinks[file.id]}</span>
                      <button onClick={() => navigator.clipboard.writeText(shareLinks[file.id])}
                        className="text-blue-500 hover:text-blue-400 font-medium shrink-0 transition-colors">Copy</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}