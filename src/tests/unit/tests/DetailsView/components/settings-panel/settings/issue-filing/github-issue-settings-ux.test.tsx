// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

import { UserConfigMessageCreator } from '../../../../../../../../common/message-creators/user-config-message-creator';
import {
    IssueServicePropertiesMap,
    UserConfigurationStoreData,
} from '../../../../../../../../common/types/store-data/user-configuration-store';
import { GitHubIssueSettingsUx } from '../../../../../../../../DetailsView/components/settings-panel/settings/issue-filing/github-issue-settings-ux';
import { SettingsDeps, SettingsProps } from '../../../../../../../../DetailsView/components/settings-panel/settings/settings-props';

type RenderTestCase = {
    bugService: string;
    bugServicePropertiesMap: IssueServicePropertiesMap;
};
describe('GitHubIssueSettingsUx', () => {
    let userData: UserConfigurationStoreData;

    beforeEach(() => {
        userData = {
            isFirstTime: true,
            enableTelemetry: true,
            enableHighContrast: true,
            bugService: 'gitHub',
            bugServicePropertiesMap: { gitHub: { repository: 'test-repository' } },
        };
    });

    describe('renders', () => {
        const testCases: RenderTestCase[] = [
            {
                bugService: 'none',
                bugServicePropertiesMap: null,
            },
            {
                bugService: 'gitHub',
                bugServicePropertiesMap: null,
            },
            {
                bugService: 'gitHub',
                bugServicePropertiesMap: {},
            },
            {
                bugService: 'gitHub',
                bugServicePropertiesMap: { gitHub: {} },
            },
            {
                bugService: 'gitHub',
                bugServicePropertiesMap: { gitHub: { repository: 'test-repository' } },
            },
        ];

        it.each(testCases)('%o', (testCase: RenderTestCase) => {
            const props: SettingsProps = {
                deps: {} as SettingsDeps,
                featureFlagData: {},
                userConfigurationStoreState: {
                    ...userData,
                    bugService: testCase.bugService,
                    bugServicePropertiesMap: testCase.bugServicePropertiesMap,
                },
            };

            const wrapped = shallow(<GitHubIssueSettingsUx {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('handle text field changes', () => {
            const userConfigMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>();

            const newValue = 'new-value';

            userConfigMessageCreatorMock
                .setup(creator => creator.setIssueFilingServiceProperty('gitHub', 'repository', newValue))
                .verifiable(Times.once());

            const props: SettingsProps = {
                deps: {
                    userConfigMessageCreator: userConfigMessageCreatorMock.object,
                } as SettingsDeps,
                featureFlagData: {},
                userConfigurationStoreState: userData,
            };

            const wrapped = shallow(<GitHubIssueSettingsUx {...props} />);

            const textField = wrapped.find(TextField);

            textField.simulate('change', null, newValue);

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
