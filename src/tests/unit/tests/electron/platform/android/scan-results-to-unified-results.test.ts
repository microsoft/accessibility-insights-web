// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { generateUID, UUIDGenerator } from 'common/uid-generator';
import { AndroidScanResults } from 'electron/platform/android/android-scan-results';
import { RuleInformationProvider } from 'electron/platform/android/rule-information-provider';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
import { convertScanResultsToUnifiedResults } from 'electron/platform/android/scan-results-to-unified-results';
import { IMock, Mock, MockBehavior } from 'typemoq';

describe('ScanResultsToUnifiesRules', () => {
    const ruleInformationProviderMock: IMock<RuleInformationProviderType> =
        Mock.ofType<RuleInformationProviderType>(undefined, MockBehavior.Strict);
    const uuidGeneratorMock: IMock<UUIDGenerator> = Mock.ofInstance(
        generateUID,
        MockBehavior.Strict,
    );
    const scanResults = {} as AndroidScanResults;

    it('returns an empty set if null converter list is specified', () => {
        const convertedRules: UnifiedResult[] = convertScanResultsToUnifiedResults(
            scanResults,
            ruleInformationProviderMock.object,
            uuidGeneratorMock.object,
            null,
        );
        expect(convertedRules.length).toBe(0);
    });

    it('returns an empty set if an empty converter list is specified', () => {
        const convertedRules: UnifiedResult[] = convertScanResultsToUnifiedResults(
            scanResults,
            ruleInformationProviderMock.object,
            uuidGeneratorMock.object,
            [],
        );
        expect(convertedRules.length).toBe(0);
    });

    it('calls each specified converter in turn and concatenates results', () => {
        let callbacks: number = 0;
        let converter1Callback: number = 0;
        let converter2Callback: number = 0;

        const unifiedResult0: UnifiedResult = { placeholder: 0 } as unknown as UnifiedResult;
        const unifiedResult1: UnifiedResult = { placeholder: 1 } as unknown as UnifiedResult;
        const unifiedResult2: UnifiedResult = { placeholder: 2 } as unknown as UnifiedResult;

        const converter1 = (
            results: AndroidScanResults,
            provider: RuleInformationProvider,
            uuidGenerator: UUIDGenerator,
        ): UnifiedResult[] => {
            expect(results).toBe(scanResults);
            expect(provider).toBe(ruleInformationProviderMock.object);
            expect(uuidGenerator).toBe(uuidGeneratorMock.object);
            converter1Callback = callbacks++;
            return [unifiedResult0];
        };
        const converter2 = (
            results: AndroidScanResults,
            provider: RuleInformationProvider,
            uuidGenerator: UUIDGenerator,
        ): UnifiedResult[] => {
            expect(results).toBe(scanResults);
            expect(provider).toBe(ruleInformationProviderMock.object);
            expect(uuidGenerator).toBe(uuidGeneratorMock.object);
            converter2Callback = callbacks++;
            return [unifiedResult1, unifiedResult2];
        };

        const convertedRules: UnifiedResult[] = convertScanResultsToUnifiedResults(
            scanResults,
            ruleInformationProviderMock.object,
            uuidGeneratorMock.object,
            [converter1, converter2],
        );

        expect(converter1Callback).toBe(0);
        expect(converter2Callback).toBe(1);
        expect(callbacks).toBe(2);

        expect(convertedRules.length).toBe(3);
        expect(convertedRules[0]).toBe(unifiedResult0);
        expect(convertedRules[1]).toBe(unifiedResult1);
        expect(convertedRules[2]).toBe(unifiedResult2);
    });
});
