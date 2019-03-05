// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ReportInstanceList, ReportInstanceListProps } from '../../../../../../DetailsView/reports/components/report-instance-list';
import { shallowRender } from '../../../../common/shallow-render';

describe('ReportInstanceListTest', () => {
    test('render 0 instances', () => {
        const props: ReportInstanceListProps = {
            nodeResults: [],
        };

        expect(shallowRender(<ReportInstanceList {...props} />)).toMatchSnapshot();
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

        expect(shallowRender(<ReportInstanceList {...props} />)).toMatchSnapshot();
    });
});
