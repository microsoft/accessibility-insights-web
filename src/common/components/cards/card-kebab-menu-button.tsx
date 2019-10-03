// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPoint } from '@uifabric/utilities';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { ContextualMenu, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';
import { IssueDetailsTextGenerator } from '../../../background/issue-details-text-generator';
import { DetailsViewActionMessageCreator } from '../../../DetailsView/actions/details-view-action-message-creator';
import { Logger } from '../../logging/logger';
import { NavigatorUtils } from '../../navigator-utils';
import { WindowUtils } from '../../window-utils';
import { Toast } from '../toast';
import { kebabMenuButton } from './card-footer.scss';
import { createDefaultLogger } from '../../logging/default-logger';

export type CardKebabMenuButtonDeps = {
    windowUtils: WindowUtils;
    issueDetailsTextGenerator: IssueDetailsTextGenerator;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    navigatorUtils: NavigatorUtils;
};

export interface CardKebabMenuButtonState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
    showingCopyToast: boolean;
    showNeedsSettingsContent: boolean;
}

export interface CardKebabMenuButtonProps {
    deps: CardKebabMenuButtonDeps;
}

export class CardKebabMenuButton extends React.Component<CardKebabMenuButtonProps, CardKebabMenuButtonState> {
    private logger: Logger = createDefaultLogger();

    constructor(props: CardKebabMenuButtonProps) {
        super(props);

        this.state = {
            isContextMenuVisible: false,
            showingCopyToast: false,
            showNeedsSettingsContent: false,
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
                {this.renderToast()}
            </div>
        );
    }

    public renderToast(): JSX.Element {
        return (
            <>
                {this.state.showingCopyToast ? (
                    <Toast onTimeout={() => this.setState({ showingCopyToast: false })} deps={this.props.deps}>
                        Failure details copied.
                    </Toast>
                ) : null}
            </>
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

    private copyFailureDetails = (event: React.MouseEvent<any>): void => {
        const onClick = this.props.deps.detailsViewActionMessageCreator.copyIssueDetailsClicked;
        if (onClick) {
            onClick(event);
        }

        this.props.deps.navigatorUtils
            .copyToClipboard('The quick brown fox jumps over the lazy dog') // to be changed when we finish the new data format and builder
            .then(() => {
                this.setState({ showingCopyToast: true });
            })
            .catch(() => {
                this.logger.log("Couldn't copy failure details!");
            });
    };

    private openDropdown = (event): void => {
        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false, showingCopyToast: false });
    }
}
