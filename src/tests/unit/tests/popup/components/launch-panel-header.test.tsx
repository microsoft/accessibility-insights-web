// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { act, fireEvent, render } from '@testing-library/react';
import { FlaggedComponent } from 'common/components/flagged-component';
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
    useOriginalReactElements,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { Mock, Times } from 'typemoq';

jest.mock('common/components/flagged-component');

describe('LaunchPanelHeaderTest', () => {
    mockReactComponents([FlaggedComponent]);
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
        useOriginalReactElements('common/components/flagged-component', ['FlaggedComponent']);
        const dropdownClickHandlerMock = Mock.ofType<DropdownClickHandler>();
        props.deps.dropdownClickHandler = dropdownClickHandlerMock.object;

        render(<LaunchPanelHeader {...props} />);

        dropdownClickHandlerMock
            .setup(handler => handler.openDebugTools())
            .verifiable(Times.once());

        const flaggedComponentProps =
            getMockComponentClassPropsForCall(FlaggedComponent).enableJSXElement;

        const wrappedIconButton = render(flaggedComponentProps);

        const button = wrappedIconButton.queryAllByRole('button');
        await act(async () => {
            await fireEvent.click(button[0]);
        });

        dropdownClickHandlerMock.verifyAll();
    });
});
