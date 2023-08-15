// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { allUrlAndFilePermissions } from 'background/browser-permissions-tracker';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { SupportedMouseEvent } from 'common/telemetry-data-factory';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';

export class AllUrlsPermissionHandler {
    constructor(
        private readonly browserAdapter: BrowserAdapter,
        private readonly actionMessageCreator: Pick<
            DetailsViewActionMessageCreator,
            'setAllUrlsPermissionState'
        >,
    ) {}

    public requestAllUrlsPermission = async (e: SupportedMouseEvent, onSuccess: () => void) => {
        const newAllUrlsPermissionState =
            await this.browserAdapter.requestPermissions(allUrlAndFilePermissions);
        this.actionMessageCreator.setAllUrlsPermissionState(e, newAllUrlsPermissionState);

        if (newAllUrlsPermissionState) {
            onSuccess();
        }
    };
}
