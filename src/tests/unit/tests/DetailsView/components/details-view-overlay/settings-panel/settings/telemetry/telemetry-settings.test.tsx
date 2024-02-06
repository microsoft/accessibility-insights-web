// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
import { GenericToggle } from '../../../../../../../../../DetailsView/components/generic-toggle';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../../../../../mock-helpers/mock-module-helpers';

jest.mock('common/components/enable-telemetry-setting-description');
jest.mock('../../../../../../../../../DetailsView/components/generic-toggle');
describe('TelemetrySettings', () => {
    mockReactComponents([EnableTelemetrySettingDescription, GenericToggle]);
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
            const teleMetryDescription = getMockComponentClassPropsForCall(GenericToggle);

            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([GenericToggle]);
            expect(teleMetryDescription.description.props.deps.LinkComponent).toBe(
                props.deps.LinkComponent,
            );
        });
    });

    describe('user interaction', () => {
        it.each(enableStates)('handle toggle click, with enabled = %s', async enabled => {
            useOriginalReactElements('../../../DetailsView/components/generic-toggle', [
                'GenericToggle',
            ]);
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
