// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog, PrimaryButton } from '@fluentui/react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
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
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let eventStub: any;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let userConfigurationStoreData: UserConfigurationStoreData;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();
        userConfigurationStoreData = {
            showSaveAssessmentDialog: true,
        } as UserConfigurationStoreData;
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        propsStub = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
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

        it('box appears checked when "dont show again" box is clicked', () => {
            const checkbox = wrapper.find('StyledCheckboxBase');
            checkbox.simulate('change', null, true);

            expect(checkbox.props().value).toEqual(false);
            userConfigMessageCreatorMock.verify(
                x => x.setSaveAssessmentDialogState(false),
                Times.atLeastOnce(),
            );
        });

        it('should call saveAssessment on click', async () => {
            detailsViewActionMessageCreatorMock.verify(
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
            detailsViewActionMessageCreatorMock.verify(
                x => x.saveAssessment(eventStub),
                Times.atLeastOnce(),
            );
        });
    });
});
