// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class DateProvider {
    public static getDate(): Date {
        return new Date();
    }

    public static getUTCDate(): Date {
        const date = new Date();
        return new Date(Date.UTC(date.getUTCFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
    }
}
