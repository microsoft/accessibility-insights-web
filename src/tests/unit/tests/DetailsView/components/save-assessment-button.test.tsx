// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Checkbox, Dialog, DialogFooter, PrimaryButton, Stack } from '@fluentui/react';
import { fireEvent, render, RenderResult, act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    SaveAssessmentButton,
    SaveAssessmentButtonProps,
} from 'DetailsView/components/save-assessment-button';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock, Times } from 'typemoq';

jest.mock('@fluentui/react');
describe('SaveAssessmentButton', () => {
    mockReactComponents([Dialog, DialogFooter, Stack, Checkbox, Stack.Item, PrimaryButton]);
    useOriginalReactElements('@fluentui/react', ['ActionButton']);
    let propsStub: SaveAssessmentButtonProps;
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
            download: 'download',
            href: 'url',
            userConfigurationStoreData,
        };
    });

    describe('on dialog enabled', () => {
        let wrapper: RenderResult;

        beforeEach(() => {});

        it('snapshot of dialog', () => {
            wrapper = render(<SaveAssessmentButton {...propsStub} />);
            fireEvent.click(wrapper.getByRole('link'));
            expect(wrapper.asFragment()).toMatchSnapshot();
        });

        it('dialog is visible', () => {
            wrapper = render(<SaveAssessmentButton {...propsStub} />);
            fireEvent.click(wrapper.getByRole('link'));
            expect(getMockComponentClassPropsForCall(Dialog, 2).hidden).toEqual(false);
        });

        it('dialog is hidden (dismissed) when onDismiss is called', () => {
            wrapper = render(<SaveAssessmentButton {...propsStub} />);
            fireEvent.click(wrapper.getByRole('link'));
            act(() => {
                getMockComponentClassPropsForCall(Dialog, 2).onDismiss();
            });
            expect(getMockComponentClassPropsForCall(Dialog, 3).hidden).toEqual(true);
        });

        it('dialog is hidden (dismissed) when "got it" button is clicked', async () => {
            useOriginalReactElements('@fluentui/react', [
                'Dialog',
                'DialogFooter',
                'Stack',
                'Checkbox',
                'PrimaryButton',
            ]);
            wrapper = render(<SaveAssessmentButton {...propsStub} />);
            fireEvent.click(wrapper.getByRole('link'));
            await userEvent.click(wrapper.getByRole('button'));
            const openDialog = wrapper.container.querySelector('.is-open');
            expect(openDialog).toBeNull();
        });

        it('when "dont show again" box is clicked, set the showSaveAssessmentDialog user config state to `false`', () => {
            wrapper = render(<SaveAssessmentButton {...propsStub} />);
            fireEvent.click(wrapper.getByRole('link'));
            // The "Don't show again" checkbox logic is inverted
            const checkbox = wrapper.getByRole('checkbox');
            // Check "Don't show again" = true
            // checkbox.simulate('change', null, true);
            fireEvent.click(checkbox);
            // showSaveAssessmentDialog = false ("Enable the dialog" = false)
            userConfigMessageCreatorMock.verify(
                x => x.setSaveAssessmentDialogState(It.isAny()),
                Times.atLeastOnce(),
            );
        });

        it('should call saveAssessment on click', async () => {
            wrapper = render(<SaveAssessmentButton {...propsStub} />);
            fireEvent.click(wrapper.getByRole('link'));
            assessmentActionMessageCreatorMock.verify(
                x => x.saveAssessment(It.isAny()),
                Times.atLeastOnce(),
            );
        });
    });

    describe('on dialog disabled', () => {
        mockReactComponents([Dialog, DialogFooter, Stack, Checkbox, Stack.Item, PrimaryButton]);
        let wrapper: RenderResult;

        beforeEach(() => {
            propsStub.userConfigurationStoreData.showSaveAssessmentDialog = false;
            wrapper = render(<SaveAssessmentButton {...propsStub} />);
            fireEvent.click(wrapper.getByRole('link'));
        });

        it('saves assessment without dialog (dialog is hidden)', () => {
            expect(getMockComponentClassPropsForCall(Dialog).hidden).toEqual(true);
        });

        it('should call saveAssessment on click', async () => {
            assessmentActionMessageCreatorMock.verify(
                x => x.saveAssessment(It.isAny()),
                Times.atLeastOnce(),
            );
        });
    });
});
