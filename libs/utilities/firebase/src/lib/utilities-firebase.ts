import * as admin from 'firebase-admin';

export const RTDB_MICROSERVICES = `https://${process.env.PROJECT_ID}.firebaseio.com`;

export function getFirebaseAdmin(): typeof admin {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: RTDB_MICROSERVICES,
    });
    admin.firestore().settings({ ignoreUndefinedProperties: true });
  }
  return admin;
}

export async function validateToken(
  token: string,
  app: typeof admin
): Promise<admin.auth.DecodedIdToken> {
  return new Promise((resolve, reject) => {
    // Just for sanity, ensure it's a string
    if (typeof token !== 'string') {
      throw new TypeError('Token is not a string');
    }

    const cleanToken = token.toLowerCase().startsWith('bearer ')
      ? token.slice(7, token.length)
      : token;

    // Auth against the Firebase endpoint
    app
      .auth()
      .verifyIdToken(cleanToken)
      .then((decodedToken) => {
        resolve(decodedToken);
      })
      .catch((err) => reject(err));
  });
}
