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
    mockReactComponents,
    useOriginalReactElements,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');

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

describe('SaveAssessmentDialog', () => {
    mockReactComponents([Dialog, DialogFooter, Stack, Checkbox, Stack.Item, PrimaryButton]);

    it('render snapshot of dialog', () => {
        const wrapper = render(<SaveAssessmentDialog {...propsStub} />);
        expect(wrapper.asFragment()).toMatchSnapshot();
    });

    it('dialog is visible', () => {
        render(<SaveAssessmentDialog {...propsStub} />);
        expect(getMockComponentClassPropsForCall(Dialog).hidden).toEqual(false);
    });

    it('dialog is hidden (dismissed) when onDismiss is called', () => {
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

    // Need to be checked
    // it('dialog is hidden (dismissed) when "got it" button is clicked', async () => {
    //     propsStub.isOpen = true;
    //     render(<SaveAssessmentDialog {...propsStub} />);
    //     const gotItButtonProps = getMockComponentClassPropsForCall(PrimaryButton);

    //     gotItButtonProps.onClick();
    //     const getProps = getMockComponentClassPropsForCall(Dialog);
    //     expect(getProps.hidden).toEqual(true);
    // });
});

describe('on dialog disabled', () => {
    mockReactComponents([Dialog, DialogFooter, Stack, Checkbox, Stack.Item, PrimaryButton]);
    let wrapper;

    beforeEach(() => {
        propsStub.isOpen = false;
        propsStub.userConfigurationStoreData.showSaveAssessmentDialog = false;
        wrapper = render(<SaveAssessmentDialog {...propsStub} />);
    });

    it('saves assessment without dialog (dialog is hidden)', () => {
        expect(getMockComponentClassPropsForCall(Dialog).hidden).toEqual(true);
    });
});
