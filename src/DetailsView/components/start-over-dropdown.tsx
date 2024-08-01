// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    DirectionalHint,
} from '@fluentui/react';

import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItemProps,
    MenuList,
    MenuPopover,
    MenuTrigger,
} from '@fluentui/react-components';

import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import * as React from 'react';

import { StartOverContextMenuKeyOptions } from './details-view-right-panel';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { useStartOverDropdownStyles } from 'DetailsView/components/start-over-dropdown-styles';

export type StartOverDropdownMenuItems = MenuItemProps & {
    name: string;
};

export interface StartOverState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | null;
}

export interface StartOverProps {
    singleTestSuffix: string;
    dropdownDirection: DropdownDirection;
    openDialog: (dialogType: StartOverDialogType) => void;
    buttonRef: React.RefObject<HTMLButtonElement>;
    allTestSuffix: string;
    rightPanelOptions: StartOverContextMenuKeyOptions;
    switcherStartOverPreferences: StartOverContextMenuKeyOptions;
    hasSubMenu?: boolean;
}

const dropdownDirections = {
    down: {
        directionalHint: DirectionalHint.bottomAutoEdge,
        iconName: 'ChevronDown',
    },
    left: {
        directionalHint: DirectionalHint.leftTopEdge,
        iconName: 'ChevronRight',
    },
};

export type DropdownDirection = keyof typeof dropdownDirections;

export const StartOverDropdown: React.FC<StartOverProps> = props => {
    const stylesValue: any = useStartOverDropdownStyles();
    const direction = props.dropdownDirection;

    const getMenuItemsV9 = (): StartOverDropdownMenuItems[] => {
        const {
            singleTestSuffix,
            allTestSuffix,
            rightPanelOptions,
            switcherStartOverPreferences: startOverButtonOptionPreferences,
        } = props;
        const items: StartOverDropdownMenuItems[] = [];
        const assessmentKey = {
            key: 'assessment',
            name: `Start over ${allTestSuffix}`,
            onClick: onStartOverAllTestsMenu,
        };
        const testKey = {
            key: 'test',
            name: `Start over ${singleTestSuffix}`,
            onClick: onStartOverTestMenu,
        };

        items.push(assessmentKey);

        if (rightPanelOptions.showTest && startOverButtonOptionPreferences.showTest) {
            items.push(testKey);
        }

        return items;
    };

    const onStartOverTestMenu = (): void => {
        console.log('clicked2');
        props.openDialog('test');
    };

    const onStartOverAllTestsMenu = (): void => {
        console.log('clicked1');
        props.openDialog('assessment');
    };

    return (
        <div>
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <MenuButton
                        ref={props.buttonRef}
                        appearance="transparent"
                        className={stylesValue?.menuButton}
                        icon={
                            <FluentUIV9Icon
                                iconName="ArrowClockwiseRegular"
                            //    customClass={stylesValue.chevronIcon}
                            />
                        }
                        aria-label="start over menu"
                        //className={mergeClasses(styles.commandBarButtonsMenu, styles.menuItem)}
                        menuIcon={
                            direction === 'left' ? (
                                <FluentUIV9Icon
                                    iconName="ChevronRight20Regular"
                                    customClass={stylesValue?.chevronIcon}
                                />
                            ) : (
                                <FluentUIV9Icon
                                    iconName="ChevronDown20Regular"
                                    customClass={stylesValue?.chevronIcon}
                                />
                            )
                        }
                    >
                        Start over
                    </MenuButton>
                </MenuTrigger>
                <MenuPopover className={stylesValue?.menuPopover}>
                    <MenuList>
                        {getMenuItemsV9().map(item => (
                            <MenuItem
                                persistOnClick={true}
                                className={stylesValue?.menuItem}
                                key={item.key}
                                {...item}
                            >
                                {item.name}
                            </MenuItem>
                        ))}
                    </MenuList>
                </MenuPopover>
            </Menu>
        </div>
    );
};
