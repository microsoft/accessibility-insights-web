// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from '../../common/stores/store-names';
import { PathSnippetStoreData } from '../../common/types/store-data/path-snippet-store-data';
import { PathSnippetActions } from '../actions/path-snippet-actions';

export class PathSnippetStore extends PersistentStore<PathSnippetStoreData> {
    constructor(
        private readonly pathSnippetActions: PathSnippetActions,
        persistedState: PathSnippetStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
    ) {
        super(
            StoreNames.PathSnippetStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.pathSnippetStore(tabId),
            logger,
        );
    }

    public getDefaultState(): PathSnippetStoreData {
        const defaultValue: PathSnippetStoreData = {
            path: null,
            snippet: null,
        };

        return defaultValue;
    }

    protected addActionListeners(): void {
        this.pathSnippetActions.getCurrentState.addListener(this.onGetCurrentState);
        this.pathSnippetActions.onAddPath.addListener(payload =>
            this.onChangeProperty('path', payload),
        );
        this.pathSnippetActions.onAddSnippet.addListener(payload =>
            this.onChangeProperty('snippet', payload),
        );
        this.pathSnippetActions.onClearData.addListener(this.onClearState);
    }

    private onChangeProperty = async (
        property: keyof PathSnippetStoreData,
        payload: string,
    ): Promise<void> => {
        this.state[property] = payload;
        await this.emitChanged();
    };

    private onClearState = async (): Promise<void> => {
        this.state = this.getDefaultState();
        await this.emitChanged();
    };
}
