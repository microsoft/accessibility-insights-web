// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NamedFC, ReactFCWithDisplayName } from 'common/react/named-fc';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { SettingsProps } from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';
import { createSettingsProvider } from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-provider';
import {
    SettingsPanel,
    SettingsPanelDeps,
    SettingsPanelProps,
} from 'DetailsView/components/details-view-overlay/settings-panel/settings-panel';
import * as React from 'react';
import { GenericPanel } from '../../../../../../../DetailsView/components/generic-panel';
import { mockReactComponents } from '../../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../../DetailsView/components/generic-panel');
describe('SettingsPanelTest', () => {
    mockReactComponents([GenericPanel]);
    const testSettingsProvider = createSettingsProvider([
        createTestSettings('test-settings-1'),
        createTestSettings('test-settings-2'),
        createTestSettings('test-settings-3'),
    ]);

    const testProps: Partial<SettingsPanelProps> = {
        deps: {
            detailsViewActionMessageCreator: {
                closeSettingsPanel: () => {},
            } as DetailsViewActionMessageCreator,
            userConfigMessageCreator: {} as UserConfigMessageCreator,
            settingsProvider: testSettingsProvider,
        } as SettingsPanelDeps,
        userConfigStoreState: {} as UserConfigurationStoreData,
        featureFlagData: { 'test-flag': false },
    };

    it.each([true, false])('render - isPanelOpen = %s', isPanelOpen => {
        const props: SettingsPanelProps = {
            ...testProps,
            isOpen: isPanelOpen,
        } as SettingsPanelProps;

        const renderResult = render(<SettingsPanel {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    it('render - with custom layer class name', () => {
        const props: SettingsPanelProps = {
            ...testProps,
            layerClassName: 'test-layer-class-name',
        } as SettingsPanelProps;

        const renderResult = render(<SettingsPanel {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });
});

function createTestSettings(name: string): ReactFCWithDisplayName<SettingsProps> {
    return NamedFC<SettingsProps>('TestSettings', props => {
        return (
            <div className="test-settings">
                <div>{name}</div>
            </div>
        );
    });
}
