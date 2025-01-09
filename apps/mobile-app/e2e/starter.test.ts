import { by, device, element, expect } from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        notifications: 'YES',
        // userTracking: 'YES',
        // calendar: "YES",
        // camera: "YES",
        // contacts: "YES",
        // faceid: "YES",
        // location: "always", // or "inuse"
        // medialibrary: "YES",
        // microphone: "YES",
        // photos: "YES",
        // reminders: "YES"
      },
      newInstance: true,
    });
  });

  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  it('should have button Get Started', async () => {
    await expect(element(by.id('get_started'))).toBeVisible();
    await expect(element(by.id('get_started.button'))).toBeVisible();
    await expect(element(by.id('get_started.button.label'))).toHaveText('GET STARTED');
    await element(by.id('get_started.button')).tap();
  });
});
