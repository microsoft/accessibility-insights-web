// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DefaultButton } from '@fluentui/react';
import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import {
    IssueFilingButton,
    IssueFilingButtonDeps,
    IssueFilingButtonProps,
} from 'common/components/issue-filing-button';
import { IssueFilingNeedsSettingsHelpText } from 'common/components/issue-filing-needs-settings-help-text';
import { IssueFilingActionMessageCreator } from 'common/message-creators/issue-filing-action-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { IssueFilingNeedsSettingsContentRenderer } from 'common/types/issue-filing-needs-setting-content';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import { IssueFilingService } from 'issue-filing/types/issue-filing-service';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { It, IMock, Mock, Times } from 'typemoq';
import { LadyBugSolidIcon } from '../../../../../../src/common/icons/lady-bug-solid-icon';
import { EventStubFactory } from '../../../common/event-stub-factory';

jest.mock('@fluentui/react');
jest.mock('common/components/issue-filing-needs-settings-help-text');
jest.mock('../../../../../../src/common/icons/lady-bug-solid-icon');
describe('IssueFilingButtonTest', () => {
    mockReactComponents([DefaultButton, IssueFilingNeedsSettingsHelpText, LadyBugSolidIcon]);
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
        needsSettingsContentRenderer = IssueFilingNeedsSettingsHelpText;
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
        const renderResult = render(<IssueFilingButton {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([LadyBugSolidIcon]);

        issueFilingServiceProviderMock.verifyAll();
    });

    test('onclick: valid settings, file bug and set %s to false', async () => {
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
            .setup(creator => creator.fileIssue(It.isAny(), It.isAny(), It.isAny(), It.isAny()))
            .verifiable(Times.once());
        const renderResult = render(<IssueFilingButton {...props} />);

        await userEvent.click(renderResult.container.querySelector('.ms-Button-label'));

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([LadyBugSolidIcon]);
        const needSettingProps = getMockComponentClassPropsForCall(
            IssueFilingNeedsSettingsHelpText,
        );
        expect(needSettingProps.isOpen).toBe(false);
        issueFilingActionMessageCreatorMock.verifyAll();
    });

    test('onclick: invalid settings, %s', async () => {
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
        const renderResult = render(<IssueFilingButton {...props} />);
        const needSettingProps = getMockComponentClassPropsForCall(
            IssueFilingNeedsSettingsHelpText,
        );
        expect(needSettingProps.isOpen).toBe(false);

        await userEvent.click(renderResult.container.querySelector('.ms-Button-label'));
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([LadyBugSolidIcon]);
        issueFilingActionMessageCreatorMock.verifyAll();
        const needSettingPropsAfterClick = getMockComponentClassPropsForCall(
            IssueFilingNeedsSettingsHelpText,
            2,
        );
        expect(needSettingPropsAfterClick.isOpen).toBe(true);
    });
});
