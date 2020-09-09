// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { utc } from 'moment';
import * as moment from 'moment';

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
        return utc(date.toISOString()).format('YYYY-MM-DD h:mm A z');
    }

    public static getTimeStringFromSeconds(seconds: number): string {
        const startOfDay = moment().startOf('day');
        const endTime = moment(startOfDay).add(seconds, 's');
        const minsAndSecs = endTime.format('mm:ss');
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
