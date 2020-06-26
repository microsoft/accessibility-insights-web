// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { CommandBarButton, IOverflowSetItemProps, OverflowSet } from 'office-ui-fabric-react';
import * as React from 'react';

export type CommandBarButtonsMenuProps = CommandBarProps;

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'DetailsListIssuesView',
    props => {
        const onRenderItem = (item: IOverflowSetItemProps) => {
            item.onRender(props);
        };

        const onRenderOverflowButton = (overflow: IOverflowSetItemProps[]): JSX.Element => {
            return (
                <CommandBarButton
                    ariaLabel="More items"
                    role="menuitem"
                    menuIconProps={{ iconName: 'More' }}
                    menuProps={{ items: overflow! }}
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
                onRender: () => props.switcherNavConfiguration.StartOverComponentFactory(props),
            },
        ];

        return (
            <OverflowSet
                onRenderItem={onRenderItem}
                overflowItems={overflowItems}
                onRenderOverflowButton={onRenderOverflowButton}
            />
        );
    },
);
