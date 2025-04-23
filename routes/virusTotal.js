const express = require('express');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data'); // For handling file uploads
const router = express.Router();

// Use environment variable for the VirusTotal API key
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY;

// Upload a file to VirusTotal
router.post('/upload-file', async (req, res) => {
    const { filePath } = req.body;

    if (!filePath) {
        console.error("File path is missing.");
        return res.status(400).send('File path is required');
    }

    try {
        // Read the file from the local filesystem
        const fileData = fs.readFileSync(filePath);

        // Create a FormData object and append the file
        const formData = new FormData();
        formData.append('file', fileData, {
            filename: path.basename(filePath), // Use the file name
            contentType: 'application/octet-stream', // Set the content type
        });

        // Upload the file to VirusTotal
        const response = await axios.post('https://www.virustotal.com/api/v3/files', formData, {
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY,
                ...formData.getHeaders(), // Include FormData headers
            },
        });

        res.json({ uploadResults: response.data });
    } catch (error) {
        console.error("Error uploading file to VirusTotal:", error.response ? error.response.data : error.message);
        res.status(500).send('Error uploading file to VirusTotal');
    }
});

module.exports = router;