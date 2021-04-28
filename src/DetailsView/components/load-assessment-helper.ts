// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDataParser } from 'common/assessment-data-parser';
import { BaseStore } from 'common/base-store';
import { Tab } from 'common/itab';
import {
    AssessmentStoreData,
    PersistedTabInfo,
} from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';

export class LoadAssessmentHelper {
    private parsedAssessmentData: VersionedAssessmentData;
    constructor(
        private readonly assessmentDataParser: AssessmentDataParser,
        private readonly detailsViewActionMessageCreator: DetailsViewActionMessageCreator,
        private readonly fileReader: FileReader,
        private readonly document: Document,
        private readonly tabId: number,
        private readonly tabStore: BaseStore<TabStoreData>,
        private readonly assessmentStore: BaseStore<AssessmentStoreData>,
    ) {}

    public getPrevTab(): PersistedTabInfo {
        return this.assessmentStore.getState().persistedTabInfo;
    }

    public getNewTab(): Tab {
        return {
            id: this.tabStore.getState().id,
            url: this.tabStore.getState().url,
            title: this.tabStore.getState().title,
        };
    }

    public getAssessmentForLoad() {
        const input = this.document.createElement('input');
        input.type = 'file';
        input.accept = '.a11ywebassessment';

        const onReaderLoad = (readerEvent: ProgressEvent<FileReader>) => {
            const content = readerEvent.target.result as string;
            this.parsedAssessmentData = this.assessmentDataParser.parseAssessmentData(content);
            // readerEvent.
        };
        const onInputChange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files[0];
            this.fileReader.onload = onReaderLoad;
            this.fileReader.readAsText(file, 'UTF-8');
        };

        input.onchange = onInputChange;
        input.click();
    }

    public loadAssessment() {
        this.detailsViewActionMessageCreator.loadAssessment(this.parsedAssessmentData, this.tabId);
    }
}
