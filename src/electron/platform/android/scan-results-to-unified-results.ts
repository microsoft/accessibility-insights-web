// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { InstancePropertyBag, InstanceResultStatus, UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { UUIDGeneratorType } from 'common/uid-generator';
import { DictionaryStringTo } from '../../../types/common-types';
import { RuleInformation } from './rule-information';
import { RuleInformationProvider } from './rule-information-provider';
import { RuleResultsData, ScanResults, ViewElementData } from './scan-results';

export type ConvertScanResultsToUnifiedResultsDelegate = (scanResults: ScanResults, uuidGenerator: UUIDGeneratorType) => UnifiedResult[];

export function convertScanResultsToUnifiedResults(scanResults: ScanResults, uuidGenerator: UUIDGeneratorType): UnifiedResult[] {
    if (!scanResults || !scanResults.ruleResults) {
        return [];
    }

    return createUnifiedResultsFromScanResults(scanResults, uuidGenerator);
}

function createUnifiedResultsFromScanResults(scanResults: ScanResults, uuidGenerator: UUIDGeneratorType): UnifiedResult[] {
    const ruleInformationProvider: RuleInformationProvider = new RuleInformationProvider();
    const viewElementLookup: DictionaryStringTo<ViewElementData> = createViewElementLookup(scanResults);
    const unifiedResults: UnifiedResult[] = [];

    for (const ruleResult of scanResults.ruleResults) {
        const ruleInformation: RuleInformation = ruleInformationProvider.getRuleInformation(ruleResult.ruleId);

        if (ruleInformation) {
            unifiedResults.push(createUnifiedResult(ruleInformation, ruleResult, viewElementLookup, uuidGenerator));
        }
    }

    return unifiedResults;
}

function createViewElementLookup(scanResults: ScanResults): DictionaryStringTo<ViewElementData> {
    const viewElementLookup = {};

    addViewElementAndChildren(viewElementLookup, scanResults.viewElementTree);

    return viewElementLookup;
}

function addViewElementAndChildren(viewElementLookup: DictionaryStringTo<ViewElementData>, element: ViewElementData): void {
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
    uuidGenerator: UUIDGeneratorType,
): UnifiedResult {
    return {
        uid: uuidGenerator(),
        ruleId: ruleInformation.ruleId,
        status: getStatus(ruleResult.status),
        descriptors: getDescriptors(viewElementLookup[ruleResult.axeViewId]),
        identifiers: null,
        resolution: {
            'how-to-fix': ruleInformation.howToFix(ruleResult),
        },
    };
}

function getDescriptors(viewElement: ViewElementData): InstancePropertyBag {
    if (viewElement) {
        return {
            className: viewElement.className,
            boundingRectangle: viewElement.boundsInScreen,
            contentDescription: viewElement.contentDescription,
            text: viewElement.text,
        };
    }
    return null;
}

function getStatus(status: string): InstanceResultStatus {
    switch (status) {
        case 'PASS':
            return 'pass';
        case 'FAIL':
            return 'fail';
        default:
            return 'unknown';
    }
}
