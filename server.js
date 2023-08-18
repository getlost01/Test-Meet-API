// index.js
const express = require('express');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const { default: axios } = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000; 

// Your credentials goes here
const CLIENT_ID = 'your_client_id.apps.googleusercontent.com';
const CLIENT_SECRET = 'your_client_secret';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback'; 

// Your cors app configuration
app.use(cors());

// Google OAuth2 configuration
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const customData = {
  name: 'Aagam Jain',
  email: 'test@gmail.com'
};

// Api for google Auth
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', 
    scope: [
      'https://www.googleapis.com/auth/calendar', 
    ],
    state: JSON.stringify(customData),
  });
  res.redirect(authUrl);
});


// Api for creating google meet after auth with google
app.get('/create-meet', async (req, res) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    console.log('oauth2Client.credentials', oauth2Client.credentials);
    var event = {
      'summary': 'Interview link test2',
      'location': 'Google Meet',
      'description': 'Meet with aaagam jain',
      'start': {
        'dateTime': '2023-09-28T09:00:00-07:00',
        'timeZone': 'Asia/Kolkata',
      },
      'end': {
        'dateTime': '2023-09-28T17:00:00-07:00',
        'timeZone': 'Asia/Kolkata',
      },
      'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
      ],
      'attendees': [
        {'email': 'aagamjain.test1@gmail.com'},
        {'email': 'aagamjain.test2@gmail.com'},
      ],
      'conferenceData': {
        'createRequest': {
          'requestId': 'tester123',
          'conferenceSolutionKey': {
            'type': 'hangoutsMeet',
          },
        },
      },
      'reminders': {
        'useDefault': true,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10},
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    // console.log('Event created: ', response.data);

    res.status(200).json({ message: 'Google Meet event created successfully' });

  } catch (error) {
    console.error('Error creating event: ', error.message);
    res.status(500).json({ error: 'Failed to create Google Meet event.' });
  }
});


// Api for google Auth callback for one time meet creation
app.get('/oauth2callback', async (req, res) => {
  const { code, state } = req.query;
  try {
    console.log('state', JSON.parse(state));
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    var event = {
      summary: 'Interview link test2',
      location: 'Google Meet',
      description: 'Meet with aaagam jain',
      start: {
        'dateTime': '2023-09-28T09:00:00-07:00',
        'timeZone': 'Asia/Kolkata',
      },
      end: {
        'dateTime': '2023-09-28T17:00:00-07:00',
        'timeZone': 'Asia/Kolkata',
      },
      attendees: [
        {'email': 'aagamjain573@gmail.com'},
        {'email': 'aagamjain9945@gmail.com'},
      ],
      conferenceData: {
        createRequest: {
          requestId: '123456765+56143',
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          {method: 'email', minutes: 24 * 60},
          {method: 'popup', minutes: 10},
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    res.send({ "Authentication" : "successful!", "message": "You can close this page now.", "link": response.data.hangoutLink});
  } catch (error) {
    console.error('Error authenticating', error);
    res.status(500).send('Authentication error!');
  }
});


app.get("*", (req, res) => {
  res.status(404).send({
      message: "Page not found 404", 
      endPoints: {
          "auth": "/auth/google",
          "create-meet": "/create-meet"
      }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
