// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { UUIDGenerator } from 'common/uid-generator';
import {
    AndroidScanResults,
    BoundingRectangle,
    RuleResultsData,
} from 'electron/platform/android/android-scan-results';
import {
    AccessibilityHierarchyCheckResult,
    AtfaBoundingRectangle,
    SpannableString,
    ViewHierarchyElement,
} from 'electron/platform/android/atfa-data-types';
import { RuleInformation } from 'electron/platform/android/rule-information';
import { RuleInformationProviderType } from 'electron/platform/android/rule-information-provider-type';

const includedResults = ['ERROR', 'WARNING'];

export function convertAtfaScanResultsToUnifiedResults(
    scanResults: AndroidScanResults,
    ruleInformationProvider: RuleInformationProviderType,
    uuidGenerator: UUIDGenerator,
): UnifiedResult[] {
    if (!scanResults || !scanResults.ruleResults) {
        return [];
    }

    const unifiedResults: UnifiedResult[] = [];

    for (const atfaResult of scanResults.atfaResults) {
        if (includeBasedOnResultType(atfaResult)) {
            const viewElement: ViewHierarchyElement =
                atfaResult['AccessibilityHierarchyCheckResult.element'];
            if (viewElement) {
                const ruleInformation: RuleInformation = ruleInformationProvider.getRuleInformation(
                    atfaResult['AccessibilityCheckResult.checkClass'],
                );

                if (ruleInformation) {
                    unifiedResults.push(
                        createUnifiedResult(
                            ruleInformation,
                            atfaResult,
                            viewElement,
                            uuidGenerator,
                        ),
                    );
                }
            }
        }
    }

    return unifiedResults;
}

function createUnifiedResult(
    ruleInformation: RuleInformation,
    atfaResult: AccessibilityHierarchyCheckResult,
    viewElement: ViewHierarchyElement,
    uuidGenerator: UUIDGenerator,
): UnifiedResult {
    const ruleResult: RuleResultsData = {
        ruleId: ruleInformation.ruleId,
        status: atfaResult['AccessibilityCheckResult.type'],
        props: atfaResult['AccessibilityHierarchyCheckResult.metadata'],
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
            contentDescription: getRawString(
                viewElement?.['ViewHierarchyElement.contentDescription'],
            ),
            text: getRawString(viewElement?.['ViewHierarchyElement.text']),
        },
        identifiers: {
            identifier: viewElement?.['ViewHierarchyElement.accessibilityClassName'],
            conciseName: viewElement?.['ViewHierarchyElement.className'],
        },
        resolution: ruleInformation.getUnifiedResolution(ruleResult),
    };
}

function getRawString(spannableString?: SpannableString): string | null {
    if (spannableString) {
        return spannableString['SpannableString.rawString'] ?? null;
    }
    return null;
}

function includeBasedOnResultType(atfaResult: AccessibilityHierarchyCheckResult): boolean {
    const resultType: string | null = atfaResult['AccessibilityCheckResult.type'] ?? null;

    return includedResults.includes(resultType);
}

function convertBoundingRectangle(
    boundingRectangle?: AtfaBoundingRectangle,
): BoundingRectangle | undefined {
    if (!boundingRectangle) {
        return undefined;
    }

    return {
        bottom: boundingRectangle['Rect.bottom'],
        left: boundingRectangle['Rect.left'],
        right: boundingRectangle['Rect.right'],
        top: boundingRectangle['Rect.top'],
    };
}
