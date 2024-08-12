// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { SaveAssessmentDialogSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/save-assessment-dialog/save-assessment-dialog-settings';
import {
    SettingsDeps,
    SettingsProps,
} from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import { GenericToggle } from '../../../../../../../../../DetailsView/components/generic-toggle';
import {
    mockReactComponents,
    useOriginalReactElements,
} from '../../../../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../../../../DetailsView/components/generic-toggle');
describe('SaveAssessmentDialog', () => {
    mockReactComponents([GenericToggle]);
    const enableStates = [true, false];

    describe('renders', () => {
        it.each(enableStates)('with enabled = %s', enabled => {
            const props: SettingsProps = {
                deps: Mock.ofType<SettingsDeps>().object,
                userConfigurationStoreState: {
                    showSaveAssessmentDialog: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const renderResult = render(<SaveAssessmentDialogSettings {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
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
                    showSaveAssessmentDialog: enabled,
                } as UserConfigurationStoreData,
                featureFlagData: {},
            };

            const renderResult = render(<SaveAssessmentDialogSettings {...props} />);

            userConfigMessageCreatorMock
                .setup(creator => creator.setSaveAssessmentDialogState(!enabled))
                .verifiable(Times.once());

            await userEvent.click(renderResult.getByRole('switch'));

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
