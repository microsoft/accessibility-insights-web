// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { SyncAction } from 'common/flux/sync-action';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

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

export const createInterpreterMock = <Payload>(
    message: string,
    payload: Payload,
    tabId?: number,
): IMock<Interpreter> => {
    const interpreterMock = Mock.ofType<Interpreter>();
    interpreterMock
        .setup(interpreter => interpreter.registerTypeToPayloadCallback(message, It.is(isFunction)))
        .callback((_, handler) => {
            if (tabId) {
                handler(payload, tabId);
            } else {
                handler(payload);
            }
        });
    return interpreterMock;
};
