// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import {
    ContextualMenu,
    ContextualMenuItemType,
    DirectionalHint,
    IContextualMenuItem,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { TelemetryEventSource } from '../../common/extension-telemetry-events';
import { NamedFC } from '../../common/react/named-fc';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../common/types/visualization-type';
import { DictionaryStringTo } from '../../types/common-types';
import { PopupActionMessageCreator } from '../actions/popup-action-message-creator';
import { LaunchPanelHeaderClickHandler } from '../handlers/launch-panel-header-click-handler';
import { LaunchPanelHeader } from './launch-panel-header';

export type HeaderContextualMenuDeps = {
    popupActionMessageCreator: PopupActionMessageCreator;
    launchPanelHeaderClickHandler: LaunchPanelHeaderClickHandler;
};

export type HeaderContextualMenuProps = {
    deps: HeaderContextualMenuDeps;
    header: LaunchPanelHeader;
    popupWindow: Window;
    featureFlags: DictionaryStringTo<boolean>;
} & Pick<IContextualMenuItem, 'target'>;

const telemetryEventSource = TelemetryEventSource.HamburgerMenu;

export const HeaderContextualMenu = NamedFC<HeaderContextualMenuProps>(
    'HeaderContextualMenu',
    props => {
        const { deps, header, popupWindow } = props;
        const { popupActionMessageCreator, launchPanelHeaderClickHandler } = deps;

        const getItems = (): IContextualMenuItem[] => [
            {
                key: 'fast-pass',
                iconProps: {
                    iconName: 'Rocket',
                },
                onClick: ev =>
                    popupActionMessageCreator.openDetailsView(
                        ev,
                        VisualizationType.Issues,
                        telemetryEventSource,
                        DetailsViewPivotType.fastPass,
                    ),
                name: 'FastPass',
            },
            {
                key: 'assessment',
                iconProps: {
                    iconName: 'testBeakerSolid',
                },
                onClick: ev =>
                    popupActionMessageCreator.openDetailsView(
                        ev,
                        null,
                        telemetryEventSource,
                        DetailsViewPivotType.assessment,
                    ),
                name: 'Assessment',
            },
            {
                key: 'ad-hoc-tools',
                iconProps: {
                    iconName: 'Medical',
                },
                name: 'Ad hoc tools',
                onClick: () => launchPanelHeaderClickHandler.openAdhocToolsPanel(header),
            },
            {
                key: 'divider_1',
                itemType: ContextualMenuItemType.Divider,
            },
            {
                key: 'modify-shortcuts',
                name: 'Keyboard shortcuts',
                onClick: event => popupActionMessageCreator.openShortcutConfigureTab(event as any),
            },
            {
                key: 'help',
                iconProps: {
                    iconName: 'Unknown',
                },
                data: 'https://go.microsoft.com/fwlink/?linkid=2077937',
                onClick: (event, item) =>
                    launchPanelHeaderClickHandler.onClickLink(popupWindow, event as any, item),
                name: 'Help',
            },
        ];

        return (
            <ContextualMenu
                className="popup-menu"
                shouldFocusOnMount={true}
                target={props.target}
                onDismiss={event =>
                    launchPanelHeaderClickHandler.onDismissFeedbackMenu(header, event)
                }
                directionalHint={
                    getRTL() ? DirectionalHint.bottomRightEdge : DirectionalHint.bottomLeftEdge
                }
                items={getItems()}
            />
        );
    },
);
