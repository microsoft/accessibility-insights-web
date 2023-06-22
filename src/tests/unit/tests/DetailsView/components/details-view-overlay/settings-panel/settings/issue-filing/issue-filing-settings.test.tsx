// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { IssueFilingSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/issue-filing/issue-filing-settings';
import {
    SettingsDeps,
    SettingsProps,
} from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';
import { shallow } from 'enzyme';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

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
            lastSelectedHighContrast: true,
            bugService: 'gitHub',
            bugServicePropertiesMap: { gitHub: { repository: 'test-repository' } },
            lastWindowState: null,
            lastWindowBounds: null,
            showAutoDetectedFailuresDialog: true,
            showSaveAssessmentDialog: true,
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
            fileIssue: () => Promise.resolve(),
        };

        issueFilingServiceProviderMock
            .setup(provider => provider.forKey(userData.bugService))
            .returns(() => testIssueFilingServiceStub);
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
