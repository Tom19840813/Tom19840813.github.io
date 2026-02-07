const axios = require('axios');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const DAILY_API_KEY = process.env.DAILY_API_KEY;
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  if (!DAILY_API_KEY || !GOOGLE_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing API keys in environment variables." }),
    };
  }

  try {
    // 1. Create a Daily.co room
    const roomResponse = await axios.post(
      'https://api.daily.co/v1/rooms',
      {
        properties: {
          exp: Math.floor(Date.now() / 1000) + 3600, // Room expires in 1 hour
          enable_chat: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const roomUrl = roomResponse.data.url;
    const roomName = roomResponse.data.name;

    // 2. Create a join token for the user
    const tokenResponse = await axios.post(
      'https://api.daily.co/v1/meeting-tokens',
      {
        properties: {
          room_name: roomName,
          is_owner: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const token = tokenResponse.data.token;

    // 3. Get Source URIs from environment
    const sourceUris = process.env.GEMINI_SOURCE_URIS ? process.env.GEMINI_SOURCE_URIS.split(',') : [];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomUrl,
        token,
        sourceUris,
        message: "Room created. Sources attached.",
      }),
    };
  } catch (error) {
    console.error("Error creating Daily room:", error.response ? error.response.data : error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to initialize interactive session." }),
    };
  }
};
