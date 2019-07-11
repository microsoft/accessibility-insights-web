// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreNames } from '../../common/stores/store-names';
import { PathSnippetData } from '../../common/types/store-data/path-snippet-data';
import { PathSnippetActions } from '../actions/path-snippet-actions';
import { BaseStoreImpl } from './base-store-impl';

export class PathSnippetStore extends BaseStoreImpl<PathSnippetData> {
    private pathSnippetActions: PathSnippetActions;

    constructor(pathSnippetActions: PathSnippetActions) {
        super(StoreNames.PathSnippetStore);

        this.pathSnippetActions = pathSnippetActions;
    }

    public getDefaultState(): PathSnippetData {
        const defaultValue: PathSnippetData = {
            path: '',
            snippet: '',
        };

        return defaultValue;
    }

    protected addActionListeners(): void {
        this.pathSnippetActions.onAddPath.addListener(this.onAddPath);
        this.pathSnippetActions.onAddSnippet.addListener(this.onAddSnippet);
    }

    private onAddPath = (payload: string): void => {
        this.state.path = payload;
        this.emitChanged();
    };

    private onAddSnippet = (payload: string): void => {
        this.state.snippet = payload;
        this.emitChanged();
    };
}
