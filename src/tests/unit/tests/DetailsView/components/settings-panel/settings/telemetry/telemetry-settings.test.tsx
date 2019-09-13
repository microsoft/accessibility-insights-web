// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import { EnableTelemetrySettingDescription } from '../../../../../../../../common/components/enable-telemetry-setting-description';
import { NewTabLink } from '../../../../../../../../common/components/new-tab-link';
import { UserConfigMessageCreator } from '../../../../../../../../common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from '../../../../../../../../common/types/store-data/user-configuration-store';
import { GenericToggle } from '../../../../../../../../DetailsView/components/generic-toggle';
import {
    TelemetrySettings,
    TelemetrySettingsProps,
} from '../../../../../../../../DetailsView/components/settings-panel/settings/telemetry/telemetry-settings';

describe('TelemetrySettings', () => {
    const enableStates = [true, false];

    describe('renders', () => {
        it.each(enableStates)('with enabled = %s', enabled => {
            const props: TelemetrySettingsProps = {
                deps: {
                    LinkComponent: NewTabLink,
                } as TelemetrySettingsProps['deps'],
                userConfigurationStoreState: {
                    enableTelemetry: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const wrapper = shallow(<TelemetrySettings {...props} />);
            const enableTelemetrySettingDescription = wrapper
                .find(GenericToggle)
                .dive()
                .find(EnableTelemetrySettingDescription);

            expect(wrapper.getElement()).toMatchSnapshot();
            expect(enableTelemetrySettingDescription.prop('deps').LinkComponent).toBe(props.deps.LinkComponent);
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
