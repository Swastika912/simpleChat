const express = require('express');
const app = express();

const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);




const port = 3000;

app.use(express.static(path.join(__dirname, "public2")));

app.get('/j', (req, res)=>{
    res.send("helllooooooo");
})

app.listen(port ,()=>{
    console.log(`Server is listening on port ${port}`);
});




// Generate public-private key pair for the server
const { publicKey: serverPublicKey, privateKey: serverPrivateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// Export the server's public key to a file (optional)
const publicKeyPath = __dirname + '/serverPublicKey.pem';
// fs.writeFileSync(publicKeyPath, serverPublicKey.export({ type: 'spki', format: 'pem' }));

// Serve the server's public key to the client
app.get('/publicKey', (req, res) => {
  res.sendFile(publicKeyPath);
});

// Receive the double-encrypted data from the client
app.post('/decrypt', (req, res) => {
  const doubleEncryptedData = req.body.doubleEncryptedData;
  const firstdecryptData = crypto.publicDecrypt(clientPublicKey,doubleEncryptedData)

  // Decrypt the double-encrypted data using the server's private key and client's public key
  const decryptedData = crypto.privateDecrypt(serverPrivateKey, firstdecryptData);

  // Extract the session key and hash from the decrypted data
  const sessionKey = decryptedData.Uint8Array.prototype.slice(0, 32);
  const receivedHash = decryptedData.Uint8Array.prototype.slice(32);

  // Generate the hash of the session key
  const computedHash = crypto.createHash('sha256').update(sessionKey).digest();

  // Compare the received hash with the computed hash
  const hashMatch = crypto.timingSafeEqual(receivedHash, computedHash);

  if (hashMatch) {
    res.send('Data successfully decrypted and hash matched!');
  } else {
    res.send('Hash mismatch. Data may have been tampered with!');
  }
});


// Socket.io event handling
io.on('connection', (socket) => {
    console.log('A user connected.');
  
    // Handle received encrypted messages
    socket.on('message', (encryptedMessage) => {
      // Decrypt the message using the session key
      const decipher = crypto.createDecipheriv('aes-256-cbc', sessionKey);
      let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
  
      console.log('Received message:', decrypted);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected.');
    });
  });