// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { VisualizationType } from '../../common/types/visualization-type';
import {
    CapturedInstanceActionType,
    FailureInstanceData,
    FailureInstancePanelControl,
    FailureInstancePanelControlStoreData,
} from './failure-instance-panel-control';

export type AssessmentInstanceEditAndRemoveControlStoreData = FailureInstancePanelControlStoreData;

export interface AssessmentInstanceEditAndRemoveControlProps {
    storeData: AssessmentInstanceEditAndRemoveControlStoreData;
    test: VisualizationType;
    step: string;
    id: string;
    currentInstance: FailureInstanceData;
    onRemove: (test, step, id) => void;
    onAddPath: (path) => void;
    onEdit: (instanceData, test, step, id) => void;
    onClearPathSnippetData: () => void;
    assessmentsProvider: AssessmentsProvider;
}

export class AssessmentInstanceEditAndRemoveControl extends React.Component<AssessmentInstanceEditAndRemoveControlProps> {
    public render(): JSX.Element {
        return (
            <div>
                <FailureInstancePanelControl
                    storeData={this.props.storeData}
                    step={this.props.step}
                    test={this.props.test}
                    actionType={CapturedInstanceActionType.EDIT}
                    instanceId={this.props.id}
                    failureInstance={this.props.currentInstance}
                    editFailureInstance={this.props.onEdit}
                    addPathForValidation={this.props.onAddPath}
                    clearPathSnippetData={this.props.onClearPathSnippetData}
                    assessmentsProvider={this.props.assessmentsProvider}
                />
                <Link className="remove-button" onClick={this.onRemoveButtonClicked}>
                    <Icon iconName="delete" ariaLabel={'delete instance'} />
                </Link>
            </div>
        );
    }

    protected onRemoveButtonClicked = (event?: React.MouseEvent<any>): void => {
        this.props.onRemove(this.props.test, this.props.step, this.props.id);
    };
}
