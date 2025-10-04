import { DropboxSign } from '@dropbox/sign';

const client = new DropboxSign({
  apiKey: process.env.DROPBOXSIGN_API_KEY || 'hs_test_abcdef123456'
});

export async function createEmbeddedSignature({
  signerEmail,
  signerName,
  fileUrl,
  subject
}: {
  signerEmail: string;
  signerName: string;
  fileUrl: string;
  subject: string;
}) {
  const response = await client.signatureRequest.createEmbedded({
    test_mode: 1,
    client_id: 'test_client_id',
    title: subject,
    subject,
    message: 'Please review and sign this document securely.',
    signers: [
      {
        email_address: signerEmail,
        name: signerName,
        role: 'Signer'
      }
    ],
    files_url: [fileUrl]
  });

  return response.signature_request;
}
