// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ChromeAlarmsAPMIMock } from 'tests/unit/mock-helpers/chrome-alarms-api-mock';
import { AlarmUtilsStub } from 'tests/unit/stubs/alarm-utils-stub';
import { Times } from 'typemoq';

describe('AlarmUtilsTest', () => {
    let testSubject: AlarmUtilsStub;
    let mockChromeAlarmsAPI: ChromeAlarmsAPMIMock;
    let mockCallback;
    const testAlarmName = 'test1';
    const testAlarmInfo = {
        when: Date.now() + 50,
    };

    beforeEach(() => {
        mockChromeAlarmsAPI = new ChromeAlarmsAPMIMock();
        mockCallback = mockChromeAlarmsAPI.createMockCallback();
        mockChromeAlarmsAPI.setupAddListener(mockChromeAlarmsAPI.createMockCallback().object);
    });

    it('registerAlarmCallback adds passed callback to alarmCallbacks', async () => {
        testSubject = new AlarmUtilsStub(mockChromeAlarmsAPI);
        mockCallback.setup(c => c()).verifiable(Times.never());
        testSubject.registerAlarmCallback(testAlarmName, mockCallback.object);
        expect(testSubject.getAlarmCallbacks()[testAlarmName]).toBe(mockCallback.object);
        expect(Object.keys(testSubject.getAlarmCallbacks())[0]).toBe(testAlarmName);
        mockCallback.verifyAll();
        mockChromeAlarmsAPI.verifyAll();
    });

    it('alarmExists returns whether alarm is in callbacks', () => {
        testSubject = new AlarmUtilsStub(mockChromeAlarmsAPI);
        mockCallback.setup(c => c()).verifiable(Times.never());
        expect(testSubject.alarmExists(testAlarmName)).toBe(false);
        testSubject.registerAlarmCallback(testAlarmName, mockCallback.object);
        expect(testSubject.alarmExists(testAlarmName)).toBe(true);
        mockCallback.verifyAll();
        mockChromeAlarmsAPI.verifyAll();
    });

    it('createAlarm calls chrome alarms API with name and alarmInfo', async () => {
        mockChromeAlarmsAPI.setupCreate(testAlarmName, testAlarmInfo);
        testSubject = new AlarmUtilsStub(mockChromeAlarmsAPI);
        testSubject.createAlarm(testAlarmName, testAlarmInfo.when);
        expect(mockChromeAlarmsAPI.getAlarms().length).toBe(1);
        expect(mockChromeAlarmsAPI.getAlarms()[0].name).toBe(testAlarmName);
        expect(mockChromeAlarmsAPI.getAlarms()[0].scheduledTime).toBe(testAlarmInfo.when);
        mockChromeAlarmsAPI.verifyAll();
    });

    it('createAlarmWithCallback registers alarm callback and creates alarms API alarm', async () => {
        mockChromeAlarmsAPI.setupCreate(testAlarmName, testAlarmInfo);
        testSubject = new AlarmUtilsStub(mockChromeAlarmsAPI);
        mockCallback.setup(c => c()).verifiable(Times.never());
        testSubject.createAlarmWithCallback(testAlarmName, testAlarmInfo.when, mockCallback.object);
        expect(testSubject.getAlarmCallbacks()[testAlarmName]).toBe(mockCallback.object);
        expect(Object.keys(testSubject.getAlarmCallbacks())[0]).toBe(testAlarmName);
        expect(mockChromeAlarmsAPI.getAlarms().length).toBe(1);
        expect(mockChromeAlarmsAPI.getAlarms()[0].name).toBe(testAlarmName);
        expect(mockChromeAlarmsAPI.getAlarms()[0].scheduledTime).toBe(testAlarmInfo.when);
        mockCallback.verifyAll();
        mockChromeAlarmsAPI.verifyAll();
    });

    it('clearAlarm clears the alarm from the chrome API', () => {
        mockChromeAlarmsAPI.setupCreate(testAlarmName, testAlarmInfo);
        mockChromeAlarmsAPI.setupClear(testAlarmName);
        testSubject = new AlarmUtilsStub(mockChromeAlarmsAPI);
        testSubject.createAlarm(testAlarmName, testAlarmInfo.when);
        expect(mockChromeAlarmsAPI.getAlarms().length).toBe(1);
        testSubject.clearAlarm(testAlarmName);
        expect(mockChromeAlarmsAPI.getAlarms().length).toBe(0);
        mockChromeAlarmsAPI.verifyAll();
    });

    it('handleAlarm calls callback and clears alarm', () => {
        mockChromeAlarmsAPI.setupCreate(testAlarmName, testAlarmInfo);
        mockChromeAlarmsAPI.setupClear(testAlarmName);
        const testAlarm = mockChromeAlarmsAPI.createStubAlarm(testAlarmName, testAlarmInfo.when);
        testSubject = new AlarmUtilsStub(mockChromeAlarmsAPI);
        mockCallback.setup(c => c()).verifiable(Times.once());
        testSubject.createAlarmWithCallback(testAlarmName, testAlarmInfo.when, mockCallback.object);
        expect(testSubject.alarmExists(testAlarmName)).toBe(true);
        testSubject.handleAlarm(testAlarm);
        expect(mockChromeAlarmsAPI.getAlarms().length).toBe(0);
        expect(testSubject.alarmExists(testAlarmName)).toBe(false);
        expect(Object.keys(testSubject.getAlarmCallbacks()).length).toBe(0);
        mockCallback.verifyAll();
        mockChromeAlarmsAPI.verifyAll();
    });
});
