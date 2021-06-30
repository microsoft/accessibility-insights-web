// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import {
    AndroidScanResults,
    AxeRuleResultsData,
    ViewElementData,
} from 'electron/platform/android/android-scan-results';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
import { DictionaryStringTo } from 'types/common-types';

export function convertAxeScanResultsToUnifiedResults(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] {
    if (!scanResults || !scanResults.ruleResults) {
        return [];
    }

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
    ruleResult: AxeRuleResultsData,
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
