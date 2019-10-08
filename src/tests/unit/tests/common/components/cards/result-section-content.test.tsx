// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedRuleResult } from 'common/components/cards/failed-instances-section';
import { ResultSectionContent, ResultSectionContentDeps, ResultSectionContentProps } from 'common/components/cards/result-section-content';
import { shallow } from 'enzyme';
import * as React from 'react';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('ResultSectionContent', () => {
    const emptyRules: UnifiedRuleResult[] = [];
    const someRules: UnifiedRuleResult[] = [exampleUnifiedRuleResult];
    const depsStub = {} as ResultSectionContentDeps;

    it('renders, with some rules', () => {
        const props = {
            deps: depsStub,
            results: someRules,
            outcomeType: 'pass',
        } as ResultSectionContentProps;

        const wrapper = shallow(<ResultSectionContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders, no rules', () => {
        const props: ResultSectionContentProps = {
            deps: depsStub,
            results: emptyRules,
            outcomeType: 'pass',
            showCongratsIfNotInstances: true,
            userConfigurationStoreData: null,
        };

        const wrapper = shallow(<ResultSectionContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
