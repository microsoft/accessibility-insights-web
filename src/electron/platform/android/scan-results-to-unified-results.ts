// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import { DictionaryStringTo } from 'types/common-types';
import { AndroidScanResults, RuleResultsData, ViewElementData } from './android-scan-results';
import { RuleInformation } from './rule-information';
import { RuleInformationProviderType } from './rule-information-provider-type';

export type ConvertScanResultsToUnifiedResultsDelegate = (
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
) => UnifiedResult[];

export function convertScanResultsToUnifiedResults(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] {
    if (!scanResults || !scanResults.ruleResults) {
        return [];
    }

    return createUnifiedResultsFromScanResults(scanResults, ruleInformationProvider, uuidGenerator);
}

function createUnifiedResultsFromScanResults(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] {
    const viewElementLookup: DictionaryStringTo<ViewElementData> =
        createViewElementLookup(scanResults);
    const unifiedResults: UnifiedResult[] = [];

    for (const ruleResult of scanResults.ruleResults) {
        const ruleInformation: RuleInformation = ruleInformationProvider.getRuleInformation(
            ruleResult.ruleId,
        );

        if (ruleInformation) {
            unifiedResults.push(
                createUnifiedResult(ruleInformation, ruleResult, viewElementLookup, uuidGenerator),
            );
        }
    }

    return unifiedResults;
}

function createViewElementLookup(
    scanResults: AndroidScanResults,
): DictionaryStringTo<ViewElementData> {
    const viewElementLookup = {};

    addViewElementAndChildren(viewElementLookup, scanResults.viewElementTree);

    return viewElementLookup;
}

function addViewElementAndChildren(
    viewElementLookup: DictionaryStringTo<ViewElementData>,
    element: ViewElementData | null,
): void {
    if (element) {
        viewElementLookup[element.axeViewId] = element;
        if (element.children) {
            for (const child of element.children) {
                addViewElementAndChildren(viewElementLookup, child);
            }
        }
    }
}

function createUnifiedResult(
    ruleInformation: RuleInformation,
    ruleResult: RuleResultsData,
    viewElementLookup: DictionaryStringTo<ViewElementData>,
    uuidGenerator: UUIDGenerator,
): UnifiedResult {
    const viewElement = viewElementLookup[ruleResult.axeViewId];
    return {
        uid: uuidGenerator(),
        ruleId: ruleInformation.ruleId,
        status: ruleInformation.getResultStatus(ruleResult),
        descriptors: {
            className: viewElement?.className,
            boundingRectangle: viewElement?.boundsInScreen,
            contentDescription: viewElement?.contentDescription,
            text: viewElement?.text,
        },
        identifiers: {
            identifier: viewElement?.className,
            conciseName: viewElement?.className,
        },
        resolution: ruleInformation.getUnifiedResolution(ruleResult),
    };
}
