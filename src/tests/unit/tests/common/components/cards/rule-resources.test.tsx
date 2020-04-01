// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RuleResources,
    RuleResourcesDeps,
    RuleResourcesProps,
} from 'common/components/cards/rule-resources';
import { shallow } from 'enzyme';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { GuidanceLink } from 'scanner/rule-to-links-mappings';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('RuleResources', () => {
    describe('renders', () => {
        type TestCases = {
            url: string;
            guidanceLinks: GuidanceLink[];
        };

        const testCases: TestCases[] = [
            { url: 'test-url', guidanceLinks: [{ href: 'test-href' } as GuidanceLink] },
            { url: null, guidanceLinks: [{ href: 'test-href' } as GuidanceLink] },
            { url: 'test-url', guidanceLinks: [] },
            { url: 'test-url', guidanceLinks: null },
            { url: null, guidanceLinks: [] },
            { url: null, guidanceLinks: null },
        ];

        it.each(testCases)('with %o', testCase => {
            const rule = cloneDeep(exampleUnifiedRuleResult);
            rule.url = testCase.url;
            rule.guidance = testCase.guidanceLinks;

            const props: RuleResourcesProps = {
                rule,
                deps: {} as RuleResourcesDeps,
            };

            const wrapper = shallow(<RuleResources {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
