// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, PrimaryButton } from '@fluentui/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import {
    SaveAssessmentButton,
    SaveAssessmentButtonProps,
} from 'DetailsView/components/save-assessment-button';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, Times } from 'typemoq';

describe('SaveAssessmentButton', () => {
    let propsStub: SaveAssessmentButtonProps;
    let assessmentActionMessageCreatorMock: IMock<AssessmentActionMessageCreator>;
    let eventStub: any;
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
                assessmentActionMessageCreator: assessmentActionMessageCreatorMock.object,
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            },
            download: 'download',
            href: 'url',
            userConfigurationStoreData,
        };
        eventStub = new EventStubFactory().createMouseClickEvent();
    });

    describe('on dialog enabled', () => {
        let wrapper: ShallowWrapper;

        beforeEach(() => {
            wrapper = shallow(<SaveAssessmentButton {...propsStub} />);
            wrapper.find(InsightsCommandButton).simulate('click', eventStub);
        });

        it('snapshot of dialog', () => {
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('dialog is visible', () => {
            expect(wrapper.find(Dialog).props().hidden).toEqual(false);
        });

        it('dialog is hidden (dismissed) when "got it" button is clicked', () => {
            wrapper.find(PrimaryButton).simulate('click');
            expect(wrapper.find(Dialog).props().hidden).toEqual(true);
        });

        it('dialog is hidden (dismissed) when onDismiss is called', () => {
            wrapper.find(Dialog).prop('onDismiss')();
            expect(wrapper.find(Dialog).props().hidden).toEqual(true);
        });

        it('when "dont show again" box is clicked, set the showSaveAssessmentDialog user config state to `false`', () => {
            // The "Don't show again" checkbox logic is inverted
            const checkbox = wrapper.find('StyledCheckboxBase');
            // Check "Don't show again" = true
            checkbox.simulate('change', null, true);
            // showSaveAssessmentDialog = false ("Enable the dialog" = false)
            userConfigMessageCreatorMock.verify(
                x => x.setSaveAssessmentDialogState(false),
                Times.atLeastOnce(),
            );
        });

        it('should call saveAssessment on click', async () => {
            assessmentActionMessageCreatorMock.verify(
                x => x.saveAssessment(eventStub),
                Times.atLeastOnce(),
            );
        });
    });

    describe('on dialog disabled', () => {
        let wrapper: ShallowWrapper;

        beforeEach(() => {
            propsStub.userConfigurationStoreData.showSaveAssessmentDialog = false;
            wrapper = shallow(<SaveAssessmentButton {...propsStub} />);
            wrapper.find(InsightsCommandButton).simulate('click', eventStub);
        });

        it('saves assessment without dialog (dialog is hidden)', () => {
            expect(wrapper.find(Dialog).props().hidden).toEqual(true);
        });

        it('should call saveAssessment on click', async () => {
            assessmentActionMessageCreatorMock.verify(
                x => x.saveAssessment(eventStub),
                Times.atLeastOnce(),
            );
        });
    });
});
