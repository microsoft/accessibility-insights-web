// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    ResultSection,
    ResultSectionDeps,
    ResultSectionProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/result-section';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('PassedChecksSection', () => {
    const depsStub = {} as ResultSectionDeps;

    it('renders, not showDetails', () => {
        const props: ResultSectionProps = {
            deps: depsStub,
            title: 'result section title',
            containerClassName: 'result-section-class-name',
            rules: [{} as RuleResult, {} as RuleResult],
            outcomeType: 'pass',
            badgeCount: 2,
        };

        const wrapper = shallow(<ResultSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders, with showDetails', () => {
        const props: ResultSectionProps = {
            deps: depsStub,
            title: 'result section title',
            containerClassName: 'result-section-class-name',
            rules: [{} as RuleResult, {} as RuleResult],
            outcomeType: 'pass',
            showDetails: true,
            badgeCount: 2,
        };

        const wrapper = shallow(<ResultSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders, no rules and show congrats', () => {
        const props: ResultSectionProps = {
            deps: depsStub,
            title: 'result section title',
            containerClassName: 'result-section-class-name',
            rules: [],
            outcomeType: 'pass',
            showDetails: true,
            showCongratsIfNotInstances: true,
            badgeCount: 2,
        };

        const wrapper = shallow(<ResultSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
