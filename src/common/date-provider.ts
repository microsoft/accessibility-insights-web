// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { utc } from 'moment';

export class DateProvider {
    public static getDateFromTimestamp(timestamp: string): Date {
        return new Date(timestamp);
    }

    public static getCurrentDate(): Date {
        return new Date();
    }

    public static getUTCStringFromDate(date: Date): string {
        return utc(date.toISOString()).format('YYYY-MM-DD h:mm A z');
    }
}
