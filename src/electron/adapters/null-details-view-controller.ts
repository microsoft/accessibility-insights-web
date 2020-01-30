// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewControllerType } from 'background/details-view-controller-type';

export class NullDetailsViewController implements DetailsViewControllerType {
    public setupDetailsViewTabRemovedHandler(handler: (tabId: number) => void): void {}

    public showDetailsView(targetTabId: number): Promise<void> {
        return Promise.resolve();
    }
}
