// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

import { UserConfigMessageCreator } from '../../../../../../../../common/message-creators/user-config-message-creator';
import { NamedFC } from '../../../../../../../../common/react/named-sfc';
import { UserConfigurationStoreData } from '../../../../../../../../common/types/store-data/user-configuration-store';
import { IssueFilingSettings } from '../../../../../../../../DetailsView/components/settings-panel/settings/issue-filing/issue-filing-settings';
import { SettingsDeps, SettingsProps } from '../../../../../../../../DetailsView/components/settings-panel/settings/settings-props';
import { IssueFilingServiceProvider } from '../../../../../../../../issue-filing/issue-filing-service-provider';
import { IssueFilingService } from '../../../../../../../../issue-filing/types/issue-filing-service';

describe('IssueFilingSettings', () => {
    let userData: UserConfigurationStoreData;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let testIssueFilingServiceStub: IssueFilingService;
    const testKey: string = 'test';
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;

    beforeEach(() => {
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        userData = {
            isFirstTime: true,
            enableTelemetry: true,
            enableHighContrast: true,
            bugService: 'gitHub',
            bugServicePropertiesMap: { gitHub: { repository: 'test-repository' } },
        };
        testIssueFilingServiceStub = {
            key: testKey,
            displayName: 'TEST',
            settingsForm: NamedFC('testForm', () => <>Hello World</>),
            isSettingsValid: () => true,
            buildStoreData: testField => {
                return { testField };
            },
            getSettingsFromStoreData: data => data[testKey],
            fileIssue: () => {},
        };

        issueFilingServiceProviderMock.setup(provider => provider.forKey(userData.bugService)).returns(() => testIssueFilingServiceStub);
    });

    it('renders', () => {
        const props: SettingsProps = {
            deps: {
                issueFilingServiceProvider: issueFilingServiceProviderMock.object,
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            } as SettingsDeps,
            featureFlagData: {},
            userConfigurationStoreState: {
                ...userData,
            },
        };

        const wrapped = shallow(<IssueFilingSettings {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
