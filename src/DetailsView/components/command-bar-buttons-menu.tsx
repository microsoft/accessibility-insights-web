// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { CommandBarButton, IContextualMenuItem } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './command-bar-buttons-menu.scss';

export type CommandBarButtonsMenuProps = CommandBarProps;

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'CommandBarButtonsMenu',
    props => {
        const overflowItems: IContextualMenuItem[] = [
            {
                key: 'export report',
                onRender: () => props.switcherNavConfiguration.ReportExportComponentFactory(props),
            },
            {
                key: 'start over',
                onRender: () =>
                    props.switcherNavConfiguration.StartOverComponentFactory({
                        ...props,
                        dropdownDirection: 'left',
                    }),
            },
        ];

        return (
            <CommandBarButton
                ariaLabel="More items"
                className={styles.commandBarButtonsMenu}
                role="menuitem"
                menuIconProps={{
                    iconName: 'More',
                    className: styles.commandBarButtonsMenuButton,
                }}
                menuProps={{ items: overflowItems, className: styles.commandBarButtonsSubmenu }}
            />
        );
    },
);
