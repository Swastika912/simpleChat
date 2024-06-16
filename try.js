const crypto = require("crypto")



// Generate a session key using crypto.randomBytes
const generateSessionKey2 = (length) => {
  const bytes = crypto.randomBytes(length);
  return bytes.toString('hex');
};

// Generate a session key with a length of 32 bytes (64 hexadecimal characters)
const sessionKey2 = generateSessionKey(32);
console.log(sessionKey2);


// Generate a random session key
const generateSessionKey = (length) => {
  // Define characters that can be used in the session key
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let sessionKey = '';
  for (let i = 0; i < length; i++) {
    // Generate a random index to select a character from the characters string
    const randomIndex = Math.floor(Math.random() * characters.length);
    // Append the selected character to the session key
    sessionKey += characters.charAt(randomIndex);
  }

  return sessionKey;
};

// Generate a session key with a length of 32 characters
const sessionKey = generateSessionKey(32);
console.log(sessionKey);
