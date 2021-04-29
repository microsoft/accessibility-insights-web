// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UUIDGenerator } from 'common/uid-generator';
import { ToolDataDelegate } from 'electron/common/application-properties-provider';
import { AndroidFriendlyDeviceNameProvider } from 'electron/platform/android/android-friendly-device-name-provider';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
import { ConvertScanResultsToPlatformDataDelegate } from 'electron/platform/android/scan-results-to-platform-data';
import { ConvertScanResultsToUnifiedResultsDelegate } from 'electron/platform/android/scan-results-to-unified-results';
import { ConvertScanResultsToUnifiedRulesDelegate } from 'electron/platform/android/scan-results-to-unified-rules';
import { createBuilder } from 'electron/platform/android/unified-result-builder';
import { axeRuleResultExample } from 'tests/unit/tests/electron/flux/action-creator/scan-result-example';
import { It, Mock, MockBehavior } from 'typemoq';

describe('buildUnifiedScanCompletedPayload', () => {
    const exampleScanResults = new AndroidScanResults(axeRuleResultExample);

    it('builds the payload', () => {
        let friendlyNameProviderWasPassed = false;
        const generateUIDMock = Mock.ofType<UUIDGenerator>();
        const friendlyNameProviderMock = Mock.ofType<AndroidFriendlyDeviceNameProvider>(
            undefined,
            MockBehavior.Strict,
        );
        const ruleInformationProviderMock = Mock.ofType<RuleInformationProviderType>();

        const getUnifiedResultsMock = Mock.ofType<ConvertScanResultsToUnifiedResultsDelegate>();
        getUnifiedResultsMock
            .setup(converter =>
                converter(
                    exampleScanResults,
                    ruleInformationProviderMock.object,
                    generateUIDMock.object,
                ),
            )
            .returns(() => {
                return [
                    {
                        uid: 'test-result-uid',
                        status: 'pass',
                        ruleId: 'test-rule-id',
                        descriptors: null,
                        identifiers: null,
                        resolution: null,
                    },
                ];
            });

        const getUnifiedRulesMock = Mock.ofType<ConvertScanResultsToUnifiedRulesDelegate>(
            undefined,
            MockBehavior.Strict,
        );
        getUnifiedRulesMock
            .setup(converter =>
                converter(
                    exampleScanResults,
                    ruleInformationProviderMock.object,
                    generateUIDMock.object,
                ),
            )
            .returns(() => {
                return [
                    {
                        id: 'test-rule-id',
                        description: 'test-rule-description',
                        url: 'test-url',
                        guidance: [],
                    },
                ];
            });

        const getPlatformDataMock = Mock.ofType<ConvertScanResultsToPlatformDataDelegate>(
            undefined,
            MockBehavior.Strict,
        );
        getPlatformDataMock
            .setup(converter => converter(exampleScanResults, It.isAny()))
            .callback((_, provider) => {
                expect(provider).toBe(friendlyNameProviderMock.object);
                friendlyNameProviderWasPassed = true;
            })
            .returns(() => ({
                osInfo: { name: 'test-os-name', version: 'test-os-version' },
                viewPortInfo: { width: 1, height: 2, dpi: 3 },
                deviceName: 'test-device-name',
            }));

        const getToolDataMock = Mock.ofType<ToolDataDelegate>();
        getToolDataMock
            .setup(getter => getter(exampleScanResults))
            .returns(() => {
                return {
                    applicationProperties: {
                        name: 'test-app-name',
                        version: 'test-version',
                    },
                    scanEngineProperties: {
                        name: 'test-scan-engine-name',
                        version: 'test-scan-engine-version',
                    },
                };
            });

        const testSubject = createBuilder(
            getUnifiedResultsMock.object,
            getUnifiedRulesMock.object,
            getPlatformDataMock.object,
            ruleInformationProviderMock.object,
            generateUIDMock.object,
            getToolDataMock.object,
            friendlyNameProviderMock.object,
        );
        const result = testSubject(exampleScanResults);

        expect(result).toMatchSnapshot();
        expect(friendlyNameProviderWasPassed).toBe(true);
    });
});
