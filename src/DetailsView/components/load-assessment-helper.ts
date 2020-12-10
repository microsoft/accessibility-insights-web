// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';

export class LoadAssessmentHelper {
    constructor(private readonly assessmentDataParser: AssessmentDataParser,
    private readonly detailsViewActionMessageCreator: DetailsViewActionMessageCreator) {}

    public getAssessmentForUpload() {
        console.log('clicked')
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

    public onReaderLoad (readerEvent: ProgressEvent<FileReader>) {
        const content = readerEvent.target.result as string;
        const assessmentData = this.assessmentDataParser.parseAssessmentData(content);
        this.detailsViewActionMessageCreator.uploadAssessment(assessmentData);
    };
}
