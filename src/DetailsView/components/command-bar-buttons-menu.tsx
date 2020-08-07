// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import {
    StartOverComponentFactory,
    StartOverFactoryProps,
} from 'DetailsView/components/start-over-component-factory';
import { CommandBarButton, IButton, IContextualMenuItem, IRefObject } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './command-bar-buttons-menu.scss';

export type CommandBarButtonsMenuProps = {
    renderExportReportButton: () => JSX.Element;
    getStartOverProps: () => StartOverFactoryProps;
    startOverComponentFactory: StartOverComponentFactory;
    buttonRef: IRefObject<IButton>;
};

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'CommandBarButtonsMenu',
    props => {
        const startOverFactoryProps = props.getStartOverProps();
        const overflowItems: IContextualMenuItem[] = [
            {
                key: 'export report',
                onRender: () => <div role="menuitem">{props.renderExportReportButton()}</div>,
            },
            {
                key: 'start over',
                ...props.startOverComponentFactory.getStartOverMenuItem(startOverFactoryProps),
            },
        ];

        return (
            <CommandBarButton
                ariaLabel="More items"
                className={styles.commandBarButtonsMenu}
                role="button"
                menuIconProps={{
                    iconName: 'More',
                    className: styles.commandBarButtonsMenuButton,
                }}
                menuProps={{ items: overflowItems, className: styles.commandBarButtonsSubmenu }}
                componentRef={props.buttonRef}
            />
        );
    },
);
