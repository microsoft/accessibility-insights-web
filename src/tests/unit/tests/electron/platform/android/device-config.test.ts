// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConfig, parseDeviceConfig } from 'electron/platform/android/device-config';

describe('parseDeviceConfig', () => {
    it.each`
        input                                         | expectedErrorMessageSnippet
        ${null}                                       | ${'invalid DeviceConfig object'}
        ${undefined}                                  | ${'invalid DeviceConfig object'}
        ${'string'}                                   | ${'invalid DeviceConfig object'}
        ${[1, 2]}                                     | ${'invalid' /* any property ok for test */}
        ${{}}                                         | ${'invalid' /* any property ok for test */}
        ${{ irrelevant: 'irrelevant' }}               | ${'invalid' /* any property ok for test */}
        ${{ packageName: 'valid' }}                   | ${'invalid deviceName'}
        ${{ deviceName: null, packageName: 'valid' }} | ${'invalid deviceName'}
        ${{ deviceName: 1, packageName: 'valid' }}    | ${'invalid deviceName'}
        ${{ deviceName: [], packageName: 'valid' }}   | ${'invalid deviceName'}
        ${{ deviceName: {}, packageName: 'valid' }}   | ${'invalid deviceName'}
        ${{ deviceName: 'valid' }}                    | ${'invalid packageName/appIdentifier'}
        ${{ deviceName: 'valid', packageName: null }} | ${'invalid packageName/appIdentifier'}
        ${{ deviceName: 'valid', packageName: 1 }}    | ${'invalid packageName/appIdentifier'}
        ${{ deviceName: 'valid', packageName: [] }}   | ${'invalid packageName/appIdentifier'}
        ${{ deviceName: 'valid', packageName: {} }}   | ${'invalid packageName/appIdentifier'}
    `(
        'throws the expected error for invalid input $input',
        ({ input, expectedErrorMessageSnippet }) => {
            expect(() => parseDeviceConfig(input)).toThrowError(/^parseDeviceConfig: /);
            expect(() => parseDeviceConfig(input)).toThrowError(expectedErrorMessageSnippet);
        },
    );

    it('parses a valid input, ignoring irrelevant props', () => {
        const input = {
            deviceName: 'my device',
            packageName: 'app.company.com',
            irrelevantOtherProperty: 'should not appear in output',
        };
        const expectedOutput: DeviceConfig = {
            deviceName: 'my device',
            appIdentifier: 'app.company.com',
        };
        expect(parseDeviceConfig(input)).toEqual(expectedOutput);
    });
});
