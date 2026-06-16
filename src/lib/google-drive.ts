import { Readable } from 'node:stream';
import { google } from 'googleapis';
import ENV from './env';

const oAuth2Client = new google.auth.OAuth2(
  ENV.GOOGLE_DRIVE_CLIENT_ID,
  ENV.GOOGLE_DRIVE_CLIENT_SECRET,
  ENV.GOOGLE_DRIVE_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: ENV.GOOGLE_DRIVE_REFRESH_TOKEN });

export const drive = google.drive({ version: 'v3', auth: oAuth2Client });

/**
 * Uploads a PDF buffer to the configured Drive folder, makes it readable by
 * anyone with the link, and returns its Drive file id. Files are always public;
 * the app's `status` flag only controls whether a resource is listed.
 */
export async function uploadPublicFile(buffer: Buffer, name: string): Promise<string> {
  const res = await drive.files.create({
    requestBody: { name, parents: [ENV.GOOGLE_DRIVE_FOLDER_ID] },
    media: { mimeType: 'application/pdf', body: Readable.from(buffer) },
    fields: 'id',
  });

  const driveId = res.data.id;
  if (!driveId) throw new Error('Drive upload failed: no file id returned.');

  await drive.permissions.create({
    fileId: driveId,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return driveId;
}

export async function deleteDriveFile(driveId: string): Promise<void> {
  await drive.files.delete({ fileId: driveId });
}
