// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { SyntheticEvent } from 'react';

export const allUrlAndFilePermissions = { origins: ['*://*/*'] };

export class AllUrlsPermissionHandler {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly actionMessageCreator: Pick<DetailsViewActionMessageCreator, 'setAllUrlsPermissionState'>,
    ) {}

    public requestAllUrlsPermission = async (e: SyntheticEvent, onSuccess: () => void) => {
        const newAllUrlsPermissionState = await this.browserAdapter.requestPermissions(allUrlAndFilePermissions);
        this.actionMessageCreator.setAllUrlsPermissionState(e, newAllUrlsPermissionState);

        if (newAllUrlsPermissionState) {
            onSuccess();
        }
    };
}
