// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from './../../common/html-element-utils';

export class RootContainerCreator {
    constructor(private readonly HTMLElementUtils: HTMLElementUtils) { }

    public create(): void {
        this.HTMLElementUtils.deleteAllElements('#accessibility-insights-root-container');
        const root = document.createElement('div');
        root.id = 'accessibility-insights-root-container';
        this.HTMLElementUtils.querySelector('body').appendChild(root);
    }
}
