// ─── Metadata stripping ────────────────────────────────────────────────────────

/**
 * Strip metadata from a File before encryption.
 * - Images (jpeg/png/gif/webp/bmp): redrawn through canvas → pure pixel data, zero EXIF
 * - Videos/Audio: passed through (no reliable in-browser strip without heavy libs)
 * - Everything else: passed through (encrypted anyway)
 */
export async function stripMetadata(file) {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff']

  if (imageTypes.includes(file.type)) {
    return stripImageMetadata(file)
  }

  // For all other file types, return as-is
  // They will still be encrypted — metadata is obscured by AES-256-GCM
  return file
}

/**
 * Strip EXIF / XMP / IPTC and all metadata from an image by re-drawing
 * it through an off-screen canvas. The output is a clean PNG or JPEG blob
 * with only raw pixel data — no GPS, device, timestamp, or any other metadata.
 */
async function stripImageMetadata(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')
      // Fill with white background first (handles transparent PNGs going to JPEG)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)

      URL.revokeObjectURL(url)

      // Keep original mime type if it's a supported canvas output type
      // Canvas can output: image/png, image/jpeg, image/webp
      // For gif/bmp/tiff → output as png (still lossless, just re-encoded)
      const outputType = ['image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)
        ? file.type
        : 'image/png'

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Canvas failed (e.g. tainted canvas) — fall back to original file
            console.warn('[Veilora] Canvas metadata strip failed, using original file')
            resolve(file)
            return
          }
          // Return as a File so the rest of the pipeline (encryptFile) works identically
          const stripped = new File([blob], file.name, {
            type: outputType,
            lastModified: Date.now(), // don't leak original timestamp
          })
          resolve(stripped)
        },
        outputType,
        0.95 // quality for jpeg/webp — high but not lossless to keep file size sane
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      // If image fails to load (corrupt / unsupported), pass original through
      console.warn('[Veilora] Image load failed during metadata strip, using original file')
      resolve(file)
    }

    img.src = url
  })
}

// ─── Key derivation ────────────────────────────────────────────────────────────

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

// ─── Encrypt ──────────────────────────────────────────────────────────────────

export async function encryptFile(file, password) {
  // Strip metadata before encrypting
  const cleanFile = await stripMetadata(file)

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv   = crypto.getRandomValues(new Uint8Array(12))
  const key  = await deriveKey(password, salt)

  const fileBuffer = await cleanFile.arrayBuffer()
  const encrypted  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, fileBuffer)

  return {
    encryptedBlob: new Blob([encrypted], { type: 'application/octet-stream' }),
    iv:   btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt)),
  }
}

// ─── Decrypt ──────────────────────────────────────────────────────────────────

export async function decryptFile(encryptedBuffer, password, ivB64, saltB64, mimeType) {
  const iv   = Uint8Array.from(atob(ivB64),   c => c.charCodeAt(0))
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0))
  const key  = await deriveKey(password, salt)

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedBuffer)
  return new Blob([decrypted], { type: mimeType || 'application/octet-stream' })
}