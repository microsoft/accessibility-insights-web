// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPoint } from '@uifabric/utilities';
import { ContextualMenu, DirectionalHint, IContextualMenuItem } from 'office-ui-fabric-react';
import * as React from 'react';

import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { DetailsRightPanelConfiguration } from './details-view-right-panel';
import { GenericDialog } from './generic-dialog';

type DialogState = 'none' | 'assessment' | 'test';

export interface StartOverState {
    isContextMenuVisible: boolean;
    target?: HTMLElement | string | MouseEvent | IPoint | null;
    dialogState: DialogState;
}

export type StartOverDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface StartOverProps {
    deps: StartOverDeps;
    testName: string;
    test: VisualizationType;
    requirementKey: string;
    rightPanelConfiguration: DetailsRightPanelConfiguration;
    dropdownDirection: DropdownDirection;
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
            dialogState: 'none',
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
                />
                {this.renderContextMenu()}
                {this.renderStartOverDialog()}
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
        const detailsViewActionMessageCreator = this.props.deps.detailsViewActionMessageCreator;
        const { requirementKey, test } = this.props;

        if (this.state.dialogState === 'assessment') {
            detailsViewActionMessageCreator.cancelStartOverAllAssessments(event);
        }

        if (this.state.dialogState === 'test') {
            detailsViewActionMessageCreator.cancelStartOver(event, test, requirementKey);
        }

        this.setState({ dialogState: 'none' });
    };

    private onStartTestOver = (event: React.MouseEvent<any>): void => {
        const detailsViewActionMessageCreator = this.props.deps.detailsViewActionMessageCreator;
        const { test } = this.props;

        detailsViewActionMessageCreator.startOverTest(event, test);

        this.setState({ dialogState: 'none' });
    };

    private onStartOverAllTests = (event: React.MouseEvent<any>): void => {
        const detailsViewActionMessageCreator = this.props.deps.detailsViewActionMessageCreator;

        detailsViewActionMessageCreator.startOverAllAssessments(event);

        this.setState({ dialogState: 'none' });
    };

    private openDropdown = (event): void => {
        this.setState({ target: event.currentTarget, isContextMenuVisible: true });
    };

    private dismissDropdown(): void {
        this.setState({ target: null, isContextMenuVisible: false });
    }
}
