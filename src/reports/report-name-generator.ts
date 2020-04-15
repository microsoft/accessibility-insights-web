// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { padStart } from 'lodash';

export class ReportNameGenerator {
    public generateName(baseName: string, scanDate: Date, pageTitle: string): string {
        return (
            baseName +
            '_' +
            this.getDateSegment(scanDate) +
            '_' +
            this.getTitleSegment(pageTitle) +
            '.html'
        );
    }

    protected getDateSegment(scanDate: Date): string {
        return (
            scanDate.getFullYear() +
            this.padStartWithZero(scanDate.getMonth() + 1, 2) +
            this.padStartWithZero(scanDate.getDate(), 2)
        );
    }

    protected padStartWithZero(num: number, digits: number): string {
        return padStart(num.toString(), digits, '0');
    }

    protected getTitleSegment(pageTitle: string): string {
        return Array.from(pageTitle).filter(this.isValidCharForTitle).slice(0, 20).join('');
    }

    protected isValidCharForTitle(character: string): boolean {
        return /[A-Za-z0-9]/.test(character);
    }
}
