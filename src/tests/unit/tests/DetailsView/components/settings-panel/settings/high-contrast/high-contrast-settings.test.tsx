// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import { UserConfigMessageCreator } from '../../../../../../../../common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from '../../../../../../../../common/types/store-data/user-configuration-store';
import {
    HighContrastSettings,
    HighContrastSettingsDeps,
    HighContrastSettingsProps,
} from '../../../../../../../../DetailsView/components/settings-panel/settings/high-contrast/high-contrast-settings';

describe('HighContrastSettings', () => {
    describe('renders', () => {
        const enableStates = [true, false];

        it.each(enableStates)('with enabled = %s', enabled => {
            const props: HighContrastSettingsProps = {
                deps: Mock.ofType<HighContrastSettingsDeps>().object,
                userConfigigurationStoreSate: {
                    enableHighContrast: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const wrapper = shallow(<HighContrastSettings {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('handles toggle click', () => {
            const userConfigMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>();
            const deps = {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            };
            const props: HighContrastSettingsProps = {
                deps,
                userConfigigurationStoreSate: {
                    enableHighContrast: true,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const wrapper = shallow(<HighContrastSettings {...props} />);

            userConfigMessageCreatorMock
                .setup(creator => creator.setHighContrastMode(!props.userConfigigurationStoreSate.enableHighContrast))
                .verifiable(Times.once());

            wrapper
                .dive()
                .find(Toggle)
                .simulate('click');

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
