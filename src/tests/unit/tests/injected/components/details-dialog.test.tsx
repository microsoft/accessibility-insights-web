// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dialog } from '@fluentui/react';
import { render } from '@testing-library/react';
import { FixInstructionPanel } from 'common/components/fix-instruction-panel';
import { GuidanceLinks } from 'common/components/guidance-links';
import { NewTabLink } from 'common/components/new-tab-link';
import { CancelIcon } from 'common/icons/cancel-icon';
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import { IssueDetailsNavigationControls } from 'injected/components/issue-details-navigation-controls';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { It, Mock, Times } from 'typemoq';

import { CommandBar } from '../../../../../injected/components/command-bar';
import {
    DetailsDialog,
    DetailsDialogDeps,
    DetailsDialogProps,
} from '../../../../../injected/components/details-dialog';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { EventStubFactory } from '../../../common/event-stub-factory';

jest.mock('@fluentui/react');
jest.mock('common/components/guidance-links');
jest.mock('../../../../../injected/components/command-bar');
jest.mock('common/icons/cancel-icon');
jest.mock('injected/components/issue-details-navigation-controls');
jest.mock('common/components/new-tab-link');
jest.mock('common/components/fix-instruction-panel');

type DetailsDialogTestCase = {
    isDevToolsOpen: boolean;
    helpUrl?: string;
    expectedHelpUrl?: string;
};

describe('DetailsDialog', () => {
    mockReactComponents([
        FixInstructionPanel,
        GuidanceLinks,
        NewTabLink,
        Dialog,
        CommandBar,
        CancelIcon,
        IssueDetailsNavigationControls,
    ]);
    const ruleId: string = 'ruleId';
    const help: string = 'help';

    const defaultDecoratedAxeNodeResult: DecoratedAxeNodeResult = {
        any: [],
        all: [],
        none: [],
        status: false,
        ruleId: ruleId,
        help: help,
        selector: 'selector',
        html: 'html',
        failureSummary: 'failureSummary',
        id: 'id1',
        guidanceLinks: [{ text: 'Guidance Link', href: 'http://example.com' }],
    } as DecoratedAxeNodeResult;

    const defaultDetailsDialogDeps: DetailsDialogDeps = {
        windowUtils: null,
        issueDetailsTextGenerator: null,
        targetPageActionMessageCreator: {
            copyIssueDetailsClicked: () => {},
        } as any,
        issueFilingActionMessageCreator: null,
    } as DetailsDialogDeps;

    const defaultDetailsDialogProps: DetailsDialogProps = {
        elementSelector: ruleId,
        target: [],
        devToolStore: {} as any,
        userConfigStore: {
            getState: () => {},
        } as any,
        devToolActionMessageCreator: {} as any,
        devToolsShortcut: 'shortcut',
    } as DetailsDialogProps;

    describe('renders', () => {
        const testCases: DetailsDialogTestCase[] = [
            {
                isDevToolsOpen: false,
            },
            {
                isDevToolsOpen: true,
            },
            {
                isDevToolsOpen: false,
                helpUrl: 'help-relative',
                expectedHelpUrl: 'http://extension/help-relative',
            },
        ];

        test.each(testCases)('with: %p', (testCase: DetailsDialogTestCase) => {
            const {
                isDevToolsOpen,
                helpUrl = 'http://extension/help1',
                expectedHelpUrl = 'http://extension/help1',
            } = testCase;

            const expectedNodeResult = {
                ...defaultDecoratedAxeNodeResult,
                helpUrl,
            };

            const expectedFailedRules: DictionaryStringTo<DecoratedAxeNodeResult> = {};
            expectedFailedRules[ruleId] = expectedNodeResult;

            const dialogDetailsHandlerMockObject = getDetailsDialogHandlerStub(isDevToolsOpen);

            const deps: DetailsDialogDeps = {
                ...defaultDetailsDialogDeps,
                browserAdapter: {
                    getUrl: url => expectedHelpUrl,
                } as any,
            };

            const props = {
                ...defaultDetailsDialogProps,
                deps,
                failedRules: expectedFailedRules,
                dialogHandler: dialogDetailsHandlerMockObject as any,
            };

            const wrapper = render(<DetailsDialog {...props} />);
            expect(wrapper.asFragment()).toMatchSnapshot();

            const dialogProps =
                getMockComponentClassPropsForCall(
                    Dialog,
                ).dialogContentProps.topButtonsProps[0].onRenderIcon();
            expect(dialogProps).toMatchSnapshot('verify close button');
        });
    });

    describe('handlers', () => {
        describe('for CommandBar', () => {
            const eventStub = new EventStubFactory().createKeypressEvent() as any;

            let expectedFailedRules: DictionaryStringTo<DecoratedAxeNodeResult>;
            let dialogDetailsHandlerMockObject;

            beforeEach(() => {
                const expectedNodeResult = {
                    ...defaultDecoratedAxeNodeResult,
                    helpUrl: 'help-url',
                };

                expectedFailedRules = {};
                expectedFailedRules[ruleId] = expectedNodeResult;

                dialogDetailsHandlerMockObject = getDetailsDialogHandlerStub(true);
            });

            test('on click copy issue details button', () => {
                const clickHandlerMock = Mock.ofInstance(
                    (component: DetailsDialog, event: React.MouseEvent<MouseEvent>) => {},
                );

                dialogDetailsHandlerMockObject.copyIssueDetailsButtonClickHandler =
                    clickHandlerMock.object;

                const deps = {
                    ...defaultDetailsDialogDeps,
                    browserAdapter: {
                        getUrl: url => 'test-url',
                    } as any,
                };

                const props = {
                    ...defaultDetailsDialogProps,
                    deps,
                    failedRules: expectedFailedRules,
                    dialogHandler: dialogDetailsHandlerMockObject,
                } as any;

                render(<DetailsDialog {...props} />);
                getMockComponentClassPropsForCall(CommandBar).onClickCopyIssueDetailsButton(
                    eventStub,
                );
                clickHandlerMock.verify(handler => handler(It.isAny(), eventStub), Times.once());
            });

            test('on click inspect button', () => {
                const clickHandlerMock = Mock.ofInstance(
                    (component: DetailsDialog, event: React.SyntheticEvent<MouseEvent>) => {},
                );

                dialogDetailsHandlerMockObject.inspectButtonClickHandler = clickHandlerMock.object;

                const deps = {
                    ...defaultDetailsDialogDeps,
                    browserAdapter: {
                        getUrl: url => 'test-url',
                    } as any,
                };

                const props = {
                    ...defaultDetailsDialogProps,
                    deps,
                    failedRules: expectedFailedRules,
                    dialogHandler: dialogDetailsHandlerMockObject,
                };

                render(<DetailsDialog {...props} />);

                getMockComponentClassPropsForCall(CommandBar).onClickInspectButton(eventStub);

                clickHandlerMock.verify(handler => handler(It.isAny(), eventStub), Times.once());
            });

            test('should should inspect button message', () => {
                const handlerMock = Mock.ofInstance<(component: DetailsDialog) => boolean>(
                    (component: DetailsDialog) => true,
                );

                dialogDetailsHandlerMockObject.shouldShowInspectButtonMessage = handlerMock.object;

                const deps = {
                    ...defaultDetailsDialogDeps,
                    browserAdapter: {
                        getUrl: url => 'test-url',
                    } as any,
                };

                const props = {
                    ...defaultDetailsDialogProps,
                    deps,
                    failedRules: expectedFailedRules,
                    dialogHandler: dialogDetailsHandlerMockObject,
                };

                render(<DetailsDialog {...props} />);


                getMockComponentClassPropsForCall(CommandBar).shouldShowInspectButtonMessage();

                handlerMock.verify(handler => handler(It.isAny()), Times.once());
            });
        });
    });

    const getDetailsDialogHandlerStub = (isDevToolsOpen: boolean) => {
        return {
            getRuleUrl: () => 'test-url',
            isBackButtonDisabled: () => true,
            isNextButtonDisabled: () => true,
            isInspectButtonDisabled: () => !isDevToolsOpen,
            getFailureInfo: () => 'Failure 1 of 1 for this target',
            componentDidMount: () => {},
            shouldShowInspectButtonMessage: () => false,
            isTargetPageOriginSecure: () => true,
            shouldShowInsecureOriginPageMessage: () => false,
            componentWillUnmount: () => jest.fn(),
        };
    };
});
