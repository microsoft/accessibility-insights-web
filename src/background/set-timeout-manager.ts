// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AlarmUtils } from 'background/alarm-utils';
import { WindowUtils } from 'common/window-utils';

export class SetTimeoutManager {
    constructor(private utils: { alarmUtils?: AlarmUtils; windowUtils?: WindowUtils }) {}

    public setTimeout(callback: Function, delayInMs: number, name?: string): void {
        if (this.utils.alarmUtils) {
            if (name) {
                this.utils.alarmUtils.createAlarmWithCallback(name, delayInMs, callback);
            } else {
                console.error('no alarm name supplied to timeout handler');
            }
        } else {
            if (this.utils.windowUtils) {
                this.utils.windowUtils?.setTimeout(callback, delayInMs);
            } else {
                console.error('no timeout handler found');
            }
        }
    }
}
