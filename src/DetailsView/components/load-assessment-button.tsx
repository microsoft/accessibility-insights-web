// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentDataParser } from 'common/assessment-data-parser';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { Tab } from 'common/itab';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { UrlParser } from 'common/url-parser';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { LoadAssessmentDialog } from 'DetailsView/components/load-assessment-dialog';
import * as React from 'react';

export type LoadAssessmentButtonDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentDataParser: AssessmentDataParser;
    urlParser: UrlParser;
    fileReader: FileReader;
};
export interface LoadAssessmentButtonProps {
    deps: LoadAssessmentButtonDeps;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
}
export interface LoadAssessmentButtonState {
    isLoadDialogOpen: boolean;
}

export const loadAssessmentButtonAutomationId = 'load-assessment-button';

export class LoadAssessmentButton extends React.Component<
    LoadAssessmentButtonProps,
    LoadAssessmentButtonState
> {
    private loadedAssessmentData: VersionedAssessmentData;
    public constructor(props) {
        super(props);
        this.state = { isLoadDialogOpen: false };
    }
    public toggleLoadDialog() {
        console.log('TOGGLE LOAD DIALOGGGG');
        console.log(this.state.isLoadDialogOpen);
        this.setState(prevState => ({ isLoadDialogOpen: !prevState.isLoadDialogOpen }));
        console.log(this.state.isLoadDialogOpen);
        console.log('end');
    }

    private getNewTab(): Tab {
        if (this.loadedAssessmentData != null) {
            return {
                id: this.loadedAssessmentData.assessmentData.persistedTabInfo.id,
                url: this.loadedAssessmentData.assessmentData.persistedTabInfo.url,
                title: this.loadedAssessmentData.assessmentData.persistedTabInfo.title,
            };
        }

        return {
            id: this.props.tabStoreData.id,
            url: this.props.tabStoreData.url,
            title: this.props.tabStoreData.title,
        };
    }
    public getAssessmentForLoad() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.a11ywebassessment';
        const persistedTabInfo = this.props.assessmentStoreData.persistedTabInfo;

        const onReaderLoad = (readerEvent: ProgressEvent<FileReader>) => {
            const content = readerEvent.target.result as string;
            this.loadedAssessmentData = this.props.deps.assessmentDataParser.parseAssessmentData(
                content,
            );
            if (persistedTabInfo) {
                this.toggleLoadDialog();
            } else {
                this.props.deps.detailsViewActionMessageCreator.loadAssessment(
                    this.loadedAssessmentData,
                    this.props.tabStoreData.id,
                );
            }
        };
        const onInputChange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files[0];
            this.props.deps.fileReader.onload = onReaderLoad;
            this.props.deps.fileReader.readAsText(file, 'UTF-8');
        };

        input.onchange = onInputChange;
        input.click();
    }

    public render(): JSX.Element {
        return (
            <>
                <InsightsCommandButton
                    data-automation-id={loadAssessmentButtonAutomationId}
                    iconProps={{ iconName: 'FabricOpenFolderHorizontal' }}
                    onClick={() => this.getAssessmentForLoad()}
                >
                    Load assessment
                </InsightsCommandButton>

                <LoadAssessmentDialog
                    {...this.props}
                    tabId={this.props.tabStoreData.id}
                    loadedAssessmentData={this.loadedAssessmentData}
                    prevTab={this.props.assessmentStoreData.persistedTabInfo}
                    newTab={this.getNewTab()}
                    show={this.state.isLoadDialogOpen}
                    onClose={this.toggleLoadDialog}
                ></LoadAssessmentDialog>
            </>
        );
    }
}
