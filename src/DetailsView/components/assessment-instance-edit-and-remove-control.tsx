// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from '@fluentui/react';
import { Link } from '@fluentui/react-components';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import * as React from 'react';
import styles from './assessment-instance-edit-and-remove-control.scss';
import { FailureInstancePanelControl } from './failure-instance-panel-control';

export interface AssessmentInstanceEditAndRemoveControlProps {
    test: VisualizationType;
    step: string;
    id: string;
    currentInstance: FailureInstanceData;
    onRemove: (test, step, id) => void;
    onAddPath: (path) => void;
    onEdit: (instanceData, test, step, id) => void;
    onClearPathSnippetData: () => void;
    assessmentsProvider: AssessmentsProvider;
    featureFlagStoreData: FeatureFlagStoreData;
}

export class AssessmentInstanceEditAndRemoveControl extends React.Component<AssessmentInstanceEditAndRemoveControlProps> {
    public render(): JSX.Element {
        return (
            <div>
                <FailureInstancePanelControl
                    step={this.props.step}
                    test={this.props.test}
                    actionType={CapturedInstanceActionType.EDIT}
                    instanceId={this.props.id}
                    failureInstance={this.props.currentInstance}
                    editFailureInstance={this.props.onEdit}
                    addPathForValidation={this.props.onAddPath}
                    clearPathSnippetData={this.props.onClearPathSnippetData}
                    assessmentsProvider={this.props.assessmentsProvider}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                />
                <Link className={styles.removeButton} onClick={this.onRemoveButtonClicked}>
                    <Icon iconName="delete" ariaLabel={'delete instance'} />
                </Link>
            </div>
        );
    }

    protected onRemoveButtonClicked = (event?: React.MouseEvent<any>): void => {
        this.props.onRemove(this.props.test, this.props.step, this.props.id);
    };
}
