
const AWS = require('aws-sdk');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 8081;
const domain_name = "routing.eagle3dstreaming.com";
const hostname = "0.0.0.0";


const meetingTable = {};

const chime = new AWS.Chime({ region: 'us-east-1' });

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', (req, res) => {
	let serverRunning = {
		status: true,
		message: "Server is running!"
	}
	res.json(serverRunning);
});

app.post('/join', async (req, res) => {
	if (!req.query.title || !req.query.name || !req.query.region) {
		res.send('Need parameters: title, name, region');
		return;
	}

	// Look up the meeting by its title. If it does not exist, create the meeting.
	if (!meetingTable[req.query.title]) {
		meetingTable[req.query.title] = await chime.createMeeting({
			// Use a UUID for the client request token to ensure that any request retries
			// do not create multiple meetings.
			ClientRequestToken: uuidv4(),
			// Specify the media region (where the meeting is hosted).
			// In this case, we use the region selected by the user.
			MediaRegion: req.query.region,
			// Any meeting ID you wish to associate with the meeting.
			// For simplicity here, we use the meeting title.
			ExternalMeetingId: req.query.title.substring(0, 64),
		}).promise();
	}

	// Fetch the meeting info
	const meeting = meetingTable[req.query.title];

	// Create new attendee for the meeting
	const attendee = await chime.createAttendee({
		// The meeting ID of the created meeting to add the attendee to
		MeetingId: meeting.Meeting.MeetingId,

		// Any user ID you wish to associate with the attendeee.
		// For simplicity here, we use a random id for uniqueness
		// combined with the name the user provided, which can later
		// be used to help build the roster.
		ExternalUserId: `${uuidv4().substring(0, 8)}#${req.query.name}`.substring(0, 64),
	}).promise()

	// Return the meeting and attendee responses. The client will use these
	// to join the meeting.
	res.json({
		JoinInfo: {
			Meeting: meeting,
			Attendee: attendee,
		},
	});
});

app.post('/end', async (req, res) => {
	await chime.deleteMeeting({
		MeetingId: meetingTable[req.query.title].Meeting.MeetingId,
	}).promise();
	res.json({status: true,
				message: "Meeting ended permanently"
				});
});

app.get('/fetch_credentials', (req, res) => {
	const awsCredentials = {
		accessKeyId: AWS.config.credentials.accessKeyId,
		secretAccessKey: AWS.config.credentials.secretAccessKey,
		sessionToken: AWS.config.credentials.sessionToken,
	};
	res.json(awsCredentials);
});

app.listen(port, hostname,() => {
	console.log(`Chime server app listening at http://` + domain_name +`:${port}`);
});
