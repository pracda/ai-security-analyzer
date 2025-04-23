require('dotenv').config();
const cors = require('cors');
const express = require('express');
const virusTotalRoutes = require('./routes/virusTotal'); // Import VirusTotal routes
const bedrockRoutes = require('./routes/bedrock');
const metadataRoutes = require('./routes/metadata'); // Import metadata routes
const uploadRoutes = require('./routes/upload');

const app = express();

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Home page is working');
});

// Use modular routes
app.use('/virustotal', virusTotalRoutes); // Mount VirusTotal routes
app.use('/bedrock', bedrockRoutes);  // This will handle Bedrock-related requests
app.use('/upload', uploadRoutes);
app.use('/metadata', metadataRoutes);  // This will handle metadata-related requests

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});