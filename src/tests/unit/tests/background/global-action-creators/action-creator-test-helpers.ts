// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';
import { Interpreter } from '../../../../../background/interpreter';

export const createActionMock = <Payload>(payload: Payload): IMock<Action<Payload>> => {
    const actionMock = Mock.ofType<Action<Payload>>(Action);
    actionMock.setup(action => action.invoke(payload)).verifiable(Times.once());
    return actionMock;
};

export const createInterpreterMock = <Payload>(message: string, payload: Payload): IMock<Interpreter> => {
    const interpreterMock = Mock.ofType<Interpreter>();
    interpreterMock
        .setup(interpreter => interpreter.registerTypeToPayloadCallback(message, It.is(isFunction)))
        .callback((_, handler) => handler(payload));
    return interpreterMock;
};
