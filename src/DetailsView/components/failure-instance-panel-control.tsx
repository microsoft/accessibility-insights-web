// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';

import { AssessmentsProvider } from '../../assessments/types/assessments-provider';
import { Requirement } from '../../assessments/types/requirement';
import { BaseStore } from '../../common/base-store';
import { FlaggedComponent } from '../../common/components/flagged-component';
import { FeatureFlags } from '../../common/feature-flags';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
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
    assessmentsProvider: AssessmentsProvider;
    featureFlagStoreData: BaseStore<FeatureFlagStoreData>;
}

export interface FailureInstancePanelControlState {
    isPanelOpen: boolean;
    failureDescription: string;
    selector: string;
    snippet: string;
}

export enum CapturedInstanceActionType {
    EDIT,
    CREATE,
}

export class FailureInstancePanelControl extends React.Component<FailureInstancePanelControlProps, FailureInstancePanelControlState> {
    private static readonly addFailureInstanceLabel: string = 'Add a failure instance';

    constructor(props) {
        super(props);
        this.state = {
            isPanelOpen: false,
            failureDescription: this.props.originalText || '',
            selector: '',
            snippet: '',
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
                    enableJSXElement={this.getSelectorAndSnippet()}
                    featureFlag={FeatureFlags[FeatureFlags.manualInstanceDetails]}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                />
                <TextField
                    className="observed-failure-textfield"
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

    private getSelectorAndSnippet = (): JSX.Element => {
        return (
            <div>
                <a className="learn-more"> Learn more about adding failure instances </a>
                <TextField
                    className="selector-failure-textfield"
                    label="CSS Selector"
                    multiline={true}
                    rows={8}
                    value={this.state.selector}
                    onChange={this.onSelectorChange}
                    resizable={false}
                    defaultValue="CSS selector"
                />
                <div>Note: If the CSS selector maps to multiple snippets, the first will be selected.</div>
                <div>
                    <DefaultButton text="Validate CSS selector" onClick={this.onValidateSelector} disabled={this.state.selector === ''} />
                </div>
                <div>
                    <label>Code Snippet</label>
                    <div>{this.state.snippet}</div>
                </div>
            </div>
        );
    };

    protected onFailureDescriptionChange = (event, value: string): void => {
        this.setState({ failureDescription: value });
    };

    private onSelectorChange = (event, value: string): void => {
        this.setState({ selector: value });
    };

    private onValidateSelector = (event): void => {
        const currSelector = this.state.selector;
        this.setState({ snippet: 'snippet for ' + currSelector });
    };

    protected onAddFailureInstance = (): void => {
        this.props.addFailureInstance(this.state.failureDescription, this.props.test, this.props.step);
        this.setState({ isPanelOpen: false });
    };

    protected onSaveEditedFailureInstance = (): void => {
        this.props.editFailureInstance(this.state.failureDescription, this.props.test, this.props.step, this.props.instanceId);
        this.setState({ isPanelOpen: false });
    };

    protected openFailureInstancePanel = (): void => {
        this.setState({ isPanelOpen: true, failureDescription: this.props.originalText || '' });
    };

    protected closeFailureInstancePanel = (): void => {
        this.setState({ isPanelOpen: false });
    };
}
