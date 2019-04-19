// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { BugFilingSettingsContainer } from '../../../../../bug-filing/components/bug-filing-settings-container';
import { BugFilingService } from '../../../../../bug-filing/types/bug-filing-service';
import { EnvironmentInfo, EnvironmentInfoProvider } from '../../../../../common/environment-info-provider';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { BugServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';
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
    let getSettingsFromStoreDataMock: IMock<Function>;
    let onCloseMock: IMock<(ev) => void>;
    let telemetryCallbackMock: IMock<(ev) => void>;
    let selectedBugDataStub: CreateIssueDetailsTextData;
    let selectedServiceData;
    let deps: IssueFilingDialogDeps;
    let bugFilingServiceStub: BugFilingService;
    let props: IssueFilingDialogProps;
    let envInfoProviderMock: IMock<EnvironmentInfoProvider>;
    let envInfo: EnvironmentInfo;
    let serviceKey: string;
    let bugServicePropertiesMapStub: BugServicePropertiesMap;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;

    beforeEach(() => {
        serviceKey = 'gitHub';
        envInfo = {
            extensionVersion: '1.1.1',
            browserSpec: '1.2.3',
            axeCoreVersion: '2.1.1',
        };
        eventStub = new EventStubFactory().createMouseClickEvent();
        isSettingsValidMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        onCloseMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        createBugFilingUrlMock = Mock.ofInstance((serviceData, bugData, info) => null, MockBehavior.Strict);
        getSettingsFromStoreDataMock = Mock.ofInstance(data => null);
        telemetryCallbackMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        envInfoProviderMock = Mock.ofType(EnvironmentInfoProvider);
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);

        envInfoProviderMock.setup(p => p.getEnvironmentInfo()).returns(() => envInfo);

        selectedBugDataStub = {
            pageTitle: 'some pageTitle',
        } as CreateIssueDetailsTextData;
        selectedServiceData = {
            someServiceData: null,
        };
        bugServicePropertiesMapStub = {
            [serviceKey]: selectedServiceData,
        };
        deps = {
            bugFilingServiceProvider: null,
            userConfigMessageCreator: userConfigMessageCreatorMock.object,
            environmentInfoProvider: envInfoProviderMock.object,
        } as IssueFilingDialogDeps;
        bugFilingServiceStub = {
            isSettingsValid: isSettingsValidMock.object,
            issueFilingUrlProvider: createBugFilingUrlMock.object,
            getSettingsFromStoreData: getSettingsFromStoreDataMock.object,
            key: serviceKey,
        } as BugFilingService;
        props = {
            deps,
            isOpen: true,
            onClose: onCloseMock.object,
            selectedBugFilingService: bugFilingServiceStub,
            selectedBugData: selectedBugDataStub,
            bugFileTelemetryCallback: telemetryCallbackMock.object,
            bugServicePropertiesMap: bugServicePropertiesMapStub,
        };

        getSettingsFromStoreDataMock.setup(mock => mock(It.isValue(bugServicePropertiesMapStub))).returns(() => selectedServiceData);
    });

    it.each([true, false])('render with isSettingsValid: %s', isSettingsValid => {
        isSettingsValidMock.setup(isValid => isValid(selectedServiceData)).returns(() => isSettingsValid);

        createBugFilingUrlMock
            .setup(createBugFilingUrl => createBugFilingUrl(selectedServiceData, selectedBugDataStub, envInfo))
            .returns(() => 'test url');

        const testSubject = shallow(<IssueFilingDialog {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('render: validate correct callbacks to ActionAndCancelButtonsComponent (file issue on click and cancel)', () => {
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

    it('render: validate correct callbacks to ActionAndCancelButtonsComponent (file issue on click and cancel)', () => {
        userConfigMessageCreatorMock.setup(ucmcm => ucmcm.saveIssueFilingSettings(serviceKey, selectedServiceData)).verifiable();
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
        userConfigMessageCreatorMock.verifyAll();
        onCloseMock.verifyAll();
    });

    it('render: validate callback (onPropertyUpdateCallback) sent to settings container when service settings are null', () => {
        const propertyStub = 'some_property';
        const propertValueStub = 'some_value';
        const differentServiceKey = 'some_different_key';
        const differentBugServicesPropertyMapStub = {};
        isSettingsValidMock.setup(isSettingsValid => isSettingsValid(selectedServiceData)).returns(() => true);
        createBugFilingUrlMock.setup(createBugFilingUrl => createBugFilingUrl(selectedServiceData, selectedBugDataStub, envInfo));

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const bugFilingSettingsContainer = testSubject.find(BugFilingSettingsContainer);

        differentBugServicesPropertyMapStub[serviceKey] = { [propertyStub]: propertValueStub };
        getSettingsFromStoreDataMock.setup(mock => mock(It.isValue(bugServicePropertiesMapStub))).returns(() => null);
        isSettingsValidMock
            .setup(isSettingsValid => isSettingsValid(differentBugServicesPropertyMapStub[differentServiceKey]))
            .returns(() => true);
        createBugFilingUrlMock.setup(createBugFilingUrl =>
            createBugFilingUrl(differentBugServicesPropertyMapStub[differentServiceKey], selectedBugDataStub, envInfo),
        );

        bugFilingSettingsContainer.props().onPropertyUpdateCallback(differentServiceKey, propertyStub, propertValueStub);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('render: validate callback (onPropertyUpdateCallback) sent to settings container when service settings are not null', () => {
        const propertyStub = 'some_property';
        const propertValueStub = 'some_value';
        isSettingsValidMock.setup(isSettingsValid => isSettingsValid(selectedServiceData)).returns(() => true);
        createBugFilingUrlMock.setup(createBugFilingUrl => createBugFilingUrl(selectedServiceData, selectedBugDataStub, envInfo));

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const bugFilingSettingsContainer = testSubject.find(BugFilingSettingsContainer);

        bugServicePropertiesMapStub[serviceKey][propertyStub] = propertValueStub;
        getSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(bugServicePropertiesMapStub)))
            .returns(() => bugServicePropertiesMapStub[serviceKey]);
        isSettingsValidMock.setup(isSettingsValid => isSettingsValid(bugServicePropertiesMapStub[serviceKey])).returns(() => true);
        createBugFilingUrlMock.setup(createBugFilingUrl =>
            createBugFilingUrl(bugServicePropertiesMapStub[serviceKey], selectedBugDataStub, envInfo),
        );

        bugFilingSettingsContainer.props().onPropertyUpdateCallback(serviceKey, propertyStub, propertValueStub);

        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
