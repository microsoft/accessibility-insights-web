// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
export interface LoadAssessmentButtonProps {

}

export class LoadAssessmentButton extends React.Component<LoadAssessmentButtonProps> {
    public render(): JSX.Element {
        return (
            <InsightsCommandButton
                iconProps={{ iconName: 'FabricOpenFolderHorizontal' }}
            >
                Load Assessment assessment
            </InsightsCommandButton>
        );
    }
}
