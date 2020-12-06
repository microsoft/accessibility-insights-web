// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { AssessmentData } from 'common/types/store-data/assessment-result-data';

export type LoadAssessmentButtonDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentDataParser: AssessmentDataParser;
};
export interface LoadAssessmentButtonProps {
    deps: LoadAssessmentButtonDeps;
}

export class LoadAssessmentButton extends React.Component<LoadAssessmentButtonProps> {
    public render(): JSX.Element {
        return (
            <InsightsCommandButton
                iconProps={{ iconName: 'FabricOpenFolderHorizontal' }}
                onClick={this.getAssessmentForUpload}
            >
                Load assessment
            </InsightsCommandButton>
        );
    }

    private getAssessmentForUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.a11ywebassessment';
        input.onchange = e => {
            const file = (e.target as HTMLInputElement).files[0];
            const reader = new FileReader();

            reader.onload = this.onReaderLoad;
            reader.readAsText(file, 'UTF-8');
        };
        input.click();
    };

    private onReaderLoad = (readerEvent: ProgressEvent<FileReader>) => {
        const content = readerEvent.target.result as string;
        const assessmentData = this.props.deps.assessmentDataParser.parseAssessmentData(
            content,
        );
        this.props.deps.detailsViewActionMessageCreator.uploadAssessment(assessmentData)
    };

}
