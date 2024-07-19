// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ContextualMenu,
    DirectionalHint,
    IButton,
    IContextualMenuItem,
    IPoint,
    IRefObject,
} from '@fluentui/react';

import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItemProps,
    MenuList,
    MenuPopover,
    MenuTrigger,
    mergeClasses,
} from '@fluentui/react-components';
import {
    ArrowClockwiseRegular,
    ChevronDown20Regular,
    ChevronRight20Regular,
} from '@fluentui/react-icons';

import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import * as React from 'react';

import { StartOverContextMenuKeyOptions } from './details-view-right-panel';
import { FluentUIV9Icon } from 'common/icons/fluentui-v9-icons';
import { StartOverDropdownStyles } from 'DetailsView/components/start-over-dropdown-styles';
import { useState } from 'react';


export type StartOverDropdownMenuItems = MenuItemProps & {
    name: string;
};

export interface StartOverState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
}

export interface StartOverProps {
    singleTestSuffix: string;
    dropdownDirection: DropdownDirection;
    openDialog: (dialogType: StartOverDialogType) => void;
    buttonRef: IRefObject<IButton>;
    allTestSuffix: string;
    rightPanelOptions: StartOverContextMenuKeyOptions;
    switcherStartOverPreferences: StartOverContextMenuKeyOptions;
    hasSubMenu?: boolean
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

// export class StartOverDropdown extends React.Component<StartOverProps, StartOverState> {
//     constructor(props: StartOverProps) {
//         super(props);

//         this.state = {
//             isContextMenuVisible: false,
//         };
//     }

//     public render(): JSX.Element {
//         const direction = this.props.dropdownDirection;

//         return (
//             // <div>
//             //     <InsightsCommandButton
//             //         iconProps={{
//             //             iconName: 'Refresh',
//             //         }}
//             //         text="Start over"
//             //         ariaLabel="start over menu"
//             //         onClick={this.openDropdown}
//             //         menuIconProps={{
//             //             iconName: dropdownDirections[direction].iconName,
//             //         }}
//             //         componentRef={this.props.buttonRef}
//             //     />
//             //     {this.renderContextMenu()}
//             // </div>
//             <div>
//                 <Menu>
//                     <MenuTrigger disableButtonEnhancement>
//                         <MenuButton
//                             appearance="transparent"
//                             className={styles.menuButton}
//                             icon={<FluentUIV9Icon iconName='ArrowClockwiseRegular' />}
//                             aria-label="start over menu"
//                             //className={mergeClasses(styles.commandBarButtonsMenu, styles.menuItem)}
//                             menuIcon={
//                                 direction === 'left' ? (
//                                     <FluentUIV9Icon iconName='ChevronRight20Regular' />
//                                 ) : (
//                                     <FluentUIV9Icon iconName='ChevronDown20Regular' />
//                                 )
//                             }
//                         >
//                             Start over V9
//                         </MenuButton>
//                         {/* <MenuItem
//                             className={mergeClasses(styles.commandBarButtonsMenu, styles.menuItem)}
//                             icon={<ArrowClockwiseRegular className={styles.refreshIcon} />}
//                             aria-label="start over menu"
//                             submenuIndicator={direction === 'left' ? (
//                                 <ChevronRightRegular />
//                             ) : (
//                                 <ChevronDownRegular />
//                             )}
//                         >
//                             Start over
//                         </MenuItem> */}
//                     </MenuTrigger>
//                     <MenuPopover className={styles.menuPopover}>
//                         <MenuList>
//                             {this.getMenuItemsV9().map(item => (
//                                 <MenuItem className={stylesValue.menuItem} key={item.key} {...item}>
//                                     {item.name}
//                                 </MenuItem>
//                             ))}
//                         </MenuList>
//                     </MenuPopover>
//                 </Menu>
//             </div >
//         );
//     }


//     private getMenuItemsV9(): StartOverDropdownMenuItems[] {
//         const {
//             singleTestSuffix,
//             allTestSuffix,
//             rightPanelOptions,
//             switcherStartOverPreferences: startOverButtonOptionPreferences,
//         } = this.props;
//         const items: StartOverDropdownMenuItems[] = [];
//         const assessmentKey = {
//             key: 'assessment',
//             name: `Start over ${allTestSuffix}`,
//             onClick: this.onStartOverAllTestsMenu,
//         };
//         const testKey = {
//             key: 'test',
//             name: `Start over ${singleTestSuffix}`,
//             onClick: this.onStartOverTestMenu,
//         };

//         items.push(assessmentKey);

//         if (rightPanelOptions.showTest && startOverButtonOptionPreferences.showTest) {
//             items.push(testKey);
//         }

//         return items;
//     }

//     private onStartOverTestMenu = (): void => {
//         console.log('clicked2')
//         this.props.openDialog('test');
//     };

//     private onStartOverAllTestsMenu = (): void => {
//         console.log('clicked1')
//         this.props.openDialog('assessment');
//     };
// }


export const StartOverDropdown: React.FC<StartOverProps> = (props) => {
    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
    const stylesValue = StartOverDropdownStyles();
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
    }

    const onStartOverTestMenu = (): void => {
        console.log('clicked2')
        props.openDialog('test');
    };

    const onStartOverAllTestsMenu = (): void => {
        console.log('clicked1')
        props.openDialog('assessment');
    };

    return (
        <div>
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <MenuButton
                        appearance="transparent"
                        className={stylesValue.menuButton}
                        icon={<FluentUIV9Icon iconName='ArrowClockwiseRegular' customClass={stylesValue.menuButton} />}
                        aria-label="start over menu"
                        //className={mergeClasses(styles.commandBarButtonsMenu, styles.menuItem)}
                        menuIcon={
                            direction === 'left' ? (
                                <FluentUIV9Icon iconName='ChevronRight20Regular' />
                            ) : (
                                <FluentUIV9Icon iconName='ChevronDown20Regular' />
                            )
                        }
                    >
                        Start over V9
                    </MenuButton>
                    {/* <MenuItem
                            className={mergeClasses(styles.commandBarButtonsMenu, styles.menuItem)}
                            icon={<ArrowClockwiseRegular className={styles.refreshIcon} />}
                            aria-label="start over menu"
                            submenuIndicator={direction === 'left' ? (
                                <ChevronRightRegular />
                            ) : (
                                <ChevronDownRegular />
                            )}
                        >
                            Start over
                        </MenuItem> */}
                </MenuTrigger>
                <MenuPopover className={stylesValue.menuPopover}>
                    <MenuList>
                        {getMenuItemsV9().map(item => (
                            <MenuItem className={stylesValue.menuItem} key={item.key} {...item}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </MenuList>
                </MenuPopover>
            </Menu>
        </div >
    )
}
