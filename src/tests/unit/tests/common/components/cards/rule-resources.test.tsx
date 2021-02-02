// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    RuleResources,
    RuleResourcesDeps,
    RuleResourcesProps,
} from 'common/components/cards/rule-resources';
import { NewTabLink } from 'common/components/new-tab-link';
import { GuidanceLink } from 'common/guidance-links';
import { ElectronExternalLink } from 'electron/views/device-connect-view/components/electron-external-link';
import { shallow } from 'enzyme';
import { cloneDeep } from 'lodash';
import * as React from 'react';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('RuleResources', () => {
    describe('renders', () => {
        const linkComponents = {
            NewTabLink,
            ElectronExternalLink,
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
                linkComponent: 'ElectronExternalLink',
            },
            {
                url: null,
                guidanceLinks: [{ href: 'test-href' } as GuidanceLink],
                linkComponent: 'NewTabLink',
            },
            { url: 'test-url', guidanceLinks: [], linkComponent: 'ElectronExternalLink' },
            { url: 'test-url', guidanceLinks: null, linkComponent: 'NewTabLink' },
            { url: null, guidanceLinks: [], linkComponent: 'ElectronExternalLink' },
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
