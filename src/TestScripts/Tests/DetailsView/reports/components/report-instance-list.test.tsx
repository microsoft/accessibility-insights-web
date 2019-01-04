// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import {
    IReportInstanceListProps,
    ReportInstanceList,
} from '../../../../../DetailsView/reports/components/report-instance-list';
import { shallowRender } from '../../../../Common/shallow-render';

describe('ReportInstanceListTest', () => {
    test('render 0 instances', () => {
        const props: IReportInstanceListProps = {
            nodeResults: [],
        };

        expect(shallowRender(<ReportInstanceList {...props} />)).toMatchSnapshot();
    });

    test('render 2 instances', () => {
        const props: IReportInstanceListProps = {
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
