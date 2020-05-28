// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import {
    IssueFilingServiceProperties,
    UserConfigurationStoreData,
} from '../../../../../common/types/store-data/user-configuration-store';
import {
    IssueFilingSettingsContainer,
    IssueFilingSettingsContainerDeps,
    IssueFilingSettingsContainerProps,
} from '../../../../../issue-filing/components/issue-filing-settings-container';
import { IssueFilingServiceProvider } from '../../../../../issue-filing/issue-filing-service-provider';
import { IssueFilingService } from '../../../../../issue-filing/types/issue-filing-service';

describe('IssueFilingSettingsContainerTest', () => {
    const issueFilingServicesProviderMock = Mock.ofType(IssueFilingServiceProvider);
    const selectedIssueFilingService: IssueFilingService = {
        key: 'test',
        displayName: 'TEST',
        settingsForm: formProps => {
            return <>{formProps}</>;
        },
    } as IssueFilingService;
    const issueFilingServices = [selectedIssueFilingService];
    const userConfigurationStoreData: UserConfigurationStoreData = {
        bugService: 'test',
    } as UserConfigurationStoreData;
    const selectedIssueFilingServiceData: IssueFilingServiceProperties = {
        repository: 'none',
    };
    const userConfigMessageCreatorStub: UserConfigMessageCreator = {} as UserConfigMessageCreator;
    const props: IssueFilingSettingsContainerProps = {
        deps: {
            userConfigMessageCreator: userConfigMessageCreatorStub,
            issueFilingServiceProvider: issueFilingServicesProviderMock.object,
        } as IssueFilingSettingsContainerDeps,
        selectedIssueFilingService,
        userConfigurationStoreData,
        selectedIssueFilingServiceData,
        onPropertyUpdateCallback: () => null,
        onSelectedServiceChange: () => null,
    };

    test('render', () => {
        issueFilingServicesProviderMock
            .setup(mock => mock.allVisible())
            .returns(() => issueFilingServices);
        const wrapper = shallow(<IssueFilingSettingsContainer {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
