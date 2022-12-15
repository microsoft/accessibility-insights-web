// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { BaseStore } from 'common/base-store';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { GetDetailsSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { NavLinkHandler } from 'DetailsView/components/left-nav/nav-link-handler';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';

export type SharedAssessmentObjects = {
    provider: AssessmentsProvider;
    actionMessageCreator: AssessmentActionMessageCreator;
    navLinkHandler: NavLinkHandler;
    instanceTableHandler: AssessmentInstanceTableHandler;
};

export const NO_STORE_DATA_ERROR = 'no store data';

export class AssessmentFunctionalitySwitcher {
    constructor(
        private readonly visualizationStore: BaseStore<VisualizationStoreData, Promise<void>>,
        private readonly assessmentObjects: SharedAssessmentObjects,
        private readonly quickAssessObjects: SharedAssessmentObjects,
        private readonly getDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration,
    ) {}

    public getAssessmentObjects(): SharedAssessmentObjects {
        return this.assessmentObjects;
    }

    public getQuickAssessObjects(): SharedAssessmentObjects {
        return this.quickAssessObjects;
    }

    public getProvider: () => AssessmentsProvider = () => {
        return this.getSharedObjects().provider;
    };

    public getAssessmentActionMessageCreator: () => AssessmentActionMessageCreator = () => {
        return this.getSharedObjects().actionMessageCreator;
    };

    public getNavLinkHandler: () => NavLinkHandler = () => {
        return this.getSharedObjects().navLinkHandler;
    };

    public getInstanceTableHandler: () => AssessmentInstanceTableHandler = () => {
        return this.getSharedObjects().instanceTableHandler;
    };

    private getSharedObjects(): SharedAssessmentObjects {
        const storeData = this.visualizationStore.getState();

        if (storeData == null) {
            throw new Error(NO_STORE_DATA_ERROR);
        }

        const switcherConfig = this.getDetailsSwitcherNavConfiguration({
            selectedDetailsViewPivot: storeData.selectedDetailsViewPivot,
        });

        return switcherConfig.getSharedAssessmentFunctionalityObjects(this);
    }
}
