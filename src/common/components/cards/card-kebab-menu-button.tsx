// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPoint } from '@uifabric/utilities';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { ContextualMenu, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';
import { kebabMenuButton } from './card-footer.scss';

export interface CardKebabMenuButtonState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
}

export interface CardKebabMenuButtonProps {}

export class CardKebabMenuButton extends React.Component<CardKebabMenuButtonProps, CardKebabMenuButtonState> {
    constructor(props: CardKebabMenuButtonProps) {
        super(props);

        this.state = {
            isContextMenuVisible: false,
        };
    }

    public render(): JSX.Element {
        return (
            <div className={kebabMenuButton}>
                <ActionButton
                    iconProps={{
                        iconName: 'moreVertical',
                    }}
                    onClick={this.openDropdown}
                />
                {this.renderContextMenu()}
            </div>
        );
    }

    private renderContextMenu(): JSX.Element {
        if (!this.state.isContextMenuVisible) {
            return null;
        }

        return <ContextualMenu onDismiss={() => this.dismissDropdown()} target={this.state.target} items={this.getMenuItems()} />;
    }

    private getMenuItems(): IContextualMenuItem[] {
        const items: IContextualMenuItem[] = [
            {
                key: 'fileissue',
                name: 'File issue',
                iconProps: {
                    iconName: 'ladybugSolid',
                },
                onClick: this.fileIssue,
            },
            {
                key: 'copyfailuredetails',
                name: `Copy failure details`,
                iconProps: {
                    iconName: 'copy',
                },
                onClick: this.copyFailureDetails,
            },
        ];

        return items;
    }

    private fileIssue = (): void => {
        // todo
    };

    private copyFailureDetails = (): void => {
        // todo
    };

    private openDropdown = (event): void => {
        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false });
    }
}
