const BASE_URL = "http://localhost:8080"

class PixelVoip{
    constructor(){
        
    }

    async authenticate(){
        let joinInfo = (await joinMeeting()).JoinInfo;
        const configuration = new MeetingSessionConfiguration(joinInfo.Meeting, joinInfo.Attendee);
        await this.initializeMeetingSession(configuration);
        const url = new URL(window.location.href);
        url.searchParams.set('m', this.meeting);
        history.replaceState({}, `${this.meeting}`, url.toString());
        return configuration.meetingId;
    }
    
    async joinMeeting() {
        const response = await fetch(
          `${BASE_URL}join`,
          {
            method: 'GET',
          }
        );
        const json = await response.json();
        if (json.error) {
          throw new Error(`Server error: ${json.error}`);
        }
        return json;
    }
    
    async endMeeting(){
        await fetch(`${DemoMeetingApp.BASE_URL}end?title=${encodeURIComponent(this.meeting)}`, {
          method: 'POST',
        });
    }

    async initializeMeetingSession(configuration) {
        let logger;
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
          logger = new ConsoleLogger('SDK', LogLevel.INFO);
        } else {
          await this.createLogStream(configuration);
          logger = new MeetingSessionPOSTLogger(
            'SDK',
            configuration,
            DemoMeetingApp.LOGGER_BATCH_SIZE,
            DemoMeetingApp.LOGGER_INTERVAL_MS,
            `${DemoMeetingApp.BASE_URL}logs`,
            LogLevel.INFO
          );
        }
        const deviceController = new DefaultDeviceController(logger);
        configuration.enableWebAudio = this.enableWebAudio;
        configuration.enableUnifiedPlanForChromiumBasedBrowsers = this.enableUnifiedPlanForChromiumBasedBrowsers;
        configuration.enableSimulcastForUnifiedPlanChromiumBasedBrowsers = this.enableSimulcast;
        this.meetingSession = new DefaultMeetingSession(configuration, logger, deviceController);
        this.audioVideo = this.meetingSession.audioVideo;
    
        this.audioVideo.addDeviceChangeObserver(this);
        this.setupDeviceLabelTrigger();
        await this.populateAllDeviceLists();
        this.setupMuteHandler();
        this.setupCanUnmuteHandler();
        this.setupSubscribeToAttendeeIdPresenceHandler();
        this.audioVideo.addObserver(this);
    }

    async createLogStream(configuration) {
        const body = JSON.stringify({
          meetingId: configuration.meetingId,
          attendeeId: configuration.credentials.attendeeId,
        });
        try {
          const response = await fetch(`${DemoMeetingApp.BASE_URL}create_log_stream`, {
            method: 'POST',
            body
          });
          if (response.status === 200) {
            console.log('Log stream created');
          }
        } catch (error) {
          console.error(error.message);
        }
      }

      populateDeviceList(
        elementId,
        genericName,
        devices,
        additionalOptions
      ) {
        const list = document.getElementById(elementId);
        while (list.firstElementChild) {
          list.removeChild(list.firstElementChild);
        }
        for (let i = 0; i < devices.length; i++) {
          const option = document.createElement('option');
          list.appendChild(option);
          option.text = devices[i].label || `${genericName} ${i + 1}`;
          option.value = devices[i].deviceId;
        }
        if (additionalOptions.length > 0) {
          const separator = document.createElement('option');
          separator.disabled = true;
          separator.text = '──────────';
          list.appendChild(separator);
          for (const additionalOption of additionalOptions) {
            const option = document.createElement('option');
            list.appendChild(option);
            option.text = additionalOption;
            option.value = additionalOption;
          }
        }
        if (!list.firstElementChild) {
          const option = document.createElement('option');
          option.text = 'Device selection unavailable';
          list.appendChild(option);
        }
      }
}


window.addEventListener('load', () => {
    new PixelVoip();
});