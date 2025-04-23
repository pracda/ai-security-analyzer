const express = require('express');
const { generateFileHash } = require('../utils/hash');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configure S3
const s3 = new AWS.S3({
    region: 'us-east-1',
    // accessKeyId: 'YOUR_ACCESS_KEY',
    // secretAccessKey: 'YOUR_SECRET_KEY',
});

// AWS Bedrock configuration (add appropriate access keys)
const bedrock = new AWS.Bedrock({
    region: 'us-east-1',
    // credentials config if needed
});

// Metadata route
router.post('/', async (req, res) => {
    const { filePath } = req.body;

    if (!filePath) {
        console.error("File path is missing.");
        return res.status(400).send('File path is required');
    }

    console.log("Received filePath:", filePath);

    try {
        const params = {
            Bucket: 'malware-detection-logs',
            Key: filePath,
        };

        const fileData = await s3.getObject(params).promise();
        console.log("File data fetched successfully");

        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const tempFilePath = path.join(tempDir, filePath.split('/').pop());
        fs.writeFileSync(tempFilePath, fileData.Body);

        const stats = fs.statSync(tempFilePath);
        const metadata = {
            fileName: filePath.split('/').pop(),
            fileSize: stats.size,
            fileHash: generateFileHash(tempFilePath),
        };

        fs.unlinkSync(tempFilePath);

        res.json({ metadata });
    } catch (error) {
        console.error("Error generating metadata:", error);
        res.status(500).send('Error generating metadata');
    }
});

// Fetch Bedrock insights
router.post('/bedrock-insights', async (req, res) => {
    const { metadata } = req.body;

    if (!metadata) {
        console.error("Metadata is missing.");
        return res.status(400).send('Metadata is required');
    }

    try {
        // Replace this with your actual Bedrock interaction logic
        const insights = `Insights for file: ${metadata.fileName}`;
        res.json({ insights });
    } catch (error) {
        console.error("Error fetching Bedrock insights:", error);
        res.status(500).send('Error fetching Bedrock insights');
    }
});

module.exports = router;