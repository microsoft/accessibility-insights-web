// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    AutomatedChecksIssueDetailsInstances,
    AutomatedChecksIssueDetailsInstancesProps,
} from '../../../../../../DetailsView/reports/components/automated-check-issue-details-instances';

describe('AutomatedChecksIssueDetailsInstances', () => {
    test('render 0 instances', () => {
        const props: AutomatedChecksIssueDetailsInstancesProps = {
            nodeResults: [],
        };

        const wrapper = shallow(<AutomatedChecksIssueDetailsInstances {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render 2 instances', () => {
        const props: AutomatedChecksIssueDetailsInstancesProps = {
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

        const wrapper = shallow(<AutomatedChecksIssueDetailsInstances {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
