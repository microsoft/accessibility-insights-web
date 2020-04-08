// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { utc } from 'moment';

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

    public static getUTCDate(): Date {
        const date = new Date();
        return new Date(
            Date.UTC(
                date.getUTCFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds(),
            ),
        );
    }

    public static getUTCStringFromDate(date: Date): string {
        return utc(date.toISOString()).format('YYYY-MM-DD h:mm A z');
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
