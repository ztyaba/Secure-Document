import { google } from 'googleapis';
import crypto from 'crypto';

const SCOPES = (process.env.GOOGLE_DELEGATED_SCOPES || '').split(',');

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY).private_key : undefined,
  scopes: SCOPES,
  subject: process.env.GOOGLE_WORKSPACE_ADMIN_EMAIL
});

const drive = google.drive({ version: 'v3', auth });

export async function ensureFolderStructure(org: string, userId: string) {
  const root = await getOrCreateFolder('ClanTrust');
  const orgFolder = await getOrCreateFolder(org, root.id!);
  const userFolder = await getOrCreateFolder(userId, orgFolder.id!);
  return userFolder.id!;
}

async function getOrCreateFolder(name: string, parentId?: string) {
  const q = `mimeType='application/vnd.google-apps.folder' and name='${name}' ${parentId ? `and '${parentId}' in parents` : ''}`;
  const existing = await drive.files.list({ q, fields: 'files(id, name)' });
  if (existing.data.files && existing.data.files.length > 0) {
    return existing.data.files[0]!;
  }
  const res = await drive.files.create({
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : undefined
    },
    fields: 'id, name'
  });
  return res.data;
}

export async function uploadPlaceholderFile({
  org,
  userId,
  filename,
  content
}: {
  org: string;
  userId: string;
  filename: string;
  content: Buffer;
}) {
  const folderId = await ensureFolderStructure(org, userId);
  const res = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [folderId]
    },
    media: {
      mimeType: 'application/pdf',
      body: content
    },
    fields: 'id, name'
  });
  const checksum = crypto.createHash('sha256').update(content).digest('hex');
  return { fileId: res.data.id!, checksum };
}

export async function downloadFile(fileId: string) {
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
  return Buffer.from(res.data as ArrayBuffer);
}

export async function deleteFile(fileId: string) {
  await drive.files.update({
    fileId,
    requestBody: {
      trashed: true
    }
  });
}
