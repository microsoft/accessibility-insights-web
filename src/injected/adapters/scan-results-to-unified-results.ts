// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flatMap } from 'lodash';
import { ResultStatus, UnifiedResult, UnifiedResults } from '../../common/types/store-data/unified-data-interface';
import { AxeNodeResult, RuleResult, ScanResults } from '../../scanner/iruleresults';

type UUIDGeneratorType = () => string;

interface RuleResultData {
    status: ResultStatus;
    ruleID: string;
}

interface CreationData extends RuleResultData {
    cssSelector: string;
    snippet: string;
    howToFix: {
        oneOf: string[];
        none: string[];
        all: string[];
    };
}

export const convertScanResultsToUnifiedResults = (scanResults: ScanResults, uuidGenerator: UUIDGeneratorType): UnifiedResults => {
    return {
        results: createUnifiedResultsFromScanResults(scanResults, uuidGenerator),
    } as UnifiedResults;
};

function createUnifiedResultsFromScanResults(scanResults: ScanResults, uuidGenerator: UUIDGeneratorType): UnifiedResult[] {
    return [
        ...createUnifiedResultsFromRuleResults(scanResults.violations, 'fail', uuidGenerator),
        ...createUnifiedResultsFromRuleResults(scanResults.passes, 'pass', uuidGenerator),
    ];
}

function createUnifiedResultsFromRuleResults(
    ruleResults: RuleResult[],
    status: ResultStatus,
    uuidGenerator: UUIDGeneratorType,
): UnifiedResult[] {
    const unifiedResultFromRuleResults = (ruleResults || []).map(result =>
        createUnifiedResultsFromRuleResult(result, status, uuidGenerator),
    );

    return flatMap(unifiedResultFromRuleResults);
}

function createUnifiedResultsFromRuleResult(
    ruleResult: RuleResult,
    status: ResultStatus,
    uuidGenerator: UUIDGeneratorType,
): UnifiedResult[] {
    return ruleResult.nodes.map(node => {
        const data: RuleResultData = {
            status: status,
            ruleID: ruleResult.id,
        };

        return createUnifiedResultFromNode(node, data, uuidGenerator);
    });
}

function createUnifiedResultFromNode(
    nodeResult: AxeNodeResult,
    ruleResultData: RuleResultData,
    uuidGenerator: UUIDGeneratorType,
): UnifiedResult {
    return createUnifiedResult(
        {
            ...ruleResultData,
            cssSelector: nodeResult.target.join(';'),
            snippet: nodeResult.snippet || nodeResult.html,
            howToFix: {
                oneOf: nodeResult.any.map(checkResult => checkResult.message),
                none: nodeResult.none.map(checkResult => checkResult.message),
                all: nodeResult.all.map(checkResult => checkResult.message),
            },
        },
        uuidGenerator,
    );
}

function createUnifiedResult(data: CreationData, uuidGenerator: UUIDGeneratorType): UnifiedResult {
    return {
        uid: uuidGenerator(),
        status: data.status,
        ruleId: data.ruleID,
        identifiers: {
            'css-selector': data.cssSelector,
        },
        descriptors: {
            snippet: data.snippet,
        },
        resolution: {
            'how-to-fix-web': {
                any: data.howToFix.oneOf,
                none: data.howToFix.none,
                all: data.howToFix.all,
            },
        },
    } as UnifiedResult;
}
