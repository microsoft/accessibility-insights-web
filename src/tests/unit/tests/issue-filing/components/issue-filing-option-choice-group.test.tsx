// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetIssueFilingServicePayload } from 'background/actions/action-payloads';
import { shallow } from 'enzyme';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import {
    IssueFilingChoiceGroup,
    IssueFilingChoiceGroupProps,
} from '../../../../../issue-filing/components/issue-filing-choice-group';
import { OnSelectedServiceChange } from '../../../../../issue-filing/components/issue-filing-settings-container';
import { IssueFilingService } from '../../../../../issue-filing/types/issue-filing-service';

describe('IssueFilingChoiceGroupTest', () => {
    let onServiceChangeMock: IMock<OnSelectedServiceChange>;
    const testKey = 'test bug service key';
    const testName = 'test bug service name';
    const testOption: IChoiceGroupOption = {
        key: testKey,
        text: testName,
    };
    const selectedIssueFilingService = {
        key: testKey,
        displayName: testName,
    } as IssueFilingService;
    const services = [selectedIssueFilingService];

    beforeEach(() => {
        onServiceChangeMock = Mock.ofInstance(_ => null);
    });

    test('render', () => {
        const props: IssueFilingChoiceGroupProps = {
            selectedIssueFilingService,
            issueFilingServices: services,
            onSelectedServiceChange: onServiceChangeMock.object,
        };

        const wrapper = shallow(<IssueFilingChoiceGroup {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('onChange', () => {
        const props: IssueFilingChoiceGroupProps = {
            selectedIssueFilingService,
            issueFilingServices: services,
            onSelectedServiceChange: onServiceChangeMock.object,
        };

        const payload: SetIssueFilingServicePayload = {
            issueFilingServiceName: testOption.key,
        };

        onServiceChangeMock.setup(u => u(payload)).verifiable(Times.once());

        const wrapper = shallow(<IssueFilingChoiceGroup {...props} />);
        wrapper.find(ChoiceGroup).props().onChange(null, testOption);
        onServiceChangeMock.verifyAll();
    });
});
