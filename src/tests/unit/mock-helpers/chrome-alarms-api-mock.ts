// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// This must be the first import, otherwise importing webextension-polyfill from within
// adapter implementations will fail
import 'tests/unit/common/webextension-polyfill-setup';
import { IMock, It, Mock, Times } from 'typemoq';
import { Alarms, Events } from 'webextension-polyfill';

export class ChromeAlarmsAPMIMock {
    private underlyingMock: IMock<Alarms.Static> = Mock.ofType<Alarms.Static>();
    private alarms: Alarms.Alarm[] = [];
    private alarmListener: (name: Alarms.Alarm) => void;

    public setupAddListener(callback: (name: Alarms.Alarm) => void, times = 1) {
        const mockOnAlarm: IMock<Events.Event<(name: Alarms.Alarm) => void>> =
            Mock.ofType<Events.Event<(name: Alarms.Alarm) => void>>();
        Mock.ofType<(callback: (name: Alarms.Alarm) => void) => void>();
        mockOnAlarm
            .setup(a => a.addListener(It.isAny()))
            .callback(() => {
                this.alarmListener = callback;
            })
            .verifiable(Times.exactly(times));

        this.underlyingMock.setup(m => m.onAlarm).returns(() => mockOnAlarm.object);
        return this;
    }

    public setAlarmListener(listener: (name: Alarms.Alarm) => void): void {
        this.alarmListener = listener;
    }

    public setupClear(alarmName: string, times: number = 1) {
        this.underlyingMock
            .setup(a => a.clear(alarmName))
            .callback(() => {
                this.alarms = this.alarms.filter(alarm => alarm.name !== alarmName);
            })
            .returns(() => Promise.resolve(true))
            .verifiable(Times.exactly(times));
        return this;
    }

    public setupCreate(alarmName: string, scheduledTime: number, times: number = 1) {
        this.underlyingMock
            .setup(a => a.create(alarmName, { when: scheduledTime }))
            .callback(cb => {
                this.alarms.push(this.createStubAlarm(alarmName, scheduledTime));
                this.alarmListener(cb);
            })
            .verifiable(Times.exactly(times));

        return this;
    }

    public createMockCallback() {
        const mockCallback: IMock<(name: Alarms.Alarm) => void> =
            Mock.ofType<(name: Alarms.Alarm) => void>();
        return mockCallback;
    }

    public createStubAlarm(name: string, scheduledTime: number) {
        const stubAlarm: Alarms.Alarm = {
            name,
            scheduledTime,
        };
        return stubAlarm;
    }

    public verifyAll(): void {
        this.underlyingMock.verifyAll();
    }

    public getObject(): Alarms.Static {
        return this.underlyingMock.object;
    }

    public callAlarmListener(name: Alarms.Alarm) {
        this.alarmListener(name);
    }

    public getAlarms() {
        return this.alarms;
    }
}
