// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from './../../common/html-element-utils';

export class RootContainerCreator {
    constructor(private readonly HTMLElementUtils: HTMLElementUtils) {}

    public create(id: string): void {
        this.HTMLElementUtils.deleteAllElements(`#${id}`);
        const root = document.createElement('div');
        root.id = id;
        this.HTMLElementUtils.querySelector('body').appendChild(root);
    }
}
