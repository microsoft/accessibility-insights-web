// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AndroidScanResults,
    DeviceInfo,
    RuleResultsData,
    ViewElementData,
} from 'electron/platform/android/android-scan-results';
import { set } from 'lodash';
import { buildAxeRuleResultObject, buildViewElement } from './scan-results-helpers';

describe('AndroidScanResults', () => {
    it.each`
        rawDataPath                                                      | rawDataValue                | scanResultProp         | expectedValue
        ${'rawData.AxeResults.axeContext.axeMetaData.axeVersion'}        | ${'test-axe-version'}       | ${'axeVersion'}        | ${'test-axe-version'}
        ${'rawData.AxeResults.axeContext.axeMetaData'}                   | ${undefined}                | ${'axeVersion'}        | ${'no-version'}
        ${'rawData.AxeResults.axeContext'}                               | ${undefined}                | ${'axeVersion'}        | ${'no-version'}
        ${'rawData.AxeResults'}                                          | ${undefined}                | ${'axeVersion'}        | ${'no-version'}
        ${'rawData'}                                                     | ${undefined}                | ${'axeVersion'}        | ${'no-version'}
        ${'rawData.AxeResults.axeContext.axeDevice.name'}                | ${'test-name'}              | ${'deviceName'}        | ${'test-name'}
        ${'rawData.AxeResults.axeContext.axeDevice'}                     | ${undefined}                | ${'deviceName'}        | ${null}
        ${'rawData.AxeResults.axeContext'}                               | ${undefined}                | ${'deviceName'}        | ${null}
        ${'rawData.AxeResults'}                                          | ${undefined}                | ${'deviceName'}        | ${null}
        ${'rawData'}                                                     | ${undefined}                | ${'deviceName'}        | ${null}
        ${'rawData.AxeResults.axeContext.axeDevice'}                     | ${getTestDeviceInfo()}      | ${'deviceInfo'}        | ${getTestDeviceInfo()}
        ${'rawData.AxeResults.axeContext'}                               | ${undefined}                | ${'deviceInfo'}        | ${null}
        ${'rawData.AxeResults'}                                          | ${undefined}                | ${'deviceInfo'}        | ${null}
        ${'rawData'}                                                     | ${undefined}                | ${'deviceInfo'}        | ${null}
        ${'rawData.AxeResults.axeContext.axeMetaData.appIdentifier'}     | ${'test-app-identifier'}    | ${'appIdentifier'}     | ${'test-app-identifier'}
        ${'rawData.AxeResults.axeContext.axeMetaData'}                   | ${undefined}                | ${'appIdentifier'}     | ${null}
        ${'rawData.AxeResults.axeContext'}                               | ${undefined}                | ${'appIdentifier'}     | ${null}
        ${'rawData.AxeResults'}                                          | ${undefined}                | ${'appIdentifier'}     | ${null}
        ${'rawData'}                                                     | ${undefined}                | ${'appIdentifier'}     | ${null}
        ${'rawData.AxeResults.axeRuleResults'}                           | ${getTestRuleResults()}     | ${'axeRuleResults'}    | ${getTestRuleResults()}
        ${'rawData.AxeResults.axeRuleResults'}                           | ${undefined}                | ${'axeRuleResults'}    | ${[]}
        ${'rawData.AxeResults'}                                          | ${undefined}                | ${'axeRuleResults'}    | ${[]}
        ${'rawData'}                                                     | ${undefined}                | ${'axeRuleResults'}    | ${[]}
        ${'rawData.AxeResults.axeContext.axeView'}                       | ${getTestViewElementData()} | ${'viewElementTree'}   | ${getTestViewElementData()}
        ${'rawData.AxeResults.axeContext'}                               | ${undefined}                | ${'viewElementTree'}   | ${null}
        ${'rawData.AxeResults'}                                          | ${undefined}                | ${'viewElementTree'}   | ${null}
        ${'rawData'}                                                     | ${undefined}                | ${'viewElementTree'}   | ${null}
        ${'rawData.AxeResults.axeContext.screenshot'}                    | ${'test-screenshot-data'}   | ${'screenshot'}        | ${{ base64PngData: 'test-screenshot-data' }}
        ${'rawData.AxeResults.axeContext'}                               | ${undefined}                | ${'screenshot'}        | ${null}
        ${'rawData.AxeResults'}                                          | ${undefined}                | ${'screenshot'}        | ${null}
        ${'rawData'}                                                     | ${undefined}                | ${'screenshot'}        | ${null}
        ${'rawData.AxeResults.axeContext.axeMetaData.analysisTimestamp'} | ${'test-timestamp'}         | ${'analysisTimestamp'} | ${'test-timestamp'}
        ${'rawData.AxeResults.axeContext.axeMetaData'}                   | ${undefined}                | ${'analysisTimestamp'} | ${null}
        ${'rawData.AxeResults.axeContext'}                               | ${undefined}                | ${'analysisTimestamp'} | ${null}
        ${'rawData.AxeResults'}                                          | ${undefined}                | ${'analysisTimestamp'} | ${null}
        ${'rawData'}                                                     | ${undefined}                | ${'analysisTimestamp'} | ${null}
    `(
        'get ScanResult.$scanResultProp when $rawDataPath = $rawDataValue',
        ({ rawDataPath, rawDataValue, scanResultProp, expectedValue }) => {
            const dataContainer = {};
            set(dataContainer, rawDataPath, rawDataValue);

            const testObject = new AndroidScanResults(dataContainer['rawData']);

            expect(testObject[scanResultProp]).toEqual(expectedValue);
        },
    );

    function getTestDeviceInfo(): DeviceInfo {
        return {
            dpi: 0.5,
            name: 'test-name',
            osVersion: 'test-os-version',
            screenHeight: 1,
            screenWidth: 2,
        };
    }

    function getTestRuleResults(): RuleResultsData[] {
        return [
            buildAxeRuleResultObject('Rule1', 'PASS'),
            buildAxeRuleResultObject('Rule2', 'FAIL'),
        ];
    }

    function getTestViewElementData(): ViewElementData {
        return buildViewElement(
            'id1',
            { top: 0, left: 10, bottom: 800, right: 600 },
            'myClass1',
            'myDescription1',
            'myText1',
            [
                buildViewElement('id2', null, null, null, null, null),
                buildViewElement('id3', null, null, null, null, null),
            ],
        );
    }
});
