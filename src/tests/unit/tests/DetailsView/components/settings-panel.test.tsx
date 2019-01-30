// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { FeatureFlags } from '../../../../../common/feature-flags';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { SettingsPanel, SettingsPanelProps } from '../../../../../DetailsView/components/settings-panel';

type SettingsPanelProtectedFunction = (id: string, state: boolean) => void;

class TestableSettingsPanel extends SettingsPanel {
    public getOnEnableTelemetryToggleClick(): SettingsPanelProtectedFunction {
        return this.onEnableTelemetryToggleClick;
    }

    public getOnEnableHighContrastModeToggleClick(): SettingsPanelProtectedFunction {
        return this.onEnableHighContrastModeToggleClick;
    }
}

describe('SettingsPanelTest', () => {
    let detailsActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let userConfigStoreData: UserConfigurationStoreData;

    beforeEach(() => {
        detailsActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
    });

    test('constructor', () => {
        const testSubject = new SettingsPanel({} as SettingsPanelProps);
        expect(testSubject).toBeDefined();
    });

    type RenderTestCase = {
        isPanelOpen: boolean;
        enableTelemetry: boolean;
        enableHighContrast: boolean;
    };

    test.each([
        {
            isPanelOpen: true,
            enableTelemetry: false,
            enableHighContrast: false,
        } as RenderTestCase,
        {
            isPanelOpen: true,
            enableTelemetry: false,
            enableHighContrast: true,
        } as RenderTestCase,
    ])('render - %o', (testCase: RenderTestCase) => {
        userConfigStoreData = {
            enableTelemetry: testCase.enableTelemetry,
            enableHighContrast: testCase.enableHighContrast,
        } as UserConfigurationStoreData;
        const testProps: SettingsPanelProps = {
            isOpen: testCase.isPanelOpen,
            deps: {
                detailsViewActionMessageCreator: detailsActionMessageCreatorMock.object,
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            userConfigStoreState: userConfigStoreData,
            featureFlagData: { [FeatureFlags.highContrastMode]: false },
        };

        const testSubject = new TestableSettingsPanel(testProps);
        expect(testSubject.render()).toMatchSnapshot();
    });

    test.each([true, false])('verify toggle click - telemetrySettingState : %s', telemetrySettingState => {
        userConfigStoreData = {} as UserConfigurationStoreData;
        const testProps: SettingsPanelProps = {
            isOpen: true,
            deps: {
                detailsViewActionMessageCreator: detailsActionMessageCreatorMock.object,
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            userConfigStoreState: userConfigStoreData,
            featureFlagData: { [FeatureFlags.highContrastMode]: true },
        };

        const testSubject = new TestableSettingsPanel(testProps);

        testSubject.getOnEnableTelemetryToggleClick()(null, telemetrySettingState);
        userConfigMessageCreatorMock.verify(u => u.setTelemetryState(telemetrySettingState), Times.once());
    });

    test.each([true, false])('verify toggle click - set high contrast button : %s', highContrastConfigState => {
        userConfigStoreData = {} as UserConfigurationStoreData;
        const testProps: SettingsPanelProps = {
            isOpen: true,
            deps: {
                detailsViewActionMessageCreator: detailsActionMessageCreatorMock.object,
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            userConfigStoreState: userConfigStoreData,
            featureFlagData: { [FeatureFlags.highContrastMode]: true },
        };

        const testSubject = new TestableSettingsPanel(testProps);

        testSubject.getOnEnableHighContrastModeToggleClick()(null, highContrastConfigState);
        userConfigMessageCreatorMock.verify(u => u.setHighContrastMode(highContrastConfigState), Times.once());
    });
});
