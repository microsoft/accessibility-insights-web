// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewStore } from 'background/stores/details-view-store';
import { DetailsViewStoreData } from '../../../common/types/store-data/details-view-store-data';
import { DetailsViewRightContentPanelType } from '../../../DetailsView/components/left-nav/details-view-right-content-panel-type';
import { BaseDataBuilder } from './base-data-builder';

export class DetailsViewStoreDataBuilder extends BaseDataBuilder<DetailsViewStoreData> {
    constructor() {
        super();
        this.data = new DetailsViewStore(null, null, null).getDefaultState();
    }

    public withPreviewFeaturesOpen(isPreviewFeaturesOpen: boolean): DetailsViewStoreDataBuilder {
        this.data.currentPanel.isPreviewFeaturesOpen = isPreviewFeaturesOpen;
        return this;
    }

    public withScopingOpen(isScopingOpen: boolean): DetailsViewStoreDataBuilder {
        this.data.currentPanel.isScopingOpen = isScopingOpen;
        return this;
    }

    public withDetailsViewRightContentPanel(
        detailsViewRightContentPanel: DetailsViewRightContentPanelType,
    ): DetailsViewStoreDataBuilder {
        this.data.detailsViewRightContentPanel = detailsViewRightContentPanel;
        return this;
    }

    public withContentOpen(
        isContentOpen: boolean,
        contentPath?: string,
        contentTitle?: string,
    ): DetailsViewStoreDataBuilder {
        this.data.currentPanel.isContentOpen = isContentOpen;
        this.data.contentPath = contentPath || null;
        this.data.contentTitle = contentTitle || null;
        return this;
    }

    public withSettingPanelState(isSettingsOpen: boolean): DetailsViewStoreDataBuilder {
        this.data.currentPanel.isSettingsOpen = isSettingsOpen;
        return this;
    }
}
