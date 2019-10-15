// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RuleResources, RuleResourcesDeps, RuleResourcesProps } from 'common/components/cards/rule-resources';
import { shallow } from 'enzyme';
import { cloneDeep } from 'lodash';
import * as React from 'react';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('RuleResources', () => {
    describe('renders', () => {
        it('with rule url and guidance links', () => {
            const rule = cloneDeep(exampleUnifiedRuleResult);

            const props: RuleResourcesProps = {
                rule,
                deps: {} as RuleResourcesDeps,
            };

            const wrapper = shallow(<RuleResources {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('no url, only guidance links', () => {
            const rule = cloneDeep(exampleUnifiedRuleResult);
            rule.url = null;

            const props: RuleResourcesProps = {
                rule,
                deps: {} as RuleResourcesDeps,
            };

            const wrapper = shallow(<RuleResources {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('only url, empty guidance links', () => {
            const rule = cloneDeep(exampleUnifiedRuleResult);
            rule.guidance = [];

            const props: RuleResourcesProps = {
                rule,
                deps: {} as RuleResourcesDeps,
            };

            const wrapper = shallow(<RuleResources {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('only url, null guidance links', () => {
            const rule = cloneDeep(exampleUnifiedRuleResult);
            rule.guidance = null;

            const props: RuleResourcesProps = {
                rule,
                deps: {} as RuleResourcesDeps,
            };

            const wrapper = shallow(<RuleResources {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('no url and null guidance links', () => {
            const rule = cloneDeep(exampleUnifiedRuleResult);
            rule.guidance = null;
            rule.url = null;

            const props: RuleResourcesProps = {
                rule,
                deps: {} as RuleResourcesDeps,
            };

            const wrapper = shallow(<RuleResources {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
