// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    RulesResultsContainer,
    RulesResultsContainerProps,
} from 'reports/components/report-sections/rules-results-container';
import { Mock } from 'typemoq';

describe(RulesResultsContainer, () => {
    it('renders', () => {
        const getScriptMock = Mock.ofInstance(() => '');
        getScriptMock.setup(getScript => getScript()).returns(() => 'test script');

        const props: RulesResultsContainerProps = {
            getCollapsibleScript: getScriptMock.object,
        };

        const children: JSX.Element[] = [
            <div key="1">1</div>,
            <div key="2" id="2">
                2
            </div>,
        ];

        const wrapped = shallow(
            <RulesResultsContainer {...props}>{children}</RulesResultsContainer>,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
