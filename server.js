const express = require('express');
const { google } = require('googleapis');
const { auth } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 8000;
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Load your service account credentials
const keyPath = './key.json'; // Replace with the actual path to your service account key file

// Initialize the Google Calendar API client
const calendar = google.calendar({ version: 'v3' });

// Middleware to handle JSON bodies
app.use(express.json());

// Route to create a Google Meet event
app.post('/create-meet', async (req, res) => {
  try {
    // Set up Google Calendar API client
    const authClient = await auth.getClient({
      keyFile: keyPath,
      scopes: SCOPES,
    });

    var event = {
        'summary': 'Google I/O 2015',
        'location': '800 Howard St., San Francisco, CA 94103',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'dateTime': '2023-09-28T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        'end': {
          'dateTime': '2023-09-28T17:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        'recurrence': [
          'RRULE:FREQ=DAILY;COUNT=2'
        ],
        'attendees': [
          {'email': 'aagamjain573@gmail.com'},
          {'email': 'aagamjain9945@gmail.com'},
        ],
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 10},
          ],
        },
      };

    // Insert the event into the calendar
    const response = await calendar.events.insert({
      auth: authClient,
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error creating event: ', error.message);
    res.status(500).json({ error: 'Error creating event' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
