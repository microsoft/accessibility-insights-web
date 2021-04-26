// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreNames } from '../../common/stores/store-names';
import { DevToolStoreData } from '../../common/types/store-data/dev-tool-store-data';
import { DevToolActions } from '../actions/dev-tools-actions';
import { BaseStoreImpl } from './base-store-impl';

export class DevToolStore extends BaseStoreImpl<DevToolStoreData> {
    private devToolActions: DevToolActions;

    constructor(devToolActions: DevToolActions) {
        super(StoreNames.DevToolsStore);

        this.devToolActions = devToolActions;
    }

    public getDefaultState(): DevToolStoreData {
        const defaultValues: DevToolStoreData = {
            isOpen: false,
            inspectElementRequestId: 0,
            inspectElement: null,
            frameUrl: null,
        };

        return defaultValues;
    }

    protected addActionListeners(): void {
        this.devToolActions.setDevToolState.addListener(this.onDevToolStatusChanged);
        this.devToolActions.setInspectElement.addListener(this.onInspectElement);
        this.devToolActions.setFrameUrl.addListener(this.onSetFrameUrl);

        this.devToolActions.getCurrentState.addListener(this.onGetCurrentState);
    }

    private onDevToolStatusChanged = (status: boolean): void => {
        if (this.state.isOpen !== status) {
            this.state.isOpen = status;
            this.state.frameUrl = null;
            this.state.inspectElement = null;
            this.emitChanged();
        }
    };

    private onInspectElement = (target: string[]): void => {
        this.state.inspectElement = target;
        this.state.frameUrl = null;
        // we're only using this to make sure the store proxy emits the change when the user inspects the same element twice
        this.state.inspectElementRequestId++;
        this.emitChanged();
    };

    private onSetFrameUrl = (frameUrl: string): void => {
        this.state.frameUrl = frameUrl;
        this.emitChanged();
    };
}
