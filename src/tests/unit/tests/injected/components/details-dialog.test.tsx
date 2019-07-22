// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Dialog } from 'office-ui-fabric-react';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { CommandBar } from '../../../../../injected/components/command-bar';
import { DetailsDialog, DetailsDialogDeps, DetailsDialogProps } from '../../../../../injected/components/details-dialog';
import { DecoratedAxeNodeResult } from '../../../../../injected/scanner-utils';
import { TargetPageActionMessageCreator } from '../../../../../injected/target-page-action-message-creator';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { BaseDataBuilder } from '../../../common/base-data-builder';
import { EventStubFactory } from '../../../common/event-stub-factory';

type DetailsDialogTestCase = {
    isDevToolsOpen: boolean;
    shadowDialog: boolean;
    helpUrl?: string;
    expectedHelpUrl?: string;
};

describe('DetailsDialogTest', () => {
    const fingerprint: string = '12345678-9ABC-1234-1234-123456789ABC';
    const ruleId: string = 'ruleId';
    const help: string = 'help';

    describe('renders', () => {
        const testCases: DetailsDialogTestCase[] = [
            {
                isDevToolsOpen: false,
                shadowDialog: false,
            },
            {
                isDevToolsOpen: false,
                shadowDialog: true,
            },
            {
                isDevToolsOpen: true,
                shadowDialog: false,
            },
            {
                isDevToolsOpen: true,
                shadowDialog: true,
            },
            {
                isDevToolsOpen: false,
                shadowDialog: false,
                helpUrl: 'help-relative',
                expectedHelpUrl: 'http://extension/help-relative',
            },
        ];

        test.each(testCases)('with: %o', (testCase: DetailsDialogTestCase) => {
            const {
                isDevToolsOpen,
                shadowDialog,
                helpUrl = 'http://extension/help1',
                expectedHelpUrl = 'http://extension/help1',
            } = testCase;

            const expectedNodeResult: DecoratedAxeNodeResult = defaultDecoratedAxeNodeResultBuilder()
                .with('helpUrl', helpUrl)
                .build();

            const expectedFailedRules: DictionaryStringTo<DecoratedAxeNodeResult> = {};
            expectedFailedRules[ruleId] = expectedNodeResult;

            const dialogDetailsHandlerMockObject = getDetailsDialogHandlerStub(isDevToolsOpen);

            const deps: DetailsDialogDeps = defaultDetailsDialogDepsBuilder()
                .with('clientBrowserAdapter', {
                    getUrl: url => expectedHelpUrl,
                } as any)
                .build();

            const props: DetailsDialogProps = defaultDetailsDialogPropsBuilder()
                .with('deps', deps)
                .with('failedRules', expectedFailedRules)
                .with('dialogHandler', dialogDetailsHandlerMockObject as any)
                .with('featureFlagStoreData', {
                    [FeatureFlags.shadowDialog]: shadowDialog,
                })
                .build();

            const wrapper = shallow(<DetailsDialog {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();

            expect(wrapper.state()).toMatchSnapshot('verify initial state');

            if (!shadowDialog) {
                expect(
                    wrapper
                        .find(Dialog)
                        .props()
                        .dialogContentProps.topButtonsProps[0].onRenderIcon(),
                ).toMatchSnapshot('verify close button for non shadow dom');
            }
        });
    });

    describe('handlers', () => {
        describe('for CommandBar', () => {
            const shadowDialogEnabled = [true, false];
            const eventStub = new EventStubFactory().createKeypressEvent() as any;

            let depsBuilder: BaseDataBuilder<DetailsDialogDeps>;
            let propsBuilder: BaseDataBuilder<DetailsDialogProps>;
            let expectedFailedRules: DictionaryStringTo<DecoratedAxeNodeResult>;
            let dialogDetailsHandlerMockObject;

            beforeEach(() => {
                const expectedNodeResult = defaultDecoratedAxeNodeResultBuilder()
                    .with('helpUrl', 'help-url')
                    .build();

                expectedFailedRules = {};
                expectedFailedRules[ruleId] = expectedNodeResult;

                depsBuilder = defaultDetailsDialogDepsBuilder().with('clientBrowserAdapter', {
                    getUrl: url => 'test-url',
                } as any);
                dialogDetailsHandlerMockObject = getDetailsDialogHandlerStub(true);

                propsBuilder = defaultDetailsDialogPropsBuilder()
                    .with('failedRules', expectedFailedRules)
                    .with('dialogHandler', dialogDetailsHandlerMockObject);
            });

            test.each(shadowDialogEnabled)('on click copy issue details button, shadow dialog: %s', shadowDialog => {
                const targetPageActionMessageCreatorMock = Mock.ofType<TargetPageActionMessageCreator>();

                const deps = depsBuilder.with('targetPageActionMessageCreator', targetPageActionMessageCreatorMock.object).build();

                const props = propsBuilder
                    .with('deps', deps)
                    .with('featureFlagStoreData', {
                        [FeatureFlags.shadowDialog]: shadowDialog,
                    })
                    .build();

                const wrapper = shallow(<DetailsDialog {...props} />);

                const commandBar = wrapper.find(CommandBar);

                commandBar.prop('onClickCopyIssueDetailsButton')(eventStub);

                targetPageActionMessageCreatorMock.verify(creator => creator.copyIssueDetailsClicked(eventStub), Times.once());
            });

            test.each(shadowDialogEnabled)('on click inspect button, shadow dialog: %s', shadowDialog => {
                const clickHandlerMock = Mock.ofInstance((component: DetailsDialog, event: React.SyntheticEvent<MouseEvent>) => {});

                dialogDetailsHandlerMockObject.inspectButtonClickHandler = clickHandlerMock.object;

                const deps = depsBuilder.build();

                const props = propsBuilder
                    .with('deps', deps)
                    .with('featureFlagStoreData', {
                        [FeatureFlags.shadowDialog]: shadowDialog,
                    })
                    .build();

                const wrapper = shallow<DetailsDialog>(<DetailsDialog {...props} />);

                const commandBar = wrapper.find(CommandBar);
                const onClick = commandBar.prop('onClickInspectButton');

                if (shadowDialog) {
                    expect(onClick).toBeNull();
                } else {
                    onClick(eventStub);

                    clickHandlerMock.verify(handler => handler(wrapper.instance(), eventStub), Times.once());
                }
            });

            test.each(shadowDialogEnabled)('should should inspect button message, shadow dialog: %s', shadowDialog => {
                const handlerMock = Mock.ofInstance<(component: DetailsDialog) => boolean>((component: DetailsDialog) => true);

                dialogDetailsHandlerMockObject.shouldShowInspectButtonMessage = handlerMock.object;

                const deps = depsBuilder.build();

                const props = propsBuilder
                    .with('deps', deps)
                    .with('featureFlagStoreData', {
                        [FeatureFlags.shadowDialog]: shadowDialog,
                    })
                    .build();

                const wrapper = shallow<DetailsDialog>(<DetailsDialog {...props} />);

                const commandBar = wrapper.find(CommandBar);

                commandBar.prop('shouldShowInspectButtonMessage')();

                handlerMock.verify(handler => handler(wrapper.instance()), Times.once());
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
        };
    };

    const defaultDecoratedAxeNodeResultBuilder = () =>
        new BaseDataBuilder<DecoratedAxeNodeResult>({
            any: [],
            all: [],
            none: [],
            status: false,
            ruleId: ruleId,
            help: help,
            selector: 'selector',
            html: 'html',
            failureSummary: 'failureSummary',
            fingerprint: fingerprint,
            id: 'id1',
            guidanceLinks: [{ text: 'Guidance Link', href: 'http://example.com' }],
            snippet: 'html',
        } as DecoratedAxeNodeResult);

    const defaultDetailsDialogDepsBuilder = () =>
        new BaseDataBuilder<DetailsDialogDeps>({
            windowUtils: null,
            issueDetailsTextGenerator: null,
            targetPageActionMessageCreator: {
                copyIssueDetailsClicked: () => {},
            } as any,
            issueFilingActionMessageCreator: null,
        } as DetailsDialogDeps);

    const defaultDetailsDialogPropsBuilder = () =>
        new BaseDataBuilder<DetailsDialogProps>({
            elementSelector: ruleId,
            target: [],
            devToolStore: {} as any,
            userConfigStore: {
                getState: () => {},
            } as any,
            devToolActionMessageCreator: {} as any,
            devToolsShortcut: 'shortcut',
        } as DetailsDialogProps);
});
