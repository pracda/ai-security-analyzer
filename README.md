# Malware Detection System
This repository contains a full-stack web application for detecting malware in uploaded files. The frontend is built with React, and the backend uses Node.js with Express, integrated with AWS services (S3, Bedrock) and VirusTotal for file analysis. The system allows users to upload files, generate metadata, check for malware using VirusTotal, and analyze potential risks with AWS Bedrock.
Table of Contents

# Project Overview
**Architecture**\
**Prerequisites**\
**Repository Structure**\
**Setup Instructions**\
**Deployment**\
**Security Considerations**\
**Troubleshooting**

# Project Overview
**The Malware Detection System enables users to:**\
Upload files to an S3 bucket.\
Generate metadata (file name, size, and hash) for the uploaded file.\
Analyze the file for malware using the VirusTotal API.\
Gain insights into potential risks using AWS Bedrock's Claude model.

The frontend provides a user-friendly interface for file uploads and displays metadata, VirusTotal results, and Bedrock insights. The backend handles file uploads, metadata generation, and interactions with external services.

# Architecture
The application leverages the following technologies and services:\
**React:** Frontend for file uploads and result display.\
**Node.js:** Express: Backend for handling API requests and file processing.\
**AWS S3:** Stores uploaded files.\
**AWS Bedrock:** Uses the Claude model (anthropic.claude-v2) for risk analysis.\
**VirusTotal API:** Scans files for malware.\
**CORS:** Configured to allow frontend-backend communication.

# Key API endpoints:

POST /upload: Uploads a file to S3 and returns the S3 key.\
POST /metadata: Generates metadata (name, size, hash) for a file.\
POST /virustotal/upload-file: Uploads a file to VirusTotal for scanning.\
POST /bedrock/analyze: Analyzes file metadata using AWS Bedrock.

# Prerequisites
To set up and run the project, ensure you have:\
**Node.js:** Version 14.x or higher.\
**AWS CLI:** Installed and configured with a profile for S3 and Bedrock access.\
**Git:** To clone the repository.\
**VirusTotal API Key:** Required for malware scanning.\
**AWS Account:** With permissions for S3 and Bedrock (Claude model access).\
**NPM:** For installing dependencies.

# Repository Structure
malware-detection-system/\
├── src/\
│   ├── components/\
│   │   ├── FileUploader.js       # Component for file uploads\
│   │   ├── MetadataDisplay.js    # Displays file metadata\
│   │   ├── VirusTotalResults.js  # Displays VirusTotal scan results\
│   │   └── BedrockInsights.js    # Displays Bedrock analysis\
│   ├── App.js                    # Main React component\
│   ├── index.js                  # React entry point\
│   └── index.css                 # Global CSS styles\
├── routes/\
│   ├── upload.js                 # Handles file uploads to S3\
│   ├── metadata.js               # Generates file metadata\
│   ├── virusTotal.js             # Interacts with VirusTotal API\
│   └── bedrock.js                # Interacts with AWS Bedrock\
├── utils/\
│   ├── s3.js                     # S3 utility functions\
│   └── hash.js                   # File hash generation\
├── server.js                     # Express server setup\
├── .env                          # Environment variables (not in repo)\
├── package.json                  # Node.js dependencies\
└── README.md                     # This file

# Setup Instructions

**Clone the Repository:**\
git clone https://github.com/<your-username>/malware-detection-system.git\
cd malware-detection-system

**Install Dependencies:**\
Frontend:**npm install**\
Backend (in the root directory):**npm install express cors dotenv multer aws-sdk axios form-data @aws-sdk/client-bedrock-runtime**

**Configure AWS CLI:**\
Set up an AWS profile with access to S3 and Bedrock:\
aws configure

Provide your AWS Access Key, Secret Key, region (us-east-1), and output format (json).

**Set Up Environment Variables:**\
Create a .env file in the root directory with the following:\
**VIRUSTOTAL_API_KEY**=your_virustotal_api_key\
**AWS_ACCESS_KEY_ID**=your_aws_access_key\
**AWS_SECRET_ACCESS_KEY**=your_aws_secret_key\
**AWS_REGION**=us-east-1\
**S3_BUCKET_NAME**=malware-detection-logs

Note: Do not commit the .env file to Git. Add it to .gitignore.\
**Start the Backend**:\
node server.js\
The server runs on http://localhost:3000.

**Start the Frontend:**\
In a separate terminal:\
npm start\
The React app runs on http://localhost:3001.

**Deployment**
**Backend Deployment**\
Deploy to a Server (e.g., AWS EC2, Heroku):

Copy the project files to the server.
Install dependencies (npm install).\
Set up environment variables on the server.\
Run node server.js.


Configure CORS:Update the cors configuration in server.js to match your frontend's production URL:\
app.use(cors({\
    origin: 'https://your-frontend-domain.com',\
    methods: ['GET', 'POST', 'PUT', 'DELETE'],\
    allowedHeaders: ['Content-Type', 'Authorization'],\
}));

**Frontend Deployment**\
Build the React App:\
npm run build

Deploy to S3:Upload the build/ directory to an S3 bucket configured for static website hosting:\
aws s3 sync build/ s3://<your-bucket-name> --region us-east-1\

Set Up CloudFront (Optional):Create a CloudFront distribution for the S3 bucket to enable HTTPS and faster content delivery.

# Usage
Access the Application:Open the frontend URL (http://localhost:3001 locally or the deployed URL).\
Upload a File:Use the file uploader to select and upload a file. The file is stored in the S3 bucket (malware-detection-logs).

# View Results:
**Metadata**: Displays the file name, size, and hash.\
**VirusTotal Results**: Shows malware scan results (requires a valid API key).\
**Bedrock Insights**: Provides risk analysis based on metadata.

# Security Considerations
The following sensitive information should not be shared in the Git repository:

# AWS Credentials:
AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in metadata.js (commented out) and .env.
Store these in the .env file or use AWS IAM roles for deployed environments.

# VirusTotal API Key:
Stored in VIRUSTOTAL_API_KEY in the .env file.\
Never hardcode this in virusTotal.js or other files.

# S3 Bucket Name:
The bucket name (malware-detection-logs) is hardcoded in metadata.js. Consider moving it to .env for flexibility and security.

# Environment File:
The .env file contains sensitive data. Ensure it is listed in .gitignore:.env

# Recommendations:
Use AWS IAM roles for EC2 or Lambda deployments to avoid hardcoding credentials.\
Rotate API keys regularly and restrict their permissions.\
Limit S3 bucket access with proper IAM policies and bucket policies.\
Enable HTTPS for production deployments using CloudFront or a custom domain.

# Troubleshooting

**CORS Errors:**\
Ensure the cors configuration in server.js matches the frontend URL.\
Verify the frontend URL in server.js (http://localhost:3001) is correct for your environment.

**S3 Upload Fails:**\
Check AWS credentials in .env or IAM role permissions.\
Verify the S3 bucket (malware-detection-logs) exists and is accessible.

**VirusTotal API Errors:**\
Ensure VIRUSTOTAL_API_KEY is set in .env and valid.\
Check rate limits or quota issues with your VirusTotal account.

**Bedrock Errors:**\
Confirm the AWS profile has access to the anthropic.claude-v2 model.\
Verify the region (us-east-1) supports Bedrock and the Claude model.

**File Path Issues:**\
The virusTotal.js route expects a local file path. Ensure the file exists on the server or modify the route to fetch from S3 first.\
In metadata.js, ensure the temporary directory (temp/) has write permissions.
