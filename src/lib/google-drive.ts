import { google } from 'googleapis';
import ENV from './env';

const oAuth2Client = new google.auth.OAuth2(
  ENV.GOOGLE_DRIVE_CLIENT_ID,
  ENV.GOOGLE_DRIVE_CLIENT_SECRET,
  ENV.GOOGLE_DRIVE_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: ENV.GOOGLE_DRIVE_REFRESH_TOKEN });

export const drive = google.drive({ version: 'v3', auth: oAuth2Client });