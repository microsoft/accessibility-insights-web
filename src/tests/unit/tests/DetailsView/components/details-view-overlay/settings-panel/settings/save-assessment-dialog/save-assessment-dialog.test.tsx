// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IMock, Mock } from 'typemoq';
import {
    SaveAssessmentDialog,
    SaveAssessmentDialogProps,
} from '../../../../../../../../../DetailsView/components/save-assessment-dialog';
import { AssessmentActionMessageCreator } from '../../../../../../../../../DetailsView/actions/assessment-action-message-creator';
import { UserConfigMessageCreator } from '../../../../../../../../../common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from '../../../../../../../../../common/types/store-data/user-configuration-store';
import { render } from '@testing-library/react';
import React from 'react';

describe('SaveAssessmentButton', () => {
    it('snapshot of dialog', () => {
        let propsStub: SaveAssessmentDialogProps;
        let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
        let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
        let userConfigurationStoreData: UserConfigurationStoreData;
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
            userConfigurationStoreData,
            isOpen: true,
            onClose: () => !userConfigurationStoreData.showSaveAssessmentDialog,
        };
        const wrapper = render(<SaveAssessmentDialog {...propsStub} />);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });
});
