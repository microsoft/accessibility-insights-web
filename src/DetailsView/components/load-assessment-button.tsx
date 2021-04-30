// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentDataParser } from 'common/assessment-data-parser';
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { Tab } from 'common/itab';
import {
    AssessmentStoreData,
    PersistedTabInfo,
} from 'common/types/store-data/assessment-result-data';
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
    document: Document;
};
export interface LoadAssessmentButtonProps {
    deps: LoadAssessmentButtonDeps;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
}
export interface LoadAssessmentButtonState {
    newTab: Tab;
    prevTab: PersistedTabInfo;
    loadedAssessmentData?: VersionedAssessmentData;
    show: boolean;
}

export const loadAssessmentButtonAutomationId = 'load-assessment-button';

export class LoadAssessmentButton extends React.Component<
    LoadAssessmentButtonProps,
    LoadAssessmentButtonState
> {
    public constructor(props) {
        super(props);
        this.state = {
            loadedAssessmentData: null,
            newTab: this.getNewTab(),
            prevTab: props.assessmentStoreData.persistedTabInfo,
            show: false,
        };
    }

    private toggleLoadDialog() {
        this.setState(prevState => ({ show: !prevState.show }));
    }

    private getNewTab(): Tab {
        if (this.state !== undefined && this.state.loadedAssessmentData != null) {
            return {
                id: this.state.loadedAssessmentData.assessmentData.persistedTabInfo.id,
                url: this.state.loadedAssessmentData.assessmentData.persistedTabInfo.url,
                title: this.state.loadedAssessmentData.assessmentData.persistedTabInfo.title,
            };
        }

        return {
            id: this.props.tabStoreData.id,
            url: this.props.tabStoreData.url,
            title: this.props.tabStoreData.title,
        };
    }

    public getAssessmentForLoad() {
        const input = this.props.deps.document.createElement('input');
        input.type = 'file';
        input.accept = '.a11ywebassessment';

        const onReaderLoad = (readerEvent: ProgressEvent<FileReader>) => {
            const content = readerEvent.target.result as string;
            this.setState(_ => ({
                loadedAssessmentData: this.props.deps.assessmentDataParser.parseAssessmentData(
                    content,
                ),
            }));
            if (this.state.prevTab != null) {
                this.toggleLoadDialog();
            } else {
                this.props.deps.detailsViewActionMessageCreator.loadAssessment(
                    this.state.loadedAssessmentData,
                    this.state.newTab.id,
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
                    loadedAssessmentData={this.state.loadedAssessmentData}
                    prevTab={this.state.prevTab}
                    newTab={this.state.newTab}
                    show={this.state.show}
                    onClose={this.toggleLoadDialog.bind(this)}
                ></LoadAssessmentDialog>
            </>
        );
    }
}
