// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { UnifiedRuleResult } from '../../../../../../DetailsView/components/cards/failed-instances-section-v2';
import {
    ResultSectionContentV2,
    ResultSectionContentV2Deps,
    ResultSectionContentV2Props,
} from '../../../../../../DetailsView/components/cards/result-section-content-v2';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('ResultSectionContentV2', () => {
    const emptyRules: UnifiedRuleResult[] = [];
    const someRules: UnifiedRuleResult[] = [exampleUnifiedRuleResult];
    const depsStub = {} as ResultSectionContentV2Deps;

    it('renders, with some rules', () => {
        const props: ResultSectionContentV2Props = {
            deps: depsStub,
            results: someRules,
            outcomeType: 'pass',
        };

        const wrapper = shallow(<ResultSectionContentV2 {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders, no rules', () => {
        const props: ResultSectionContentV2Props = {
            deps: depsStub,
            results: emptyRules,
            outcomeType: 'pass',
            showCongratsIfNotInstances: true,
        };

        const wrapper = shallow(<ResultSectionContentV2 {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
