// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ResultStatus, UnifiedResult, UnifiedResults } from '../../common/types/store-data/unified-data-interface';
import { generateUID } from '../../common/uid-generator';
import { pass } from '../../reports/assessment-report.scss';
import { AxeNodeResult, RuleResult, ScanResults } from '../../scanner/iruleresults';

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

export function convertScanResultsToUnifiedResults(scanResults: ScanResults): UnifiedResults {
    return {
        results: createUnifiedResultsFromScanResults(scanResults),
    } as UnifiedResults;
}

function createUnifiedResultsFromScanResults(scanResults: ScanResults): UnifiedResult[] {
    let resultsArray: UnifiedResult[] = [];

    resultsArray = createUnifiedResultsFromRuleResults(scanResults.violations, 'fail');
    resultsArray = resultsArray.concat(createUnifiedResultsFromRuleResults(scanResults.passes, 'pass'));

    return resultsArray;
}

function createUnifiedResultsFromRuleResults(ruleResults: RuleResult[], status: ResultStatus): UnifiedResult[] {
    let unifiedResults: UnifiedResult[] = [];

    ruleResults.forEach(result => {
        const moreUnifiedResults = createUnifiedResultsFromRuleResult(result, status);
        unifiedResults = unifiedResults.concat(moreUnifiedResults);
    });

    return unifiedResults;
}

function createUnifiedResultsFromRuleResult(ruleResult: RuleResult, status: ResultStatus): UnifiedResult[] {
    return ruleResult.nodes.map(node => {
        const data: RuleResultData = {
            status: status,
            ruleID: ruleResult.id,
        };

        return createUnifiedResultFromNode(node, data);
    });
}

function createUnifiedResultFromNode(nodeResult: AxeNodeResult, ruleResultData: RuleResultData): UnifiedResult {
    return createUnifiedResult({
        ...ruleResultData,
        cssSelector: nodeResult.target.join(';'),
        snippet: nodeResult.snippet || nodeResult.html,
        howToFix: {
            oneOf: nodeResult.any.map(checkResult => checkResult.message),
            none: nodeResult.none.map(checkResult => checkResult.message),
            all: nodeResult.all.map(checkResult => checkResult.message),
        },
    });
}

function createUnifiedResult(data: CreationData): UnifiedResult {
    return {
        uid: generateUID(),
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
