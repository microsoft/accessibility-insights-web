// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { title } from 'content/strings/application';
import { BaseStore } from '../common/base-store';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { AssessmentStoreData } from '../common/types/store-data/assessment-result-data';
import { DetailsViewData } from '../common/types/store-data/details-view-data';
import { TabStoreData } from '../common/types/store-data/tab-store-data';
import { VisualizationStoreData } from '../common/types/store-data/visualization-store-data';
import { GetDetailsRightPanelConfiguration } from './components/details-view-right-panel';
import { GetDetailsSwitcherNavConfiguration } from './components/details-view-switcher-nav';

export class DocumentTitleUpdater {
    constructor(
        private readonly tabStore: BaseStore<TabStoreData>,
        private readonly detailsViewStore: BaseStore<DetailsViewData>,
        private readonly visualizationStore: BaseStore<VisualizationStoreData>,
        private readonly assessmentStore: BaseStore<AssessmentStoreData>,
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
    }

    private onStoreChange = (): void => {
        const documentTitle = this.getDocumentTitle();
        const defaultTitle = title;

        this.doc.title = documentTitle ? `${documentTitle} - ${defaultTitle}` : defaultTitle;
    };

    private getDocumentTitle(): string {
        if (!this.hasAllStoreData() || this.tabStore.getState().isClosed) {
            return '';
        }

        const assessmentStoreData = this.assessmentStore.getState();
        const visualizationStoreData = this.visualizationStore.getState();
        const selectedDetailsViewPivot = visualizationStoreData.selectedDetailsViewPivot;
        const switcherNavConfiguration = this.getDetailsSwitcherNavConfiguration({
            selectedDetailsViewPivot,
        });

        const selectedDetailsView = switcherNavConfiguration.getSelectedDetailsView({
            assessmentStoreData,
            visualizationStoreData,
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
        ].every(store => store.getState() != null);
    }
}
