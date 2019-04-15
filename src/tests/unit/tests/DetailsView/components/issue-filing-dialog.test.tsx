// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BugFilingService } from '../../../../../bug-filing/types/bug-filing-service';
import { EnvironmentInfo, EnvironmentInfoProvider } from '../../../../../common/environment-info-provider';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { ActionAndCancelButtonsComponent } from '../../../../../DetailsView/components/action-and-cancel-buttons-component';
import {
    IssueFilingDialog,
    IssueFilingDialogDeps,
    IssueFilingDialogProps,
} from '../../../../../DetailsView/components/issue-filing-dialog';
import { EventStub, EventStubFactory } from '../../../common/event-stub-factory';

describe('IssueFilingDialog', () => {
    let eventStub: EventStub;
    let isSettingsValidMock: IMock<Function>;
    let createBugFilingUrlMock: IMock<Function>;
    let onCloseMock: IMock<(ev) => void>;
    let telemetryCallbackMock: IMock<(ev) => void>;
    let selectedBugDataStub: CreateIssueDetailsTextData;
    let selectedServiceData;
    let deps: IssueFilingDialogDeps;
    let bugFilingServiceStub: BugFilingService;
    let props: IssueFilingDialogProps;
    let envInfoProviderMock: IMock<EnvironmentInfoProvider>;
    let envInfo: EnvironmentInfo;

    beforeEach(() => {
        envInfo = {
            extensionVersion: '1.1.1',
            browserSpec: '1.2.3',
            axeCoreVersion: '2.1.1',
        };
        eventStub = new EventStubFactory().createMouseClickEvent();
        isSettingsValidMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        onCloseMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        createBugFilingUrlMock = Mock.ofInstance((serviceData, bugData, info) => null, MockBehavior.Strict);
        telemetryCallbackMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        envInfoProviderMock = Mock.ofType(EnvironmentInfoProvider);

        envInfoProviderMock.setup(p => p.getEnvironmentInfo()).returns(() => envInfo);
        selectedBugDataStub = {
            pageTitle: 'some pageTitle',
        } as CreateIssueDetailsTextData;
        selectedServiceData = {
            someServiceData: null,
        };
        deps = {
            bugFilingServiceProvider: null,
            environmentInfoProvider: envInfoProviderMock.object,
        } as IssueFilingDialogDeps;
        bugFilingServiceStub = {
            isSettingsValid: isSettingsValidMock.object,
            createBugFilingUrl: createBugFilingUrlMock.object,
        } as BugFilingService;
        props = {
            deps,
            isOpen: true,
            onClose: onCloseMock.object,
            selectedBugFilingService: bugFilingServiceStub,
            selectedBugData: selectedBugDataStub,
            selectedBugFilingServiceData: selectedServiceData,
            bugFileTelemetryCallback: telemetryCallbackMock.object,
        };
    });

    it.each([true, false])('render with isSettingsValid: %s', isSettingsValid => {
        isSettingsValidMock.setup(isValid => isValid(selectedServiceData)).returns(() => isSettingsValid);

        createBugFilingUrlMock
            .setup(createBugFilingUrl => createBugFilingUrl(selectedServiceData, selectedBugDataStub, envInfo))
            .returns(() => 'test url');

        const testSubject = shallow(<IssueFilingDialog {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('render: validate correct callbacks (file issue on click and cancel)', () => {
        isSettingsValidMock
            .setup(isSettingsValid => isSettingsValid(selectedServiceData))
            .returns(() => true)
            .verifiable(Times.once());
        createBugFilingUrlMock
            .setup(createBugFilingUrl => createBugFilingUrl(selectedServiceData, selectedBugDataStub, envInfo))
            .verifiable(Times.once());
        telemetryCallbackMock.setup(telemetryCallback => telemetryCallback(eventStub)).verifiable(Times.never());
        onCloseMock.setup(onClose => onClose(null)).verifiable(Times.once());

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const actionCancelButtons = testSubject.find(ActionAndCancelButtonsComponent);
        actionCancelButtons.props().cancelButtonOnClick(null);

        isSettingsValidMock.verifyAll();
        createBugFilingUrlMock.verifyAll();
        telemetryCallbackMock.verifyAll();
        onCloseMock.verifyAll();
    });

    it('render: validate correct callbacks (file issue on click and cancel)', () => {
        isSettingsValidMock
            .setup(isSettingsValid => isSettingsValid(selectedServiceData))
            .returns(() => true)
            .verifiable(Times.once());
        createBugFilingUrlMock
            .setup(createBugFilingUrl => createBugFilingUrl(selectedServiceData, selectedBugDataStub, envInfo))
            .verifiable(Times.once());
        telemetryCallbackMock.setup(telemetryCallback => telemetryCallback(eventStub)).verifiable(Times.once());
        onCloseMock.setup(onClose => onClose(eventStub)).verifiable(Times.once());

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const actionCancelButtons = testSubject.find(ActionAndCancelButtonsComponent);
        actionCancelButtons.props().primaryButtonOnClick(eventStub);

        isSettingsValidMock.verifyAll();
        createBugFilingUrlMock.verifyAll();
        telemetryCallbackMock.verifyAll();
        onCloseMock.verifyAll();
    });
});
