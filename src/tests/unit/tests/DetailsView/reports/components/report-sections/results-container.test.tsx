// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { Mock } from 'typemoq';
import {
    ResultsContainer,
    ResultsContainerProps,
} from '../../../../../../../DetailsView/reports/components/report-sections/results-container';

describe('ResultsContainer', () => {
    it('renders', () => {
        const getScriptMock = Mock.ofInstance(() => '');
        getScriptMock.setup(getScript => getScript()).returns(() => 'test script');

        const props: ResultsContainerProps = {
            getCollapsibleScript: getScriptMock.object,
        };

        const children: JSX.Element[] = [<div>1</div>, <div id="2">2</div>];

        const wrapped = shallow(<ResultsContainer {...props}>{children}</ResultsContainer>);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
