// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AlarmUtils } from 'background/alarm-utils';
import { ChromeAlarmsAPMIMock } from 'tests/unit/mock-helpers/chrome-alarms-api-mock';

export class AlarmUtilsStub extends AlarmUtils {
    constructor(public mockAlarmsAPI: ChromeAlarmsAPMIMock) {
        super(mockAlarmsAPI.getObject());
    }

    public createAlarmWithCallback(name: string, delayInMs: number, callback: Function) {
        this.registerAlarmCallback(name, callback);
        this.createAlarm(name, delayInMs);
        this.mockAlarmsAPI.callAlarmListener(
            this.mockAlarmsAPI.createStubAlarm(name, Date.now() + delayInMs),
        ); //we need to prompt calling the onAlarm listener for tests
    }

    public getAlarmCallbacks() {
        return this.alarmCallbacks;
    }
}
