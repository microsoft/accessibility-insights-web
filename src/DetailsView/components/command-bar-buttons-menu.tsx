// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Tooltip,
} from '@fluentui/react-components';
import { NamedFC } from 'common/react/named-fc';
import { StartOverMenuItem } from 'DetailsView/components/start-over-component-factory';
import * as React from 'react';
import styles from './command-bar-buttons-menu.scss';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';

export type CommandBarButtonsMenuProps = {
    renderExportReportButton: () => JSX.Element | null;
    saveAssessmentButton?: JSX.Element | null;
    loadAssessmentButton?: JSX.Element | null;
    transferToAssessmentButton?: JSX.Element | null;
    getStartOverMenuItem: () => StartOverMenuItem;
    buttonRef?: React.RefObject<HTMLButtonElement>;
    //buttonRef: JSX.Element
};

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'CommandBarButtonsMenu',
    props => {
        const exportButton = props.renderExportReportButton();
        const overflowItems: any[] = [];

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

        overflowItems.push({
            key: 'start over',
            ...props.getStartOverMenuItem(),
        });

        return (
            <Tooltip content="More actions" relationship="label">
                <Menu persistOnItemClick={true}>
                    <MenuTrigger>
                        <MenuButton
                            appearance="transparent"
                            icon={<FluentUIV9Icon iconName="MoreHorizontalRegular" />}
                            className={styles.commandBarButtonsMenuButton}
                            ref={props.buttonRef}
                        />
                    </MenuTrigger>
                    <MenuPopover
                        style={{
                            padding: 'unset !important',
                            border: 'unset !important',
                            borderRadius: 'unset !important',
                        }}
                    >
                        <MenuList className={styles.menuList}>
                            {overflowItems.map((item, index) => {
                                return item?.children?.props?.children?.props?.hasSubMenu ? (
                                    <span className={styles.menuItem} key={index}>
                                        {item.children}
                                    </span>
                                ) : (
                                    <MenuItem className={styles.menuItem} key={index} {...props}>
                                        {item?.children}
                                    </MenuItem>
                                );
                            })}
                        </MenuList>
                    </MenuPopover>
                </Menu>
            </Tooltip>
        );
    },
);
