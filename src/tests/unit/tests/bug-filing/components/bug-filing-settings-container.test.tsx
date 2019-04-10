// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import {
    BugFilingSettingsContainer,
    BugFilingSettingsContainerProps,
} from '../../../../../bug-filing/components/bug-filing-settings-container';
import { BugFilingService } from '../../../../../bug-filing/types/bug-filing-service';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { BugServiceProperties, UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';

describe('BugFilingSettingsContainerTest', () => {
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
    const userConfigMessageCreatorMock: IMock<UserConfigMessageCreator> = Mock.ofType(UserConfigMessageCreator);
    const props: BugFilingSettingsContainerProps = {
        deps: {
            userConfigMessageCreator: userConfigMessageCreatorMock.object,
        },
        selectedBugFilingService,
        bugFilingServices,
        userConfigurationStoreData,
        selectedBugFilingServiceData,
    };

    test('render', () => {
        const wrapper = shallow(<BugFilingSettingsContainer {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
