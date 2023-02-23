const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const uuidv4 = require('uuid/v4');
// import { v4 as uuidv4 } from 'uuid';

const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.json());


const users = [];

// User registration endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const apiKey = uuidv4();

  users.push({ username, password, apiKey });
  
  res.json({ apiKey });
});

// User login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }
  
  res.json({ apiKey: user.apiKey });
});


// API key authentication middleware
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const user = users.find(u => u.apiKey === apiKey);
  
    if (!user) {
      res.status(401).json({ message: 'Invalid API key' });
      return;
    }
  
    next();
  }
  
  // Protect endpoints with API key authentication
  app.use('/api', apiKeyAuth);
  
  // Protected endpoint
  app.get('/api/protected', (req, res) => {
    res.json({ message: 'This endpoint is protected by API key authentication' });
  });
  