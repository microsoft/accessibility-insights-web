// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import type { AssessmentDataParser } from 'common/assessment-data-parser';
import type { PersistedTabInfo } from 'common/types/store-data/assessment-result-data';
import type { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import type { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import type { LoadAssessmentDataValidator } from 'DetailsView/components/load-assessment-data-validator';

export class LoadAssessmentHelper {
    constructor(
        private readonly assessmentDataParser: AssessmentDataParser,
        private readonly assessmentActionMessageCreator: AssessmentActionMessageCreator,
        private readonly fileReader: FileReader,
        private readonly document: Document,
        private readonly loadAssessmentDataValidator: LoadAssessmentDataValidator,
    ) {}

    public getAssessmentForLoad(
        setAssessmentState: (versionedAssessmentData: VersionedAssessmentData) => void,
        toggleInvalidLoadAssessmentDialog: () => void,
        toggleLoadAssessmentDialog: () => void,
        prevTargetPageData: PersistedTabInfo,
        newTargetPageId: number,
    ): void {
        const input = this.document.createElement('input');
        input.type = 'file';
        input.accept = '.a11ywebassessment';

        const onReaderLoad = (readerEvent: ProgressEvent<FileReader>) => {
            const content = readerEvent.target.result as string;
            let parsedAssessmentData: VersionedAssessmentData;

            try {
                parsedAssessmentData = this.assessmentDataParser.parseAssessmentData(content);
            } catch {
                toggleInvalidLoadAssessmentDialog();
                return;
            }

            const validationData =
                this.loadAssessmentDataValidator.uploadedDataIsValid(parsedAssessmentData);

            if (!validationData.dataIsValid) {
                toggleInvalidLoadAssessmentDialog();
                return;
            }

            setAssessmentState(parsedAssessmentData);

            if (
                prevTargetPageData != null &&
                prevTargetPageData.id &&
                prevTargetPageData.title &&
                prevTargetPageData.url
            ) {
                toggleLoadAssessmentDialog();
            } else {
                this.assessmentActionMessageCreator.loadAssessment(
                    parsedAssessmentData,
                    newTargetPageId,
                    prevTargetPageData?.detailsViewId,
                );
            }
        };
        const onInputChange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files[0];
            this.fileReader.onload = onReaderLoad;
            this.fileReader.readAsText(file, 'UTF-8');
        };

        input.onchange = onInputChange;
        input.click();
    }
}
