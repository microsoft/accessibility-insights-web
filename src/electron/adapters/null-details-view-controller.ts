// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewController } from 'background/details-view-controller';

export class NullDetailsViewController implements DetailsViewController {
    public showDetailsView(targetTabId: number): Promise<void> {
        return Promise.resolve();
    }
}
