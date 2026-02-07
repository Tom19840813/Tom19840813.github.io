const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = process.env.GOOGLE_API_KEY;

/**
 * Uploads a file to the Gemini Files API
 * Files are stored for 48 hours.
 */
async function uploadFile(filePath, mimeType) {
    if (!API_KEY) {
        console.error("Error: GOOGLE_API_KEY environment variable is not set.");
        process.exit(1);
    }

    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);

    console.log(`Starting upload: ${fileName} (${stats.size} bytes)`);

    try {
        // 1. Initialize Metadata
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${API_KEY}`,
            {
                file: { display_name: fileName }
            },
            {
                headers: {
                    'X-Goog-Upload-Protocol': 'resumable',
                    'X-Goog-Upload-Command': 'start',
                    'X-Goog-Upload-Header-Content-Length': stats.size,
                    'X-Goog-Upload-Header-Content-Type': mimeType,
                    'Content-Type': 'application/json',
                }
            }
        );

        const uploadUrl = response.headers['x-goog-upload-url'];

        // 2. Upload the Data
        const uploadResponse = await axios.post(uploadUrl, fs.createReadStream(filePath), {
            headers: {
                'X-Goog-Upload-Protocol': 'resumable',
                'X-Goog-Upload-Command': 'upload, finalize',
                'X-Goog-Upload-Offset': 0,
                'Content-Length': stats.size,
            }
        });

        const fileUri = uploadResponse.data.file.uri;
        console.log("\n✅ Upload successful!");
        console.log(`File URI: ${fileUri}`);
        console.log("\nAdd this URI to your GEMINI_SOURCE_URIS environment variable in Netlify.");
        console.log("(Separate multiple URIs with commas)");

        return fileUri;
    } catch (error) {
        console.error("Upload failed:", error.response ? error.response.data : error.message);
    }
}

// CLI Usage
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Usage: node scripts/upload-source.js <path_to_file> <mime_type>");
    console.log("Example: node scripts/upload-source.js my-podcast.mp3 audio/mp3");
    process.exit(0);
}

uploadFile(args[0], args[1]);
