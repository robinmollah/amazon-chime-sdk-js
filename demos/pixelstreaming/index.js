const express = require('express')
const app = express()
const AWS = require('aws-sdk');
const compression = require('compression');
const fs = require('fs');
const http = require('http');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const path = require("path");

const chime = new AWS.Chime({ region: 'us-east-1' });

// Set the AWS SDK Chime endpoint. The global endpoint is https://service.chime.aws.amazon.com.
chime.endpoint = new AWS.Endpoint(process.env.ENDPOINT || 'https://service.chime.aws.amazon.com');

// Store created meetings in a map so attendees can join by meeting title
const meetingTable = {};
const meetingName1 = "meeting-one";
const meetingName2 = "meeting-two";
const port = 3000;
let user_count = 0;

app.get('/join', async (req, res) => {
	if(!meetingTable[meetingName1]){
		meetingTable[meetingName1] = await chime.createMeeting({
			// Use a UUID for the client request token to ensure that any request retries
			// do not create multiple meetings.
			ClientRequestToken: uuidv4(),
			// Specify the media region (where the meeting is hosted).
			// In this case, we use the region selected by the user.
			MediaRegion: "us-east-1",
			// Any meeting ID you wish to associate with the meeting.
			// For simplicity here, we use the meeting title.
			ExternalMeetingId: requestUrl.query.title.substring(0, 64),
		  }).promise();
	}

	const meeting = meetingTable[meetingName1];
	const attendee = await chime.createAttendee({
        // The meeting ID of the created meeting to add the attendee to
        MeetingId: meeting.Meeting.MeetingId,

        // Any user ID you wish to associate with the attendeee.
        // For simplicity here, we use a random id for uniqueness
        // combined with the name the user provided, which can later
        // be used to help build the roster.
        ExternalUserId: `${uuidv4().substring(0, 8)}#${"robin"+user_count++}`.substring(0, 64),
	  }).promise();

	res.json({
        JoinInfo: {
          Meeting: meeting,
          Attendee: attendee,
		}
	});
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/app/index.html'));
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
