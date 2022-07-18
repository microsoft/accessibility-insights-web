// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Checkbox, Dialog, PrimaryButton } from '@fluentui/react';
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
import { IMock, It, Mock, Times } from 'typemoq';

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
            const eventStub = new EventStubFactory().createMouseClickEvent() as any;
            wrapper = shallow(<SaveAssessmentButton {...propsStub} />);
            wrapper.find(InsightsCommandButton).simulate('click', eventStub);
        });

        it('renders when dialog is enabled', () => {
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('is dismissed when "got it" button is clicked', () => {
            wrapper.find(PrimaryButton).simulate('click');

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('is dismissed when onDismiss is called', () => {
            wrapper.find(Dialog).prop('onDismiss')();
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('box appears checked when "dont show again" box is clicked', () => {
            userConfigMessageCreatorMock
                .setup(ucmcm => ucmcm.setSaveAssessmentDialogState(false))
                .verifiable(Times.once());

            wrapper.find(Checkbox).simulate('change', undefined, true);

            expect(wrapper.getElement()).toMatchSnapshot();
            userConfigMessageCreatorMock.verifyAll();
        });

        it('should call saveAssessment on click', async () => {
            detailsViewActionMessageCreatorMock
                .setup(m => m.saveAssessment(It.isAny()))
                .verifiable();

            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });

    describe('on dialog disabled', () => {
        let wrapper: ShallowWrapper;

        beforeEach(() => {
            propsStub.userConfigurationStoreData.showSaveAssessmentDialog = false;
            wrapper = shallow(<SaveAssessmentButton {...propsStub} />);
            wrapper.find(InsightsCommandButton).simulate('click', eventStub);
        });

        it('saves assessment without dialog', () => {
            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('should call saveAssessment on click', async () => {
            detailsViewActionMessageCreatorMock
                .setup(m => m.saveAssessment(It.isAny()))
                .verifiable();

            detailsViewActionMessageCreatorMock.verifyAll();
        });
    });
});
