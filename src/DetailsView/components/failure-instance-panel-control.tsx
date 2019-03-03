// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { VisualizationType } from '../../common/types/visualization-type';
import { ActionAndCancelButtonsComponent } from './action-and-cancel-buttons-component';
import { GenericPanel, GenericPanelProps } from './generic-panel';

export interface FailureInstancePanelControlProps {
    step: string;
    test: VisualizationType;
    addFailureInstance?: (description, test, step) => void;
    editFailureInstance?: (description, test, step, id) => void;
    actionType: CapturedInstanceActionType;
    instanceId?: string;
    originalText?: string;
    assessmentsProvider: IAssessmentsProvider;
}

// tslint:disable-next-line:interface-name
export interface IFailureInstancePanelControlState {
    isPanelOpen: boolean;
    failureDescription: string;
}

export enum CapturedInstanceActionType {
    EDIT,
    CREATE,
}

export class FailureInstancePanelControl extends React.Component<FailureInstancePanelControlProps, IFailureInstancePanelControlState> {
    private static readonly addFailureInstanceLabel: string = 'Add a failure instance';

    constructor(props) {
        super(props);
        this.state = {
            isPanelOpen: false,
            failureDescription: this.props.originalText || '',
        };
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>
                {this.renderButton()}
                {this.renderPanel()}
            </React.Fragment>
        );
    }

    private renderButton(): JSX.Element {
        if (this.props.actionType === CapturedInstanceActionType.CREATE) {
            return (
                <ActionButton
                    ariaLabel={FailureInstancePanelControl.addFailureInstanceLabel}
                    ariaDescription="Open add a failure instance panel"
                    iconProps={{ iconName: 'Add' }}
                    onClick={this.openFailureInstancePanel}
                >
                    {FailureInstancePanelControl.addFailureInstanceLabel}
                </ActionButton>
            );
        } else {
            return (
                <Link className="edit-button" onClick={this.openFailureInstancePanel}>
                    <Icon iconName="edit" ariaLabel={'edit instance'} />
                </Link>
            );
        }
    }

    private renderPanel(): JSX.Element {
        const testStepConfig = this.props.assessmentsProvider.getStep(this.props.test, this.props.step);

        const panelProps: GenericPanelProps = {
            isOpen: this.state.isPanelOpen,
            className: 'failure-instance-panel',
            onDismiss: this.closeFailureInstancePanel,
            title:
                this.props.actionType === CapturedInstanceActionType.CREATE
                    ? FailureInstancePanelControl.addFailureInstanceLabel
                    : 'Edit failure instance',
            hasCloseButton: false,
            closeButtonAriaLabel: null,
        };

        return (
            <GenericPanel {...panelProps}>
                {testStepConfig.addFailureInstruction}
                <TextField
                    label="Observed failure"
                    multiline={true}
                    rows={8}
                    value={this.state.failureDescription}
                    onChange={this.onFailureDescriptionChange}
                    resizable={false}
                />
                <ActionAndCancelButtonsComponent
                    isHidden={false}
                    primaryButtonDisabled={this.state.failureDescription === ''}
                    primaryButtonText={this.props.actionType === CapturedInstanceActionType.CREATE ? 'Add' : 'Save'}
                    primaryButtonOnClick={
                        this.props.actionType === CapturedInstanceActionType.CREATE
                            ? this.onAddFailureInstance
                            : this.onSaveEditedFailureInstance
                    }
                    cancelButtonOnClick={this.closeFailureInstancePanel}
                />
            </GenericPanel>
        );
    }

    @autobind
    protected onFailureDescriptionChange(event, value: string): void {
        this.setState({ failureDescription: value });
    }

    @autobind
    protected onAddFailureInstance(): void {
        this.props.addFailureInstance(this.state.failureDescription, this.props.test, this.props.step);
        this.setState({ isPanelOpen: false });
    }

    @autobind
    protected onSaveEditedFailureInstance(): void {
        this.props.editFailureInstance(this.state.failureDescription, this.props.test, this.props.step, this.props.instanceId);
        this.setState({ isPanelOpen: false });
    }

    @autobind
    protected openFailureInstancePanel(): void {
        this.setState({ isPanelOpen: true, failureDescription: this.props.originalText || '' });
    }

    @autobind
    protected closeFailureInstancePanel(): void {
        this.setState({ isPanelOpen: false });
    }
}
