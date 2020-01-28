// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { shallow } from 'enzyme';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { LaunchPanelHeader, LaunchPanelHeaderDeps, LaunchPanelHeaderProps } from 'popup/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from 'popup/handlers/launch-panel-header-click-handler';
import * as React from 'react';

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
});
