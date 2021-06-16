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
                    urls: ['http://url-fail/1', 'http://url-fail/2'],
                },
            },
        } as unknown as CardResult,
        {
            identifiers: {
                urls: {
                    urls: ['http://url-fail/1'],
                },
            },
        } as unknown as CardResult,
        {
            identifiers: {
                urls: {
                    urls: [],
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
        expect(countByIdentifierUrls(testCards)).toEqual(3);
    });
});
