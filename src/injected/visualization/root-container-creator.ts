// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from './../../common/html-element-utils';

export class RootContainerCreator {
    constructor(private readonly htmlElementUtils: HTMLElementUtils) {}

    public create(id: string): void {
        this.htmlElementUtils.deleteAllElements(`#${id}`);
        const root = document.createElement('div');
        root.id = id;
        this.htmlElementUtils.getBody().appendChild(root);
    }
}
