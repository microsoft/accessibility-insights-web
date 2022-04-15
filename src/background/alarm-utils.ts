// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class AlarmUtils {
    protected alarmCallbacks = {};
    constructor(protected readonly alarmAPI = chrome.alarms) {
        this.alarmAPI.onAlarm.addListener(this.handleAlarm);
    }

    public registerAlarmCallback(alarmName: string, callback: Function): void {
        this.alarmCallbacks[alarmName] = callback;
    }

    public handleAlarm = (alarm: chrome.alarms.Alarm): void => {
        if (this.alarmExists(alarm.name)) {
            try {
                this.alarmCallbacks[alarm.name]();
                delete this.alarmCallbacks[alarm.name];
                this.clearAlarm(alarm.name);
            } catch (e) {
                console.error(e);
            }
        }
    };

    public alarmExists(alarmName: string): boolean {
        const alarm = this.alarmCallbacks[alarmName];
        return alarm !== undefined;
    }

    public clearAlarm(name: string): void {
        this.alarmAPI.clear(name);
    }

    public createAlarm(name: string, when: number) {
        this.alarmAPI.create(name, { when: when });
    }

    public createAlarmWithCallback(name: string, delayInMs: number, callback: Function) {
        this.registerAlarmCallback(name, callback);
        this.createAlarm(name, Date.now() + delayInMs);
    }
}
