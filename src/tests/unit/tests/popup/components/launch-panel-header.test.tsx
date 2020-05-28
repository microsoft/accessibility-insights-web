// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FlaggedComponent } from 'common/components/flagged-component';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { mount, shallow } from 'enzyme';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import {
    LaunchPanelHeader,
    LaunchPanelHeaderDeps,
    LaunchPanelHeaderProps,
} from 'popup/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from 'popup/handlers/launch-panel-header-click-handler';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('LaunchPanelHeaderTest', () => {
    let props: LaunchPanelHeaderProps;

    beforeEach(() => {
        const deps: LaunchPanelHeaderDeps = {
            popupActionMessageCreator: {} as PopupActionMessageCreator,
            dropdownClickHandler: {} as DropdownClickHandler,
            launchPanelHeaderClickHandler: {} as LaunchPanelHeaderClickHandler,
        };
        props = {
            deps,
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

    it('renders', () => {
        const wrapped = shallow(<LaunchPanelHeader {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    it('handle open debug tools button activation', () => {
        const dropdownClickHandlerMock = Mock.ofType<DropdownClickHandler>();
        props.deps.dropdownClickHandler = dropdownClickHandlerMock.object;

        const wrapped = mount(<LaunchPanelHeader {...props} />);

        dropdownClickHandlerMock
            .setup(handler => handler.openDebugTools())
            .verifiable(Times.once());

        const flaggedComponent = wrapped.find(FlaggedComponent);

        const wrappedIconButton = shallow(flaggedComponent.prop('enableJSXElement'));

        wrappedIconButton.simulate('click');

        dropdownClickHandlerMock.verifyAll();
    });
});
