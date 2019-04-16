// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { DefaultButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { BugFilingServiceProvider } from '../../../../../bug-filing/bug-filing-service-provider';
import { BugFilingService } from '../../../../../bug-filing/types/bug-filing-service';
import {
    IssueFilingButton,
    IssueFilingButtonDeps,
    IssueFilingButtonProps,
    IssueFilingButtonState,
} from '../../../../../common/components/issue-filing-button';
import { EnvironmentInfoProvider } from '../../../../../common/environment-info-provider';
import { BugActionMessageCreator } from '../../../../../common/message-creators/bug-action-message-creator';
import { NamedSFC } from '../../../../../common/react/named-sfc';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { EventStubFactory } from '../../../common/event-stub-factory';

describe('IssueFilingButtonTest', () => {
    const testKey: string = 'test';
    const eventStub = new EventStubFactory().createNativeMouseClickEvent();
    let environmentInfoProviderMock: IMock<EnvironmentInfoProvider>;
    let bugFilingServiceProviderMock: IMock<BugFilingServiceProvider>;
    let bugActionMessageCreatorMock: IMock<BugActionMessageCreator>;
    let userConfigurationStoreData: UserConfigurationStoreData;
    let testBugService: BugFilingService;

    beforeEach(() => {
        testBugService = {
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
            bugServicePropertiesMap: {},
        } as UserConfigurationStoreData;
        environmentInfoProviderMock = Mock.ofType(EnvironmentInfoProvider);
        bugFilingServiceProviderMock = Mock.ofType(BugFilingServiceProvider);
        bugActionMessageCreatorMock = Mock.ofType(BugActionMessageCreator);
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
        bugFilingServiceProviderMock
            .setup(bp => bp.forKey(testKey))
            .returns(() => testBugService)
            .verifiable();
    });

    describe.each(['showSettingsDialog', 'showHelpText'])('test with stateToToggle = %s', (stateToToggle: keyof IssueFilingButtonState) => {
        test.each([true, false])('render: isSettingsValid: %s', isSettingsValid => {
            testBugService.isSettingsValid = () => isSettingsValid;
            const props: IssueFilingButtonProps = {
                deps: {
                    bugActionMessageCreator: bugActionMessageCreatorMock.object,
                    environmentInfoProvider: environmentInfoProviderMock.object,
                    bugFilingServiceProvider: bugFilingServiceProviderMock.object,
                } as IssueFilingButtonDeps,
                issueDetailsData: {
                    pageTitle: 'pageTitle',
                    pageUrl: 'http://pageUrl',
                    ruleResult: null,
                },
                userConfigurationStoreData: userConfigurationStoreData,
                stateToToggleForNeedsSettings: stateToToggle,
            };
            const wrapper = shallow(<IssueFilingButton {...props} />);
            expect(wrapper.debug()).toMatchSnapshot();

            environmentInfoProviderMock.verifyAll();
            bugFilingServiceProviderMock.verifyAll();
        });

        test('render with needs more info content showing', () => {
            const props: IssueFilingButtonProps = {
                deps: {
                    bugActionMessageCreator: bugActionMessageCreatorMock.object,
                    environmentInfoProvider: environmentInfoProviderMock.object,
                    bugFilingServiceProvider: bugFilingServiceProviderMock.object,
                } as IssueFilingButtonDeps,
                issueDetailsData: {
                    pageTitle: 'pageTitle',
                    pageUrl: 'http://pageUrl',
                    ruleResult: null,
                },
                userConfigurationStoreData: userConfigurationStoreData,
                stateToToggleForNeedsSettings: stateToToggle,
            };
            const wrapper = shallow(<IssueFilingButton {...props} />);
            wrapper.setState({ [stateToToggle]: true });
            expect(wrapper.debug()).toMatchSnapshot();
        });

        test('onclick: valid settings, file bug and set %s to false', () => {
            bugActionMessageCreatorMock
                .setup(messageCreator => messageCreator.trackFileIssueClick(eventStub as any, testKey as any))
                .verifiable(Times.once());
            const props: IssueFilingButtonProps = {
                deps: {
                    bugActionMessageCreator: bugActionMessageCreatorMock.object,
                    environmentInfoProvider: environmentInfoProviderMock.object,
                    bugFilingServiceProvider: bugFilingServiceProviderMock.object,
                } as IssueFilingButtonDeps,
                issueDetailsData: {
                    pageTitle: 'pageTitle',
                    pageUrl: 'http://pageUrl',
                    ruleResult: null,
                },
                userConfigurationStoreData: userConfigurationStoreData,
                stateToToggleForNeedsSettings: stateToToggle,
            };
            const wrapper = shallow(<IssueFilingButton {...props} />);

            wrapper.find(DefaultButton).simulate('click', eventStub);
            expect(wrapper.state()[stateToToggle]).toBe(false);
            bugActionMessageCreatorMock.verifyAll();
        });

        test('onclick: invalid settings, %s', () => {
            testBugService.isSettingsValid = () => false;
            bugActionMessageCreatorMock
                .setup(messageCreator => messageCreator.trackFileIssueClick(eventStub as any, testKey as any))
                .verifiable(Times.never());
            const props: IssueFilingButtonProps = {
                deps: {
                    bugActionMessageCreator: bugActionMessageCreatorMock.object,
                    environmentInfoProvider: environmentInfoProviderMock.object,
                    bugFilingServiceProvider: bugFilingServiceProviderMock.object,
                } as IssueFilingButtonDeps,
                issueDetailsData: {
                    pageTitle: 'pageTitle',
                    pageUrl: 'http://pageUrl',
                    ruleResult: null,
                },
                userConfigurationStoreData: userConfigurationStoreData,
                stateToToggleForNeedsSettings: stateToToggle,
            };
            const wrapper = shallow(<IssueFilingButton {...props} />);
            expect(wrapper.state()[stateToToggle]).toBe(false);

            wrapper.find(DefaultButton).simulate('click', eventStub);

            bugActionMessageCreatorMock.verifyAll();
            expect(wrapper.state()[stateToToggle]).toBe(true);
        });
    });
});
