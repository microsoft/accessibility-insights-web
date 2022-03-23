// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    EditExistingFailureInstancePayload,
    TabStopsViewActions,
} from 'DetailsView/components/tab-stops/tab-stops-view-actions';

export class TabStopsTestViewController {
    constructor(private actions: TabStopsViewActions) {}

    public createNewFailureInstancePanel: (payload: string) => void = payload =>
        this.actions.createNewFailureInstancePanel.invoke(payload);

    public editExistingFailureInstance: (payload: EditExistingFailureInstancePayload) => void =
        payload => this.actions.editExistingFailureInstance.invoke(payload);

    public dismissPanel = () => this.actions.dismissPanel.invoke();

    public updateDescription: (payload: string) => void = payload =>
        this.actions.updateDescription.invoke(payload);
}
