import { getFirebaseAdmin, validateToken } from './utilities-firebase';
import * as admin from 'firebase-admin';
import * as shortId from 'short-uuid';
import { getTestIdToken } from './testing-tools';

describe(`Firebase Utilities`, () => {
  it('should get an instance of admin', () => {
    expect(admin.apps.length).toEqual(0);
    const firebaseAdmin = getFirebaseAdmin();
    expect(admin.apps.length).not.toEqual(0);
    expect(firebaseAdmin).toEqual(admin);
  });

  it(`Should validate a token`, async () => {
    const fbAdmin = getFirebaseAdmin();
    const uid = shortId().new();
    const user = await fbAdmin.auth().createUser({ uid });
    const { idToken } = await getTestIdToken({
      admin: fbAdmin,
      uid: user.uid,
      emulatorOptions: {
        port: 9100,
      },
    });
    // Actual validation
    const decodedUser = await validateToken(idToken, fbAdmin);
    expect(decodedUser.uid).toEqual(uid);
    // Decode with bearer in string
    const secondDecode = await validateToken(`Bearer ${idToken}`, fbAdmin);
    expect(secondDecode.uid).toEqual(uid);
    // Cleanup
    await fbAdmin.auth().deleteUser(uid);
  });

  it('Should fail to validate if a non-string is provided', async () => {
    const fbAdmin = getFirebaseAdmin();
    const badValue = [1, 2, 3] as never;
    await expect(validateToken(badValue, fbAdmin)).rejects.toThrow(
      `Token is not a string`
    );
  });
});
