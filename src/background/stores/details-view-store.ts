// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { StoreNames } from '../../common/stores/store-names';
import { ICurrentPanel, IDetailsViewData } from '../../common/types/store-data/idetails-view-data';
import { DetailsViewRightContentPanelType } from '../../DetailsView/components/left-nav/details-view-right-content-panel-type';
import { ContentActions } from '../actions/content-actions';
import { DetailsViewActions } from '../actions/details-view-actions';
import { ScopingActions } from '../actions/scoping-actions';
import { PreviewFeaturesActions } from './../actions/preview-features-actions';
import { BaseStore } from './base-store';

export class DetailsViewStore extends BaseStore<IDetailsViewData> {
    constructor(
        private previewFeaturesActions: PreviewFeaturesActions,
        private scopingActions: ScopingActions,
        private contentActions: ContentActions,
        private detailsViewActions: DetailsViewActions,
    ) {
        super(StoreNames.DetailsViewStore);
    }

    public getDefaultState(): IDetailsViewData {
        const data: IDetailsViewData = {
            contentPath: '',
            currentPanel: {
                isPreviewFeaturesOpen: false,
                isScopingOpen: false,
                isContentOpen: false,
                isSettingsOpen: false,
            },
            detailsViewRightContentPanel: 'Overview',
        };

        return data;
    }

    protected addActionListeners(): void {

        this.previewFeaturesActions.openPreviewFeatures.addListener(() => this.onOpen('isPreviewFeaturesOpen'));
        this.previewFeaturesActions.closePreviewFeatures.addListener(() => this.onClose('isPreviewFeaturesOpen'));

        this.scopingActions.openScopingPanel.addListener(() => this.onOpen('isScopingOpen'));
        this.scopingActions.closeScopingPanel.addListener(() => this.onClose('isScopingOpen'));

        this.detailsViewActions.openSettingsPanel.addListener(() => this.onOpen('isSettingsOpen'));
        this.detailsViewActions.closeSettingsPanel.addListener(() => this.onClose('isSettingsOpen'));


        this.contentActions.openContentPanel.addListener(contentPayload => this.onOpen('isContentOpen',
            state => state.contentPath = contentPayload.contentPath));
        this.contentActions.closeContentPanel.addListener(() => this.onClose('isContentOpen',
            state => state.contentPath = null));

        this.detailsViewActions.setSelectedDetailsViewRightContentPanel.addListener(this.onSetSelectedDetailsViewRightContentPanel);
        this.detailsViewActions.getCurrentState.addListener(this.onGetCurrentState);
    }

    @autobind
    private onOpen(flagName: keyof ICurrentPanel, mutator?: (IDetailsViewData) => void): void {
        Object.keys(this.state.currentPanel).forEach(key => { this.state.currentPanel[key] = false; });
        this.state.currentPanel[flagName] = true;

        if (mutator != null) {
            mutator(this.state);
        }

        this.emitChanged();
    }

    @autobind
    private onClose(flagName: keyof ICurrentPanel, mutator?: (IDetailsViewData) => void): void {
        this.state.currentPanel[flagName] = false;

        if (mutator != null) {
            mutator(this.state);
        }
        this.emitChanged();
    }

    @autobind
    private onSetSelectedDetailsViewRightContentPanel(view: DetailsViewRightContentPanelType): void {
        this.state.detailsViewRightContentPanel = view;
        this.emitChanged();
    }
}
