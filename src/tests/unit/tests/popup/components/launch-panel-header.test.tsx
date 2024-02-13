// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IconButton } from '@fluentui/react';
import { act, render } from '@testing-library/react';
import { FlaggedComponent } from 'common/components/flagged-component';
import { GearMenuButton } from 'common/components/gear-menu-button';
import { HamburgerMenuButton } from 'common/components/hamburger-menu-button';
import { Header } from 'common/components/header';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';

import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import {
    LaunchPanelHeader,
    LaunchPanelHeaderDeps,
    LaunchPanelHeaderProps,
} from 'popup/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from 'popup/handlers/launch-panel-header-click-handler';
import * as React from 'react';

import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { Mock, Times } from 'typemoq';

jest.mock('common/components/flagged-component');
jest.mock('common/components/header');
jest.mock('common/components/hamburger-menu-button');
jest.mock('common/components/gear-menu-button');
jest.mock('@fluentui/react');

describe('LaunchPanelHeaderTest', () => {
    mockReactComponents([FlaggedComponent, Header, GearMenuButton, HamburgerMenuButton]);
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
        const wrapped = render(<LaunchPanelHeader {...props} />);

        expect(wrapped.asFragment()).toMatchSnapshot();
    });

    it('handle open debug tools button activation', async () => {
        const dropdownClickHandlerMock = Mock.ofType<DropdownClickHandler>();
        props.deps.dropdownClickHandler = dropdownClickHandlerMock.object;

        render(<LaunchPanelHeader {...props} />);

        dropdownClickHandlerMock
            .setup(handler => handler.openDebugTools())
            .verifiable(Times.once());

        const flaggedComponentProps =
            getMockComponentClassPropsForCall(FlaggedComponent).enableJSXElement;

        render(flaggedComponentProps);

        await act(() => {
            getMockComponentClassPropsForCall(IconButton).onClick();
        });

        dropdownClickHandlerMock.verifyAll();
    });
});
