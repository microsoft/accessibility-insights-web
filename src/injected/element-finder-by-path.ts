// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from '../common/html-element-utils';

export class ElementFinderByPath {
    constructor(private readonly htmlElementUtils: HTMLElementUtils) {}

    public onFindElementByPath = (path: string[]): string => {
        return this.processRequest(path);
    };

    private processRequest(path: string[]): string {
        if (path.length == 1) {
            return this.getSnippet(path[0]);
        } else {
            return this.processRequest(path[1:]);
        }
    }

    private getSnippet(path: string): string {
        const element = this.htmlElementUtils.querySelector(path) as HTMLElement;
        return element ? element.outerHTML : 'error';
    }
}
