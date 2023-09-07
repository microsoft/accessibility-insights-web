// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContextualMenuItemType, IconButton, IContextualMenuItem } from '@fluentui/react';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { NamedFC } from 'common/react/named-fc';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { VisualizationType } from 'common/types/visualization-type';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { LaunchPanelHeader } from 'popup/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from 'popup/handlers/launch-panel-header-click-handler';
import * as React from 'react';
import styles from './hamburger-menu-button.scss';

const telemetryEventSource = TelemetryEventSource.HamburgerMenu;

export type HamburgerMenuButtonDeps = {
    popupActionMessageCreator: PopupActionMessageCreator;
    launchPanelHeaderClickHandler: LaunchPanelHeaderClickHandler;
};

export type HamburgerMenuButtonProps = {
    deps: HamburgerMenuButtonDeps;
    popupWindow: Window;
    header: LaunchPanelHeader;
};

export const HamburgerMenuButton = NamedFC<HamburgerMenuButtonProps>(
    'HamburgerMenuButton',
    props => {
        const { deps, header, popupWindow } = props;
        const { launchPanelHeaderClickHandler, popupActionMessageCreator } = deps;
        const fastPassMenuItem = {
            key: 'fast-pass',
            iconProps: {
                iconName: 'Rocket',
            },
            onClick: event =>
                popupActionMessageCreator.openDetailsView(
                    event,
                    VisualizationType.Issues,
                    telemetryEventSource,
                    DetailsViewPivotType.fastPass,
                ),
            name: 'FastPass',
        };
        const assessmentMenuItem = {
            key: 'assessment',
            iconProps: {
                iconName: 'testBeakerSolid',
            },
            onClick: event =>
                popupActionMessageCreator.openDetailsView(
                    event,
                    null,
                    telemetryEventSource,
                    DetailsViewPivotType.assessment,
                ),
            name: 'Assessment',
        };
        const quickAssessMenuItem = {
            key: 'quick-assess',
            iconProps: {
                iconName: 'SiteScan',
            },
            onClick: event =>
                popupActionMessageCreator.openDetailsView(
                    event,
                    null,
                    telemetryEventSource,
                    DetailsViewPivotType.quickAssess,
                ),
            name: 'Quick Assess',
        };
        const adhocToolsMenuItem = {
            key: 'ad-hoc-tools',
            iconProps: {
                iconName: 'Medical',
            },
            name: 'Ad hoc tools',
            onClick: () => launchPanelHeaderClickHandler.openAdhocToolsPanel(header),
        };
        const productMenuItems = [
            fastPassMenuItem,
            quickAssessMenuItem,
            assessmentMenuItem,
            adhocToolsMenuItem,
        ];

        const resourceMenuItems: IContextualMenuItem[] = [
            {
                key: 'divider_1',
                itemType: ContextualMenuItemType.Divider,
            },
            {
                key: 'modify-shortcuts',
                iconProps: {
                    iconName: 'KeyboardClassic',
                },
                name: 'Keyboard shortcuts',
                onClick: event => popupActionMessageCreator.openShortcutConfigureTab(event),
            },
            {
                key: 'third-party-notices',
                iconProps: {
                    iconName: 'TextDocument',
                },
                data: '/NOTICE.html',
                onClick: (event, item) =>
                    launchPanelHeaderClickHandler.onClickLink(popupWindow, event as any, item),
                name: 'Third party notices',
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

        const getMenuItems = (): IContextualMenuItem[] =>
            [...productMenuItems, ...resourceMenuItems] as IContextualMenuItem[];

        return (
            <IconButton
                className={styles.hamburgerMenuButton}
                iconProps={{ iconName: 'GlobalNavButton' }}
                menuProps={{
                    items: getMenuItems(),
                    calloutProps: {
                        className: styles.hamburgerMenuButtonCallout,
                    },
                }}
                onRenderMenuIcon={() => null}
                ariaLabel="help menu"
            />
        );
    },
);
