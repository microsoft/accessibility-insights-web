// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Toggle } from '@fluentui/react';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AutoDetectedFailuresDialogSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/auto-detected-failures-dialog/auto-detected-failures-dialog-settings';
import {
    SettingsDeps,
    SettingsProps,
} from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('AutoDetectedFailuresDialogSettings', () => {
    const enableStates = [true, false];

    describe('renders', () => {
        it.each(enableStates)('with enabled = %s', enabled => {
            const props: SettingsProps = {
                deps: Mock.ofType<SettingsDeps>().object,
                userConfigurationStoreState: {
                    showAutoDetectedFailuresDialog: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const wrapper = shallow(<AutoDetectedFailuresDialogSettings {...props} />);

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
                    showAutoDetectedFailuresDialog: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const wrapper = shallow(<AutoDetectedFailuresDialogSettings {...props} />);

            userConfigMessageCreatorMock
                .setup(creator => creator.setAutoDetectedFailuresDialogState(!enabled))
                .verifiable(Times.once());

            wrapper.dive().find(Toggle).simulate('click');

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
