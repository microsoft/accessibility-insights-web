// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { padStart } from 'lodash';

export class FileNameBuilder {
    public getDateSegment(scanDate: Date): string {
        return (
            scanDate.getFullYear() +
            this.padStartWithZero(scanDate.getMonth() + 1, 2) +
            this.padStartWithZero(scanDate.getDate(), 2)
        );
    }

    public getTitleSegment(pageTitle: string): string {
        return Array.from(pageTitle).filter(this.isValidCharForTitle).slice(0, 20).join('');
    }

    public getTimeSegment(scanDate: Date): string {
        return (
            this.padStartWithZero(scanDate.getHours(), 2) +
            this.padStartWithZero(scanDate.getMinutes(), 2) +
            this.padStartWithZero(scanDate.getSeconds(), 2)
        );
    }

    private padStartWithZero(num: number, digits: number): string {
        return padStart(num.toString(), digits, '0');
    }

    private isValidCharForTitle(character: string): boolean {
        return /[A-Za-z0-9]/.test(character);
    }
}
