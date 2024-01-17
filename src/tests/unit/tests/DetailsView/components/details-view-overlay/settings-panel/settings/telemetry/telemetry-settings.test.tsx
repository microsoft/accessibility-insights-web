// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { EnableTelemetrySettingDescription } from 'common/components/enable-telemetry-setting-description';
import { NewTabLink } from 'common/components/new-tab-link';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import {
    createTelemetrySettings,
    TelemetrySettingsProps,
} from 'DetailsView/components/details-view-overlay/settings-panel/settings/telemetry/telemetry-settings';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import { getMockComponentClassPropsForCall, mockReactComponents } from '../../../../../../../mock-helpers/mock-module-helpers';
import userEvent from '@testing-library/user-event';

jest.mock('common/components/enable-telemetry-setting-description');
describe('TelemetrySettings', () => {
    mockReactComponents([EnableTelemetrySettingDescription]);
    const enableStates = [true, false];

    const TelemetrySettings = createTelemetrySettings('test-product-name');

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

            const renderResult = render(<TelemetrySettings {...props} />);
            
            const enableTelemetrySettingDescription = getMockComponentClassPropsForCall(EnableTelemetrySettingDescription);

            expect(renderResult.asFragment()).toMatchSnapshot();
            expect(enableTelemetrySettingDescription.deps.LinkComponent).toBe(
                props.deps.LinkComponent,
            );
        });
    });

    describe('user interaction', () => {
        it.each(enableStates)('handle toggle click, with enabled = %s', async enabled => {
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

            const renderResult = render(<TelemetrySettings {...props} />);

            userConfigMessageCreatorMock
                .setup(creator => creator.setTelemetryState(!enabled))
                .verifiable(Times.once());

            await userEvent.click(renderResult.getByRole('switch'));

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
