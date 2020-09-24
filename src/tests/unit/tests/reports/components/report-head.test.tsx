// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Head, ReporterHead, WebReportHead } from 'reports/components/report-head';

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
        const wrapper = shallow(<Head titlePreface="some title preface" />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
