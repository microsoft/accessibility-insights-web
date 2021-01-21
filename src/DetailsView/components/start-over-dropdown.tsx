// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPoint } from '@uifabric/utilities';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { StartOverDialogType } from 'DetailsView/components/start-over-dialog';
import {
    ContextualMenu,
    DirectionalHint,
    IButton,
    IContextualMenuItem,
    IRefObject,
} from 'office-ui-fabric-react';
import * as React from 'react';

import { DetailsRightPanelConfiguration } from './details-view-right-panel';

export interface StartOverState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
}

export interface StartOverProps {
    testName: string;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    dropdownDirection: DropdownDirection;
    openDialog: (dialogType: StartOverDialogType) => void;
    buttonRef: IRefObject<IButton>;
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

export class StartOverDropdown extends React.Component<StartOverProps, StartOverState> {
    constructor(props: StartOverProps) {
        super(props);

        this.state = {
            isContextMenuVisible: false,
        };
    }

    public render(): JSX.Element {
        const direction = this.props.dropdownDirection;
        return (
            <div>
                <InsightsCommandButton
                    iconProps={{
                        iconName: 'Refresh',
                    }}
                    text="Start over"
                    ariaLabel="start over menu"
                    onClick={this.openDropdown}
                    menuIconProps={{
                        iconName: dropdownDirections[direction].iconName,
                    }}
                    componentRef={this.props.buttonRef}
                />
                {this.renderContextMenu()}
            </div>
        );
    }

    private renderContextMenu(): JSX.Element {
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
        const { testName, rightPanelConfiguration } = this.props;
        const items: IContextualMenuItem[] = [
            {
                key: 'assessment',
                name: 'Start over Assessment',
                onClick: this.onStartOverAllTestsMenu,
            },
            {
                key: 'test',
                name: `Start over ${testName}`,
                onClick: this.onStartOverTestMenu,
            },
        ];

        return rightPanelConfiguration
            .GetStartOverContextualMenuItemKeys()
            .map(key => items.find(item => item.key === key));
    }

    private onStartOverTestMenu = (): void => {
        this.props.openDialog('test');
    };

    private onStartOverAllTestsMenu = (): void => {
        this.props.openDialog('assessment');
    };

    private openDropdown = (event): void => {
        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false });
    }
}
