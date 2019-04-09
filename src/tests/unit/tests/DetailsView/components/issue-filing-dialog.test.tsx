// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, MockBehavior, Times } from 'typemoq';

import { BugFilingService } from '../../../../../bug-filing/types/bug-filing-service';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { ActionAndCancelButtonsComponent } from '../../../../../DetailsView/components/action-and-cancel-buttons-component';
import {
    IssueFilingDialog,
    IssueFilingDialogDeps,
    IssueFilingDialogProps,
} from '../../../../../DetailsView/components/issue-filing-dialog';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('IssueFilingDialog', () => {
    it('renders', () => {
        const eventStub = new EventStubFactory().createMouseClickEvent();
        const isSettingsValidMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        const createBugFilingUrlMock = Mock.ofInstance((serviceData, bugData) => null, MockBehavior.Strict);
        const telemetryCallbackMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        const selectedBugDataStub = {
            pageTitle: 'some pageTitle',
        } as CreateIssueDetailsTextData;
        const selectedServiceData = {
            someServiceData: null,
        };
        const deps: IssueFilingDialogDeps = {
            bugFilingServiceProvider: null,
        };
        const bugFilingServiceStub = {
            isSettingsValid: isSettingsValidMock.object,
            createBugFilingUrl: createBugFilingUrlMock.object,
        } as BugFilingService;
        const props: IssueFilingDialogProps = {
            deps,
            isOpen: true,
            onClose: null,
            selectedBugFilingService: bugFilingServiceStub,
            selectedBugData: selectedBugDataStub,
            selectedBugFilingServiceData: selectedServiceData,
            bugFileTelemetryCallback: telemetryCallbackMock.object,
        };

        isSettingsValidMock.setup(isSettingsValid => isSettingsValid(selectedServiceData)).verifiable(Times.exactly(2));
        createBugFilingUrlMock
            .setup(createBugFilingUrl => createBugFilingUrl(selectedServiceData, selectedBugDataStub))
            .verifiable(Times.exactly(2));
        telemetryCallbackMock.setup(telemetryCallback => telemetryCallback(eventStub)).verifiable();

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        expect(testSubject.getElement()).toMatchSnapshot('Opened Dialog');

        const actionCancelButtons = testSubject.find(ActionAndCancelButtonsComponent);
        actionCancelButtons.prop('primaryButtonOnClick')(eventStub);
        actionCancelButtons.prop('cancelButtonOnClick')(null);

        isSettingsValidMock.verifyAll();
        createBugFilingUrlMock.verifyAll();
        telemetryCallbackMock.verifyAll();

        expect(testSubject.getElement()).toMatchSnapshot('Closed Dialog');
    });
});
