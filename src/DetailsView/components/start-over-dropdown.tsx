// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPoint } from '@uifabric/utilities';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { ContextualMenu, IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import * as React from 'react';

import { VisualizationActionMessageCreator } from 'common/message-creators/visualization-action-message-creator';
import { IIconProps } from 'office-ui-fabric-react';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';
import { GenericDialog } from './generic-dialog';

type DialogState = 'none' | 'assessment' | 'test';

export type StartOverDeps = {
    visualizationActionMessageCreator: VisualizationActionMessageCreator;
};

export interface StartOverState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
    dialogState: DialogState;
}

export interface StartOverProps {
    deps: StartOverDeps;
    buttonCaption: string;
    hasDropdown: boolean;
    testName: string;
    actionMessageCreator: DetailsViewActionMessageCreator;
    test: VisualizationType;
    requirementKey: string;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
}

export class StartOverDropdown extends React.Component<StartOverProps, StartOverState> {
    constructor(props: StartOverProps) {
        super(props);

        this.state = {
            isContextMenuVisible: false,
            dialogState: 'none',
        };
    }

    public render(): JSX.Element {
        let menuIconProps: IIconProps = null;
        let onClick;

        if (this.props.hasDropdown) {
            menuIconProps = {
                iconName: 'ChevronDown',
            };
            onClick = this.openDropdown;
        } else {
            onClick = this.onStartOverTestMenu;
        }

        return (
            <div>
                <ActionButton
                    iconProps={{
                        iconName: 'Refresh',
                    }}
                    text={this.props.buttonCaption}
                    ariaLabel="start over menu"
                    onClick={onClick}
                    menuIconProps={menuIconProps}
                />
                {this.renderContextMenu()}
                {this.renderStartOverDialog()}
            </div>
        );
    }

    private renderContextMenu(): JSX.Element {
        if (!this.state.isContextMenuVisible || !this.props.hasDropdown) {
            return null;
        }

        return <ContextualMenu onDismiss={() => this.dismissDropdown()} target={this.state.target} items={this.getMenuItems()} />;
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

        return rightPanelConfiguration.GetStartOverContextualMenuItemKeys().map(key => items.find(item => item.key === key));
    }

    private onStartOverTestMenu = (): void => {
        this.setState({ dialogState: 'test' });
    };

    private onStartOverAllTestsMenu = (): void => {
        this.setState({ dialogState: 'assessment' });
    };

    private renderStartOverDialog(): JSX.Element {
        if (this.state.dialogState === 'none') {
            return null;
        }

        let messageText: string;
        let onPrimaryButtonClick;

        if (this.state.dialogState === 'assessment') {
            messageText =
                'Starting over will clear all existing results from the Assessment. ' +
                'This will clear results and progress of all tests and requirements. ' +
                'Are you sure you want to start over?';
            onPrimaryButtonClick = this.onStartOverAllTests;
        }

        if (this.state.dialogState === 'test') {
            messageText = `Starting over will clear all existing results from the ${this.props.testName} test. Are you sure you want to start over?`;
            onPrimaryButtonClick = this.onStartTestOver;
        }

        return (
            <GenericDialog
                title="Start over"
                messageText={messageText}
                onCancelButtonClick={this.onDismissStartOverDialog}
                onPrimaryButtonClick={onPrimaryButtonClick}
                primaryButtonText="Start over"
            />
        );
    }

    private onDismissStartOverDialog = (event: React.MouseEvent<any>): void => {
        const { actionMessageCreator, requirementKey, test } = this.props;

        if (this.state.dialogState === 'assessment') {
            actionMessageCreator.cancelStartOverAllAssessments(event);
        }

        if (this.state.dialogState === 'test') {
            actionMessageCreator.cancelStartOver(event, test, requirementKey);
        }

        this.setState({ dialogState: 'none' });
    };

    private onStartTestOver = (event: React.MouseEvent<any>): void => {
        const { actionMessageCreator, test, requirementKey } = this.props;

        actionMessageCreator.startOverAssessment(event, test, requirementKey);

        this.setState({ dialogState: 'none' });
    };

    private onStartOverAllTests = (event: React.MouseEvent<any>): void => {
        const { actionMessageCreator } = this.props;

        actionMessageCreator.startOverAllAssessments(event);

        this.setState({ dialogState: 'none' });
    };

    private openDropdown = (event): void => {
        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false });
    }
}
