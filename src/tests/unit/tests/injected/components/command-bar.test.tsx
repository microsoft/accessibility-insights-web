// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { DecoratedAxeNodeResult } from 'common/types/store-data/visualization-scan-result-data';
import * as React from 'react';
import { It, Mock, Times } from 'typemoq';

import { BaseButton } from '../../../../../../node_modules/@fluentui/react';
import { Button } from '../../../../../../node_modules/@fluentui/react-components';
import { CopyIssueDetailsButton } from '../../../../../common/components/copy-issue-details-button';
import { IssueFilingButton } from '../../../../../common/components/issue-filing-button';
import { FileHTMLIcon } from '../../../../../common/icons/file-html-icon';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import {
    CommandBar,
    CommandBarDeps,
    CommandBarProps,
} from '../../../../../injected/components/command-bar';
import { AxeResultToIssueFilingDataConverter } from '../../../../../issue-filing/rule-result-to-issue-filing-data';
import { EventStubFactory } from '../../../common/event-stub-factory';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
    expectMockedComponentPropsToMatchSnapshots,
} from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../common/components/copy-issue-details-button');
jest.mock('../../../../../../node_modules/@fluentui/react');
jest.mock('../../../../../../node_modules/@fluentui/react-components');
jest.mock('../../../../../common/components/issue-filing-button');
jest.mock('../../../../../common/icons/file-html-icon');

describe('CommandBar', () => {
    mockReactComponents([CopyIssueDetailsButton, Button, IssueFilingButton, FileHTMLIcon]);
    const ruleResult = {
        failureSummary: 'RR-failureSummary',
        guidanceLinks: [
            {
                text: 'WCAG-1.4.1',
                tags: [
                    { id: 'some-id', displayText: 'some displayText' },
                    { id: 'some-other-id', displayText: 'some other displayText' },
                ],
            },
            { text: 'wcag-2.8.2' },
        ],
        help: 'RR-help',
        html: 'RR-html',
        ruleId: 'RR-rule-id',
        helpUrl: 'RR-help-url',
        selector: 'RR-selector<x>',
    } as DecoratedAxeNodeResult;
    const axeConverterMock = Mock.ofType(AxeResultToIssueFilingDataConverter);
    const issueData = {} as CreateIssueDetailsTextData;
    const defaultCommandBarProps: CommandBarProps = {
        deps: {
            axeResultToIssueFilingDataConverter: axeConverterMock.object,
        } as CommandBarDeps,
        onClickInspectButton: undefined,
        onClickCopyIssueDetailsButton: undefined,
        shouldShowInspectButtonMessage: () => false,
        userConfigurationStoreData: {
            isFirstTime: false,
            bugService: 'None',
        } as UserConfigurationStoreData,
        devToolsShortcut: 'dev-tools-shortcut',
        currentRuleIndex: 0,
        failedRules: {
            'RR-rule-id': ruleResult,
        },
        hasSecureTargetPage: undefined,
        shouldShowInsecureOriginPageMessage: false,
    };

    beforeAll(() => {
        axeConverterMock
            .setup(m => m.convert(ruleResult, It.isAnyString(), It.isAnyString()))
            .returns(_ => issueData)
            .verifiable(Times.atLeastOnce());
    });

    describe('renders', () => {
        const showInspectButtonMessage = [true, false];
        const showCopyIssueDetailsHelpMessage = [true, false];

        it.each(showInspectButtonMessage)('renders, shows inspect button message: %s', show => {
            const props = {
                ...defaultCommandBarProps,

                shouldShowInspectButtonMessage: () => show,
            };

            const renderResult = render(<CommandBar {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([IssueFilingButton]);
            axeConverterMock.verifyAll();
        });

        it.each(showCopyIssueDetailsHelpMessage)(
            'renders, shows copy button insecure origin message: %s',
            show => {
                const props = {
                    ...defaultCommandBarProps,

                    shouldShowInsecureOriginPageMessage: show,
                };

                const renderResult = render(<CommandBar {...props} />);

                expect(renderResult.asFragment()).toMatchSnapshot();
                expectMockedComponentPropsToMatchSnapshots([IssueFilingButton]);
                axeConverterMock.verifyAll();
            },
        );
    });

    describe('click handlers', () => {
        const eventStub = new EventStubFactory().createKeypressEvent() as any;

        test('for inspect button', () => {
            const onClickMock = Mock.ofInstance(
                (
                    event: React.MouseEvent<
                        | typeof Button
                        | BaseButton
                        | HTMLDivElement
                        | HTMLAnchorElement
                        | HTMLButtonElement,
                        MouseEvent
                    >,
                ) => {},
            );

            const props = {
                ...defaultCommandBarProps,
                onClickInspectButton: onClickMock.object,
            };

            render(<CommandBar {...props} />);

            getMockComponentClassPropsForCall(Button).onClick(eventStub);

            onClickMock.verify(onClick => onClick(eventStub), Times.once());
            axeConverterMock.verifyAll();
        });

        test('for copy issue details button', () => {
            const onClickMock = Mock.ofInstance((event: React.MouseEvent<any, MouseEvent>) => {});

            const props = {
                ...defaultCommandBarProps,
                onClickCopyIssueDetailsButton: onClickMock.object,
            };

            render(<CommandBar {...props} />);

            getMockComponentClassPropsForCall(CopyIssueDetailsButton).onClick(eventStub);

            onClickMock.verify(onClick => onClick(eventStub), Times.once());
            axeConverterMock.verifyAll();
        });
    });
});
