const express = require('express');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const router = express.Router();

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });

router.post('/analyze', async (req, res) => {
    const { metadata } = req.body;

    if (!metadata) {
        return res.status(400).send('Metadata is required');
    }

    const prompt = `
    Analyze the following file metadata and predict if it indicates malware or potential risks:
    File Name: ${metadata.fileName}
    File Size: ${metadata.fileSize} bytes
    File Hash: ${metadata.fileHash}
    Provide a detailed explanation of your analysis.
    `;

    try {
        // Prepare the input for the anthropic.claude-v2 model
        const input = {
            prompt: `\n\nHuman: ${prompt}\n\nAssistant:`, // Format the prompt for Claude
            max_tokens_to_sample: 300, // Set the maximum number of tokens to generate
            temperature: 0.5, // Control the randomness of the output (optional)
            top_p: 0.9, // Control the diversity of the output (optional)
            stop_sequences: ['\n\nHuman:'], // Stop generating when this sequence is encountered (optional)
        };

        // Create the InvokeModelCommand
        const command = new InvokeModelCommand({
            modelId: 'anthropic.claude-v2', // Use the correct model ID
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(input), // Include the required parameters
        });

        // Send the request to Bedrock
        const response = await bedrockClient.send(command);

        // Parse the response body
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        // Ensure the response contains the correct body
        if (responseBody && responseBody.completion) {
            res.json({ insights: responseBody.completion });
        } else {
            console.error('Invalid response from Bedrock:', responseBody);
            res.status(500).send('Invalid response from Bedrock');
        }
    } catch (error) {
        console.error('Error generating Bedrock insights:', error);
        res.status(500).send('Error generating insights');
    }
});

module.exports = router;