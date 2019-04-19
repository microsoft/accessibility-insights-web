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
import { BugFilingServiceProvider } from '../../../../../bug-filing/bug-filing-service-provider';

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
    let bugFilingServiceProviderMock: IMock<BugFilingServiceProvider>;

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
        getSettingsFromStoreDataMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        telemetryCallbackMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        envInfoProviderMock = Mock.ofType(EnvironmentInfoProvider);
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        bugFilingServiceProviderMock = Mock.ofType(BugFilingServiceProvider);

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
            bugFilingServiceProvider: bugFilingServiceProviderMock.object,
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

        getSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(bugServicePropertiesMapStub)))
            .returns(() => selectedServiceData)
            .verifiable(Times.once());
        isSettingsValidMock
            .setup(isSettingsValid => isSettingsValid(selectedServiceData))
            .returns(() => true)
            .verifiable(Times.once());
        createBugFilingUrlMock
            .setup(createBugFilingUrl => createBugFilingUrl(selectedServiceData, selectedBugDataStub, envInfo))
            .verifiable(Times.once());
    });

    it.each([true, false])('render with isSettingsValid: %s', isSettingsValid => {
        isSettingsValidMock.reset();
        isSettingsValidMock.setup(isValid => isValid(selectedServiceData)).returns(() => isSettingsValid);

        createBugFilingUrlMock
            .setup(createBugFilingUrl => createBugFilingUrl(selectedServiceData, selectedBugDataStub, envInfo))
            .returns(() => 'test url');

        const testSubject = shallow(<IssueFilingDialog {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('render: validate correct callbacks to ActionAndCancelButtonsComponent (file issue on click and cancel)', () => {
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

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const bugFilingSettingsContainer = testSubject.find(BugFilingSettingsContainer);

        getSettingsFromStoreDataMock.setup(mock => mock(It.isValue(bugServicePropertiesMapStub))).returns(() => null);
        bugServicePropertiesMapStub[differentServiceKey] = { [propertyStub]: propertValueStub };
        getSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(bugServicePropertiesMapStub)))
            .returns(() => bugServicePropertiesMapStub[differentServiceKey]);
        isSettingsValidMock.setup(isSettingsValid => isSettingsValid(bugServicePropertiesMapStub[differentServiceKey])).returns(() => true);
        createBugFilingUrlMock.setup(createBugFilingUrl =>
            createBugFilingUrl(bugServicePropertiesMapStub[differentServiceKey], selectedBugDataStub, envInfo),
        );

        bugFilingSettingsContainer.props().onPropertyUpdateCallback(differentServiceKey, propertyStub, propertValueStub);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('render: validate callback (onPropertyUpdateCallback) sent to settings container when service settings are not null', () => {
        const propertyStub = 'some_property';
        const propertValueStub = 'some_value';
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

    it('render: validate callback (onSelectedServiceChange) sent to settings container', () => {
        const differentServiceKey = 'different_service';
        const differentIsSettingsValidMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        const differentCreateBugFilingUrlMock = Mock.ofInstance((serviceData, bugData, info) => null, MockBehavior.Strict);
        const differentGetSettingsFromStoreDataMock = Mock.ofInstance(data => null);
        const differentServiceStub = {
            isSettingsValid: differentIsSettingsValidMock.object,
            issueFilingUrlProvider: differentCreateBugFilingUrlMock.object,
            getSettingsFromStoreData: differentGetSettingsFromStoreDataMock.object,
            key: differentServiceKey,
        } as BugFilingService;
        const differentServiceData = {
            differentProperty: 'different_property',
        };

        bugFilingServiceProviderMock.setup(mock => mock.forKey(differentServiceKey)).returns(() => differentServiceStub);
        differentGetSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(bugServicePropertiesMapStub)))
            .returns(() => differentServiceData);
        differentIsSettingsValidMock.setup(isSettingsValid => isSettingsValid(differentServiceData)).returns(() => true);
        differentCreateBugFilingUrlMock.setup(createBugFilingUrl => createBugFilingUrl(differentServiceData, selectedBugDataStub, envInfo));

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const bugFilingSettingsContainer = testSubject.find(BugFilingSettingsContainer);
        bugFilingSettingsContainer.props().onSelectedServiceChange(differentServiceKey);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    const scenarios = [
        ['dialog is open & props have changed', true, { bugServicePropertiesMap: {} }],
        ['dialog is open & props have not changed', true, {}],
        ['dialog is not open & props have changed', false, { bugServicePropertiesMap: {} }],
        ['dialog is not open & props have not changed', false, {}],
    ];

    it.each(scenarios)('componentDidUpdate %s', (_, isOpenVal, additionalProperties) => {
        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const newProps = {
            ...props,
            isOpen: isOpenVal,
            ...additionalProperties,
        } as IssueFilingDialogProps;
        const differentServiceData = {
            differentProperty: 'different_property',
        };

        isSettingsValidMock.setup(isSettingsValid => isSettingsValid(differentServiceData)).returns(() => true);
        createBugFilingUrlMock.setup(createBugFilingUrl => createBugFilingUrl(differentServiceData, selectedBugDataStub, envInfo));
        getSettingsFromStoreDataMock.setup(mock => mock(It.isValue(newProps.bugServicePropertiesMap))).returns(() => differentServiceData);

        testSubject.setProps(newProps);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
