// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { It, Mock, Times } from 'typemoq';
import { DropdownClickHandler } from '../../../../../../common/dropdown-click-handler';
import { TelemetryEventSource } from '../../../../../../common/telemetry-events';
import { DetailsViewPivotType } from '../../../../../../common/types/details-view-pivot-type';
import { FeatureFlagStoreData } from '../../../../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import { PopupActionMessageCreator } from '../../../../../../popup/scripts/actions/popup-action-message-creator';
import {
    LaunchPanelHeader,
    LaunchPanelHeaderDeps,
    LaunchPanelHeaderProps,
} from '../../../../../../popup/scripts/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from '../../../../../../popup/scripts/handlers/launch-panel-header-click-handler';
import { SupportLinkHandler } from '../../../../../../popup/support-link-handler';
import { EventStubFactory } from '../../../../common/event-stub-factory';

describe('LaunchPanelHeaderTest', () => {
    const eventStubFactory = new EventStubFactory();
    let props: LaunchPanelHeaderProps;

    beforeEach(() => {
        const deps: LaunchPanelHeaderDeps = {
            popupActionMessageCreator: {} as PopupActionMessageCreator,
            dropdownClickHandler: {} as DropdownClickHandler,
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
            openAdhocToolsPanel: () => {},
            dropdownClickHandler: {} as DropdownClickHandler,
        };
    });

    test('render', () => {
        const wrapped = shallow(<LaunchPanelHeader {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    describe('render contextual menu', () => {
        it('renders without new assessment experience', () => {
            const wrapped = shallow(<LaunchPanelHeader {...props} />);

            wrapped.setState({ target: 'test-target', isContextMenuVisible: true });

            expect(wrapped.getElement()).toMatchSnapshot();
        });

        it('renders with new assessment experience', () => {
            props.featureFlags = { newAssessmentExperience: true } as FeatureFlagStoreData;

            const wrapped = shallow(<LaunchPanelHeader {...props} />);

            wrapped.setState({ target: 'test-target', isContextMenuVisible: true });

            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });

    describe('click handling', () => {
        const event = eventStubFactory.createMouseClickEvent() as any;

        test('openFastPass', () => {
            const pivotType = DetailsViewPivotType.fastPass;
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
            const actionMessageCreator = Mock.ofType(PopupActionMessageCreator);
            actionMessageCreator.setup(amc => amc.openShortcutConfigureTab(event)).verifiable(Times.once());

            props.deps.popupActionMessageCreator = actionMessageCreator.object;

            const component = React.createElement(LaunchPanelHeader, props);
            const testSubject = TestUtils.renderIntoDocument(component);

            (testSubject as any)._openShortcutModifyTab(event);

            actionMessageCreator.verifyAll();
        });

        test('Help', () => {
            const clickHanderMock = Mock.ofType(LaunchPanelHeaderClickHandler);
            clickHanderMock.setup(cH => cH.onClickLink(props.popupWindow, event, It.isAny())).verifiable(Times.once());

            props.clickhandler = clickHanderMock.object;

            const component = React.createElement(LaunchPanelHeader, props);
            const testSubject = TestUtils.renderIntoDocument(component);

            (testSubject as any)._onClickLink(event);

            clickHanderMock.verifyAll();
        });
    });
});
