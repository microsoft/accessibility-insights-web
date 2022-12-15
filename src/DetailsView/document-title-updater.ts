// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import { BaseStore } from '../common/base-store';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { DetailsViewStoreData } from '../common/types/store-data/details-view-store-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { GetDetailsRightPanelConfiguration } from './components/details-view-right-panel';
import { GetDetailsSwitcherNavConfiguration } from './components/details-view-switcher-nav';

export class DocumentTitleUpdater {
    constructor(
        private readonly tabStore: BaseStore<TabStoreData, Promise<void>>,
        private readonly detailsViewStore: BaseStore<DetailsViewStoreData, Promise<void>>,
        private readonly visualizationStore: BaseStore<VisualizationStoreData, Promise<void>>,
        private readonly assessmentStore: BaseStore<AssessmentStoreData, Promise<void>>,
        private readonly quickAssessStore: BaseStore<AssessmentStoreData, Promise<void>>,
        private readonly getDetailsRightPanelConfiguration: GetDetailsRightPanelConfiguration,
        private readonly getDetailsSwitcherNavConfiguration: GetDetailsSwitcherNavConfiguration,
        private readonly visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private readonly doc: Document,
    ) {}

    public initialize(): void {
        this.tabStore.addChangedListener(this.onStoreChange);
        this.detailsViewStore.addChangedListener(this.onStoreChange);
        this.visualizationStore.addChangedListener(this.onStoreChange);
        this.assessmentStore.addChangedListener(this.onStoreChange);
        this.quickAssessStore.addChangedListener(this.onStoreChange);
    }

    private onStoreChange = async (): Promise<void> => {
        const documentTitle = this.getDocumentTitle();
        const defaultTitle = title;

        this.doc.title = documentTitle ? `${documentTitle} - ${defaultTitle}` : defaultTitle;
    };

    private getDocumentTitle(): string {
        if (!this.hasAllStoreData() || this.tabStore.getState().isClosed) {
            return '';
        }

        const assessmentStoreData = this.assessmentStore.getState();
        const quickAssessStoreData = this.quickAssessStore.getState();
        const visualizationStoreData = this.visualizationStore.getState();
        const selectedDetailsViewPivot = visualizationStoreData.selectedDetailsViewPivot;
        const switcherNavConfiguration = this.getDetailsSwitcherNavConfiguration({
            selectedDetailsViewPivot,
        });

        const selectedDetailsView = switcherNavConfiguration.getSelectedDetailsView({
            assessmentStoreData,
            visualizationStoreData,
            quickAssessStoreData,
        });

        const panel = this.detailsViewStore.getState().detailsViewRightContentPanel;

        return this.getDetailsRightPanelConfiguration({
            detailsViewRightContentPanel: panel,
            selectedDetailsViewPivot: selectedDetailsViewPivot,
        }).GetTitle({
            visualizationConfigurationFactory: this.visualizationConfigurationFactory,
            selectedDetailsView,
        });
    }

    private hasAllStoreData(): boolean {
        return [
            this.tabStore,
            this.detailsViewStore,
            this.visualizationStore,
            this.assessmentStore,
            this.quickAssessStore,
        ].every(store => store.getState() != null);
    }
}
