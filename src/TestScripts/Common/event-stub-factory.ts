// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface IEventStub {
    nativeEvent: INativeEventStub;
}

export interface INativeEventStub {
    detail: number;
}

export class EventStubFactory {
    public createNativeMouseClickEvent(): INativeEventStub {
        return {
            detail: 1,
        };
    }

    public createNativeKeypressEvent(): INativeEventStub {
        return {
            detail: 0,
        };
    }

    public createKeypressEvent(): IEventStub {
        return {
            nativeEvent: {
                detail: 0,
            },
        };
    }

    public createMouseClickEvent(): IEventStub {
        return {
            nativeEvent: {
                detail: 1,
            },
        };
    }
}
