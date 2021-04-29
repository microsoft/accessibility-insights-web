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

    public listenToStore = async (): Promise<void> => {
        this.pathSnippetStore.addChangedListener(this.onChangedState);
        await this.onChangedState();
    };

    private onChangedState = async (): Promise<void> => {
        const pathSnippetStoreState = this.pathSnippetStore.getState();

        if (pathSnippetStoreState == null) {
            return;
        }

        if (pathSnippetStoreState.path) {
            await this.getElementFromPath(pathSnippetStoreState.path);
        }
    };

    private getElementFromPath = async (path: string): Promise<void> => {
        const splitPath = path.split(';');
        const message = {
            path: splitPath,
        } as ElementFinderByPathMessage;

        try {
            const result = await this.elementFinderByPath.processRequest(message);
            this.sendBackSnippetFromPath(result.payload);
        } catch {
            this.sendBackErrorFromPath(path);
        }
    };

    private sendBackSnippetFromPath = (snippet: string): void => {
        this.addCorrespondingSnippet(snippet);
    };
    private sendBackErrorFromPath = (path: string): void => {
        this.addCorrespondingSnippet('No code snippet is mapped to: ' + path);
    };
}
