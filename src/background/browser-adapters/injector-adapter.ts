// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type InjectorAdapter = {
    injectJs(tabId, file: string, callback: Function): void;
    injectCss(tabId, file: string, callback: Function): void;
};
