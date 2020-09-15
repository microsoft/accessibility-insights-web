// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateTime } from 'luxon';

export class DateProvider {
    public static getDateFromTimestamp(timestamp: string): Date {
        if (DateProvider.isNumericalTimestamp(timestamp)) {
            return DateProvider.getDateFromMillis(timestamp);
        } else {
            return DateProvider.getDateFromDateString(timestamp);
        }
    }

    public static getCurrentDate(): Date {
        return new Date();
    }

    public static getUTCStringFromDate(date: Date): string {
        const utcDateTime = DateTime.fromJSDate(date, { zone: 'utc' });
        return utcDateTime.toFormat('YYYY-MM-DD h:mm A z');
    }

    public static getTimeStringFromSeconds(seconds: number): string {
        const localTime = DateTime.local();
        const startOfDay = localTime.startOf('day');
        const endTime = startOfDay.plus({ seconds });
        const minsAndSecs = endTime.toFormat('mm:ss');
        const hours = `${endTime.diff(startOfDay, 'hours')}`.padStart(2, '0');

        return `${hours}:${minsAndSecs}`;
    }

    private static getDateFromDateString(timestamp: string): Date {
        return new Date(timestamp);
    }

    private static getDateFromMillis(timestamp: string): Date {
        return new Date(Number(timestamp));
    }

    private static isNumericalTimestamp(timestamp: string): boolean {
        return !isNaN(Number(timestamp));
    }
}
