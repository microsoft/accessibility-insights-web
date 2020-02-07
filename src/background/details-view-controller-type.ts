// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export type DetailsViewController = {
    setupDetailsViewTabRemovedHandler(handler: (tabId: number) => void): void;
    showDetailsView(targetTabId: number): Promise<void>;
};
