// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';

export type CardViewResultsHandlerCallback = (issuesEnabled: boolean, cardCount: number) => void;

export class CardViewResultsHandler {
    public fastPassHandleCardViewResults(
        detailsViewActionMessageCreator: DetailsViewActionMessageCreator,
        visualizationStoreData: VisualizationStoreData,
    ): CardViewResultsHandlerCallback {
        const callback: CardViewResultsHandlerCallback = (
            issuesEnabled: boolean,
            cardCount: number,
        ): void => {
            if (!issuesEnabled && cardCount > 0) {
                detailsViewActionMessageCreator.enableFastPassVisualHelperWithoutScan(
                    visualizationStoreData.selectedFastPassDetailsView,
                );
            }
            if (!issuesEnabled && cardCount === 0) {
                detailsViewActionMessageCreator.rescanVisualizationWithoutTelemetry(
                    visualizationStoreData.selectedFastPassDetailsView,
                );
            }
        };
        return callback;
    }

    public getAssessmentHandleCardViewResults(
        assessmentActionMessageCreator: AssessmentActionMessageCreator,
        assessmentStoreData: AssessmentStoreData,
    ): CardViewResultsHandlerCallback {
        const callback: CardViewResultsHandlerCallback = (
            issuesEnabled: boolean,
            cardCount: number,
        ): void => {
            if (!issuesEnabled && cardCount === 0) {
                assessmentActionMessageCreator.startOverTestWithoutTelemetry(
                    assessmentStoreData?.assessmentNavState?.selectedTestType,
                );
            }
        };
        return callback;
    }
}
