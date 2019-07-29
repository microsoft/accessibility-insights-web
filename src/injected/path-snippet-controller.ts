// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../common/base-store';
import { PathSnippetStoreData } from '../common/types/store-data/path-snippet-store-data';
import { ElementFinderByPath } from './element-finder-by-path';

export class PathSnippetController {
    constructor(
        private readonly pathSnippetStore: BaseStore<PathSnippetStoreData>,
        private readonly elementFinderByPath: ElementFinderByPath,
        private readonly addCorrespondingSnippet: (snippet: string) => void,
    ) {}

    public listenToStore(): void {
        this.pathSnippetStore.addChangedListener(this.onChangedState);
        this.onChangedState();
    }

    private onChangedState = (): void => {
        const pathSnippetStoreState = this.pathSnippetStore.getState();

        if (pathSnippetStoreState == null) {
            return;
        }

        if (pathSnippetStoreState.path !== '') {
            const retrievedSnippet = this.getElementFromPath(pathSnippetStoreState.path);
            this.addCorrespondingSnippet(retrievedSnippet);
        }
    };

    private getElementFromPath = (path: string): string => {
        const splitPath = path.split(';');
        return this.elementFinderByPath.onFindElementByPath(splitPath);
    };
}
