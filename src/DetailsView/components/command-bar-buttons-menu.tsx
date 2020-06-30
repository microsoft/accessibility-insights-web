// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { CommandBarButton, IOverflowSetItemProps, OverflowSet } from 'office-ui-fabric-react';
import * as React from 'react';
import * as styles from './command-bar-buttons-menu.scss';

export type CommandBarButtonsMenuProps = CommandBarProps;

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'CommandBarButtonsMenu',
    props => {
        const onRenderItem = (item: IOverflowSetItemProps): JSX.Element => {
            return item.onRender(props);
        };

        const onRenderOverflowButton = (overflow: IOverflowSetItemProps[]): JSX.Element => {
            return (
                <CommandBarButton
                    ariaLabel="More items"
                    role="menuitem"
                    menuIconProps={{ iconName: 'More' }}
                    menuProps={{ items: overflow, className: styles.commandBarButtonsSubmenu }}
                />
            );
        };

        const overflowItems = [
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
            <OverflowSet
                onRenderItem={onRenderItem}
                overflowItems={overflowItems}
                onRenderOverflowButton={onRenderOverflowButton}
                className={styles.commandBarButtonsMenu}
            />
        );
    },
);
