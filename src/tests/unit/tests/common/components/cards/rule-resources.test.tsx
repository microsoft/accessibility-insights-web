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
        };

        const testCases: TestCases[] = [
            {
                url: 'test-url',
                guidanceLinks: [{ href: 'test-href' } as GuidanceLink],
                linkComponent: 'ExternalLink',
            },
            {
                url: null,
                guidanceLinks: [{ href: 'test-href' } as GuidanceLink],
                linkComponent: 'NewTabLink',
            },
            { url: 'test-url', guidanceLinks: [], linkComponent: 'ExternalLink' },
            { url: 'test-url', guidanceLinks: null, linkComponent: 'NewTabLink' },
            { url: null, guidanceLinks: [], linkComponent: 'ExternalLink' },
            { url: null, guidanceLinks: null, linkComponent: 'NewTabLink' },
        ];

        it.each(testCases)('with %o', testCase => {
            const rule = cloneDeep(exampleUnifiedRuleResult);
            rule.url = testCase.url;
            rule.guidance = testCase.guidanceLinks;

            const props: RuleResourcesProps = {
                rule,
                deps: {
                    LinkComponent: linkComponents[testCase.linkComponent],
                } as RuleResourcesDeps,
            };

            const renderResult = render(<RuleResources {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([GuidanceTags, GuidanceLinks]);
        });
    });
});
