const express = require('express');
const multer = require('multer');
const { uploadToS3 } = require('../utils/s3');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
    const file = req.file;
    try {
        // Add 'uploads/' prefix to the S3 key
        const s3Key = `uploads/${file.originalname}`;
        
        // Upload file to S3
        const s3Response = await uploadToS3(file, s3Key);
        
        res.json({
            message: 'File uploaded successfully',
            s3Key: s3Response.Key,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file to S3');
    }
});

module.exports = router;
