// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { IssueFilingSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/issue-filing/issue-filing-settings';
import {
    SettingsDeps,
    SettingsProps,
} from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';
import { expectMockedComponentPropsToMatchSnapshots, mockReactComponents } from '../../../../../../../mock-helpers/mock-module-helpers';
import { IssueFilingSettingsContainer } from '../../../../../../../../../issue-filing/components/issue-filing-settings-container';

jest.mock('../../../../../../../../../issue-filing/components/issue-filing-settings-container');
describe('IssueFilingSettings', () => {
    mockReactComponents([IssueFilingSettingsContainer]);
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

        const renderResult = render(<IssueFilingSettings {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([IssueFilingSettingsContainer])
    });
});
