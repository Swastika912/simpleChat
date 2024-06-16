const crypto = require('crypto');
const axios = require('axios');

// Generate a symmetric session key
const sessionKey = crypto.randomBytes(32); // 32 bytes for AES-256 encryption key

// Generate public-private key pair for the client
const { publicKey: clientPublicKey, privateKey: clientPrivateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// Fetch the server's public key
axios.get('http://your-server-url/publicKey')
  .then(response => {
    const serverPublicKey = response.data;

    // Generate the hash of the session key
    const computedHash = crypto.createHash('sha256').update(sessionKey).digest();

    // Append the hash to the session key
    const message = Buffer.concat([sessionKey, computedHash]);

    // Encrypt the message using the server's public key
    const encryptedData = crypto.publicEncrypt(serverPublicKey, message);

    // Encrypt the encryptedData using the client's private key
    const doubleEncryptedData = crypto.privateEncrypt(clientPrivateKey, encryptedData);

    // Send the doubleEncryptedData to the server for decryption
    axios.post('http://your-server-url/decrypt', { doubleEncryptedData })
      .then(response => {
        // Handle the server's response after decryption
        console.log(response.data);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error sending doubleEncryptedData:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching server public key:', error);
  });





