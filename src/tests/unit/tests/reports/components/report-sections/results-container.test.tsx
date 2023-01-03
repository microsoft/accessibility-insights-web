// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    ResultsContainer,
    ResultsContainerProps,
} from 'reports/components/report-sections/results-container';
import { Mock } from 'typemoq';

describe('ResultsContainer', () => {
    it('renders', () => {
        const getScriptMock = Mock.ofInstance(() => 'test script');
        getScriptMock.setup(getScript => getScript()).returns(() => 'test script');

        const props: ResultsContainerProps = {
            getCollapsibleScript: getScriptMock.object,
        };

        const children: JSX.Element[] = [
            <div key="1">1</div>,
            <div key="2" id="2">
                2
            </div>,
        ];

        const wrapped = shallow(<ResultsContainer {...props}>{children}</ResultsContainer>);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
