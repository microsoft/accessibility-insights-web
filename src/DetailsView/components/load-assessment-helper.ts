// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { Tab } from 'common/itab';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { LoadAssessmentDataValidator } from 'DetailsView/components/load-assessment-data-validator';

export class LoadAssessmentHelper {
    constructor(
        private readonly assessmentDataParser: AssessmentDataParser,
        private readonly detailsViewActionMessageCreator: DetailsViewActionMessageCreator,
        private readonly fileReader: FileReader,
        private readonly document: Document,
        private readonly loadAssessmentDataValidator: LoadAssessmentDataValidator,
    ) {}

    public getAssessmentForLoad(
        setAssessmentState: (versionedAssessmentData: VersionedAssessmentData) => void,
        toggleLoadAssessmentDialog: () => void,
        prevTargetPageData: Tab,
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
                console.log('Invalid JSON');
                //toggle invalid data dialog
                return;
            }

            const validationData =
                this.loadAssessmentDataValidator.uploadedDataIsValid(parsedAssessmentData);

            if (!validationData.dataIsValid) {
                console.log('Invalid JSON schema');
                console.log(validationData.errors);
                //toggle invalid data dialog
                return;
            }

            setAssessmentState(parsedAssessmentData);

            if (prevTargetPageData != null) {
                toggleLoadAssessmentDialog();
            } else {
                this.detailsViewActionMessageCreator.loadAssessment(
                    parsedAssessmentData,
                    newTargetPageId,
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
