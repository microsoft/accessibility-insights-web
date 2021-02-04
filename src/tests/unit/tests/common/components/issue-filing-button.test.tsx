// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    IssueFilingButton,
    IssueFilingButtonDeps,
    IssueFilingButtonProps,
} from 'common/components/issue-filing-button';
import { IssueFilingActionMessageCreator } from 'common/message-creators/issue-filing-action-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { IssueFilingNeedsSettingsContentRenderer } from 'common/types/issue-filing-needs-setting-content';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { shallow } from 'enzyme';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { EventStubFactory } from '../../../common/event-stub-factory';

describe('IssueFilingButtonTest', () => {
    const testKey: string = 'test';
    const eventStub = new EventStubFactory().createNativeMouseClickEvent() as any;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let issueFilingActionMessageCreatorMock: IMock<IssueFilingActionMessageCreator>;
    let userConfigurationStoreData: UserConfigurationStoreData;
    let testIssueFilingServiceStub: IssueFilingService;
    let needsSettingsContentRenderer: IssueFilingNeedsSettingsContentRenderer;

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
        testIssueFilingServiceStub = {
            key: testKey,
            displayName: 'TEST',
            settingsForm: NamedFC('testForm', props => <>Hello World</>),
            isSettingsValid: () => true,
            buildStoreData: testField => {
                return { testField };
            },
            getSettingsFromStoreData: data => data[testKey],
            fileIssue: () => Promise.resolve(),
        };
        userConfigurationStoreData = {
            bugService: testKey,
            bugServicePropertiesMap: {
                [testKey]: {},
            },
        } as UserConfigurationStoreData;
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        issueFilingActionMessageCreatorMock = Mock.ofType(IssueFilingActionMessageCreator);
        issueFilingServiceProviderMock
            .setup(bp => bp.forKey(testKey))
            .returns(() => testIssueFilingServiceStub)
            .verifiable();
        needsSettingsContentRenderer = NamedFC('testRenderer', () => <>needs settings</>);
    });

    test.each([true, false])('render: isSettingsValid: %s', isSettingsValid => {
        testIssueFilingServiceStub.isSettingsValid = () => isSettingsValid;
        const props: IssueFilingButtonProps = {
            deps: {
                issueFilingActionMessageCreator: issueFilingActionMessageCreatorMock.object,
                toolData: toolData,
                issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            } as IssueFilingButtonDeps,
            issueDetailsData: {} as CreateIssueDetailsTextData,
            userConfigurationStoreData: userConfigurationStoreData,
            needsSettingsContentRenderer,
        };
        const wrapper = shallow(<IssueFilingButton {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();

        issueFilingServiceProviderMock.verifyAll();
    });

    test('onclick: valid settings, file bug and set %s to false', () => {
        const props: IssueFilingButtonProps = {
            deps: {
                issueFilingActionMessageCreator: issueFilingActionMessageCreatorMock.object,
                toolData: toolData,
                issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            } as IssueFilingButtonDeps,
            issueDetailsData: {} as CreateIssueDetailsTextData,
            userConfigurationStoreData: userConfigurationStoreData,
            needsSettingsContentRenderer,
        };
        issueFilingActionMessageCreatorMock
            .setup(creator =>
                creator.fileIssue(eventStub, testKey, props.issueDetailsData, toolData),
            )
            .verifiable(Times.once());
        const wrapper = shallow<IssueFilingButton>(<IssueFilingButton {...props} />);

        wrapper.find(DefaultButton).simulate('click', eventStub);

        expect(wrapper.debug()).toMatchSnapshot();
        expect(wrapper.state().showNeedsSettingsContent).toBe(false);
        issueFilingActionMessageCreatorMock.verifyAll();
    });

    test('onclick: invalid settings, %s', () => {
        testIssueFilingServiceStub.isSettingsValid = () => false;
        issueFilingActionMessageCreatorMock
            .setup(messageCreator =>
                messageCreator.trackFileIssueClick(eventStub as any, testKey as any),
            )
            .verifiable(Times.never());
        const props: IssueFilingButtonProps = {
            deps: {
                issueFilingActionMessageCreator: issueFilingActionMessageCreatorMock.object,
                toolData: toolData,
                issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            } as IssueFilingButtonDeps,
            issueDetailsData: {} as CreateIssueDetailsTextData,
            userConfigurationStoreData: userConfigurationStoreData,
            needsSettingsContentRenderer,
        };
        const wrapper = shallow<IssueFilingButton>(<IssueFilingButton {...props} />);
        expect(wrapper.state().showNeedsSettingsContent).toBe(false);

        wrapper.find(DefaultButton).simulate('click', eventStub);

        expect(wrapper.debug()).toMatchSnapshot();

        issueFilingActionMessageCreatorMock.verifyAll();
        expect(wrapper.state().showNeedsSettingsContent).toBe(true);
    });
});
