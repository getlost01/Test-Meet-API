// app.js
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());


// Replace 'YOUR_CLIENT_ID' and 'YOUR_CLIENT_SECRET' with your actual Zoom app credentials
const clientId = 'ApFF2fEvSpmYYN2PeVpg8A';
const clientSecret = 'PJjLZjAoMXZIYX3pE0RKjdpKE64Ei3T7';
const redirectUri = 'http://localhost:3000/zoom/callback';


// Route for starting the OAuth flow
app.get('/zoom/auth', (req, res) => {
  res.redirect(`https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`);
});


// Callback route to handle OAuth code exchange for access token
app.get('/zoom/callback', async (req, res) => {
  try {
    const code = req.query.code;

    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    });

    const accessToken = tokenResponse.data.access_token;
    const meetingLink = await createZoomMeeting(accessToken);

    res.send(`Zoom Meeting Link: ${meetingLink}`);
  } catch (error) {
    console.error('Error obtaining access token:', error.response.data);
    res.status(error.response.status || 500).json({ error: 'Error obtaining access token' });
  }
});


// Function to create a Zoom meeting
async function createZoomMeeting(accessToken) {
  try {
    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
      topic: 'Zoom Meeting',
      type: 2, // Scheduled Meeting
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.join_url;
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response.data);
    throw new Error('Error creating Zoom meeting');
  }
}

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
