// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// tslint:disable-next-line:interface-name
export interface IEventStub {
    nativeEvent: INativeEventStub;
}

// tslint:disable-next-line:interface-name
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
