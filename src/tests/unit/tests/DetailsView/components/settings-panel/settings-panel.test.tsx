// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { FeatureFlags } from '../../../../../../common/feature-flags';
import { UserConfigMessageCreator } from '../../../../../../common/message-creators/user-config-message-creator';
import { BugServicePropertiesMap, UserConfigurationStoreData } from '../../../../../../common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from '../../../../../../DetailsView/actions/details-view-action-message-creator';
import { SettingsPanel, SettingsPanelProps } from '../../../../../../DetailsView/components/settings-panel/settings-panel';

type SettingsPanelProtectedTextFieldChangeFunction = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string,
) => void;

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
        bugService: string;
        bugServicePropertiesMap: BugServicePropertiesMap;
    };

    test.each([
        {
            isPanelOpen: true,
            enableTelemetry: false,
            enableHighContrast: false,
            bugService: undefined,
            bugServicePropertiesMap: null,
        } as RenderTestCase,
        {
            isPanelOpen: true,
            enableTelemetry: false,
            enableHighContrast: true,
            bugService: 'gitHub',
            bugServicePropertiesMap: null,
        } as RenderTestCase,
        {
            isPanelOpen: true,
            enableTelemetry: false,
            enableHighContrast: false,
            bugService: 'gitHub',
            bugServicePropertiesMap: {},
        } as RenderTestCase,
        {
            isPanelOpen: true,
            enableTelemetry: false,
            enableHighContrast: false,
            bugService: 'gitHub',
            bugServicePropertiesMap: { gitHub: {} },
        } as RenderTestCase,
        {
            isPanelOpen: true,
            enableTelemetry: false,
            enableHighContrast: false,
            bugService: 'gitHub',
            bugServicePropertiesMap: { gitHub: { repository: 'test-repository' } },
        } as RenderTestCase,
    ])('render - %o', (testCase: RenderTestCase) => {
        userConfigStoreData = {
            enableTelemetry: testCase.enableTelemetry,
            enableHighContrast: testCase.enableHighContrast,
            bugService: testCase.bugService,
            bugServicePropertiesMap: testCase.bugServicePropertiesMap,
        } as UserConfigurationStoreData;
        const testProps: SettingsPanelProps = {
            isOpen: testCase.isPanelOpen,
            deps: {
                detailsViewActionMessageCreator: {
                    closeSettingsPanel: () => {},
                } as DetailsViewActionMessageCreator,
                userConfigMessageCreator: {} as UserConfigMessageCreator,
            },
            userConfigStoreState: userConfigStoreData,
            featureFlagData: { 'test-flag': false },
        };

        const wrapped = shallow(<SettingsPanel {...testProps} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });
});
