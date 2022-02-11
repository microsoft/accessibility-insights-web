// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Head } from 'reports/components/head';
import { ReporterHead } from 'reports/components/reporter-automated-check-head';
import { WebReportHead } from 'reports/components/web-report-head';

describe('WebReportHead', () => {
    it('renders', () => {
        const wrapper = shallow(<WebReportHead />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('ReporterHead', () => {
    it('renders', () => {
        const wrapper = shallow(<ReporterHead />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('Head', () => {
    it('renders', () => {
        const styleSheetStub = {
            styleSheet: 'some style sheet',
        };
        const wrapper = shallow(
            <Head
                titlePreface="some title preface"
                bundledStyles={styleSheetStub}
                title="some title"
            />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
