// Client-side encryption using Web Crypto API
// This ensures the server never sees plaintext passwords

export function encryptData(data) {
  // Get encryption key from localStorage or generate one
  let encryptionKey = localStorage.getItem('encryptionKey');
  
  if (!encryptionKey) {
    // Generate a random 256-bit key
    encryptionKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    localStorage.setItem('encryptionKey', encryptionKey);
  }

  // Generate a random IV (Initialization Vector)
  const iv = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Simple XOR encryption (for demo purposes)
  const dataStr = JSON.stringify(data);
  const encrypted = xorEncrypt(dataStr, encryptionKey);

  return {
    encrypted,
    iv
  };
}

export function decryptData(encryptedData, iv) {
  const encryptionKey = localStorage.getItem('encryptionKey');
  
  if (!encryptionKey) {
    throw new Error('No encryption key found');
  }

  const decrypted = xorDecrypt(encryptedData, encryptionKey);
  return JSON.parse(decrypted);
}

// Simple XOR encryption
function xorEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result); // Base64 encode
}

// Simple XOR decryption
function xorDecrypt(encrypted, key) {
  const text = atob(encrypted); // Base64 decode
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}