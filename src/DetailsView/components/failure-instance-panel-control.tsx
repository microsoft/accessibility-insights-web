// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { AssessmentsProvider } from '../../assessments/types/assessments-provider';
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
    addFailureInstance?: (description, path, snippet, test, step) => void;
    editFailureInstance?: (description, path, snippet, test, step, id) => void;
    actionType: CapturedInstanceActionType;
    originalInstance?: FailureInstanceData;
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
        let filledOriginalInstance;
        if (this.props.originalInstance) {
            filledOriginalInstance = {
                failureDescription: this.props.originalInstance.failureDescription,
                path: this.props.originalInstance.path,
                snippet: this.props.originalInstance.snippet,
            };
        } else {
            filledOriginalInstance = { failureDescription: '', path: '', snippet: '' };
        }

        this.state = {
            isPanelOpen: false,
            currentInstance: {
                failureDescription: filledOriginalInstance.failureDescription || '',
                path: filledOriginalInstance.path || '',
                snippet: filledOriginalInstance.snippet || '',
            },
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
                    primaryButtonDisabled={this.state.currentInstance.failureDescription === ''}
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

    private getCurrentInstance = (): FailureInstanceData => {
        const updatedInstance = {
            failureDescription: this.state.currentInstance.failureDescription,
            path: this.state.currentInstance.path,
            snippet: this.state.currentInstance.snippet,
        };

        return updatedInstance;
    };

    protected onFailureDescriptionChange = (event, value: string): void => {
        const updatedInstance = this.getCurrentInstance();
        updatedInstance.failureDescription = value;
        this.setState({ currentInstance: updatedInstance });
    };

    private onSelectorChange = (event, value: string): void => {
        const updatedInstance = this.getCurrentInstance();
        updatedInstance.path = value;
        this.setState({ currentInstance: updatedInstance });
    };

    private onValidateSelector = (event): void => {
        const currSelector = this.state.currentInstance.path;
        const currSnippet = 'snippet for ' + currSelector;
        const updatedInstance = this.getCurrentInstance();
        updatedInstance.snippet = currSnippet;
        this.setState({ currentInstance: updatedInstance });
    };

    protected onAddFailureInstance = (): void => {
        this.props.addFailureInstance(
            this.state.currentInstance.failureDescription,
            this.state.currentInstance.path,
            this.state.currentInstance.snippet,
            this.props.test,
            this.props.step,
        );
        this.setState({ isPanelOpen: false });
    };

    protected onSaveEditedFailureInstance = (): void => {
        this.props.editFailureInstance(
            this.state.currentInstance.failureDescription,
            this.state.currentInstance.path,
            this.state.currentInstance.snippet,
            this.props.test,
            this.props.step,
            this.props.instanceId,
        );
        this.setState({ isPanelOpen: false });
    };

    protected openFailureInstancePanel = (): void => {
        let propsDescription = '';
        let propsPath = '';
        let propsSnippet = '';
        if (this.props.originalInstance) {
            propsDescription = this.props.originalInstance.failureDescription || '';
            propsPath = this.props.originalInstance.path || '';
            propsSnippet = this.props.originalInstance.snippet || '';
        }

        const updatedInstance = this.getCurrentInstance();
        updatedInstance.failureDescription = propsDescription;
        updatedInstance.path = propsPath;
        updatedInstance.snippet = propsSnippet;

        this.setState({
            isPanelOpen: true,
            currentInstance: updatedInstance,
        });
    };

    protected closeFailureInstancePanel = (): void => {
        this.setState({ isPanelOpen: false });
    };
}
