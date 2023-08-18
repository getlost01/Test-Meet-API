// app.js
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Replace 'YOUR_API_KEY' with your actual Calendarly API key or OAuth token
const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.calendarly.com';


// Route for creating a new meeting link
app.post('/create-meet-link', async (req, res) => {
  try {
    const response = await axios.post(`${apiUrl}/scheduling_links`, {
      type: 'One-on-One',
      owner: 'YOUR_CALENDAR_OWNER_EMAIL', // Replace with your calendar owner email
      event_type_uuid: 'YOUR_EVENT_TYPE_UUID', // Replace with the event type UUID you want to use
      name: 'Meet with John Doe', // Replace with the desired meeting name
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const meetLink = response.data.data.attributes.uri;
    res.json({ meetLink });
  } catch (error) {
    console.error('Error creating meet link:', error.response.data);
    res.status(error.response.status).json({ error: 'Error creating meet link' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
