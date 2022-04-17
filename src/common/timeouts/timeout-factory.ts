// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AlarmUtils } from 'background/alarm-utils';
import { WindowUtils } from 'common/window-utils';

type Timeout = (callback: Function, delayInMs: number, name?: string) => void;
export enum TimeoutType {
    Window,
    Alarm,
}
export interface TimeoutFactory {
    timeoutType: TimeoutType;
    createTimeout: Timeout;
}

export class WindowTimeoutFactory implements TimeoutFactory {
    public timeoutType: TimeoutType;
    constructor(private windowUtils: WindowUtils) {
        this.timeoutType = TimeoutType.Window;
    }

    public createTimeout(callback: Function, delayInMs: number) {
        this.windowUtils.setTimeout(callback, delayInMs);
    }
}

export class AlarmTimeoutFactory implements TimeoutFactory {
    public timeoutType: TimeoutType;

    constructor(private alarmUtils: AlarmUtils) {
        this.timeoutType = TimeoutType.Alarm;
    }

    public createTimeout(callback: Function, delayInMs: number, name: string) {
        this.alarmUtils.createAlarmWithCallback(name, delayInMs, callback);
    }
}
