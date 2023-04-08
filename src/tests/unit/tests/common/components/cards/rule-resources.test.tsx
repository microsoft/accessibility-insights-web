// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RuleResources,
    RuleResourcesDeps,
    RuleResourcesProps,
} from 'common/components/cards/rule-resources';
import { NewTabLink } from 'common/components/new-tab-link';
import { GuidanceLink } from 'common/types/store-data/guidance-links';
import { shallow } from 'enzyme';
import { cloneDeep } from 'lodash';
import * as React from 'react';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('RuleResources', () => {
    describe('renders', () => {
        const linkComponents = {
            NewTabLink,
        };

        type TestCases = {
            url: string;
            guidanceLinks: GuidanceLink[];
            linkComponent: keyof typeof linkComponents;
        };

        const testCases: TestCases[] = [
            {
                url: null,
                guidanceLinks: [{ href: 'test-href' } as GuidanceLink],
                linkComponent: 'NewTabLink',
            },
            { url: 'test-url', guidanceLinks: null, linkComponent: 'NewTabLink' },
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

            const wrapper = shallow(<RuleResources {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
