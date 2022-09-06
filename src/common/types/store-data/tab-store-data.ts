// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface TabStoreData {
    url?: string;
    title?: string;
    id?: number;
    isClosed: boolean;
    isChanged: boolean;
    isPageHidden: boolean;
    isOriginChanged: boolean;
}
