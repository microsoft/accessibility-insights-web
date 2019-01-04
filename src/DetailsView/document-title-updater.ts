// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { title } from '../content/strings/application';
import { VisualizationConfigurationFactory } from './../common/configs/visualization-configuration-factory';
import { IBaseStore } from './../common/istore.d';
import { IAssessmentStoreData } from './../common/types/store-data/iassessment-result-data.d';
import { IDetailsViewData } from './../common/types/store-data/idetails-view-data.d';
import { ITabStoreData } from './../common/types/store-data/itab-store-data.d';
import { IVisualizationStoreData } from './../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from './../common/types/visualization-type';
import { GetDetailsRightPanelConfiguration } from './components/details-view-right-panel';
import { SelectedDetailsViewProvider } from './handlers/selected-details-view-provider';


export class DocumentTitleUpdater {
    constructor(
        private readonly tabStore: IBaseStore<ITabStoreData>,
        private readonly detailsViewStore: IBaseStore<IDetailsViewData>,
        private readonly visualizationStore: IBaseStore<IVisualizationStoreData>,
        private readonly assessmentStore: IBaseStore<IAssessmentStoreData>,
        private readonly getDetailsRightPanelConfiguration: GetDetailsRightPanelConfiguration,
        private readonly visualizationConfigurationFactory: VisualizationConfigurationFactory,
        private readonly selectedDetailsViewHelper: SelectedDetailsViewProvider,
        private readonly doc: Document,
    ) { }

    public initialize() {
        this.tabStore.addChangedListener(this.onStoreChange);
        this.detailsViewStore.addChangedListener(this.onStoreChange);
        this.visualizationStore.addChangedListener(this.onStoreChange);
        this.assessmentStore.addChangedListener(this.onStoreChange);
    }

    @autobind
    private onStoreChange(): void {
        const selectedDetailsView = this.selectedDetailsViewHelper.getSelectedDetailsView({
            assessmentStoreData: this.assessmentStore.getState(),
            visualizationStoreData: this.visualizationStore.getState(),
        });
        const documentTitle = this.getDocumentTitle(selectedDetailsView);
        const defaultTitle = title;

        this.doc.title = documentTitle ? `${documentTitle} - ${defaultTitle}` : defaultTitle;
    }

    private getDocumentTitle(selectedDetailsView: VisualizationType): string {
        if (selectedDetailsView == null ||
            !this.hasAllStoreData() ||
            this.tabStore.getState().isClosed
        ) {
            return '';
        }

        const panel = this.detailsViewStore.getState().detailsViewRightContentPanel;
        const selectedDetailsViewPivot = this.visualizationStore.getState().selectedDetailsViewPivot;
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
