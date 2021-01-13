// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FlaggedComponent } from 'common/components/flagged-component';
import { FeatureFlags } from 'common/feature-flags';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { clone, isEqual } from 'lodash';
import { ActionButton } from 'office-ui-fabric-react';
import { Icon } from 'office-ui-fabric-react';
import { ILabelStyles } from 'office-ui-fabric-react';
import { Link } from 'office-ui-fabric-react';
import { ITextFieldStyles, TextField } from 'office-ui-fabric-react';
import * as React from 'react';

import { ActionAndCancelButtonsComponent } from './action-and-cancel-buttons-component';
import { FailureInstancePanelDetails } from './failure-instance-panel-details';
import * as styles from './failure-instance-panel.scss';
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
    featureFlagStoreData: FeatureFlagStoreData;
}

export interface FailureInstancePanelControlState {
    isPanelOpen: boolean;
    currentInstance: FailureInstanceData;
}

export enum CapturedInstanceActionType {
    EDIT,
    CREATE,
}

export class FailureInstancePanelControl extends React.Component<
    FailureInstancePanelControlProps,
    FailureInstancePanelControlState
> {
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

    public componentDidMount(): void {
        this.props.clearPathSnippetData();
    }

    public componentDidUpdate(prevProps: Readonly<FailureInstancePanelControlProps>): void {
        if (isEqual(prevProps, this.props) === false) {
            this.setState((prevState, prevProps) => ({
                currentInstance: {
                    failureDescription: prevState.currentInstance.failureDescription,
                    path: prevProps.failureInstance.path,
                    snippet: prevProps.failureInstance.snippet,
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
                <Link className={styles.editButton} onClick={this.openFailureInstancePanel}>
                    <Icon iconName="edit" ariaLabel={'edit instance'} />
                </Link>
            );
        }
    }

    private renderPanel(): JSX.Element {
        const testStepConfig = this.props.assessmentsProvider.getStep(
            this.props.test,
            this.props.step,
        );

        const panelProps: GenericPanelProps = {
            isOpen: this.state.isPanelOpen,
            className: styles.failureInstancePanel,
            onDismiss: this.closeFailureInstancePanel,
            headerText:
                this.props.actionType === CapturedInstanceActionType.CREATE
                    ? FailureInstancePanelControl.addFailureInstanceLabel
                    : 'Edit failure instance',
            hasCloseButton: true,
            closeButtonAriaLabel: 'Close failure instance panel',
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
                    className={styles.observedFailureTextfield}
                    label="Comment"
                    styles={getStyles}
                    multiline={true}
                    rows={8}
                    value={this.state.currentInstance.failureDescription}
                    onChange={this.onFailureDescriptionChange}
                    resizable={false}
                    placeholder="Comment"
                />
                {this.getActionCancelButtons()}
            </GenericPanel>
        );
    }

    private getActionCancelButtons = (): JSX.Element => {
        let primaryButtonText = 'Save';
        let primaryButtonOnClick = this.onSaveEditedFailureInstance;

        if (this.props.actionType === CapturedInstanceActionType.CREATE) {
            primaryButtonText = 'Add failed instance';
            primaryButtonOnClick = this.onAddFailureInstance;
        }

        return (
            <div>
                <ActionAndCancelButtonsComponent
                    isHidden={false}
                    primaryButtonDisabled={
                        this.state.currentInstance.failureDescription === null &&
                        this.state.currentInstance.path === null
                    }
                    primaryButtonText={primaryButtonText}
                    primaryButtonOnClick={primaryButtonOnClick}
                    cancelButtonOnClick={this.closeFailureInstancePanel}
                />
            </div>
        );
    };

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
        this.setState(prevState => {
            const updatedInstance = clone(prevState.currentInstance);
            updatedInstance.failureDescription = value;

            return { currentInstance: updatedInstance };
        });
    };

    private onSelectorChange = (event, value: string): void => {
        this.setState(prevState => {
            const updatedInstance = clone(prevState.currentInstance);
            updatedInstance.path = value;

            return { currentInstance: updatedInstance };
        });
    };

    private onValidateSelector = (event): void => {
        this.props.addPathForValidation(this.state.currentInstance.path);
    };

    protected onAddFailureInstance = (): void => {
        this.props.addFailureInstance(this.state.currentInstance, this.props.test, this.props.step);
        this.closeFailureInstancePanel();
    };

    protected onSaveEditedFailureInstance = (): void => {
        this.props.editFailureInstance(
            this.state.currentInstance,
            this.props.test,
            this.props.step,
            this.props.instanceId,
        );
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

function getStyles(): Partial<ITextFieldStyles> {
    return {
        subComponentStyles: {
            label: getLabelStyles,
        },
    };
}

function getLabelStyles(): ILabelStyles {
    return {
        root: [
            {
                paddingBottom: 8,
            },
        ],
    };
}
