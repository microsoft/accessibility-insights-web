// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardResult } from 'common/types/store-data/card-view-model';
import { OutcomeCounter } from 'reports/components/outcome-counter';

describe('OutcomeCounter', () => {
    const { countByCards, countByIdentifierUrls } = OutcomeCounter;
    const testCards = [
        {
            identifiers: {
                urls: {
                    urlInfos: [
                        { url: 'http://url-fail/1', baselineStatus: 'unknown' },
                        { url: 'http://url-fail/2', baselineStatus: 'existing' },
                        { url: 'http://url-fail/3', baselineStatus: 'new' },
                    ],
                },
            },
        } as unknown as CardResult,
        {
            identifiers: {
                urls: {
                    urlInfos: [
                        { url: 'http://url-fail/1', baselineStatus: 'existing' },
                        { url: 'http://url-fail/2', baselineStatus: 'new' },
                    ],
                },
            },
        } as unknown as CardResult,
        {
            identifiers: {
                urls: {
                    urlInfos: [],
                },
            },
        } as unknown as CardResult,
        {
            identifiers: {},
        } as unknown as CardResult,
    ];

    it('counts by cards', () => {
        expect(countByCards(testCards)).toEqual(4);
    });

    it('counts by identifier urls', () => {
        expect(countByIdentifierUrls(testCards)).toEqual(5);
    });
});
