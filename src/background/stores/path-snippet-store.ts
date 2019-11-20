// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreNames } from '../../common/stores/store-names';
import { PathSnippetStoreData } from '../../common/types/store-data/path-snippet-store-data';
import { PathSnippetActions } from '../actions/path-snippet-actions';
import { BaseStoreImpl } from './base-store-impl';

export class PathSnippetStore extends BaseStoreImpl<PathSnippetStoreData> {
    constructor(private readonly pathSnippetActions: PathSnippetActions) {
        super(StoreNames.PathSnippetStore);
    }

    public getDefaultState(): PathSnippetStoreData {
        const defaultValue: PathSnippetStoreData = {
            path: null,
            snippet: null,
        };

        return defaultValue;
    }

    protected addActionListeners(): void {
        this.pathSnippetActions.getCurrentState.addListener(
            this.onGetCurrentState,
        );
        this.pathSnippetActions.onAddPath.addListener(payload =>
            this.onChangeProperty('path', payload),
        );
        this.pathSnippetActions.onAddSnippet.addListener(payload =>
            this.onChangeProperty('snippet', payload),
        );
        this.pathSnippetActions.onClearData.addListener(this.onClearState);
    }

    private onChangeProperty = (
        property: keyof PathSnippetStoreData,
        payload: string,
    ): void => {
        this.state[property] = payload;
        this.emitChanged();
    };

    private onClearState = () => {
        this.state = this.getDefaultState();
        this.emitChanged();
    };
}
