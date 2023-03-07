// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentData } from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import {
    CardRuleResult,
    CardRuleResultsByStatus,
} from '../../../../../../common/types/store-data/card-view-model';
import { UnifiedResult } from '../../../../../../common/types/store-data/unified-data-interface';

export const exampleUnifiedResult: UnifiedResult = {
    uid: 'some-guid-here',
    status: 'fail',
    ruleId: 'image-alt',
    identifiers: {
        identifier: 'body img',
        conciseName: 'body img',
        'css-selector': 'body img',
    },
    descriptors: {
        snippet: 'this is a sample snippet',
    },
    resolution: {
        howToFixSummary: 'sample how to fix summary',
        'how-to-fix-web': {
            any: [
                'Element does not have an alt attribute',
                'aria-label attribute does not exist or is empty',
                'aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty',
            ],
            none: [],
            all: [],
        },
    },
};

export const exampleAssessmentResult: AssessmentData = {
    fullAxeResultsMap: null,
    generatedAssessmentInstancesMap: {
        'body img': {
            target: ['body img'],
            html: 'body img',
            testStepResults: {
                'image-alt': {
                    status: ManualTestStatus.FAIL,
                    isVisualizationEnabled: true,
                    id: 'some-guid-here',
                    failureSummary: 'sample how to fix summary',
                },
            },
        },
    },
    testStepStatus: {},
};

export const exampleUnifiedResultWithBoundingRectangle = {
    ...exampleUnifiedResult,
    descriptors: {
        ...exampleUnifiedResult.descriptors,
        boundingRectangle: {
            left: 1,
            top: 2,
            right: 3,
            bottom: 4,
        },
    },
};

export const exampleUnifiedRuleResult: CardRuleResult = {
    id: 'some-rule',
    nodes: [exampleUnifiedResult as UnifiedResult],
    description: 'sample-description',
    url: 'sample-url',
    guidance: [{ href: 'sample-guidance-href', text: 'sample-guidance-text' }],
} as CardRuleResult;

export const exampleUnifiedStatusResults: CardRuleResultsByStatus = {
    pass: [],
    fail: [exampleUnifiedRuleResult],
    inapplicable: [],
    unknown: [],
};
