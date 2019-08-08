// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { clone, isEqual } from 'lodash';
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { BaseStore } from '../../common/base-store';
import { FlaggedComponent } from '../../common/components/flagged-component';
import { FeatureFlags } from '../../common/feature-flags';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { ActionAndCancelButtonsComponent } from './action-and-cancel-buttons-component';
import { FailureInstancePanelDetails } from './failure-instance-panel-details';
import { GenericPanel, GenericPanelProps } from './generic-panel';

export interface FailureInstancePanelControlProps {
    step: string;
    test: VisualizationType;
    addPathForValidation: (path) => void;
    addFailureInstance?: (instanceData, test, step) => void;
    editFailureInstance?: (instanceData, test, step, id) => void;
    clearPathSnippetData: () => void;
    actionType: CapturedInstanceActionType;
    failureInstance: FailureInstanceData;
    instanceId?: string;
    assessmentsProvider: AssessmentsProvider;
    featureFlagStoreData: BaseStore<FeatureFlagStoreData>;
}

export type FailureInstanceData = {
    failureDescription?: string;
    path?: string;
    snippetError?: boolean;
    snippetValue?: string;
};

export interface FailureInstancePanelControlState {
    isPanelOpen: boolean;
    currentInstance: FailureInstanceData;
}

export enum CapturedInstanceActionType {
    EDIT,
    CREATE,
}

export class FailureInstancePanelControl extends React.Component<FailureInstancePanelControlProps, FailureInstancePanelControlState> {
    private static readonly addFailureInstanceLabel: string = 'Add a failure instance';

    constructor(props) {
        super(props);
        const defaultInstance = this.getDefaultInstance();
        const currentInstance = {
            ...defaultInstance,
            ...this.props.failureInstance,
        };

        this.state = {
            isPanelOpen: false,
            currentInstance: currentInstance,
        };
    }

    public componentDidUpdate(prevProps: Readonly<FailureInstancePanelControlProps>): void {
        if (isEqual(prevProps, this.props) === false) {
            this.setState(() => ({
                currentInstance: {
                    failureDescription: this.state.currentInstance.failureDescription,
                    path: this.props.failureInstance.path,
                    snippetValue: this.props.failureInstance.snippetValue,
                    snippetError: this.props.failureInstance.snippetError,
                },
            }));
        }
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
            hasCloseButton: true,
            closeButtonAriaLabel: 'Close failure instance panel',
            onRenderFooterContent: this.getActionCancelbuttons,
        };

        return (
            <GenericPanel {...panelProps}>
                {testStepConfig.addFailureInstruction}
                <FlaggedComponent
                    enableJSXElement={this.getFailureInstancePanelDetails()}
                    featureFlag={FeatureFlags[FeatureFlags.manualInstanceDetails]}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                />
                <TextField
                    className="observed-failure-textfield"
                    label="Comments"
                    multiline={true}
                    rows={4}
                    value={this.state.currentInstance.failureDescription}
                    onChange={this.onFailureDescriptionChange}
                    resizable={false}
                />
            </GenericPanel>
        );
    }

    private getActionCancelbuttons = (): JSX.Element => {
        return (
            <div className="footer">
                <ActionAndCancelButtonsComponent
                    isHidden={false}
                    primaryButtonDisabled={
                        this.state.currentInstance.failureDescription === null && this.state.currentInstance.path === null
                    }
                    primaryButtonText={this.props.actionType === CapturedInstanceActionType.CREATE ? 'Add failed instance' : 'Save'}
                    primaryButtonOnClick={
                        this.props.actionType === CapturedInstanceActionType.CREATE
                            ? this.onAddFailureInstance
                            : this.onSaveEditedFailureInstance
                    }
                    cancelButtonOnClick={this.closeFailureInstancePanel}
                />
            </div>
        );
    };

    private getFailureInstancePanelDetails = (): JSX.Element => {
        return (
            <FailureInstancePanelDetails
                path={this.state.currentInstance.path}
                snippetValue={this.state.currentInstance.snippetValue}
                snippetError={this.state.currentInstance.snippetError}
                onSelectorChange={this.onSelectorChange}
                onValidateSelector={this.onValidateSelector}
            />
        );
    };

    private getDefaultInstance = (): FailureInstanceData => {
        const defaultInstance = {
            failureDescription: null,
            path: null,
            snippetValue: null,
            snippetError: false,
        };

        return defaultInstance;
    };

    protected onFailureDescriptionChange = (event, value: string): void => {
        const updatedInstance = clone(this.state.currentInstance);
        updatedInstance.failureDescription = value;
        this.setState({ currentInstance: updatedInstance });
    };

    private onSelectorChange = (event, value: string): void => {
        const updatedInstance = clone(this.state.currentInstance);
        updatedInstance.path = value;
        this.setState({ currentInstance: updatedInstance });
    };

    private onValidateSelector = (event): void => {
        this.props.addPathForValidation(this.state.currentInstance.path);
    };

    protected onAddFailureInstance = (): void => {
        this.props.addFailureInstance(this.state.currentInstance, this.props.test, this.props.step);
        this.closeFailureInstancePanel();
    };

    protected onSaveEditedFailureInstance = (): void => {
        this.props.editFailureInstance(this.state.currentInstance, this.props.test, this.props.step, this.props.instanceId);
        this.closeFailureInstancePanel();
    };

    protected openFailureInstancePanel = (): void => {
        const defaultInstance = this.getDefaultInstance();
        const updatedInstance = {
            ...defaultInstance,
            ...this.props.failureInstance,
        };

        this.setState({
            isPanelOpen: true,
            currentInstance: updatedInstance,
        });
    };

    protected closeFailureInstancePanel = (): void => {
        this.props.clearPathSnippetData();
        this.setState({ isPanelOpen: false });
    };
}
