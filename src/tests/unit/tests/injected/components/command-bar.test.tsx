// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, Times, It } from 'typemoq';

import { BaseButton, Button } from '../../../../../../node_modules/office-ui-fabric-react';
import { CopyIssueDetailsButton } from '../../../../../common/components/copy-issue-details-button';
import { UserConfigurationStoreData } from '../../../../../common/types/store-data/user-configuration-store';
import { CommandBar, CommandBarDeps, CommandBarProps } from '../../../../../injected/components/command-bar';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { EventStubFactory } from '../../../common/event-stub-factory';
import { CreateIssueDetailsTextData } from '../../../../../common/types/create-issue-details-text-data';
import { AxeResultToIssueFilingDataConverter } from '../../../../../issue-filing/rule-result-to-issue-filing-data';

describe('CommandBar', () => {
    const ruleResult = {
        failureSummary: 'RR-failureSummary',
        guidanceLinks: [
            {
                text: 'WCAG-1.4.1',
                tags: [{ id: 'some-id', displayText: 'some displayText' }, { id: 'some-other-id', displayText: 'some other displayText' }],
            },
            { text: 'wcag-2.8.2' },
        ],
        help: 'RR-help',
        html: 'RR-html',
        ruleId: 'RR-rule-id',
        helpUrl: 'RR-help-url',
        selector: 'RR-selector<x>',
        snippet: 'RR-snippet   space',
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
        userConfigurationStoreData: { isFirstTime: false, bugService: 'None' } as UserConfigurationStoreData,
        devToolsShortcut: 'dev-tools-shortcut',
        currentRuleIndex: 0,
        failedRules: {
            'RR-rule-id': ruleResult,
        },
    };

    describe('renders', () => {
        const showInspectButtonMessage = [true, false];

        it.each(showInspectButtonMessage)('renders, shows inspect button message: %s', show => {
            axeConverterMock
                .setup(m => m.convert(ruleResult, It.isAnyString(), It.isAnyString()))
                .returns(_ => issueData)
                .verifiable(Times.atLeastOnce());

            const props = {
                ...defaultCommandBarProps,

                shouldShowInspectButtonMessage: () => show,
            };

            const wrapper = shallow(<CommandBar {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
            axeConverterMock.verifyAll();
        });
    });

    describe('click handlers', () => {
        const eventStub = new EventStubFactory().createKeypressEvent() as any;

        test('for inspect button', () => {
            const onClickMock = Mock.ofInstance(
                (event: React.MouseEvent<Button | BaseButton | HTMLDivElement | HTMLAnchorElement | HTMLButtonElement, MouseEvent>) => {},
            );

            const props = {
                ...defaultCommandBarProps,
                onClickInspectButton: onClickMock.object,
            };

            const wrapper = shallow(<CommandBar {...props} />);

            const button = wrapper.find('.insights-dialog-button-inspect');

            button.simulate('click', eventStub);

            onClickMock.verify(onClick => onClick(eventStub), Times.once());
        });

        test('for copy issue details button', () => {
            const onClickMock = Mock.ofInstance((event: React.MouseEvent<any, MouseEvent>) => {});

            const props = {
                ...defaultCommandBarProps,
                onClickCopyIssueDetailsButton: onClickMock.object,
            };

            const wrapper = shallow(<CommandBar {...props} />);

            const button = wrapper.find(CopyIssueDetailsButton);

            button.prop('onClick')(eventStub);

            onClickMock.verify(onClick => onClick(eventStub), Times.once());
        });
    });
});
