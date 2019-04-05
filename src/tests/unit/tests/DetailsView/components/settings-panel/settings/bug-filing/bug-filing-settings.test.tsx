// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

import { FeatureFlags } from '../../../../../../../../common/feature-flags';
import { UserConfigMessageCreator } from '../../../../../../../../common/message-creators/user-config-message-creator';
import {
    BugServicePropertiesMap,
    UserConfigurationStoreData,
} from '../../../../../../../../common/types/store-data/user-configuration-store';
import { BugFilingSettings } from '../../../../../../../../DetailsView/components/settings-panel/settings/bug-filing/bug-filing-settings';
import { SettingsProps, SettingsDeps } from '../../../../../../../../DetailsView/components/settings-panel/settings/settings-props';

type RenderTestCase = {
    bugFilingEnable: boolean;
    bugService: string;
    bugServicePropertiesMap: BugServicePropertiesMap;
};

describe('BugFilingSettings', () => {
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
                bugFilingEnable: false,
                bugService: 'none',
                bugServicePropertiesMap: null,
            },
            {
                bugFilingEnable: false,
                bugService: 'gitHub',
                bugServicePropertiesMap: null,
            },
            {
                bugFilingEnable: false,
                bugService: 'gitHub',
                bugServicePropertiesMap: {},
            },
            {
                bugFilingEnable: false,
                bugService: 'gitHub',
                bugServicePropertiesMap: { gitHub: {} },
            },
            {
                bugFilingEnable: false,
                bugService: 'gitHub',
                bugServicePropertiesMap: { gitHub: { repository: 'test-repository' } },
            },
        ];

        it.each(testCases)('%o', (testCase: RenderTestCase) => {
            const props: SettingsProps = {
                deps: Mock.ofType<SettingsDeps>().object,
                featureFlagData: {
                    [FeatureFlags.showBugFiling]: testCase.bugFilingEnable,
                },
                userConfigurationStoreState: {
                    ...userData,
                    bugService: testCase.bugService,
                    bugServicePropertiesMap: testCase.bugServicePropertiesMap,
                },
            };

            const wrapped = shallow(<BugFilingSettings {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('renders the text field properly', () => {
            const props: SettingsProps = {
                deps: Mock.ofType<SettingsDeps>().object,
                featureFlagData: {
                    [FeatureFlags.showBugFiling]: true,
                },
                userConfigurationStoreState: userData,
            };

            const wrapped = shallow(<BugFilingSettings {...props} />);

            const textField = wrapped.dive().find(TextField);

            expect(textField.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('handle text field changes', () => {
            const userConfigMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>();

            const newValue = 'new-value';

            userConfigMessageCreatorMock
                .setup(creator => creator.setBugServiceProperty('gitHub', 'repository', newValue))
                .verifiable(Times.once());

            const props: SettingsProps = {
                deps: {
                    userConfigMessageCreator: userConfigMessageCreatorMock.object,
                },
                featureFlagData: {
                    [FeatureFlags.showBugFiling]: true,
                },
                userConfigurationStoreState: userData,
            };

            const wrapped = shallow(<BugFilingSettings {...props} />);

            const textField = wrapped.dive().find(TextField);

            textField.simulate('change', null, newValue);

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
