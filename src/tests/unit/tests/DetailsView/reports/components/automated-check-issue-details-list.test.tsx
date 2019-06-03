// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    AutomatedChecksIssueDetailsList,
    AutomatedChecksIssueDetailsListProps,
} from '../../../../../../DetailsView/reports/components/automated-check-issue-details-list';

describe('AutomatedChecksIssueDetailsList', () => {
    test('matches stored snapshot', () => {
        const props: AutomatedChecksIssueDetailsListProps = {
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

        const wrapper = shallow(<AutomatedChecksIssueDetailsList {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
