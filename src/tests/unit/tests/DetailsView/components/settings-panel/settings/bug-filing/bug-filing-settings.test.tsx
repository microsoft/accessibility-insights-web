// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { Mock } from 'typemoq';

import { FeatureFlags } from '../../../../../../../../common/feature-flags';
import {
    BugServicePropertiesMap,
    UserConfigurationStoreData,
} from '../../../../../../../../common/types/store-data/user-configuration-store';
import {
    BugFilingSettings,
    BugFilingSettingsDeps,
    BugFilingSettingsProps,
} from '../../../../../../../../DetailsView/components/settings-panel/settings/bug-filing/bug-filing-settings';

type RenderTestCase = {
    bugFilingEnable: boolean;
    bugService: string;
    bugServicePropertiesMap: BugServicePropertiesMap;
};

describe('BugFilingSettings', () => {
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
            const props: BugFilingSettingsProps = {
                deps: Mock.ofType<BugFilingSettingsDeps>().object,
                featureFlagData: {
                    [FeatureFlags.showBugFiling]: testCase.bugFilingEnable,
                },
                userConfigStoreState: {
                    bugService: testCase.bugService,
                    bugServicePropertiesMap: testCase.bugServicePropertiesMap,
                } as UserConfigurationStoreData,
            };

            const wrapped = shallow(<BugFilingSettings {...props} />);

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('renders the text field properly', () => {
            const userData: UserConfigurationStoreData = {
                isFirstTime: true,
                enableTelemetry: true,
                enableHighContrast: true,
                bugService: 'GitHub',
                bugServicePropertiesMap: { gitHub: { repository: 'test-repository' } },
            };

            const props: BugFilingSettingsProps = {
                deps: Mock.ofType<BugFilingSettingsDeps>().object,
                featureFlagData: {
                    [FeatureFlags.showBugFiling]: true,
                },
                userConfigStoreState: userData,
            };

            const wrapped = shallow(<BugFilingSettings {...props} />);

            const textField = wrapped.dive().find(TextField);

            expect(textField.getElement()).toMatchSnapshot();

        });
    });
});
