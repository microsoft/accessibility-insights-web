// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';
import { Head } from 'reports/components/head';
import { ReporterHead } from 'reports/components/reporter-automated-check-head';
import { WebReportHead } from 'reports/components/web-report-head';

describe('WebReportHead', () => {
    it('renders', () => {
        const renderResult = render(<WebReportHead />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

describe('ReporterHead', () => {
    it('renders', () => {
        const renderResult = render(<ReporterHead />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

describe('Head', () => {
    it('renders', () => {
        const styleSheetStub = {
            styleSheet: 'some style sheet',
        };
        const renderResult = render(
            <Head
                titlePreface="some title preface"
                bundledStyles={styleSheetStub}
                title="some title"
            />,
        );
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});
