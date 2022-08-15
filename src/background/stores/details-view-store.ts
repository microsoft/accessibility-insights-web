// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { SidePanel } from 'background/stores/side-panel';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import { CurrentPanel } from 'common/types/store-data/current-panel';
import { DetailsViewRightContentPanelType } from 'common/types/store-data/details-view-right-content-panel-type';
import { DetailsViewStoreData } from 'common/types/store-data/details-view-store-data';
import { ContentActions } from '../actions/content-actions';
import { DetailsViewActions } from '../actions/details-view-actions';

type SidePanelToStoreKey = {
    [P in SidePanel]: keyof DetailsViewStoreData['currentPanel'];
};

export class DetailsViewStore extends PersistentStore<DetailsViewStoreData> {
    constructor(
        private contentActions: ContentActions,
        private detailsViewActions: DetailsViewActions,
        private sidePanelActions: SidePanelActions,
        persistedState: DetailsViewStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
        persistStoreData: boolean,
    ) {
        super(
            StoreNames.DetailsViewStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.detailsViewStore(tabId),
            logger,
            persistStoreData,
        );
    }

    public getDefaultState(): DetailsViewStoreData {
        const data: DetailsViewStoreData = {
            contentPath: '',
            contentTitle: '',
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
        this.contentActions.openContentPanel.addListener(contentPayload =>
            this.onOpen('isContentOpen', state => {
                state.contentPath = contentPayload.contentPath;
                state.contentTitle = contentPayload.contentTitle;
            }),
        );
        this.contentActions.closeContentPanel.addListener(() =>
            this.onClose('isContentOpen', state => {
                state.contentPath = null;
                state.contentTitle = null;
            }),
        );

        this.detailsViewActions.setSelectedDetailsViewRightContentPanel.addListener(
            this.onSetSelectedDetailsViewRightContentPanel,
        );
        this.detailsViewActions.getCurrentState.addListener(this.onGetCurrentState);

        this.sidePanelActions.openSidePanel.addListener(this.onOpenSidePanel);
        this.sidePanelActions.closeSidePanel.addListener(this.onCloseSidePanel);
    }

    private sidePanelToStateKey: SidePanelToStoreKey = {
        Settings: 'isSettingsOpen',
        PreviewFeatures: 'isPreviewFeaturesOpen',
        Scoping: 'isScopingOpen',
    };

    private onOpenSidePanel = async (sidePanel: SidePanel): Promise<void> => {
        const stateKey = this.sidePanelToStateKey[sidePanel];

        await this.onOpen(stateKey);
    };

    private onOpen = async (
        flagName: keyof CurrentPanel,
        mutator?: (data: DetailsViewStoreData) => void,
    ): Promise<void> => {
        Object.keys(this.state.currentPanel).forEach(key => {
            this.state.currentPanel[key] = false;
        });

        this.state.currentPanel[flagName] = true;

        if (mutator != null) {
            mutator(this.state);
        }

        this.emitChanged();
    };

    private onCloseSidePanel = async (sidePanel: SidePanel): Promise<void> => {
        const stateKey = this.sidePanelToStateKey[sidePanel];

        await this.onClose(stateKey);
    };

    private onClose = async (
        flagName: keyof CurrentPanel,
        mutator?: (data: DetailsViewStoreData) => void,
    ): Promise<void> => {
        this.state.currentPanel[flagName] = false;

        if (mutator != null) {
            mutator(this.state);
        }

        this.emitChanged();
    };

    private onSetSelectedDetailsViewRightContentPanel = async (
        view: DetailsViewRightContentPanelType,
    ): Promise<void> => {
        this.state.detailsViewRightContentPanel = view;
        this.emitChanged();
    };
}
