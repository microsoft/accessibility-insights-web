// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import { UserConfigMessageCreator } from '../../../../../../../../common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from '../../../../../../../../common/types/store-data/user-configuration-store';
import {
    TelemetrySettings,
    TelemetrySettingsProps,
} from '../../../../../../../../DetailsView/components/settings-panel/settings/telemetry/telemetry-settings';

describe('TelemetrySettings', () => {
    const enableStates = [true, false];

    describe('renders', () => {
        it.each(enableStates)('with enabled = %s', enabled => {
            const props: TelemetrySettingsProps = {
                deps: Mock.ofType<TelemetrySettingsProps['deps']>().object,
                userConfigurationStoreState: {
                    enableTelemetry: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const wrapper = shallow(<TelemetrySettings {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it.each(enableStates)('handle toggle click, with enabled = %s', enabled => {
            const userConfigMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>();
            const deps = {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            } as TelemetrySettingsProps['deps'];
            const props: TelemetrySettingsProps = {
                deps,
                userConfigurationStoreState: {
                    enableTelemetry: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const wrapper = shallow(<TelemetrySettings {...props} />);

            userConfigMessageCreatorMock.setup(creator => creator.setTelemetryState(!enabled)).verifiable(Times.once());

            wrapper
                .dive()
                .find(Toggle)
                .simulate('click');

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
