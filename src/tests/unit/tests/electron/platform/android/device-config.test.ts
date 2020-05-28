// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConfig } from 'electron/platform/android/device-config';
import { set } from 'lodash';

describe('DeviceConfig', () => {
    it.each`
        rawDataPath              | rawDataValue           | deviceConfigProp   | expectedValue
        ${'rawData.deviceName'}  | ${'test-device-name'}  | ${'deviceName'}    | ${'test-device-name'}
        ${'rawData'}             | ${undefined}           | ${'deviceName'}    | ${null}
        ${'rawData.packageName'} | ${'test-package-name'} | ${'appIdentifier'} | ${'test-package-name'}
        ${'rawData'}             | ${undefined}           | ${'appIdentifier'} | ${null}
    `(
        'gets DeviceConfig.$deviceConfigProp when $rawDataPath = $rawDataValue',
        ({ rawDataPath, rawDataValue, deviceConfigProp, expectedValue }) => {
            const dataContainer = {};
            set(dataContainer, rawDataPath, rawDataValue);

            const testSubject = new DeviceConfig(dataContainer['rawData']);

            expect(testSubject[deviceConfigProp]).toEqual(expectedValue);
        },
    );
});
