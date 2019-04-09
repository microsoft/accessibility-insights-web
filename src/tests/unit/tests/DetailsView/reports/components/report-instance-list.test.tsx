// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportInstanceList, ReportInstanceListProps } from '../../../../../../DetailsView/reports/components/report-instance-list';

describe('ReportInstanceListTest', () => {
    test('render 0 instances', () => {
        const props: ReportInstanceListProps = {
            nodeResults: [],
        };

        const wrapper = shallow(<ReportInstanceList {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render 2 instances', () => {
        const props: ReportInstanceListProps = {
            nodeResults: [
                {
                    target: 'target-1',
                    html: '<html-1/>',
                } as any,
                {
                    target: 'target-2',
                    html: '<html-2/>',
                } as any,
            ],
        };

        const wrapper = shallow(<ReportInstanceList {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
