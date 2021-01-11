// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { IssueFilingActionMessageCreator } from '../../../../../common/message-creators/issue-filing-action-message-creator';
import { UserConfigMessageCreator } from '../../../../../common/message-creators/user-config-message-creator';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { IssueFilingServicePropertiesMap } from '../../../../../common/types/store-data/user-configuration-store';
import { ActionAndCancelButtonsComponent } from '../../../../../DetailsView/components/action-and-cancel-buttons-component';
import {
    IssueFilingDialog,
    IssueFilingDialogDeps,
    IssueFilingDialogProps,
} from '../../../../../DetailsView/components/issue-filing-dialog';
import { IssueFilingSettingsContainer } from '../../../../../issue-filing/components/issue-filing-settings-container';
import { IssueFilingServiceProvider } from '../../../../../issue-filing/issue-filing-service-provider';
import { IssueFilingService } from '../../../../../issue-filing/types/issue-filing-service';
import { EventStub, EventStubFactory } from '../../../common/event-stub-factory';

describe('IssueFilingDialog', () => {
    let eventStub: EventStub;
    let isSettingsValidMock: IMock<Function>;
    let getSettingsFromStoreDataMock: IMock<Function>;
    let onCloseMock: IMock<(ev) => void>;
    let selectedIssueDataStub: CreateIssueDetailsTextData;
    let selectedServiceData;
    let deps: IssueFilingDialogDeps;
    let issueFilingServiceStub: IssueFilingService;
    let props: IssueFilingDialogProps;
    let serviceKey: string;
    let issueFilingServicePropertiesMapStub: IssueFilingServicePropertiesMap;
    let userConfigMessageCreatorMock: IMock<UserConfigMessageCreator>;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let issueFilingActionMessageCreatorMock: IMock<IssueFilingActionMessageCreator>;

    const toolData: ToolData = {
        scanEngineProperties: {
            name: 'engine-name',
            version: 'engine-version',
        },
        applicationProperties: {
            name: 'app-name',
            version: 'app-version',
            environmentName: 'environmentName',
        },
    };

    beforeEach(() => {
        serviceKey = 'gitHub';
        eventStub = new EventStubFactory().createMouseClickEvent();
        isSettingsValidMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        onCloseMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        getSettingsFromStoreDataMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        issueFilingActionMessageCreatorMock = Mock.ofType(IssueFilingActionMessageCreator);

        selectedIssueDataStub = {
            targetApp: {
                name: 'some pageTitle',
            },
        } as CreateIssueDetailsTextData;
        selectedServiceData = {
            someServiceData: null,
        };
        issueFilingServicePropertiesMapStub = {
            [serviceKey]: selectedServiceData,
        };
        deps = {
            issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            userConfigMessageCreator: userConfigMessageCreatorMock.object,
            toolData: toolData,
            issueFilingActionMessageCreator: issueFilingActionMessageCreatorMock.object,
        } as IssueFilingDialogDeps;
        issueFilingServiceStub = {
            isSettingsValid: isSettingsValidMock.object,
            getSettingsFromStoreData: getSettingsFromStoreDataMock.object,
            key: serviceKey,
        } as IssueFilingService;
        props = {
            deps,
            isOpen: true,
            onClose: onCloseMock.object,
            selectedIssueFilingService: issueFilingServiceStub,
            selectedIssueData: selectedIssueDataStub,
            issueFilingServicePropertiesMap: issueFilingServicePropertiesMapStub,
        };

        getSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(issueFilingServicePropertiesMapStub)))
            .returns(() => selectedServiceData)
            .verifiable(Times.once());
        isSettingsValidMock
            .setup(isSettingsValid => isSettingsValid(selectedServiceData))
            .returns(() => true)
            .verifiable(Times.once());
    });

    it.each([true, false])('render with isSettingsValid: %s', isSettingsValid => {
        isSettingsValidMock.reset();
        isSettingsValidMock
            .setup(isValid => isValid(selectedServiceData))
            .returns(() => isSettingsValid);

        const testSubject = shallow(<IssueFilingDialog {...props} />);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('render: validate correct callbacks to ActionAndCancelButtonsComponent (file issue on click and cancel)', () => {
        onCloseMock.setup(onClose => onClose(null)).verifiable(Times.once());

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const actionCancelButtons = testSubject.find(ActionAndCancelButtonsComponent);
        actionCancelButtons.props().cancelButtonOnClick(null);

        isSettingsValidMock.verifyAll();
        onCloseMock.verifyAll();
    });

    it('render: validate correct callbacks to ActionAndCancelButtonsComponent (file issue on click and cancel)', () => {
        const payload = {
            issueFilingServiceName: serviceKey,
            issueFilingSettings: selectedServiceData,
        };
        userConfigMessageCreatorMock
            .setup(creator => creator.saveIssueFilingSettings(payload))
            .verifiable();
        issueFilingActionMessageCreatorMock
            .setup(creator =>
                creator.fileIssue(
                    eventStub as any,
                    serviceKey,
                    It.isValue(props.selectedIssueData),
                    toolData,
                ),
            )
            .verifiable(Times.once());
        onCloseMock.setup(onClose => onClose(eventStub)).verifiable(Times.once());

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const actionCancelButtons = testSubject.find(ActionAndCancelButtonsComponent);
        actionCancelButtons.props().primaryButtonOnClick(eventStub);

        isSettingsValidMock.verifyAll();
        userConfigMessageCreatorMock.verifyAll();
        issueFilingActionMessageCreatorMock.verifyAll();
        onCloseMock.verifyAll();
    });

    it('render: validate callback (onPropertyUpdateCallback) sent to settings container when service settings are null', () => {
        const propertyStub = 'some_property';
        const propertyValueStub = 'some_value';
        const differentServiceKey = 'some_different_key';

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const issueFilingSettingsContainer = testSubject.find(IssueFilingSettingsContainer);

        getSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(issueFilingServicePropertiesMapStub)))
            .returns(() => null);
        issueFilingServicePropertiesMapStub[differentServiceKey] = {
            [propertyStub]: propertyValueStub,
        };
        getSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(issueFilingServicePropertiesMapStub)))
            .returns(() => issueFilingServicePropertiesMapStub[differentServiceKey]);
        isSettingsValidMock
            .setup(isSettingsValid =>
                isSettingsValid(issueFilingServicePropertiesMapStub[differentServiceKey]),
            )
            .returns(() => true);

        const payload = {
            issueFilingServiceName: differentServiceKey,
            propertyName: propertyStub,
            propertyValue: propertyValueStub,
        };
        issueFilingSettingsContainer.props().onPropertyUpdateCallback(payload);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('render: validate callback (onPropertyUpdateCallback) sent to settings container when service settings are not null', () => {
        const propertyStub = 'some_property';
        const propertyValueStub = 'some_value';
        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const issueFilingSettingsContainer = testSubject.find(IssueFilingSettingsContainer);

        issueFilingServicePropertiesMapStub[serviceKey][propertyStub] = propertyValueStub;
        getSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(issueFilingServicePropertiesMapStub)))
            .returns(() => issueFilingServicePropertiesMapStub[serviceKey]);
        isSettingsValidMock
            .setup(isSettingsValid =>
                isSettingsValid(issueFilingServicePropertiesMapStub[serviceKey]),
            )
            .returns(() => true);

        const payload = {
            issueFilingServiceName: serviceKey,
            propertyName: propertyStub,
            propertyValue: propertyValueStub,
        };
        issueFilingSettingsContainer.props().onPropertyUpdateCallback(payload);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    it('render: validate callback (onSelectedServiceChange) sent to settings container', () => {
        const differentServiceKey = 'different_service';
        const differentIsSettingsValidMock = Mock.ofInstance(data => null, MockBehavior.Strict);
        const differentGetSettingsFromStoreDataMock = Mock.ofInstance(data => null);
        const differentServiceStub = {
            isSettingsValid: differentIsSettingsValidMock.object,
            getSettingsFromStoreData: differentGetSettingsFromStoreDataMock.object,
            key: differentServiceKey,
        } as IssueFilingService;
        const differentServiceData = {
            differentProperty: 'different_property',
        };

        issueFilingServiceProviderMock
            .setup(mock => mock.forKey(differentServiceKey))
            .returns(() => differentServiceStub);
        differentGetSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(issueFilingServicePropertiesMapStub)))
            .returns(() => differentServiceData);
        differentIsSettingsValidMock
            .setup(isSettingsValid => isSettingsValid(differentServiceData))
            .returns(() => true);

        const testSubject = shallow(<IssueFilingDialog {...props} />);
        const issueFilingSettingsContainer = testSubject.find(IssueFilingSettingsContainer);
        const payload = {
            issueFilingServiceName: differentServiceKey,
        };
        issueFilingSettingsContainer.props().onSelectedServiceChange(payload);

        expect(testSubject.getElement()).toMatchSnapshot();
    });

    const scenarios = [
        ['dialog is open & props have changed', true, { issueFilingServicePropertiesMap: {} }],
        ['dialog is open & props have not changed', true, {}],
        ['dialog is not open & props have changed', false, { issueFilingServicePropertiesMap: {} }],
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

        isSettingsValidMock
            .setup(isSettingsValid => isSettingsValid(differentServiceData))
            .returns(() => true);
        getSettingsFromStoreDataMock
            .setup(mock => mock(It.isValue(newProps.issueFilingServicePropertiesMap)))
            .returns(() => differentServiceData);

        testSubject.setProps(newProps);
        expect(testSubject.getElement()).toMatchSnapshot();
    });
});
