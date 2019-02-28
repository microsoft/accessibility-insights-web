// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { ContextualMenu, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { IMock, It, Mock, Times } from 'typemoq';

import { GearOptionsButtonComponent } from '../../../../../../common/components/gear-options-button-component';
import { DropdownClickHandler } from '../../../../../../common/dropdown-click-handler';
import { TelemetryEventSource } from '../../../../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../../../../common/types/details-view-pivot-type';
import { FeatureFlagStoreData } from '../../../../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import { PopupActionMessageCreator } from '../../../../../../popup/scripts/actions/popup-action-message-creator';
import Header from '../../../../../../popup/scripts/components/header';
import {
    ILaunchPanelHeaderProps,
    LaunchPanelHeader,
    LaunchPanelHeaderDeps,
} from '../../../../../../popup/scripts/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from '../../../../../../popup/scripts/handlers/launch-panel-header-click-handler';
import { SupportLinkHandler } from '../../../../../../popup/support-link-handler';
import { EventStubFactory } from '../../../../common/event-stub-factory';

describe('LaunchPanelHeaderTest', () => {
    const eventStubFactory = new EventStubFactory();
    let onClickLinkMock: (ev: any, items: any) => void;
    let openStartingDialogMock: (ev: any, items: any) => void;
    let onOpenContextualMenuMock: (ev: any) => void;
    let onDismissContextualMenuMock: (ev: any) => void;
    let sendEmailMock: () => void;
    let openAdhocToolsMock: (ev: any) => void;
    let props: ILaunchPanelHeaderProps;
    let openShortcutModifyTabMock: () => void;
    let onOpenDetailsViewForAllTestsMock: (ev: any) => void;
    let onOpenDetailsViewForAssessment: (ev: any) => void;
    let onOpenDetailsViewForFastPassMock: (ev: any) => void;
    let dropdownClickHandlerMock: IMock<DropdownClickHandler>;

    beforeEach(() => {
        onClickLinkMock = (ev, items) => {};
        openStartingDialogMock = (ev, items) => {};
        onOpenContextualMenuMock = ev => {};
        onDismissContextualMenuMock = ev => {};
        sendEmailMock = () => {};
        openAdhocToolsMock = ev => {};
        openShortcutModifyTabMock = () => {};
        onOpenDetailsViewForAllTestsMock = ev => {};
        onOpenDetailsViewForFastPassMock = ev => {};
        onOpenDetailsViewForAssessment = ev => {};
        dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);
        const deps: LaunchPanelHeaderDeps = {
            popupActionMessageCreator: {} as PopupActionMessageCreator,
            dropdownClickHandler: dropdownClickHandlerMock.object,
        };
        props = {
            deps: deps,
            title: 'test title',
            subtitle: 'test subtitle',
            openGettingStartedDialog: {} as any,
            openFeedbackDialog: {} as any,
            clickhandler: {} as LaunchPanelHeaderClickHandler,
            supportLinkHandler: {} as SupportLinkHandler,
            popupWindow: {} as Window,
            featureFlags: {} as FeatureFlagStoreData,
            openAdhocToolsPanel: {} as any,
            dropdownClickHandler: dropdownClickHandlerMock.object,
        };
    });

    test('render header when feature flag is Off', () => {
        props.featureFlags = {} as FeatureFlagStoreData;
        const testSubject = new LaunchPanelHeader(props);
        (testSubject as any)._onOpenContextualMenu = onOpenContextualMenuMock;

        const expected = getExpectedHeader();
        expect(testSubject.render()).toEqual(expected);
        console.log();
    });

    test('render feedback new menu', () => {
        const testSubject = new LaunchPanelHeader(props);
        (testSubject as any)._onOpenContextualMenu = onOpenContextualMenuMock;
        (testSubject as any)._onClickLink = onClickLinkMock;
        (testSubject as any)._openStartingDialog = openStartingDialogMock;
        (testSubject as any)._onDismissContextualMenu = onDismissContextualMenuMock;
        (testSubject as any)._openAdhocToolsPanel = openAdhocToolsMock;
        (testSubject as any)._sendEmail = sendEmailMock;
        (testSubject as any)._openShortcutModifyTab = openShortcutModifyTabMock;
        (testSubject as any)._onOpenDetailsViewForAllTests = onOpenDetailsViewForAllTestsMock;
        (testSubject as any)._onOpenDetailsViewForAssessment = onOpenDetailsViewForAssessment;
        (testSubject as any)._onOpenDetailsViewForFastPass = onOpenDetailsViewForFastPassMock;

        const expected = (
            <ContextualMenu
                className="popup-menu"
                shouldFocusOnMount={true}
                target={undefined}
                onDismiss={onDismissContextualMenuMock}
                directionalHint={getRTL() ? DirectionalHint.bottomRightEdge : DirectionalHint.bottomLeftEdge}
                items={[
                    {
                        key: 'fast-pass',
                        iconProps: {
                            iconName: 'Rocket',
                        },
                        onClick: onOpenDetailsViewForFastPassMock,
                        name: 'FastPass',
                    },
                    {
                        key: 'full-assessment',
                        iconProps: {
                            iconName: 'testBeakerSolid',
                        },
                        onClick: onOpenDetailsViewForAllTestsMock,
                        name: 'Full Assessment',
                    },
                    {
                        key: 'ad-hoc-tools',
                        iconProps: {
                            iconName: 'Medical',
                        },
                        name: 'Ad hoc tools',
                        onClick: openAdhocToolsMock,
                    },
                    {
                        key: 'divider_1',
                        itemType: ContextualMenuItemType.Divider,
                    },
                    {
                        key: 'modify-shortcuts',
                        name: 'Keyboard shortcuts',
                        onClick: openShortcutModifyTabMock,
                    },
                    {
                        key: 'help',
                        iconProps: {
                            iconName: 'Unknown',
                        },
                        data: 'https://aka.ms/accessibilityinsights-stackoverflow',
                        onClick: onClickLinkMock,
                        name: 'Help',
                    },
                    {
                        key: 'divider_2',
                        itemType: ContextualMenuItemType.Divider,
                    },
                    {
                        key: 'ask-a-question',
                        iconProps: {
                            iconName: 'Mail',
                        },
                        onClick: sendEmailMock,
                        name: 'Ask a question',
                    },
                ]}
            />
        );

        expect(testSubject.renderContextualMenu(true)).toEqual(expected);
    });

    test('render feedback menu when newAssessment is on', () => {
        props.featureFlags = { newAssessmentExperience: true } as FeatureFlagStoreData;
        const testSubject = new LaunchPanelHeader(props);
        (testSubject as any)._onOpenContextualMenu = onOpenContextualMenuMock;
        (testSubject as any)._onClickLink = onClickLinkMock;
        (testSubject as any)._openStartingDialog = openStartingDialogMock;
        (testSubject as any)._onDismissContextualMenu = onDismissContextualMenuMock;
        (testSubject as any)._openAdhocToolsPanel = openAdhocToolsMock;
        (testSubject as any)._sendEmail = sendEmailMock;
        (testSubject as any)._openShortcutModifyTab = openShortcutModifyTabMock;
        (testSubject as any)._onOpenDetailsViewForAllTests = onOpenDetailsViewForAllTestsMock;
        (testSubject as any)._onOpenDetailsViewForAssessment = onOpenDetailsViewForAssessment;
        (testSubject as any)._onOpenDetailsViewForFastPass = onOpenDetailsViewForFastPassMock;

        const expected = (
            <ContextualMenu
                className="popup-menu"
                shouldFocusOnMount={true}
                target={undefined}
                onDismiss={onDismissContextualMenuMock}
                directionalHint={getRTL() ? DirectionalHint.bottomRightEdge : DirectionalHint.bottomLeftEdge}
                items={[
                    {
                        key: 'fast-pass',
                        iconProps: {
                            iconName: 'Rocket',
                        },
                        onClick: onOpenDetailsViewForFastPassMock,
                        name: 'FastPass',
                    },
                    {
                        key: 'assessment',
                        iconProps: {
                            iconName: 'testBeakerSolid',
                        },
                        name: 'Assessment',
                        onClick: onOpenDetailsViewForAssessment,
                    },
                    {
                        key: 'ad-hoc-tools',
                        iconProps: {
                            iconName: 'Medical',
                        },
                        name: 'Ad hoc tools',
                        onClick: openAdhocToolsMock,
                    },
                    {
                        key: 'divider_1',
                        itemType: ContextualMenuItemType.Divider,
                    },
                    {
                        key: 'modify-shortcuts',
                        name: 'Keyboard shortcuts',
                        onClick: openShortcutModifyTabMock,
                    },
                    {
                        key: 'help',
                        iconProps: {
                            iconName: 'Unknown',
                        },
                        data: 'https://go.microsoft.com/fwlink/?linkid=2077937',
                        onClick: onClickLinkMock,
                        name: 'Help',
                    },
                ]}
            />
        );

        expect(testSubject.renderContextualMenu(true)).toEqual(expected);
    });

    test('openFastPass', () => {
        const pivotType = DetailsViewPivotType.fastPass;
        const event = eventStubFactory.createMouseClickEvent() as any;
        const actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
        const source = TelemetryEventSource.HamburgerMenu;

        actionMessageCreatorMock
            .setup(amc => amc.openDetailsView(event as any, VisualizationType.Issues, source, pivotType))
            .verifiable(Times.once());

        props.deps.popupActionMessageCreator = actionMessageCreatorMock.object;

        const component = React.createElement(LaunchPanelHeader, props);
        const testSubject = TestUtils.renderIntoDocument(component);

        (testSubject as any)._onOpenDetailsViewForFastPass(event);

        actionMessageCreatorMock.verifyAll();
    });

    test('openAllTests', () => {
        const pivotType = DetailsViewPivotType.allTest;
        const event = eventStubFactory.createMouseClickEvent() as any;
        const actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
        const source = TelemetryEventSource.HamburgerMenu;

        actionMessageCreatorMock
            .setup(amc => amc.openDetailsView(event as any, VisualizationType.Issues, source, pivotType))
            .verifiable(Times.once());

        props.deps.popupActionMessageCreator = actionMessageCreatorMock.object;

        const component = React.createElement(LaunchPanelHeader, props);
        const testSubject = TestUtils.renderIntoDocument(component);

        (testSubject as any)._onOpenDetailsViewForAllTests(event);

        actionMessageCreatorMock.verifyAll();
    });

    test('open assessment', () => {
        const pivotType = DetailsViewPivotType.assessment;
        const event = eventStubFactory.createMouseClickEvent() as any;
        const actionMessageCreatorMock = Mock.ofType(PopupActionMessageCreator);
        const source = TelemetryEventSource.HamburgerMenu;

        actionMessageCreatorMock.setup(amc => amc.openDetailsView(event as any, null, source, pivotType)).verifiable(Times.once());

        props.deps.popupActionMessageCreator = actionMessageCreatorMock.object;

        const component = React.createElement(LaunchPanelHeader, props);
        const testSubject = TestUtils.renderIntoDocument(component);

        (testSubject as any)._onOpenDetailsViewForAssessment(event);

        actionMessageCreatorMock.verifyAll();
    });

    test('Keyboard: modify shortcuts', () => {
        const event = eventStubFactory.createKeypressEvent() as any;
        const actionMessageCreator = Mock.ofType(PopupActionMessageCreator);
        actionMessageCreator.setup(amc => amc.openShortcutConfigureTab(event)).verifiable(Times.once());

        props.deps.popupActionMessageCreator = actionMessageCreator.object;

        const component = React.createElement(LaunchPanelHeader, props);
        const testSubject = TestUtils.renderIntoDocument(component);

        (testSubject as any)._openShortcutModifyTab(event);

        actionMessageCreator.verifyAll();
    });

    test('Help', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const clickHanderMock = Mock.ofType(LaunchPanelHeaderClickHandler);
        clickHanderMock.setup(cH => cH.onClickLink(props.popupWindow, event, It.isAny())).verifiable(Times.once());

        props.clickhandler = clickHanderMock.object;

        const component = React.createElement(LaunchPanelHeader, props);
        const testSubject = TestUtils.renderIntoDocument(component);

        (testSubject as any)._onClickLink(event);

        clickHanderMock.verifyAll();
    });

    test('Ask a question', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const supportLinkHandlerMock = Mock.ofType(SupportLinkHandler);
        supportLinkHandlerMock.setup(sLH => sLH.sendEmail(props.title)).verifiable(Times.once());

        props.supportLinkHandler = supportLinkHandlerMock.object;
        const component = React.createElement(LaunchPanelHeader, props);
        const testSubject = TestUtils.renderIntoDocument(component);

        (testSubject as any)._sendEmail();

        supportLinkHandlerMock.verifyAll();
    });

    test('File a Bug', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;
        const clickHanderMock = Mock.ofType(LaunchPanelHeaderClickHandler);
        clickHanderMock.setup(cH => cH.onClickLink(props.popupWindow, event, It.isAny())).verifiable(Times.once());

        props.clickhandler = clickHanderMock.object;

        const component = React.createElement(LaunchPanelHeader, props);
        const testSubject = TestUtils.renderIntoDocument(component);

        (testSubject as any)._onClickLink(event);

        clickHanderMock.verifyAll();
    });

    function getExpectedHeader(): JSX.Element {
        return (
            <Header
                title={props.title}
                subtitle={props.subtitle}
                rowExtraClassName="header-title"
                extraContent={
                    <div className="ms-Grid-col ms-u-sm2 feedback-collapseMenuButton-col">
                        <GearOptionsButtonComponent
                            dropdownClickHandler={dropdownClickHandlerMock.object}
                            featureFlags={props.featureFlags}
                        />
                        <IconButton
                            iconProps={{ iconName: 'GlobalNavButton' }}
                            id="feedback-collapse-menu-button"
                            onClick={onOpenContextualMenuMock}
                            ariaLabel="Help and Feedback menu"
                        />
                        {null}
                    </div>
                }
            />
        );
    }
});
