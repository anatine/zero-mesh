import * as firebase from 'firebase-admin';
import { request } from 'http';

interface IdTokenResponse {
  kind: string;
  isNewUser: boolean;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

export async function getIdToken(
  admin: typeof firebase,
  uid: string,
  claims?: Record<string, string>
): Promise<IdTokenResponse> {
  const customToken = await admin.auth().createCustomToken(uid, claims);

  return new Promise((respond, reject) => {
    const data = JSON.stringify({
      token: customToken,
      returnSecureToken: true,
    });

    const options = {
      hostname: `localhost`,
      port: 9100,
      path: `/www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.FIREBASE_APP_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    let response = '';

    const req = request(options, (res) => {
      res.on('data', (d) => {
        response += d;
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('close', () => {
      try {
        respond(JSON.parse(response));
      } catch (err) {
        throw new Error(`Invalid return: ${response}`);
      }
    });

    req.write(data);
    req.end();
  });
}
