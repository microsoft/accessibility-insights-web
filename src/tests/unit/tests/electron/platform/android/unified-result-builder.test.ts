// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UUIDGeneratorType } from 'common/uid-generator';
import { ApplicationPropertiesDelegate } from 'electron/common/application-properties-provider';
import { ScanResults } from 'electron/platform/android/scan-results';
import { ConvertScanResultsToUnifiedResultsDelegate } from 'electron/platform/android/scan-results-to-unified-results';
import { ConvertScanResultsToUnifiedRulesDelegate } from 'electron/platform/android/scan-results-to-unified-rules';
import { createBuilder } from 'electron/platform/android/unified-result-builder';
import { axeRuleResultExample } from 'tests/unit/tests/electron/flux/action-creator/scan-result-example';
import { Mock, MockBehavior } from 'typemoq';

describe('buildUnifiedScanCompletedPayload', () => {
    const exampleScanResults = new ScanResults(axeRuleResultExample);

    it('builds the payload', () => {
        const generateUIDMock = Mock.ofType<UUIDGeneratorType>();

        const getUnifiedResultsMock = Mock.ofType<ConvertScanResultsToUnifiedResultsDelegate>();
        getUnifiedResultsMock
            .setup(converter => converter(exampleScanResults, generateUIDMock.object))
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

        const getUnifiedRulesMock = Mock.ofType<ConvertScanResultsToUnifiedRulesDelegate>(undefined, MockBehavior.Strict);
        getUnifiedRulesMock
            .setup(converter => converter(exampleScanResults, generateUIDMock.object))
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

        const applicationPropertiesDelegateMock = Mock.ofType<ApplicationPropertiesDelegate>(undefined, MockBehavior.Strict);
        applicationPropertiesDelegateMock
            .setup(delegate => delegate())
            .returns(() => {
                return {
                    name: 'test-app',
                    version: 'test-version',
                };
            });

        const testSubject = createBuilder(
            getUnifiedResultsMock.object,
            getUnifiedRulesMock.object,
            generateUIDMock.object,
            applicationPropertiesDelegateMock.object,
        );
        const result = testSubject(exampleScanResults);

        expect(result).toMatchSnapshot();
    });
});
