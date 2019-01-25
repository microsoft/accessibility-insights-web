// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import {
    enableTelemetrySettingDescription,
    enableTelemetrySettingsPanelTitle,
} from '../../../../../content/settings/improve-accessibility-insights';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { GenericPanel } from '../../../../../DetailsView/components/generic-panel';
import { GenericToggle } from '../../../../../DetailsView/components/generic-toggle';
import { SettingsPanel, SettingsPanelProps } from '../../../../../DetailsView/components/settings-panel';

class TestableSettingsPanel extends SettingsPanel {
    public getOnEnableTelemetryToggleClick() {
        return this.onEnableTelemetryToggleClick;
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
    };

    test.each([
        {
            isPanelOpen: true,
            enableTelemetry: false,
        } as RenderTestCase,
        {
            isPanelOpen: true,
            enableTelemetry: false,
        } as RenderTestCase,
    ])('render - %o', (testCase: RenderTestCase) => {
        userConfigStoreData = { enableTelemetry: testCase.enableTelemetry } as UserConfigurationStoreData;
        const testProps: SettingsPanelProps = {
            isOpen: testCase.isPanelOpen,
            deps: {
                detailsViewActionMessageCreator: detailsActionMessageCreatorMock.object,
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            userConfigStoreState: userConfigStoreData,
        };

        const testSubject = new TestableSettingsPanel(testProps);

        const expected = (
            <GenericPanel
                isOpen={testCase.isPanelOpen}
                className={'settings-panel'}
                onDismiss={detailsActionMessageCreatorMock.object.closeScopingPanel}
                closeButtonAriaLabel={'Close settings panel'}
                hasCloseButton={true}
                title="Settings"
            >
                <GenericToggle
                    enabled={userConfigStoreData.enableTelemetry}
                    id="enable-telemetry"
                    name={enableTelemetrySettingsPanelTitle}
                    description={enableTelemetrySettingDescription}
                    onClick={testSubject.getOnEnableTelemetryToggleClick()}
                />
            </GenericPanel>
        );

        expect(testSubject.render()).toEqual(expected);
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
        };

        const testSubject = new TestableSettingsPanel(testProps);

        testSubject.getOnEnableTelemetryToggleClick()(null, telemetrySettingState);
        userConfigMessageCreatorMock.verify(u => u.setTelemetryState(telemetrySettingState), Times.once());
    });
});
