// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../common/base-store';
import { PathSnippetStoreData } from '../common/types/store-data/path-snippet-store-data';

export class PathSnippetController {
    constructor(
        private readonly pathSnippetStore: BaseStore<PathSnippetStoreData>,
        private readonly addCorrespondingSnippet: (snippet: string) => void,
    ) {}

    public listenToStore(): void {
        this.pathSnippetStore.addChangedListener(this.onChangedState);
        this.onChangedState();
    }

    private onChangedState = (): void => {
        if (this.pathSnippetStore.getState() == null) {
            return;
        }

        const pathSnippetStoreState = this.pathSnippetStore.getState();

        if (pathSnippetStoreState.path !== '') {
            const retrievedSnippet = this.getElementFromPath(pathSnippetStoreState.path);
            this.addCorrespondingSnippet(retrievedSnippet);
        }
    };

    private getElementFromPath = (path: string): string => {
        return 'Retrieved Snippet from Store for Path: ' + path;
    };
}
