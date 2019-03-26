// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { StoreNames } from '../../common/stores/store-names';
import { DevToolState } from '../../common/types/store-data/idev-tool-state';
import { DevToolActions } from '../actions/dev-tools-actions';
import { BaseStoreImpl } from './base-store-impl';

export class DevToolStore extends BaseStoreImpl<DevToolState> {
    private devToolActions: DevToolActions;

    constructor(devToolActions: DevToolActions) {
        super(StoreNames.DevToolsStore);

        this.devToolActions = devToolActions;
    }

    public getDefaultState(): DevToolState {
        const defaultValues: DevToolState = {
            isOpen: false,
        };

        return defaultValues;
    }

    protected addActionListeners(): void {
        this.devToolActions.setDevToolState.addListener(this.onDevToolStatusChanged);
        this.devToolActions.setInspectElement.addListener(this.onInspectElement);
        this.devToolActions.setFrameUrl.addListener(this.onSetFrameUrl);

        this.devToolActions.getCurrentState.addListener(this.onGetCurrentState);
    }

    @autobind
    private onDevToolStatusChanged(status: boolean): void {
        if (this.state.isOpen !== status) {
            this.state.isOpen = status;
            this.state.frameUrl = null;
            this.state.inspectElement = null;
            this.emitChanged();
        }
    }

    @autobind
    private onInspectElement(target: string[]): void {
        this.state.inspectElement = target;
        this.state.frameUrl = null;
        this.emitChanged();
    }

    @autobind
    private onSetFrameUrl(frameUrl: string): void {
        this.state.frameUrl = frameUrl;
        this.emitChanged();
    }
}
