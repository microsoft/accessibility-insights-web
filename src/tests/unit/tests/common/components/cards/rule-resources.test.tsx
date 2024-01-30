// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    RuleResources,
    RuleResourcesDeps,
    RuleResourcesProps,
} from 'common/components/cards/rule-resources';
import { ExternalLink } from 'common/components/external-link';
import { GuidanceLinks } from 'common/components/guidance-links';
import { GuidanceTags } from 'common/components/guidance-tags';
import { NewTabLink } from 'common/components/new-tab-link';
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import {
    getNeedsReviewRuleResourcesUrl,
    isOutcomeNeedsReview,
} from '../../../../../../common/configs/needs-review-rule-resources';
import { InstanceOutcomeType } from '../../../../../../reports/components/instance-outcome-type';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

jest.mock('common/components/guidance-tags');
jest.mock('common/components/guidance-links');
jest.mock('common/components/external-link');

describe('RuleResources', () => {
    mockReactComponents([GuidanceTags, GuidanceLinks, ExternalLink]);
    describe('renders', () => {
        const linkComponents = {
            NewTabLink,
            ExternalLink,
        };

        type TestCases = {
            url: string;
            guidanceLinks: GuidanceLink[];
            linkComponent: keyof typeof linkComponents;
            outcomeType: InstanceOutcomeType;
        };

        const testCases: TestCases[] = [
            {
                url: 'test-url',
                guidanceLinks: [{ href: 'test-href' } as GuidanceLink],
                linkComponent: 'ExternalLink',
                outcomeType: 'pass',
            },
            {
                url: null,
                guidanceLinks: [{ href: 'test-href' } as GuidanceLink],
                linkComponent: 'NewTabLink',
                outcomeType: 'pass',
            },
            {
                url: 'test-url',
                guidanceLinks: [],
                linkComponent: 'ExternalLink',
                outcomeType: 'pass',
            },
            {
                url: 'test-url',
                guidanceLinks: null,
                linkComponent: 'NewTabLink',
                outcomeType: 'pass',
            },
            { url: null, guidanceLinks: [], linkComponent: 'ExternalLink', outcomeType: 'pass' },
            { url: null, guidanceLinks: null, linkComponent: 'NewTabLink', outcomeType: 'pass' },
            {
                url: 'test-url',
                guidanceLinks: null,
                linkComponent: 'NewTabLink',
                outcomeType: 'review',
            },
            { url: null, guidanceLinks: [], linkComponent: 'ExternalLink', outcomeType: 'review' },
        ];

        it.each(testCases)('with %o', testCase => {
            const rule = cloneDeep(exampleUnifiedRuleResult);
            rule.url = testCase.url;
            rule.guidance = testCase.guidanceLinks;

            const props: RuleResourcesProps = {
                rule,
                deps: {
                    LinkComponent: linkComponents[testCase.linkComponent],
                    IsOutcomeNeedsReview: isOutcomeNeedsReview,
                    GetNeedsReviewRuleResourcesUrl: getNeedsReviewRuleResourcesUrl,
                } as RuleResourcesDeps,
                outcomeType: testCase.outcomeType,
            };

            const renderResult = render(<RuleResources {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([GuidanceTags, GuidanceLinks]);
        });
    });
});
