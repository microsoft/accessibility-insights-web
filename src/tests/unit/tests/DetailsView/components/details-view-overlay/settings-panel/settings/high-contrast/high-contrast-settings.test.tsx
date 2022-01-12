// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { HighContrastSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/high-contrast/high-contrast-settings';
import {
    SettingsDeps,
    SettingsProps,
} from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';
import { shallow } from 'enzyme';
import { Toggle } from '@fluentui/react';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('HighContrastSettings', () => {
    const enableStates = [true, false];

    describe('renders', () => {
        it.each(enableStates)('with enabled = %s', enabled => {
            const props: SettingsProps = {
                deps: Mock.ofType<SettingsDeps>().object,
                userConfigurationStoreState: {
                    enableHighContrast: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const wrapper = shallow(<HighContrastSettings {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it.each(enableStates)('handles toggle click, with enabled = %s', enabled => {
            const userConfigMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>();
            const deps = {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            } as SettingsDeps;
            const props: SettingsProps = {
                deps,
                userConfigurationStoreState: {
                    enableHighContrast: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const wrapper = shallow(<HighContrastSettings {...props} />);

            userConfigMessageCreatorMock
                .setup(creator => creator.setHighContrastMode(!enabled))
                .verifiable(Times.once());

            wrapper.dive().find(Toggle).simulate('click');

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
