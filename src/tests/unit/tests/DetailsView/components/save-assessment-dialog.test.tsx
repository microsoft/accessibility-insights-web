// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Checkbox, Dialog, DialogFooter, PrimaryButton, Stack } from '@fluentui/react';
import { fireEvent, render } from '@testing-library/react';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    SaveAssessmentDialog,
    SaveAssessmentDialogProps,
} from 'DetailsView/components/save-assessment-dialog';
import React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import {
    getMockComponentClassPropsForCall,
    mockReactComponent,
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');

describe('SaveAssessmentDialog', () => {
    mockReactComponents([DialogFooter, Stack, Checkbox, Stack.Item, PrimaryButton]);
    mockReactComponent(Dialog, 'Dialog');

    let propsStub: SaveAssessmentDialogProps;
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let userConfigurationStoreData: UserConfigurationStoreData;
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
            userConfigurationStoreData,
            isOpen: true,
            onClose: () => {},
        };
    });

    it('render', () => {
        const wrapper = render(<SaveAssessmentDialog {...propsStub} />);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

    it('dialog is visible when isOpen is `true`', () => {
        render(<SaveAssessmentDialog {...propsStub} />);
        expect(getMockComponentClassPropsForCall(Dialog).hidden).toEqual(false);
    });

    it('dialog is hidden (dismissed) when isOpen is `false`', () => {
        propsStub.isOpen = false;
        render(<SaveAssessmentDialog {...propsStub} />);
        expect(getMockComponentClassPropsForCall(Dialog).hidden).toEqual(true);
    });

    it('when "dont show again" box is clicked, set the showSaveAssessmentDialog user config state to `false`', () => {
        useOriginalReactElements('@fluentui/react', [
            'Dialog',
            'DialogFooter',
            'Stack',
            'Checkbox',
        ]);
        const wrapper = render(<SaveAssessmentDialog {...propsStub} />);
        const checkbox = wrapper.getByRole('checkbox');

        fireEvent.click(checkbox);

        userConfigMessageCreatorMock.verify(
            x => x.setSaveAssessmentDialogState(false),
            Times.once(),
        );
    });
});
