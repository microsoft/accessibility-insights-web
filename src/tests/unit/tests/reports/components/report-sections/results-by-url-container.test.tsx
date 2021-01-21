// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    ResultsByUrlContainer,
    ResultsByUrlContainerProps,
} from 'reports/components/report-sections/results-by-url-container';
import { Mock } from 'typemoq';

describe('ResultsByUrlContainer', () => {
    it('renders', () => {
        const getScriptMock = Mock.ofInstance(() => '');
        getScriptMock.setup(getScript => getScript()).returns(() => 'test script');

        const props: ResultsByUrlContainerProps = {
            getCollapsibleScript: getScriptMock.object,
        };

        const children: JSX.Element[] = [
            <div key="1">1</div>,
            <div key="2" id="2">
                2
            </div>,
        ];

        const wrapped = shallow(
            <ResultsByUrlContainer {...props}>{children}</ResultsByUrlContainer>,
        );

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
