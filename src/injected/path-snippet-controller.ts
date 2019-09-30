// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from '../common/base-store';
import { PathSnippetStoreData } from '../common/types/store-data/path-snippet-store-data';
import { ElementFinderByPath, ElementFinderByPathMessage } from './element-finder-by-path';

export class PathSnippetController {
    constructor(
        private readonly pathSnippetStore: BaseStore<PathSnippetStoreData>,
        private readonly elementFinderByPath: ElementFinderByPath,
        private readonly addCorrespondingSnippet: (snippet: string) => void,
    ) {}

    public listenToStore = (): void => {
        this.pathSnippetStore.addChangedListener(this.onChangedState);
        this.onChangedState();
    };

    private onChangedState = (): void => {
        const pathSnippetStoreState = this.pathSnippetStore.getState();

        if (pathSnippetStoreState == null) {
            return;
        }

        if (pathSnippetStoreState.path) {
            this.getElementFromPath(pathSnippetStoreState.path);
        }
    };

    private getElementFromPath = (path: string): void => {
        const splitPath = path.split(';');
        const message = {
            path: splitPath,
        } as ElementFinderByPathMessage;

        this.elementFinderByPath.processRequest(message).then(
            result => {
                this.sendBackSnippetFromPath(result);
            },
            err => {
                this.sendBackErrorFromPath(path);
            },
        );
    };

    private sendBackSnippetFromPath = (snippet: string): void => {
        this.addCorrespondingSnippet(snippet);
    };
    private sendBackErrorFromPath = (path: string): void => {
        this.addCorrespondingSnippet('No code snippet is mapped to: ' + path);
    };
}
