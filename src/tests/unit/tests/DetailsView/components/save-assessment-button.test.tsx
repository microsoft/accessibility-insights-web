// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    ActionButton,
    Checkbox,
    Dialog,
    DialogFooter,
    PrimaryButton,
    Stack,
} from '@fluentui/react';
import { fireEvent, render, RenderResult, act } from '@testing-library/react';

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
    mockReactComponent,
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { IMock, It, Mock, Times } from 'typemoq';

jest.mock('@fluentui/react');
describe('SaveAssessmentButton', () => {
    mockReactComponents([DialogFooter, Stack, Checkbox, Stack.Item, PrimaryButton, ActionButton]);
    mockReactComponent(Dialog, 'Dialog');
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
        describe('render', () => {
            beforeEach(() => {
                mockReactComponent(Dialog, 'Dialog');
                wrapper = render(<SaveAssessmentButton {...propsStub} />);
                fireEvent.click(wrapper.container.querySelector('mock-customizedactionbutton'));
            });
            it('snapshot of dialog', () => {
                expect(wrapper.asFragment()).toMatchSnapshot();
            });

            it('dialog is visible', () => {
                expect(getMockComponentClassPropsForCall(Dialog, 2).hidden).toEqual(false);
            });

            it('dialog is hidden (dismissed) when onDismiss is called', () => {
                act(() => {
                    getMockComponentClassPropsForCall(Dialog, 2).onDismiss();
                });
                expect(getMockComponentClassPropsForCall(Dialog, 3).hidden).toEqual(true);
            });
        });
        let wrapper: RenderResult;
        describe('interaction', () => {
            beforeEach(() => {
                useOriginalReactElements('@fluentui/react', [
                    'Dialog',
                    'DialogFooter',
                    'Stack',
                    'Checkbox',
                    'PrimaryButton',
                    'ActionButton',
                ]);

                wrapper = render(<SaveAssessmentButton {...propsStub} />);
                fireEvent.click(wrapper.getByRole('button'));
            });

            it('when "dont show again" box is clicked, set the showSaveAssessmentDialog user config state to `false`', () => {
                // The "Don't show again" checkbox logic is inverted
                const checkbox = wrapper.getByRole('checkbox');
                // Check "Don't show again" = true

                fireEvent.click(checkbox);
                // showSaveAssessmentDialog = false ("Enable the dialog" = false)
                userConfigMessageCreatorMock.verify(
                    x => x.setSaveAssessmentDialogState(false),
                    Times.atLeastOnce(),
                );
            });

            it('should call saveAssessment on click', async () => {
                assessmentActionMessageCreatorMock.verify(
                    x => x.saveAssessment(It.isAny()),
                    Times.atLeastOnce(),
                );
            });
            it('dialog is hidden (dismissed) when "got it" button is clicked', async () => {
                const gotItButtonProps = getMockComponentClassPropsForCall(PrimaryButton);
                act(() => {
                    gotItButtonProps.onClick();
                });
                // since upgrading to React 18, this test is nondeterministic between being run in
                // isolation and being run with the entire test suite. If you are working on this test
                // and running it all by itself locally, it will include an additional empty render after
                // the link click in the beforeEach, making this test fail.
                const getProps = getMockComponentClassPropsForCall(Dialog, 3);
                expect(getProps.hidden).toEqual(true);
            });
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
