// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import {
    AndroidScanResults,
    BoundingRectangle,
    RuleResultsData,
    ViewElementData,
} from 'electron/platform/android/android-scan-results';
import {
    ATFABoundingRectangle,
    ViewHierarchyElement,
} from 'electron/platform/android/atfa-data-types';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';
import { DictionaryStringTo } from 'types/common-types';

export function convertATFAResultsToUnifiedResults(
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
    const viewElementLookup: DictionaryStringTo<ViewHierarchyElement> = {};
    const unifiedResults: UnifiedResult[] = [];

    for (const atfaResult of scanResults.atfaResults) {
        const viewElement: ViewHierarchyElement =
            atfaResult['AccessibilityHierarchyCheckResult.element'];
        if (viewElement) {
            const key = keyFromElement(viewElement);

            // TODO: Use the same element each time?
            if (!viewElementLookup[key]) {
                viewElementLookup[key] = viewElement;
            }

            const ruleInformation: RuleInformation = ruleInformationProvider.getRuleInformation(
                atfaResult['AccessibilityHierarchyCheckResult.checkClass'],
            );

            if (ruleInformation) {
                unifiedResults.push(
                    createUnifiedResult(
                        ruleInformation,
                        atfaResult,
                        key,
                        viewElement,
                        uuidGenerator,
                    ),
                );
            }
        }
    }

    return unifiedResults;
}

function keyFromElement(element: ViewHierarchyElement): string {
    return `atfa-${element['ViewHierarchyElement.id']}`;
}

function createUnifiedResult(
    ruleInformation: RuleInformation,
    atfaResult,
    key: string,
    viewElement: ViewHierarchyElement,
    uuidGenerator: UUIDGenerator,
): UnifiedResult {
    const ruleResult: RuleResultsData = {
        axeViewId: key,
        ruleId: null, // TBD
        status: null, // TBD
        props: null, // TBD
    };
    return {
        uid: uuidGenerator(),
        ruleId: ruleInformation.ruleId,
        status: ruleInformation.getResultStatus(ruleResult),
        descriptors: {
            className: viewElement?.['ViewHierarchyElement.className'],
            boundingRectangle: convertBoundingRectangle(
                viewElement?.['ViewHierarchyElement.boundsInScreen'],
            ),
            contentDescription:
                viewElement?.['ViewHierarchyElement.contentDescription'][
                    'SpannableString.rawString'
                ],
            text: viewElement?.['ViewHierarchyElement.text']['SpannableString.rawString'],
        },
        identifiers: {
            identifier: viewElement?.['ViewHierarchyElement.accessibilityClassName'],
            conciseName: viewElement?.['ViewHierarchyElement.className'],
        },
        resolution: ruleInformation.getUnifiedResolution(ruleResult),
    };
}

function convertBoundingRectangle(boundingRectangle: ATFABoundingRectangle): BoundingRectangle {
    if (!boundingRectangle) {
        return null;
    }

    return {
        bottom: boundingRectangle['Rect.bottom'],
        left: boundingRectangle['Rect.left'],
        right: boundingRectangle['Rect.right'],
        top: boundingRectangle['Rect.top'],
    };
}
