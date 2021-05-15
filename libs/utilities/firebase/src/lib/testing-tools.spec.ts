import { getTestIdToken } from './testing-tools';
import * as shortId from 'short-uuid';
import { getFirebaseAdmin } from './utilities-firebase';

describe('Get Id Token', async () => {
  const admin = getFirebaseAdmin();
  it('should get an ID TOken', async () => {
    // Create a user
    const uid = shortId().new();
    const user = await admin.auth().createUser({ uid });
    const result = await getTestIdToken({
      admin,
      uid,
      claims: { isAwesome: 'true' },
      emulatorOptions: {
        port: 9100,
      },
    });
    expect(result.idToken).toBeDefined();
    await admin.auth().deleteUser(user.uid);
  });
});
