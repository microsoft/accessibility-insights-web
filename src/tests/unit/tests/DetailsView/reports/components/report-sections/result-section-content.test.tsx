// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    ResultSectionContent,
    ResultSectionContentProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/result-section-content';
import { RuleResult } from '../../../../../../../scanner/iruleresults';

describe('ResultSectionContent', () => {
    const emptyRules: RuleResult[] = [];
    const someRules: RuleResult[] = [{} as RuleResult, {} as RuleResult];

    it('renders, with some rules', () => {
        const props: ResultSectionContentProps = {
            rules: someRules,
            outcomeType: 'pass',
        };

        const wrapper = shallow(<ResultSectionContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders, no rules', () => {
        const props: ResultSectionContentProps = {
            rules: emptyRules,
            outcomeType: 'pass',
            showCongratsIfNotInstances: true,
        };

        const wrapper = shallow(<ResultSectionContent {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
