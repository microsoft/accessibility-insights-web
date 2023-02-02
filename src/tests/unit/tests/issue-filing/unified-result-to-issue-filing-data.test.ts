// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    TargetAppData,
    UnifiedResult,
    UnifiedRule,
} from 'common/types/store-data/unified-data-interface';

import { CreateIssueDetailsTextData } from '../../../../common/types/create-issue-details-text-data';
import { UnifiedResultToIssueFilingDataConverter } from '../../../../issue-filing/unified-result-to-issue-filing-data';

describe(UnifiedResultToIssueFilingDataConverter, () => {
    test('constructor', () => {
        const converter = new UnifiedResultToIssueFilingDataConverter();
        expect(converter).not.toBeNull();
    });

    test('convert', () => {
        const result: UnifiedResult = {
            uid: 'abcd-1234-KYHF',
            status: 'pass',
            ruleId: 'rule-id',
            identifiers: {
                identifier: 'selector',
                conciseName: 'selector last part',
                'css-selector': 'selector',
            },
            descriptors: {
                snippet: 'snippet',
                relatedCssSelectors: ['#related-1', '#related-2'],
            },
            resolution: {
                howToFixSummary: 'failureSummary',
                'how-to-fix-web': {
                    any: [],
                    none: [],
                    all: [],
                },
            },
        } as UnifiedResult;
        const targetApp: TargetAppData = {
            name: 'app name',
            url: 'app url',
        };
        const rule: UnifiedRule = {
            description: 'desc',
            id: 'rule-id',
            url: 'url',
            guidance: [],
        };
        const expected: CreateIssueDetailsTextData = {
            rule,
            targetApp,
            element: {
                identifier: 'selector',
                conciseName: 'selector last part',
            },
            howToFixSummary: 'failureSummary',
            snippet: 'snippet',
            relatedPaths: ['#related-1', '#related-2'],
        };

        const converter = new UnifiedResultToIssueFilingDataConverter();
        const textData = converter.convert(result, rule, targetApp);
        expect(textData).toEqual(expected);
    });
});
