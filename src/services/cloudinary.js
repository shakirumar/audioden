// Cloudinary Service for AUDIO DEN
// Handles signed image uploads directly to Cloudinary CDN

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ohhon9yl';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '664151284353543';
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || '2M-8o0ALDZtrXCWfU2yWmbXCOjQ';

/**
 * Calculates SHA-1 hex digest using native Web Crypto API
 * @param {string} message 
 * @returns {Promise<string>}
 */
async function generateSha1(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured() {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

/**
 * Upload an image file or base64 data URL to Cloudinary
 * @param {File|Blob|string} fileOrDataUrl - The image file or base64 data string
 * @param {string} folder - Folder name in Cloudinary (default: 'audioden')
 * @returns {Promise<{ url: string, secure_url: string, public_id: string }>}
 */
export async function uploadToCloudinary(fileOrDataUrl, folder = 'audioden') {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error('Cloudinary credentials are not configured.');
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Parameters to sign in alphabetical order: folder, timestamp
  const strToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
  const signature = await generateSha1(strToSign);

  const formData = new FormData();
  formData.append('file', fileOrDataUrl);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('folder', folder);
  formData.append('signature', signature);

  const uploadEndpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const response = await fetch(uploadEndpoint, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `Cloudinary upload failed (${response.status})`);
  }

  return {
    url: data.secure_url || data.url,
    secure_url: data.secure_url,
    public_id: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format
  };
}
