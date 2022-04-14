// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AlarmUtils } from 'background/alarm-utils';
import { WindowUtils } from 'common/window-utils';

export class SetTimeoutManager {
    constructor(private utils: { alarmUtils?: AlarmUtils; windowUtils?: WindowUtils }) {}

    public setTimeout(callback: Function, delayInMs: number, name?: string): void {
        if (name && this.utils.alarmUtils) {
            this.utils.alarmUtils.createAlarmWithCallback(name, delayInMs, callback);
        } else {
            this.utils.windowUtils?.setTimeout(callback, delayInMs);
        }
    }
}
