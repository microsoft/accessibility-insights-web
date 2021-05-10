// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import * as React from 'react';

export interface SaveAssessmentButtonDeps {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
}
export interface SaveAssessmentButtonProps {
    download: string;
    href: string;
    deps: SaveAssessmentButtonDeps;
}

export class SaveAssessmentButton extends React.Component<SaveAssessmentButtonProps> {
    public render(): JSX.Element {
        return (
            <InsightsCommandButton
                iconProps={{ iconName: 'Save' }}
                download={this.props.download}
                href={this.props.href}
                onClick={this.props.deps.detailsViewActionMessageCreator.saveAssessment}
            >
                Save assessment
            </InsightsCommandButton>
        );
    }
}
