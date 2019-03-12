// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';

export class ReportNameGenerator {
    public generateName(scanDate: Date, pageTitle: string): string {
        return 'InsightsScan_' + this.getDateSegment(scanDate) + '_' + this.getTitleSegment(pageTitle) + '.html';
    }

    private getDateSegment(scanDate: Date): string {
        return scanDate.getFullYear() + this.padStartWithZero(scanDate.getMonth() + 1, 2) + this.padStartWithZero(scanDate.getDate(), 2);
    }

    private padStartWithZero(num: number, digits: number): string {
        return _.padStart(num.toString(), digits, '0');
    }

    private getTitleSegment(pageTitle: string): string {
        let title: string = '';
        for (let i: number = 0; i < pageTitle.length; i++) {
            const c = pageTitle[i];
            if (this.isValidCharForTitle(c)) {
                title += c;
                if (title.length >= 20) {
                    return title;
                }
            }
        }
        return title;
    }

    private isValidCharForTitle(character: string): boolean {
        return ('0' <= character && character <= '9') || ('A' <= character && character <= 'Z') || ('a' <= character && character <= 'z');
    }
}
