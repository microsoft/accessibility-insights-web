// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import * as React from 'react';
export interface SaveAssessmentButtonProps {
    download: string;
    href: string;
}

export class SaveAssessmentButton extends React.Component<SaveAssessmentButtonProps> {
    public render(): JSX.Element {
        return (
            <InsightsCommandButton
                iconProps={{ iconName: 'Save' }}
                download={this.props.download}
                href={this.props.href}
            >
                Save assessment
            </InsightsCommandButton>
        );
    }
}
