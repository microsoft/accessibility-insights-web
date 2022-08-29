// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { SyncAction } from 'common/flux/sync-action';
import { IMock, Mock, Times } from 'typemoq';

export const createSyncActionMock = <Payload>(
    payload: Payload,
    scope?: string,
): IMock<SyncAction<Payload>> => {
    const actionMock = Mock.ofType<SyncAction<Payload>>();
    if (scope) {
        actionMock.setup(action => action.invoke(payload, scope)).verifiable(Times.once());
    } else {
        actionMock.setup(action => action.invoke(payload)).verifiable(Times.once());
    }
    return actionMock;
};

export const createAsyncActionMock = <Payload>(
    payload: Payload,
    scope?: string,
): IMock<AsyncAction<Payload>> => {
    const actionMock = Mock.ofType<AsyncAction<Payload>>();
    if (scope) {
        actionMock
            .setup(async action => await action.invoke(payload, scope))
            .verifiable(Times.once());
    } else {
        actionMock.setup(async action => await action.invoke(payload)).verifiable(Times.once());
    }
    return actionMock;
};
