// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';

export interface SaveAssessmentButtonProps {}

export class SaveAssessmentButton extends React.Component<SaveAssessmentButtonProps> {
    public render(): JSX.Element {
        return (
            <InsightsCommandButton iconProps={{ iconName: 'Save' }}>
                Save assessment
            </InsightsCommandButton>
        );
    }
}
