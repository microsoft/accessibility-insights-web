// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// tslint:disable-next-line:interface-name
export interface ITabStoreData {
    url: string;
    title: string;
    id: number;
    isClosed: boolean;
    isChanged: boolean;
    isPageHidden: boolean;
}
