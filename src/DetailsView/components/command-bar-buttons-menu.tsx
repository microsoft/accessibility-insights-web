// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandBarButton,
    IButton,
    IContextualMenuItem,
    IRefObject,
    TooltipHost,
} from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import { StartOverMenuItem } from 'DetailsView/components/start-over-component-factory';
import * as React from 'react';
import styles from './command-bar-buttons-menu.scss';
import { Menu, MenuButton, MenuItem, MenuItemProps, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import { MoreHorizontalRegular } from '@fluentui/react-icons';
import { Icons } from 'common/icons/fluentui-v9-icons';
export type CommandBarButtonsMenuProps = {
    renderExportReportButton: () => JSX.Element | null;
    saveAssessmentButton?: JSX.Element | null;
    loadAssessmentButton?: JSX.Element | null;
    transferToAssessmentButton?: JSX.Element | null;
    getStartOverMenuItem: () => StartOverMenuItem;
    getStartOverComponent: () => StartOverMenuItem;
    buttonRef: IRefObject<IButton>;
};

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'CommandBarButtonsMenu',
    props => {
        const exportButton = props.renderExportReportButton();
        const overflowItems: MenuItemProps[] = [];

        if (exportButton != null) {
            overflowItems.push({
                key: 'export report',
                children: <div role="menuitem">{exportButton}</div>,
            });
        }
        if (props.saveAssessmentButton && props.loadAssessmentButton) {
            overflowItems.push(
                {
                    key: 'save assessment',
                    children: <div role="menuitem">{props.saveAssessmentButton}</div>,
                },
                {
                    key: 'load assessment',
                    children: <div role="menuitem">{props.loadAssessmentButton}</div>,
                },
            );
        }

        if (props.transferToAssessmentButton) {
            overflowItems.push({
                key: 'transfer to assessment',
                children: <div role="menuitem">{props.transferToAssessmentButton}</div>,
            });
        }

        // overflowItems.push({
        //     key: 'start over',
        //     children: {
        //         ...props.getStartOverMenuItem(),
        //     }
        // });

        if (props.getStartOverMenuItem() != null) {
            const value = props.getStartOverMenuItem();
            overflowItems.push({
                key: 'start over',
                ...props.getStartOverMenuItem(),
                //children: <div role="menuitem">{value}</div>,
            });
        }
        console.warn(overflowItems);

        return (
            <>
                <h1>top</h1>
                {/* <TooltipHost content="More actions" aria-label="More actions">
                    <CommandBarButton
                        ariaLabel="More actions"
                        className={styles.commandBarButtonsMenu}
                        role="button"
                        menuIconProps={{
                            iconName: 'More',
                            className: styles.commandBarButtonsMenuButton,
                        }}
                        menuProps={{ items: overflowItems, className: styles.commandBarButtonsSubmenu }}
                        componentRef={props.buttonRef}
                    />
                </TooltipHost> */}
                <TooltipHost content="More actions" className={styles.commandBarButtonsMenu}>
                    <Menu>
                        <MenuTrigger>
                            <MenuButton appearance="transparent" icon={<MoreHorizontalRegular />} className={styles.commandBarButtonsMenuButton} />
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                {/* {overflowItems.map((item: any) => (
                                    <MenuItem icon={Icons[item?.iconProps?.iconName]} key={item.key} className={styles.commandBarButtonsSubmenu} {...item}>
                                         {item.children ? item.children : item.text}
                                        {item.children}
                                    </MenuItem>
                                ))} */}
                                {overflowItems.map((item: any) => (
                                    <>

                                        <MenuItem key={item.key} icon={Icons[item?.iconName]} className={item?.iconProps?.iconName === 'ArrowClockwiseRegular' ? item?.className : styles.commandBarButtonsSubmenu} {...item}>

                                            {item?.children}
                                        </MenuItem>
                                        {/* <MenuItem icon={item?.iconProps?.iconName === 'Refresh' && <ArrowClockwiseRegular />} >
                                        {item?.text}
                                    </MenuItem> */}
                                    </>
                                ))}
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </TooltipHost>
            </>
        );
    },
);
