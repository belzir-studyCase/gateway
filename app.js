import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import { Agent } from 'https';
import fs from "fs";
import https from 'https';
import axios from "axios";
const agent = new Agent({ rejectUnauthorized: false });

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to the Gateway URL....!');
});

app.use('/account', (req, res) => {
  const method = req.method.toLowerCase();
  
  // Set up request options based on incoming method
  const options = {
    method: method,  // Use the same HTTP method
    url: 'https://localhost:3001' + req.url,  // Forward to the target service
    headers: req.headers,  // Forward the original headers
    data: req.body,  // Forward the body (for POST/PUT requests)
    httpsAgent: agent  // Use the custom agent if needed for SSL
  };
  axios(options)
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});


app.use('/request', (req, res) => {
  axios.get('https://localhost:3002' + req.url, { httpsAgent: agent })
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});

app.use('/notification', (req, res) => {
  axios.get('https://localhost:3004' + req.url, { httpsAgent: agent })
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});


https.createServer(options, app).listen(3000, () => {
  console.log('HTTPS server running on https://localhost:3000');
});
export default app;
