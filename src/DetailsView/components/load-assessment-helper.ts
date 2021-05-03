// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';

export function getAssessmentForLoad(
    assessmentDataParser: AssessmentDataParser,
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator,
    document: Document,
    setAssessmentState: Function,
    toggleLoadAssessmentDialog: Function,
    prevTargetPageData: PersistedTabInfo,
    newTargetPageId: number,
    fileReader: FileReader,
): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.a11ywebassessment';

    const onReaderLoad = (readerEvent: ProgressEvent<FileReader>) => {
        const content = readerEvent.target.result as string;
        const parsedAssessmentData = assessmentDataParser.parseAssessmentData(content);
        setAssessmentState(parsedAssessmentData);

        if (prevTargetPageData != null) {
            toggleLoadAssessmentDialog();
        } else {
            detailsViewActionMessageCreator.loadAssessment(parsedAssessmentData, newTargetPageId);
        }
    };
    const onInputChange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files[0];
        fileReader.onload = onReaderLoad;
        fileReader.readAsText(file, 'UTF-8');
    };

    input.onchange = onInputChange;
    input.click();
}
