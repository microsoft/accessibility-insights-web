// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ContextualMenu,
    DirectionalHint,
    IButton,
    IContextualMenuItem,
    IRefObject,
} from '@fluentui/react';
import { IPoint } from '@fluentui/utilities';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import * as React from 'react';

import { StartOverContextMenuKeyOptions } from './details-view-right-panel';
import { MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';

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
        iconName: 'ChevronDownRegular',
    },
    left: {
        directionalHint: DirectionalHint.leftTopEdge,
        iconName: 'ChevronRightRegular',
    },
};

export type DropdownDirection = keyof typeof dropdownDirections;

export class StartOverDropdown2 extends React.Component<StartOverProps, StartOverState> {
    constructor(props: StartOverProps) {
        super(props);

        this.state = {
            isContextMenuVisible: true,
        };
    }

    public render(): JSX.Element {
        const direction = this.props.dropdownDirection;
        console.log("props in start--->", this.props);

        return (
            <div>
                {/* <MenuPopover>
                    <MenuList>
                     
                        <MenuItem> */}
                {this.renderContextMenu()}
                {/* </MenuItem>
                    </MenuList >
                </MenuPopover > */}
            </div >
        )
        // return (
        //     <div>
        //         <h1>inside h1</h1>
        //         {/* <InsightsCommandButton
        //             // iconProps={{
        //             //     iconName: 'Refresh',
        //             // }}
        //             iconName='ArrowClockwiseRegular'
        //             text="Start over"
        //             aria-label="start over menu"
        //             onClick={this.openDropdown}
        //             menuIconProps={{
        //                 iconName: dropdownDirections[direction].iconName,
        //             }}
        //             componentRef={this.props.buttonRef}
        //         />
        //         {this.state.isContextMenuVisible && this.renderContextMenu()} */}
        //         <MenuTrigger>
        //             <MenuItem>
        //                 {/* <InsightsCommandButton
        //                     // iconProps={{
        //                     //     iconName: 'Refresh',
        //                     // }}
        //                     iconName='ArrowClockwiseRegular'
        //                     text="Start over"
        //                     aria-label="start over menu"
        //                     onClick={this.openDropdown}
        //                     menuIconProps={{
        //                         iconName: dropdownDirections[direction].iconName,
        //                     }}
        //                     componentRef={this.props.buttonRef}
        //                 /> */}
        //                 <h1>inside</h1>
        //             </MenuItem>
        //         </MenuTrigger>
        //         <MenuPopover>
        //             <MenuList>
        //                 {/* 11<MenuItem>{item?.children}</MenuItem> */}
        //                 {this.renderContextMenu()}
        //             </MenuList>
        //         </MenuPopover>
        //     </div>
        // );
    }

    private renderContextMenu(): JSX.Element | null {
        if (!this.state.isContextMenuVisible) {
            return null;
        }

        const direction = this.props.dropdownDirection;

        return (
            <ContextualMenu
                onDismiss={() => this.dismissDropdown()}
                target={this.state.target}
                items={this.getMenuItems()}
                directionalHint={dropdownDirections[direction].directionalHint}
            />
        );
    }

    private getMenuItems(): IContextualMenuItem[] {
        const {
            singleTestSuffix,
            allTestSuffix,
            rightPanelOptions,
            switcherStartOverPreferences: startOverButtonOptionPreferences,
        } = this.props;
        const items: IContextualMenuItem[] = [];
        const assessmentKey = {
            key: 'assessment',
            name: `Start over ${allTestSuffix}`,
            onClick: this.onStartOverAllTestsMenu,
        };
        const testKey = {
            key: 'test',
            name: `Start over ${singleTestSuffix}`,
            onClick: this.onStartOverTestMenu,
        };

        items.push(assessmentKey);

        if (rightPanelOptions.showTest && startOverButtonOptionPreferences.showTest) {
            items.push(testKey);
        }

        console.log('menuItmes', items)

        return items;
    }

    private onStartOverTestMenu = (): void => {
        this.props.openDialog('test');
    };

    private onStartOverAllTestsMenu = (): void => {
        this.props.openDialog('assessment');
    };

    private openDropdown = (event: any): void => {
        // //const currentTarget = { ...event.currentTarget, writingsuggestions: false }

        // delete event.currentTarget.textprediction;
        // //const updatedEvent = { ...event.currentTarget, writingSuggestions: false }
        // Object.assign(event.currentTarget, { writingSuggestions: false })
        // this.setState({ target: event.currentTarget, isContextMenuVisible: true });

        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false });
    }
}
