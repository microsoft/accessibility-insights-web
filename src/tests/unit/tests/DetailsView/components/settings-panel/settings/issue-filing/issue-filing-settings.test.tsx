// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { BugFilingServiceProvider } from '../../../../../../../../issue-filing/issue-filing-service-provider';
import { BugFilingService } from '../../../../../../../../issue-filing/types/issue-filing-service';
import { UserConfigMessageCreator } from '../../../../../../../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../../../../../../../common/react/named-sfc';
import { UserConfigurationStoreData } from '../../../../../../../../common/types/store-data/user-configuration-store';
import { BugFilingSettings } from '../../../../../../../../DetailsView/components/settings-panel/settings/issue-filing/issue-filing-settings';
import { SettingsDeps, SettingsProps } from '../../../../../../../../DetailsView/components/settings-panel/settings/settings-props';

describe('BugFilingSettings', () => {
    let userData: UserConfigurationStoreData;
    let bugFilingServiceProviderMock: IMock<BugFilingServiceProvider>;
    let testIssueFilingService: BugFilingService;
    const testKey: string = 'test';
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;

    beforeEach(() => {
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        bugFilingServiceProviderMock = Mock.ofType(BugFilingServiceProvider);
        userData = {
            isFirstTime: true,
            enableTelemetry: true,
            enableHighContrast: true,
            bugService: 'gitHub',
            bugServicePropertiesMap: { gitHub: { repository: 'test-repository' } },
        };
        testIssueFilingService = {
            key: testKey,
            displayName: 'TEST',
            settingsForm: NamedSFC('testForm', () => <>Hello World</>),
            isSettingsValid: () => true,
            buildStoreData: testField => {
                return { testField };
            },
            getSettingsFromStoreData: data => data[testKey],
            issueFilingUrlProvider: () => 'test url',
        };

        bugFilingServiceProviderMock.setup(provider => provider.forKey(userData.bugService)).returns(() => testIssueFilingService);
    });

    it('renders', () => {
        const props: SettingsProps = {
            deps: {
                bugFilingServiceProvider: bugFilingServiceProviderMock.object,
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            } as SettingsDeps,
            featureFlagData: {},
            userConfigurationStoreState: {
                ...userData,
            },
        };

        const wrapped = shallow(<BugFilingSettings {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
