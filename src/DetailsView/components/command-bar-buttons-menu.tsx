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
import { useState } from 'react';

import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { ChevronRightRegular } from '@fluentui/react-icons'
export type CommandBarButtonsMenuProps = {
    renderExportReportButton: () => JSX.Element | null;
    saveAssessmentButton?: JSX.Element | null;
    loadAssessmentButton?: JSX.Element | null;
    transferToAssessmentButton?: JSX.Element | null;
    getStartOverMenuItem: () => StartOverMenuItem;
    //getStartOverComponent: () => StartOverMenuItem;
    buttonRef: IRefObject<IButton>;
};

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'CommandBarButtonsMenu',
    props => {
        const exportButton = props.renderExportReportButton();
        const overflowItems: MenuItemProps[] = [];
        const [showMenu, setShowMenu] = useState(false)

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
        //     ...props.getStartOverMenuItem(),
        // });

        // if (props.getStartOverMenuItem() != null) {
        //     overflowItems.push({
        //         key: 'start over',
        //         ...props.getStartOverMenuItem(),
        //         //children: <div role="menuitem">{value}</div>,
        //     });
        // }
        if (props.getStartOverMenuItem() != null) {
            overflowItems.push({
                key: 'start over',
                // hasSubmenu: true,
                ...props.getStartOverMenuItem(),
            });
        }

        console.log('overflowItems', overflowItems);


        return (
            <Menu>
                <MenuTrigger>
                    <MenuButton appearance="transparent" icon={<MoreHorizontalRegular />} className={styles.commandBarButtonsMenuButton} />
                </MenuTrigger>
                <MenuList>
                    {overflowItems.map((item: any, index: number) => (

                        item?.children?.props?.children?.props?.hasSubMenu ?
                            <>
                                <Menu>
                                    <MenuTrigger>
                                        <MenuItem onClick={() => setShowMenu(!showMenu)} icon={<ChevronRightRegular />} key={`${item.key}-${index}`}>
                                            Start over
                                        </MenuItem>
                                    </MenuTrigger>
                                    <MenuPopover>
                                        <MenuList>
                                            <MenuItem>{item.children}</MenuItem>
                                        </MenuList>
                                    </MenuPopover>
                                </Menu>
                                {/* {showMenu && item.children} */}
                            </>
                            :

                            <MenuItem key={`${item.key}-${index}`} icon={Icons[item?.iconName]} className={item?.iconProps?.iconName === 'ArrowClockwiseRegular' ? item?.className : styles.commandBarButtonsSubmenu} {...item}>

                                {item?.children}
                            </MenuItem>


                    ))}
                </MenuList>
            </Menu>
        )

        // return (
        //     <>
        //         top = {overflowItems.map((item: any, index: number) => <h1>{item.children}</h1>)}
        //         {/* <TooltipHost content="More actions" aria-label="More actions">
        //             <CommandBarButton
        //                 ariaLabel="More actions"
        //                 className={styles.commandBarButtonsMenu}
        //                 role="button"
        //                 menuIconProps={{
        //                     iconName: 'More',
        //                     className: styles.commandBarButtonsMenuButton,
        //                 }}
        //                 menuProps={{ items: overflowItems, className: styles.commandBarButtonsSubmenu }}
        //                 componentRef={props.buttonRef}
        //             />
        //         </TooltipHost> */}
        //         <TooltipHost content="More actions" className={styles.commandBarButtonsMenu}>
        //             <Menu>
        //                 <MenuTrigger>
        //                     <MenuButton appearance="transparent" icon={<MoreHorizontalRegular />} className={styles.commandBarButtonsMenuButton} />
        //                 </MenuTrigger>
        //                 {/* <MenuPopover> */}
        //                 <MenuList>
        //                     {overflowItems.map((item: any, index: number) => (
        //                         <>
        //                             {item?.children?.props?.children?.props?.hasSubMenu ?
        //                                 <Menu key={`${item.key}-${index}`}>
        //                                     {/* <MenuTrigger>
        //                                             <MenuItem className={item?.iconProps?.iconName === 'ArrowClockwiseRegular' ? item?.className : styles.commandBarButtonsSubmenu}>
        //                                                 22{item?.children?.props?.children}
        //                                             </MenuItem>
        //                                         </MenuTrigger> */}
        //                                     {/* <MenuTrigger>
        //                                             <MenuItem>Start over</MenuItem>
        //                                         </MenuTrigger>
        //                                         <MenuPopover>
        //                                             <MenuList>

        //                                                 {props.getStartOverMenuItem().children[1]}
        //                                             </MenuList>
        //                                         </MenuPopover> */}

        //                                     {item.children}



        //                                     {/* {props.getStartOverMenuItem().children} */}

        //                                 </Menu>

        //                                 : <MenuItem key={`${item.key}-${index}`} icon={Icons[item?.iconName]} className={item?.iconProps?.iconName === 'ArrowClockwiseRegular' ? item?.className : styles.commandBarButtonsSubmenu} {...item}>

        //                                     {item?.children}
        //                                 </MenuItem >}


        //                         </>
        //                     ))}

        //                 </MenuList>
        //                 {/* </MenuPopover> */}
        //             </Menu>
        //         </TooltipHost >
        //     </>
        // );
    },
);
