// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface EventStub {
    nativeEvent: NativeEventStub;
}

export interface NativeEventStub {
    detail: number;
}

export class EventStubFactory {
    public createNativeMouseClickEvent(): NativeEventStub {
        return {
            detail: 1,
        };
    }

    public createNativeKeypressEvent(): NativeEventStub {
        return {
            detail: 0,
        };
    }

    public createKeypressEvent(): EventStub {
        return {
            nativeEvent: {
                detail: 0,
            },
        };
    }

    public createMouseClickEvent(): EventStub {
        return {
            nativeEvent: {
                detail: 1,
            },
        };
    }
}
