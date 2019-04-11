// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { BugFilingServiceProvider } from '../../../../../bug-filing/bug-filing-service-provider';
import {
    BugFilingSettingsContainer,
    BugFilingSettingsContainerProps,
} from '../../../../../bug-filing/components/bug-filing-settings-container';
import { BugFilingService } from '../../../../../bug-filing/types/bug-filing-service';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { BugServiceProperties, UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';

describe('BugFilingSettingsContainerTest', () => {
    const bugFilingServicesProviderMock = Mock.ofType(BugFilingServiceProvider);
    const selectedBugFilingService: BugFilingService = {
        key: 'test',
        displayName: 'TEST',
        renderSettingsForm: formProps => {
            return <>{formProps}</>;
        },
    } as BugFilingService;
    const bugFilingServices = [selectedBugFilingService];
    const userConfigurationStoreData: UserConfigurationStoreData = {
        bugService: 'test',
    } as UserConfigurationStoreData;
    const selectedBugFilingServiceData: BugServiceProperties = {
        repository: 'none',
    };
    const userConfigMessageCreatorStub: UserConfigMessageCreator = {} as UserConfigMessageCreator;
    const props: BugFilingSettingsContainerProps = {
        deps: {
            userConfigMessageCreator: userConfigMessageCreatorStub,
            bugFilingServiceProvider: bugFilingServicesProviderMock.object,
        },
        selectedBugFilingService,
        userConfigurationStoreData,
        selectedBugFilingServiceData,
    };

    test('render', () => {
        bugFilingServicesProviderMock.setup(mock => mock.allVisible()).returns(() => bugFilingServices);
        const wrapper = shallow(<BugFilingSettingsContainer {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
