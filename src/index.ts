const https = require('https');
const fs = require('fs');
const express = require('express'); // Import Express

const app = express(); // Create an Express application

// Define the endpoints
app.get('/', (req:any, res:any) => {
    res.send('Hello World');
});

app.get('/api', (req:any, res:any) => {
    res.send('Hell');
});

const privateKey = fs.readFileSync('/etc/nginx/ssl/local-server.key', 'utf8');
const certificate = fs.readFileSync('/etc/nginx/ssl/local-server.crt', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
};

// Create the HTTPS server using the Express app
const httpsServer = https.createServer(credentials, app);

// Listen on a port
const PORT = process.env.PORT || 3000;
httpsServer.listen(PORT, () => {
    console.log('HTTPS Server running on port 3000');
}).on('error', (err: any) => {
    console.error('Server failed to start:', err);
});

// const express = require('express');
// const https = require('https');
// const fs = require('fs');
// const app = express();

// app.get('/', (req: any, res: any) => res.send('Hello True Shuffle!'));

// const options = {
//     hostname: 'api.example.com',
//     key: fs.readFileSync('~/etc/nginx/ssl/local-server.key'), // replace it with your key path
//     cert: fs.readFileSync('~/etc/nginx/ssl/local-server.crt'), // replace it with your certificate path
// }

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server running on port ${PORT}`);
// });