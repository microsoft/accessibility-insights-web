// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { ReportHeader, ReportHeaderProps } from '../../../../../../DetailsView/reports/components/report-header';

describe('ReportHeaderTest', () => {
    it('renders with failures, without inapplicable', () => {
        const props: ReportHeaderProps = {
            scanResult: {
                violations: [
                    {
                        nodes: [{}],
                    },
                    {
                        nodes: [{}, {}],
                    },
                ] as any,
                passes: [{}] as any,
                inapplicable: [],
                incomplete: [],
                timestamp: '',
                targetPageTitle: '',
                targetPageUrl: '',
            },
        };

        const wrapper = shallow(<ReportHeader {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    it('renders without failures, with inapplicable', () => {
        const props: ReportHeaderProps = {
            scanResult: {
                violations: [],
                passes: [],
                inapplicable: [{} as any],
                incomplete: [],
                timestamp: '',
                targetPageTitle: '',
                targetPageUrl: '',
            },
        };

        const wrapper = shallow(<ReportHeader {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
