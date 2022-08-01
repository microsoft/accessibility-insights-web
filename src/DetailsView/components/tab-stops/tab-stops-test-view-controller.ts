// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    EditExistingFailureInstancePayload,
    TabStopsViewActions,
} from 'DetailsView/components/tab-stops/tab-stops-view-actions';

export class TabStopsTestViewController {
    constructor(private actions: TabStopsViewActions) {}

    public createNewFailureInstancePanel: (payload: string) => Promise<void> = async payload =>
        await this.actions.createNewFailureInstancePanel.invoke(payload);

    public editExistingFailureInstance: (
        payload: EditExistingFailureInstancePayload,
    ) => Promise<void> = async payload =>
        await this.actions.editExistingFailureInstance.invoke(payload);

    public dismissPanel: () => Promise<void> = async () => await this.actions.dismissPanel.invoke();

    public updateDescription: (payload: string) => Promise<void> = async payload =>
        await this.actions.updateDescription.invoke(payload);
}
