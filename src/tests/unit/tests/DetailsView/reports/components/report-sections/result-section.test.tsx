// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ResultSection, ResultSectionProps } from '../../../../../../../DetailsView/reports/components/report-sections/result-section';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('PassedChecksSection', () => {
    it('renders, not showDetails', () => {
        const props: ResultSectionProps = {
            title: 'result section title',
            containerClassName: 'result-section-class-name',
            rules: [{} as RuleResult, {} as RuleResult],
            outcomeType: 'pass',
        };

        const wrapper = shallow(<ResultSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders, with showDetails', () => {
        const props: ResultSectionProps = {
            title: 'result section title',
            containerClassName: 'result-section-class-name',
            rules: [{} as RuleResult, {} as RuleResult],
            outcomeType: 'pass',
            showDetails: true,
        };

        const wrapper = shallow(<ResultSection {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
