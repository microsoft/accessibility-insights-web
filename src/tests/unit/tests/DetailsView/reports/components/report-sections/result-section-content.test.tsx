// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { RuleResult } from 'scanner/iruleresults';
import {
    ResultSectionContent,
    ResultSectionContentDeps,
    ResultSectionContentProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/result-section-content';

describe('ResultSectionContent', () => {
    const emptyRules: RuleResult[] = [];
    const someRules: RuleResult[] = [{} as RuleResult, {} as RuleResult];
    const depsStub = {} as ResultSectionContentDeps;

    it('renders, with some rules', () => {
        const props: ResultSectionContentProps = {
            deps: depsStub,
            rules: someRules,
            outcomeType: 'pass',
        };

        const wrapper = shallow(<ResultSectionContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders, no rules', () => {
        const props: ResultSectionContentProps = {
            deps: depsStub,
            rules: emptyRules,
            outcomeType: 'pass',
            showCongratsIfNotInstances: true,
        };

        const wrapper = shallow(<ResultSectionContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
