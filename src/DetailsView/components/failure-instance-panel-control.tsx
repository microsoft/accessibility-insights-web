// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { clone } from 'lodash';
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
    actionType: CapturedInstanceActionType;
    failureInstance?: FailureInstanceData;
    instanceId?: string;
    assessmentsProvider: AssessmentsProvider;
    featureFlagStoreData: BaseStore<FeatureFlagStoreData>;
}

export type FailureInstanceData = {
    failureDescription?: string;
    path?: string;
    snippet?: string;
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
                <FlaggedComponent
                    enableJSXElement={this.getFailureInstancePanelDetails()}
                    featureFlag={FeatureFlags[FeatureFlags.manualInstanceDetails]}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                />
                <TextField
                    className="observed-failure-textfield"
                    label="Comments"
                    multiline={true}
                    rows={8}
                    value={this.state.currentInstance.failureDescription}
                    onChange={this.onFailureDescriptionChange}
                    resizable={false}
                />
                <ActionAndCancelButtonsComponent
                    isHidden={false}
                    primaryButtonDisabled={this.state.currentInstance.failureDescription === null}
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

    private getFailureInstancePanelDetails = (): JSX.Element => {
        return (
            <FailureInstancePanelDetails
                path={this.state.currentInstance.path}
                snippet={this.state.currentInstance.snippet}
                onSelectorChange={this.onSelectorChange}
                onValidateSelector={this.onValidateSelector}
            />
        );
    };

    private getDefaultInstance = (): FailureInstanceData => {
        const defaultInstance = {
            failureDescription: null,
            path: null,
            snippet: null,
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
        const currSelector = this.state.currentInstance.path;
        const currSnippet = 'snippet for ' + currSelector;
        const updatedInstance = clone(this.state.currentInstance);
        updatedInstance.snippet = currSnippet;
        this.setState({ currentInstance: updatedInstance });
        this.props.addPathForValidation(this.state.currentInstance.path);
    };

    protected onAddFailureInstance = (): void => {
        this.props.addFailureInstance(this.state.currentInstance, this.props.test, this.props.step);
        this.setState({ isPanelOpen: false });
    };

    protected onSaveEditedFailureInstance = (): void => {
        this.props.editFailureInstance(this.state.currentInstance, this.props.test, this.props.step, this.props.instanceId);
        this.setState({ isPanelOpen: false });
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
        this.setState({ isPanelOpen: false });
    };
}
