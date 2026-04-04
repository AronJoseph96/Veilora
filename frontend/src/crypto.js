export async function deriveKey(password, salt) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 310000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptFile(file, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const fileBuffer = await file.arrayBuffer()
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, fileBuffer)
  return {
    encryptedBlob: new Blob([encrypted], { type: 'application/octet-stream' }),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt))
  }
}

export async function decryptFile(encryptedBuffer, password, ivB64, saltB64, mimeType) {
  const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0))
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0))
  const key = await deriveKey(password, salt)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedBuffer)
  return new Blob([decrypted], { type: mimeType || 'application/octet-stream' })
}