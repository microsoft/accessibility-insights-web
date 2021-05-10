// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';

describe('AndroidDeviceFriendlyNameProvider', () => {
    const testSubject = new AndroidFriendlyDeviceNameProvider();

    it.each([null, undefined])('returns same output if input is falsy', input => {
        expect(testSubject.getFriendlyName(input)).toBe(input);
    });

    it('returns model if no match exists', () => {
        const undefinedDevice = 'No device exists with this model';

        expect(testSubject.getFriendlyName(undefinedDevice)).toBe(undefinedDevice);
    });

    it('returns friendly name if match exists', () => {
        const definedDevice = 'SM-T830';
        const expectedFriendlyName = 'SM-T830 [Samsung Galaxy Tab S4]';

        expect(testSubject.getFriendlyName(definedDevice)).toBe(expectedFriendlyName);
    });
});
