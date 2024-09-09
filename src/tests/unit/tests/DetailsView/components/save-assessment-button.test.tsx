// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    SaveAssessmentButton,
    SaveAssessmentButtonProps,
} from 'DetailsView/components/save-assessment-button';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock } from 'typemoq';
import { InsightsCommandButton } from '../../../../../common/components/controls/insights-command-button';

jest.mock('@fluentui/react-components', () => ({
    ...jest.requireActual('@fluentui/react-components'),
    makeStyles: () => () => ({}),
}));
jest.mock('common/icons/fluentui-v9-icons');
jest.mock('DetailsView/components/save-assessment-dialog');
jest.mock('../../../../../common/components/controls/insights-command-button');
jest.mock('@fluentui/react-components');

describe('SaveAssessmentButton', () => {
    mockReactComponents([InsightsCommandButton]);
    let propsStub: SaveAssessmentButtonProps;
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let userConfigurationStoreData: UserConfigurationStoreData;
    const handleSaveAssessmentButtonClickMock =
        Mock.ofType<(event: React.MouseEvent<any>) => void>();
    beforeEach(() => {
        assessmentActionMessageCreatorMock = Mock.ofType<AssessmentActionMessageCreator>();
        userConfigurationStoreData = {
            showSaveAssessmentDialog: true,
        } as UserConfigurationStoreData;
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        propsStub = {
            deps: {
                getAssessmentActionMessageCreator: () => assessmentActionMessageCreatorMock.object,
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            download: 'download',
            href: 'url',
            userConfigurationStoreData,
            handleSaveAssessmentButtonClick: handleSaveAssessmentButtonClickMock.object,
        };
    });

    it('should render per snapshot', async () => {
        const wrapper = render(<SaveAssessmentButton {...propsStub} />);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

    it('should call save assessment button click method on click', async () => {
        useOriginalReactElements('../../../common/components/controls/insights-command-button', [
            'InsightsCommandButton',
        ]);
        handleSaveAssessmentButtonClickMock.setup(m => m(It.isAny())).verifiable();
        const wrapper = render(<SaveAssessmentButton {...propsStub} />);
        await userEvent.click(wrapper.getByRole('button'));
        handleSaveAssessmentButtonClickMock.verifyAll();
    });
});
