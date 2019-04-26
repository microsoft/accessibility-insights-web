// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { IssueFilingButton, IssueFilingButtonDeps, IssueFilingButtonProps } from '../../../../../common/components/issue-filing-button';
import { EnvironmentInfoProvider } from '../../../../../common/environment-info-provider';
import { IssueFilingActionMessageCreator } from '../../../../../common/message-creators/issue-filing-action-message-creator';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import { IssueFilingNeedsSettingsContentRenderer } from '../../../../../common/types/issue-filing-needs-setting-content';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { IssueFilingServiceProvider } from '../../../../../issue-filing/issue-filing-service-provider';
import { IssueFilingService } from '../../../../../issue-filing/types/issue-filing-service';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('IssueFilingButtonTest', () => {
    const testKey: string = 'test';
    const eventStub = new EventStubFactory().createNativeMouseClickEvent();
    let environmentInfoProviderMock: IMock<EnvironmentInfoProvider>;
    let issueFilingServiceProviderMock: IMock<IssueFilingServiceProvider>;
    let bugActionMessageCreatorMock: IMock<IssueFilingActionMessageCreator>;
    let userConfigurationStoreData: UserConfigurationStoreData;
    let testIssueFilingService: IssueFilingService;
    let needsSettingsContentRenderer: IssueFilingNeedsSettingsContentRenderer;

    beforeEach(() => {
        testIssueFilingService = {
            key: testKey,
            displayName: 'TEST',
            settingsForm: NamedSFC('testForm', props => <>Hello World</>),
            isSettingsValid: () => true,
            buildStoreData: testField => {
                return { testField };
            },
            getSettingsFromStoreData: data => data[testKey],
            issueFilingUrlProvider: () => 'test url',
        };
        userConfigurationStoreData = {
            bugService: testKey,
            bugServicePropertiesMap: {
                [testKey]: {},
            },
        } as UserConfigurationStoreData;
        environmentInfoProviderMock = Mock.ofType(EnvironmentInfoProvider);
        issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        bugActionMessageCreatorMock = Mock.ofType(IssueFilingActionMessageCreator);
        environmentInfoProviderMock
            .setup(envp => envp.getEnvironmentInfo())
            .returns(() => {
                return {
                    extensionVersion: '1',
                    axeCoreVersion: '2',
                    browserSpec: 'spec',
                };
            })
            .verifiable();
        issueFilingServiceProviderMock
            .setup(bp => bp.forKey(testKey))
            .returns(() => testIssueFilingService)
            .verifiable();
        needsSettingsContentRenderer = NamedSFC('testRenderer', () => <>needs settings</>);
    });

    test.each([true, false])('render: isSettingsValid: %s', isSettingsValid => {
        testIssueFilingService.isSettingsValid = () => isSettingsValid;
        const props: IssueFilingButtonProps = {
            deps: {
                bugActionMessageCreator: bugActionMessageCreatorMock.object,
                environmentInfoProvider: environmentInfoProviderMock.object,
                issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            } as IssueFilingButtonDeps,
            issueDetailsData: {
                pageTitle: 'pageTitle',
                pageUrl: 'http://pageUrl',
                ruleResult: null,
            },
            userConfigurationStoreData: userConfigurationStoreData,
            needsSettingsContentRenderer,
        };
        const wrapper = shallow(<IssueFilingButton {...props} />);
        expect(wrapper.debug()).toMatchSnapshot();

        environmentInfoProviderMock.verifyAll();
        issueFilingServiceProviderMock.verifyAll();
    });

    test('onclick: valid settings, file bug and set %s to false', () => {
        bugActionMessageCreatorMock
            .setup(messageCreator => messageCreator.trackFileIssueClick(eventStub as any, testKey as any))
            .verifiable(Times.once());
        const props: IssueFilingButtonProps = {
            deps: {
                bugActionMessageCreator: bugActionMessageCreatorMock.object,
                environmentInfoProvider: environmentInfoProviderMock.object,
                issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            } as IssueFilingButtonDeps,
            issueDetailsData: {
                pageTitle: 'pageTitle',
                pageUrl: 'http://pageUrl',
                ruleResult: null,
            },
            userConfigurationStoreData: userConfigurationStoreData,
            needsSettingsContentRenderer,
        };
        const wrapper = shallow(<IssueFilingButton {...props} />);

        wrapper.find(DefaultButton).simulate('click', eventStub);

        expect(wrapper.debug()).toMatchSnapshot();
        expect(wrapper.state().showNeedsSettingsContent).toBe(false);
        bugActionMessageCreatorMock.verifyAll();
    });

    test('onclick: invalid settings, %s', () => {
        testIssueFilingService.isSettingsValid = () => false;
        bugActionMessageCreatorMock
            .setup(messageCreator => messageCreator.trackFileIssueClick(eventStub as any, testKey as any))
            .verifiable(Times.never());
        const props: IssueFilingButtonProps = {
            deps: {
                bugActionMessageCreator: bugActionMessageCreatorMock.object,
                environmentInfoProvider: environmentInfoProviderMock.object,
                issueFilingServiceProvider: issueFilingServiceProviderMock.object,
            } as IssueFilingButtonDeps,
            issueDetailsData: {
                pageTitle: 'pageTitle',
                pageUrl: 'http://pageUrl',
                ruleResult: null,
            },
            userConfigurationStoreData: userConfigurationStoreData,
            needsSettingsContentRenderer,
        };
        const wrapper = shallow(<IssueFilingButton {...props} />);
        expect(wrapper.state().showNeedsSettingsContent).toBe(false);

        wrapper.find(DefaultButton).simulate('click', eventStub);

        expect(wrapper.debug()).toMatchSnapshot();

        bugActionMessageCreatorMock.verifyAll();
        expect(wrapper.state().showNeedsSettingsContent).toBe(true);
    });
});
