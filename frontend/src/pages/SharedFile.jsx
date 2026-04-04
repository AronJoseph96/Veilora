import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import { decryptFile } from '../crypto'

export default function SharedFile() {
  const { token } = useParams()
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/share/${token}`)
      .then(r => setInfo(r.data))
      .catch(e => setError(e.response?.data?.error || 'Invalid or expired link'))
  }, [token])

  async function download() {
    const pw = prompt(`Enter the decryption password for "${info.file.name}"`)
    if (!pw) return
    try {
      const res = await fetch(info.downloadUrl)
      const buf = await res.arrayBuffer()
      const blob = await decryptFile(buf, pw, info.file.iv, info.file.salt, info.file.mime_type)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = info.file.name; a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Decryption failed. Wrong password?')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold mb-4">Veilora</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {info && (
          <>
            <p className="text-lg font-medium mb-1">{info.file.name}</p>
            <p className="text-sm text-gray-400 mb-6">{(info.file.size / 1024).toFixed(1)} KB</p>
            <button onClick={download}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              Decrypt & Download
            </button>
            <p className="text-xs text-gray-400 mt-3">
              You need the encryption password from the file owner.
            </p>
          </>
        )}
      </div>
    </div>
  )
}