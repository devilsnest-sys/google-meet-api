import { Component } from '@angular/core';
declare const gapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  meetingLink!: string;

  constructor() {}

  createMeeting() {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: '805729498855-ha4lc37v3dame7v9jtcu9atpf7d2bote.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.events',
      }).then(() => {
        return gapi.auth2.getAuthInstance().signIn();
      }).then(() => {
        const event = {
          summary: 'Google Meet Meeting',
          location: 'Online',
          description: 'This is a Google Meet meeting.',
          start: {
            dateTime: new Date().toISOString(),
            timeZone: 'America/Los_Angeles', // Update to a valid time zone
          },
          end: {
            dateTime: new Date(Date.now() + 3600000).toISOString(),
            timeZone: 'America/Los_Angeles', // Update to a valid time zone
          },
          conferenceDataVersion: 1, // Set the conferenceDataVersion query parameter to 1
          conferenceData: {
            createRequest: {
              requestId:  '7qxalsvy0e', // Set a unique request ID
              conferenceSolutionKey: {
                type: 'hangoutsMeet' // Set the conference solution key type to 'hangoutsMeet'
              },
              allowedConferenceSolutionTypes: ['hangoutsMeet']
            }
          },
          attendees: [
            {'email': 'sharmapranjal588@gmail.com'},
            {'email': 'sbrin@example.com'},
          ],
        };
  
        const request = gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event,
          conferenceDataVersion: 1
        });
  
        request.then((response: any) => {
          console.log('Response:', response);
          const meetingLink = response.result &&
            response.result.conferenceData &&
            response.result.conferenceData.entryPoints &&
            response.result.conferenceData.entryPoints.find((entry: any) => entry.entryPointType === 'video')?.uri;
          if (meetingLink) {
            console.log('Meeting Link:', meetingLink); // Display the meeting link in the console
            this.meetingLink = meetingLink;
            const pTag = document.createElement('p');
            pTag.innerHTML = `Meeting Link: <a href="${meetingLink}" target="_blank">${meetingLink}</a>`;
            document.body.appendChild(pTag);
          } else {
            console.error('Meeting link not found in response.');
          }
        }).catch((error: any) => {
          console.error('Error creating event:', error);
        });
      });
    });
  }
  
  
  
}
