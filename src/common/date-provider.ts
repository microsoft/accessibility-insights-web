// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class DateProvider {
    public static getDate(timestamp?: string): Date {
        return new Date(timestamp);
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
}
