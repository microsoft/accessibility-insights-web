// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
export interface SaveAssessmentButtonProps {
    // getAssessment: (e) => void;
}

export class SaveAssessmentButton extends React.Component<SaveAssessmentButtonProps> {
    public render(): JSX.Element {
        return (
            <InsightsCommandButton
                iconProps={{ iconName: 'Save' }}
                // onClick={this.props.getAssessment}
            >
                Save assessment
            </InsightsCommandButton>
        );
    }
}
