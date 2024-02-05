// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { HighContrastSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/high-contrast/high-contrast-settings';
import {
    SettingsDeps,
    SettingsProps,
} from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import { GenericToggle } from '../../../../../../../../../DetailsView/components/generic-toggle';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../../../../DetailsView/components/generic-toggle');
describe('HighContrastSettings', () => {
    mockReactComponents([GenericToggle]);
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

            const renderResult = render(<HighContrastSettings {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([GenericToggle]);
        });
    });

    describe('user interaction', () => {
        it.each(enableStates)('handles toggle click, with enabled = %s', async enabled => {
            useOriginalReactElements('../../../DetailsView/components/generic-toggle', [
                'GenericToggle',
            ]);
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

            const renderResult = render(<HighContrastSettings {...props} />);

            userConfigMessageCreatorMock
                .setup(creator => creator.setHighContrastMode(!enabled))
                .verifiable(Times.once());

            await userEvent.click(renderResult.getByRole('switch'));

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
