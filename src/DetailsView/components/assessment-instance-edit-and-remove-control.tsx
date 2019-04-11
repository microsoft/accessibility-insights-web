// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

import { AssessmentsProvider } from '../../assessments/types/assessments-provider';
import { VisualizationType } from '../../common/types/visualization-type';
import { CapturedInstanceActionType, FailureInstancePanelControl } from './failure-instance-panel-control';

export interface AssessmentInstanceEditAndRemoveControlProps {
    test: VisualizationType;
    step: string;
    id: string;
    description: string;
    onRemove: (test, step, id) => void;
    onEdit: (description, test, step, id) => void;
    assessmentsProvider: AssessmentsProvider;
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
                    editFailureInstance={this.props.onEdit}
                    originalText={this.props.description}
                    assessmentsProvider={this.props.assessmentsProvider}
                />
                <Link className="remove-button" onClick={this.onRemoveButtonClicked}>
                    <Icon iconName="delete" ariaLabel={'delete instance'} />
                </Link>
            </div>
        );
    }

    @autobind
    protected onRemoveButtonClicked(event?: React.MouseEvent<any>): void {
        this.props.onRemove(this.props.test, this.props.step, this.props.id);
    }
}
