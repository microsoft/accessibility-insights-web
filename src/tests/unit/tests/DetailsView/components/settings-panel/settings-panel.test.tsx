// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { UserConfigMessageCreator } from '../../../../../../common/message-creators/user-config-message-creator';
import { NamedSFC } from '../../../../../../common/react/named-sfc';
import { BugServicePropertiesMap, UserConfigurationStoreData } from '../../../../../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../../../../../../DetailsView/actions/details-view-action-message-creator';
import { SettingsPanel, SettingsPanelProps } from '../../../../../../DetailsView/components/settings-panel/settings-panel';
import { SettingsProps } from '../../../../../../DetailsView/components/settings-panel/settings/settings-props';
import { create } from '../../../../../../DetailsView/components/settings-panel/settings/settings-provider';

describe('SettingsPanelTest', () => {
    let userConfigStoreData: UserConfigurationStoreData;

    type RenderTestCase = {
        isPanelOpen: boolean;
        enableTelemetry?: boolean;
        enableHighContrast?: boolean;
        bugService?: string;
        bugServicePropertiesMap?: BugServicePropertiesMap;
    };

    test.each([
        {
            isPanelOpen: true,
        } as RenderTestCase,
        {
            isPanelOpen: false,
        } as RenderTestCase,
    ])('render - %o', (testCase: RenderTestCase) => {
        userConfigStoreData = {} as UserConfigurationStoreData;

        const testSettingsProvider = create([
            createTestSettings('test-settings-1'),
            createTestSettings('test-settings-2'),
            createTestSettings('test-settings-3'),
        ]);

        const testProps: SettingsPanelProps = {
            isOpen: testCase.isPanelOpen,
            deps: {
                detailsViewActionMessageCreator: {
                    closeSettingsPanel: () => {},
                } as DetailsViewActionMessageCreator,
                userConfigMessageCreator: {} as UserConfigMessageCreator,
                settingsProvider: testSettingsProvider,
            },
            userConfigStoreState: userConfigStoreData,
            featureFlagData: { 'test-flag': false },
        };

        const wrapped = shallow(<SettingsPanel {...testProps} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('renders the settings component', () => {
        userConfigStoreData = {} as UserConfigurationStoreData;

        const testSettingsProvider = create([
            createTestSettings('test-settings-1'),
            createTestSettings('test-settings-2'),
            createTestSettings('test-settings-3'),
        ]);

        const testProps: SettingsPanelProps = {
            isOpen: true,
            deps: {
                detailsViewActionMessageCreator: {
                    closeSettingsPanel: () => {},
                } as DetailsViewActionMessageCreator,
                userConfigMessageCreator: {} as UserConfigMessageCreator,
                settingsProvider: testSettingsProvider,
            },
            userConfigStoreState: userConfigStoreData,
            featureFlagData: { 'test-flag': false },
        };

        const wrapped = shallow(<SettingsPanel {...testProps} />);

        const testSettingsWrapper = wrapped.find('TestSettings');

        [0, 1, 2].forEach(index => {
            expect(
                testSettingsWrapper
                    .at(index)
                    .dive()
                    .getElement(),
            ).toMatchSnapshot(`settings ${index + 1}`);
        });
    });
});

const createTestSettings = (name: string) => {
    return NamedSFC<SettingsProps>('TestSettings', props => {
        return (
            <div className="test-settings">
                <div>{name}</div>
                <div>{props}</div>
            </div>
        );
    });
};
