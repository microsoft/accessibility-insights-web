// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import {
    ResultsContainer,
    ResultsContainerProps,
} from 'reports/components/report-sections/results-container';
import { Mock } from 'typemoq';

describe('ResultsContainer', () => {
    it('renders', () => {
        const getScriptMock = Mock.ofInstance((): string => '');
        getScriptMock.setup(getScript => getScript()).returns(() => 'test script');

        const props: ResultsContainerProps = {
            getCollapsibleScript: getScriptMock.object,
            getCopyToClipboardScript: getScriptMock.object,
        };

        const children: JSX.Element[] = [
            <div key="1">1</div>,
            <div key="2" id="2">
                2
            </div>,
        ];

        const renderResult = render(<ResultsContainer {...props}>{children}</ResultsContainer>);

        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
