// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FlaggedComponent } from 'common/components/flagged-component';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { mount, shallow } from 'enzyme';
import { IconButton } from 'office-ui-fabric-react';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { LaunchPanelHeader, LaunchPanelHeaderDeps, LaunchPanelHeaderProps } from 'popup/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from 'popup/handlers/launch-panel-header-click-handler';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { It, Mock, Times } from 'typemoq';

describe('LaunchPanelHeaderTest', () => {
    let props: LaunchPanelHeaderProps;

    beforeEach(() => {
        const deps: LaunchPanelHeaderDeps = {
            popupActionMessageCreator: {} as PopupActionMessageCreator,
            dropdownClickHandler: {} as DropdownClickHandler,
            launchPanelHeaderClickHandler: {} as LaunchPanelHeaderClickHandler,
        };
        props = {
            deps: deps,
            title: 'test title',
            subtitle: 'test subtitle',
            openGettingStartedDialog: {} as any,
            openFeedbackDialog: {} as any,
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

    describe('user interaction', () => {
        const eventStubFactory = new EventStubFactory();
        const eventStub = eventStubFactory.createMouseClickEvent() as any;

        it('handle global nav button activation', () => {
            const launchPanelHeaderClickHandlerMock = Mock.ofType<LaunchPanelHeaderClickHandler>();
            props.deps.launchPanelHeaderClickHandler = launchPanelHeaderClickHandlerMock.object;

            const wrapped = mount(<LaunchPanelHeader {...props} />);

            launchPanelHeaderClickHandlerMock
                .setup(handler => handler.onOpenContextualMenu(It.isAny(), It.isObjectWith(eventStub)))
                .verifiable(Times.once());

            const iconButton = wrapped.find(IconButton);

            expect(iconButton.length).toBe(1);

            iconButton.simulate('click', eventStub);

            launchPanelHeaderClickHandlerMock.verifyAll();
        });

        it('handle open debug tools button activation', () => {
            const dropdownClickHandlerMock = Mock.ofType<DropdownClickHandler>();
            props.deps.dropdownClickHandler = dropdownClickHandlerMock.object;

            const wrapped = mount(<LaunchPanelHeader {...props} />);

            dropdownClickHandlerMock.setup(handler => handler.openDebugTools()).verifiable(Times.once());

            const flaggedComponent = wrapped.find(FlaggedComponent);

            const wrappedIconButton = shallow(flaggedComponent.prop('enableJSXElement'));

            wrappedIconButton.simulate('click');

            dropdownClickHandlerMock.verifyAll();
        });
    });
});
