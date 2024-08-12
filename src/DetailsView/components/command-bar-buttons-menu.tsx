// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    Menu,
    MenuButton,
    MenuList,
    MenuPopover,
    MenuProps,
    MenuTrigger,
    Tooltip,
} from '@fluentui/react-components';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { NamedFC } from 'common/react/named-fc';
import { MyFunctionType } from 'DetailsView/components/details-view-command-bar';
import { StartOverMenuItem } from 'DetailsView/components/start-over-component-factory';
import * as React from 'react';
import styles from './command-bar-buttons-menu.scss';

export type CommandBarButtonsMenuProps = {
    renderExportReportButton: () => JSX.Element | null;
    saveAssessmentButton?: JSX.Element | null;
    loadAssessmentButton?: JSX.Element | null;
    transferToAssessmentButton?: JSX.Element | null;
    getStartOverMenuItem: () => StartOverMenuItem;
    buttonRef?: MyFunctionType;
    hasSubMenu?: boolean;
};

export const CommandBarButtonsMenu = NamedFC<CommandBarButtonsMenuProps>(
    'CommandBarButtonsMenu',
    props => {
        const [open, setOpen] = React.useState(false);
        const onOpenChange: MenuProps['onOpenChange'] = (e, data) => setOpen(data.open);
        const exportButton = props.renderExportReportButton();
        const overflowItems: any[] = [];
        if (exportButton != null) {
            overflowItems.push({
                key: 'export report',
                children: <>{exportButton}</>,
            });
        }
        if (props.saveAssessmentButton && props.loadAssessmentButton) {
            overflowItems.push(
                {
                    key: 'save assessment',
                    children: <>{props.saveAssessmentButton}</>,
                },
                {
                    key: 'load assessment',
                    children: <>{props.loadAssessmentButton}</>,
                },
            );
        }

        if (props.transferToAssessmentButton) {
            overflowItems.push({
                key: 'transfer to assessment',
                children: <>{props.transferToAssessmentButton}</>,
            });
        }

        overflowItems.push({
            key: 'start over',
            ...props.getStartOverMenuItem(),
        });
        console.log('open-->', open);
        return (
            <>
                <Tooltip content="More actions" relationship="label">
                    <Menu open={open} onOpenChange={onOpenChange}>
                        <MenuTrigger disableButtonEnhancement>
                            <MenuButton
                                appearance="transparent"
                                aria-label="More actions"
                                icon={<FluentUIV9Icon iconName="MoreHorizontalRegular" />}
                                className={styles.commandBarButtonsMenuButton}
                                ref={props.buttonRef}
                            />
                        </MenuTrigger>
                        <MenuPopover
                            style={{
                                border: 'unset !important',
                                borderRadius: 'unset !important',
                            }}
                        >
                            <MenuList className={styles.menuList}>
                                {overflowItems.map((item, index) => (
                                    <span role="group" key={index}>
                                        {item?.children}
                                    </span>
                                ))}
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                </Tooltip>
            </>
        );
    },
);
