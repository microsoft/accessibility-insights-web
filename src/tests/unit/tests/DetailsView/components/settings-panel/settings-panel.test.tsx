// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { UserConfigMessageCreator } from '../../../../../../common/message-creators/user-config-message-creator';
import { NamedFC } from '../../../../../../common/react/named-sfc';
import { UserConfigurationStoreData } from '../../../../../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    SettingsPanel,
    SettingsPanelDeps,
    SettingsPanelProps,
} from '../../../../../../DetailsView/components/settings-panel/settings-panel';
import { SettingsProps } from '../../../../../../DetailsView/components/settings-panel/settings/settings-props';
import { createSettingsProvider } from '../../../../../../DetailsView/components/settings-panel/settings/settings-provider';

describe('SettingsPanelTest', () => {
    let userConfigStoreData: UserConfigurationStoreData;

    it.each([true, false])('render - isPanelOpen = %s', isPanelOpen => {
        userConfigStoreData = {} as UserConfigurationStoreData;

        const testSettingsProvider = createSettingsProvider([
            createTestSettings('test-settings-1'),
            createTestSettings('test-settings-2'),
            createTestSettings('test-settings-3'),
        ]);

        const testProps: SettingsPanelProps = {
            isOpen: isPanelOpen,
            deps: {
                detailsViewActionMessageCreator: {
                    closeSettingsPanel: () => {},
                } as DetailsViewActionMessageCreator,
                userConfigMessageCreator: {} as UserConfigMessageCreator,
                settingsProvider: testSettingsProvider,
            } as SettingsPanelDeps,
            userConfigStoreState: userConfigStoreData,
            featureFlagData: { 'test-flag': false },
        };

        const wrapped = shallow(<SettingsPanel {...testProps} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});

const createTestSettings = (name: string) => {
    return NamedFC<SettingsProps>('TestSettings', props => {
        return (
            <div className="test-settings">
                <div>{name}</div>
                <div>{props}</div>
            </div>
        );
    });
};
