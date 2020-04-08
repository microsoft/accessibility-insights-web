// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { utc } from 'moment';

export class DateProvider {
    public static getDateFromTimestamp(timestamp: string): Date {
        const dateNumber = Number(timestamp);
        if (isNaN(dateNumber)) {
            return new Date(timestamp);
        }
        return new Date(dateNumber);
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
}
