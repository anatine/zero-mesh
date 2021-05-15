import { getIdToken } from './testing-tools';
import * as shortId from 'short-uuid';
import { getFirebaseAdmin } from './utilities-firebase';

describe('Get Id Token', async () => {
  const admin = getFirebaseAdmin();
  it('should get an ID TOken', async () => {
    // Create a user
    const uid = shortId().new();
    const user = await admin.auth().createUser({ uid });
    const result = await getIdToken(admin, user.uid, { isAwesome: 'true' });
    expect(result.idToken).toBeDefined();
    await admin.auth().deleteUser(user.uid);
  });
});
