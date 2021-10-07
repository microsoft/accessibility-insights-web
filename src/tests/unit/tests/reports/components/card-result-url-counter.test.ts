// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardResult } from 'common/types/store-data/card-view-model';
import { getCardResultUrlCount } from 'reports/components/card-result-url-counter';

describe('CardResultUrlCounter', () => {
    it('prefers baseline-aware URLs to string URLs', () => {
        const cardResult = {
            identifiers: {
                urls: {
                    urls: ['http://url-fail/1', 'http://url-fail/2'],
                    baselineAwareUrls: [
                        { url: 'http://url-fail/1', status: 'unknown' },
                        { url: 'http://url-fail/2', status: 'existing' },
                        { url: 'http://url-fail/3', status: 'new' },
                    ],
                },
            },
        } as unknown as CardResult;

        expect(getCardResultUrlCount(cardResult)).toBe(3);
    });

    it('counts non-empty baseline-aware URLs', () => {
        const cardResult = {
            identifiers: {
                urls: {
                    baselineAwareUrls: [
                        { url: 'http://url-fail/1', status: 'unknown' },
                        { url: 'http://url-fail/2', status: 'existing' },
                        { url: 'http://url-fail/3', status: 'new' },
                    ],
                },
            },
        } as unknown as CardResult;

        expect(getCardResultUrlCount(cardResult)).toBe(3);
    });

    it('counts empty baseline-aware URLs', () => {
        const cardResult = {
            identifiers: {
                urls: {
                    baselineAwareUrls: [],
                },
            },
        } as unknown as CardResult;

        expect(getCardResultUrlCount(cardResult)).toBe(0);
    });

    it('counts non-empty string URLs', () => {
        const cardResult = {
            identifiers: {
                urls: {
                    urls: ['http://url-fail/1', 'http://url-fail/2'],
                },
            },
        } as unknown as CardResult;

        expect(getCardResultUrlCount(cardResult)).toBe(2);
    });

    it('counts empty string URLs', () => {
        const cardResult = {
            identifiers: {
                urls: {
                    urls: [],
                },
            },
        } as unknown as CardResult;

        expect(getCardResultUrlCount(cardResult)).toBe(0);
    });

    it('counts with no urls at all', () => {
        const cardResult = {
            identifiers: {
                urls: {},
            },
        } as unknown as CardResult;

        expect(getCardResultUrlCount(cardResult)).toBe(0);
    });

    it('counts with no propertyData', () => {
        const cardResult = {
            identifiers: {},
        } as unknown as CardResult;

        expect(getCardResultUrlCount(cardResult)).toBe(0);
    });
});
