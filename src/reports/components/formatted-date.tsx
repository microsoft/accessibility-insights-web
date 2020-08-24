// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { padStart } from 'lodash';
import * as React from 'react';

export interface FormattedDateProps {
    date: Date;
}

type timeRange = 'AM' | 'PM';

export class FormattedDate extends React.Component<FormattedDateProps> {
    public render(): JSX.Element {
        return <>{this.formatDateTime(this.props.date)}</>;
    }

    private formatDateTime(date: Date): string {
        return (
            date.getFullYear() +
            '-' +
            this.padStartWithZero(date.getMonth() + 1, 2) +
            '-' +
            this.padStartWithZero(date.getDate(), 2) +
            ' ' +
            this.getTwelveHour(date.getHours()) +
            ':' +
            this.padStartWithZero(date.getMinutes(), 2) +
            ' ' +
            this.getAmPm(date.getHours()) +
            ' ' +
            this.getTimeZone(date)
        );
    }

    private getTwelveHour(hour: number): number {
        hour = hour % 12;
        if (hour === 0) {
            return 12;
        }
        return hour;
    }

    private getAmPm(hour: number): timeRange {
        if (hour < 12) {
            return 'AM';
        } else {
            return 'PM';
        }
    }

    private getTimeZone(date: Date): string {
        const timeString = date
            .toLocaleTimeString(undefined, { timeZoneName: 'short' })
            .replace(/\u200E/g, '');
        return timeString.substr(timeString.lastIndexOf(' ') + 1);
    }

    private padStartWithZero(num: number, digits: number): string {
        return padStart(num.toString(), digits, '0');
    }
}
