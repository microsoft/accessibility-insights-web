// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SidePanel, SidePanelActions } from 'background/actions/side-panel-actions';
import { StoreNames } from 'common/stores/store-names';
import { CurrentPanel } from 'common/types/store-data/current-panel';
import { DetailsViewStoreData } from 'common/types/store-data/details-view-store-data';
import { DetailsViewRightContentPanelType } from 'DetailsView/components/left-nav/details-view-right-content-panel-type';
import { ContentActions } from '../actions/content-actions';
import { DetailsViewActions } from '../actions/details-view-actions';
import { ScopingActions } from '../actions/scoping-actions';
import { PreviewFeaturesActions } from './../actions/preview-features-actions';
import { BaseStoreImpl } from './base-store-impl';

export class DetailsViewStore extends BaseStoreImpl<DetailsViewStoreData> {
    constructor(
        private previewFeaturesActions: PreviewFeaturesActions,
        private scopingActions: ScopingActions,
        private contentActions: ContentActions,
        private detailsViewActions: DetailsViewActions,
        private sidePanelActions?: SidePanelActions,
    ) {
        super(StoreNames.DetailsViewStore);
    }

    public getDefaultState(): DetailsViewStoreData {
        const data: DetailsViewStoreData = {
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
        this.previewFeaturesActions.openPreviewFeatures.addListener(() =>
            this.onOpen('isPreviewFeaturesOpen'),
        );
        this.previewFeaturesActions.closePreviewFeatures.addListener(() =>
            this.onClose('isPreviewFeaturesOpen'),
        );

        this.scopingActions.openScopingPanel.addListener(() => this.onOpen('isScopingOpen'));
        this.scopingActions.closeScopingPanel.addListener(() => this.onClose('isScopingOpen'));

        this.detailsViewActions.openSettingsPanel.addListener(() => this.onOpen('isSettingsOpen'));
        this.detailsViewActions.closeSettingsPanel.addListener(() =>
            this.onClose('isSettingsOpen'),
        );

        this.contentActions.openContentPanel.addListener(contentPayload =>
            this.onOpen('isContentOpen', state => (state.contentPath = contentPayload.contentPath)),
        );
        this.contentActions.closeContentPanel.addListener(() =>
            this.onClose('isContentOpen', state => (state.contentPath = null)),
        );

        this.detailsViewActions.setSelectedDetailsViewRightContentPanel.addListener(
            this.onSetSelectedDetailsViewRightContentPanel,
        );
        this.detailsViewActions.getCurrentState.addListener(this.onGetCurrentState);

        this.sidePanelActions.openPanel.addListener(this.onOpenPanel);
    }

    private sidePanelToStateKey = {
        Settings: 'isSettingsOpen',
        PreviewFeatures: 'isPreviewFeaturesOpen',
        Scoping: 'isScopingOpen',
        Content: 'isContentOpen',
    };

    private onOpenPanel = (sidePanel: SidePanel) => {
        console.log('SEBAX');
        console.log('sidePanel', sidePanel);

        const stateKey = this.sidePanelToStateKey[sidePanel];

        let mutator: (data: DetailsViewStoreData) => void;

        if (sidePanel === 'Content') {
            mutator = state => (state.contentPath = null);
        }

        console.log('mutator', mutator);

        this.onOpen(stateKey, mutator);
    };

    private onOpen = (
        flagName: keyof CurrentPanel,
        mutator?: (data: DetailsViewStoreData) => void,
    ): void => {
        Object.keys(this.state.currentPanel).forEach(key => {
            this.state.currentPanel[key] = false;
        });

        this.state.currentPanel[flagName] = true;

        if (mutator != null) {
            mutator(this.state);
        }

        this.emitChanged();
    };

    private onClose = (
        flagName: keyof CurrentPanel,
        mutator?: (data: DetailsViewStoreData) => void,
    ): void => {
        this.state.currentPanel[flagName] = false;

        if (mutator != null) {
            mutator(this.state);
        }

        this.emitChanged();
    };

    private onSetSelectedDetailsViewRightContentPanel = (
        view: DetailsViewRightContentPanelType,
    ): void => {
        this.state.detailsViewRightContentPanel = view;
        this.emitChanged();
    };
}
