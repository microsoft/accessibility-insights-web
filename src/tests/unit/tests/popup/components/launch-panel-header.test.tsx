// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IconButton } from '@fluentui/react';
import { act, render } from '@testing-library/react';
import { FlaggedComponent } from 'common/components/flagged-component';
import { GearMenuButton } from 'common/components/gear-menu-button';
import { HamburgerMenuButton } from 'common/components/hamburger-menu-button';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';

import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { Header } from 'popup/components/header';
import {
    LaunchPanelHeader,
    LaunchPanelHeaderDeps,
    LaunchPanelHeaderProps,
} from 'popup/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from 'popup/handlers/launch-panel-header-click-handler';
import * as React from 'react';

import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { Mock, Times } from 'typemoq';

jest.mock('common/components/flagged-component');
jest.mock('popup/components/header');
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
            popupWindow: {} as Window,
            featureFlags: {} as FeatureFlagStoreData,
            openAdhocToolsPanel: () => {},
        };
    });

    it('renders', () => {
        const wrapped = render(<LaunchPanelHeader {...props} />);
        expectMockedComponentPropsToMatchSnapshots([
            FlaggedComponent,
            GearMenuButton,
            HamburgerMenuButton,
        ]);
        expect(wrapped.asFragment()).toMatchSnapshot();
    });

    it('handle open debug tools button activation', () => {
        const dropdownClickHandlerMock = Mock.ofType<DropdownClickHandler>();
        props.deps.dropdownClickHandler = dropdownClickHandlerMock.object;

        render(<LaunchPanelHeader {...props} />);

        dropdownClickHandlerMock
            .setup(handler => handler.openDebugTools())
            .verifiable(Times.once());

        const flaggedComponentProps = getMockComponentClassPropsForCall(FlaggedComponent);

        render(flaggedComponentProps.enableJSXElement);

        act(() => {
            getMockComponentClassPropsForCall(IconButton).onClick();
        });

        dropdownClickHandlerMock.verifyAll();
    });
});
