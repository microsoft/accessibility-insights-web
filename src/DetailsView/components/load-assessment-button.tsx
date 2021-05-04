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
import { LoadAssessmentHelper } from 'DetailsView/components/load-assessment-helper';
import * as React from 'react';

export type LoadAssessmentButtonDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentDataParser: AssessmentDataParser;
    urlParser: UrlParser;
    loadAssessmentHelper: LoadAssessmentHelper;
};
export interface LoadAssessmentButtonProps {
    deps: LoadAssessmentButtonDeps;
    tabStoreData: TabStoreData;
    assessmentStoreData: AssessmentStoreData;
}
export interface LoadAssessmentButtonState {
    newTargetPageData: Tab;
    prevTargetPageData: Tab;
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
            newTargetPageData: this.getNewTab(),
            prevTargetPageData: props.assessmentStoreData.persistedTabInfo,
            show: false,
        };
    }

    private toggleLoadDialog = () => {
        this.setState(prevState => ({ show: !prevState.show }));
    };

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

    private setAssessmentState = (parsedAssessmentData: VersionedAssessmentData) => {
        this.setState(_ => ({
            loadedAssessmentData: parsedAssessmentData,
        }));
    };

    public render(): JSX.Element {
        return (
            <>
                <InsightsCommandButton
                    data-automation-id={loadAssessmentButtonAutomationId}
                    iconProps={{ iconName: 'FabricOpenFolderHorizontal' }}
                    onClick={() =>
                        this.props.deps.loadAssessmentHelper.getAssessmentForLoad(
                            this.setAssessmentState,
                            this.toggleLoadDialog,
                            this.state.prevTargetPageData,
                            this.state.newTargetPageData.id,
                        )
                    }
                >
                    Load assessment
                </InsightsCommandButton>

                <LoadAssessmentDialog
                    {...this.props}
                    tabId={this.props.tabStoreData.id}
                    loadedAssessmentData={this.state.loadedAssessmentData}
                    prevTab={this.state.prevTargetPageData}
                    newTab={this.state.newTargetPageData}
                    show={this.state.show}
                    onClose={this.toggleLoadDialog}
                ></LoadAssessmentDialog>
            </>
        );
    }
}
