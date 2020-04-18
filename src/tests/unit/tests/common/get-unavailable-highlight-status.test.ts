// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    getUnavailableHighlightStatusUnified,
    getUnavailableHighlightStatusWeb,
} from 'common/get-unavailable-highlight-status';
import { PlatformData, UnifiedResult } from 'common/types/store-data/unified-data-interface';

describe('getUnavailableHighlightStatusUnified', () => {
    test('unavailable: boundingRectangle is null', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {},
        } as UnifiedResult;

        expect(getUnavailableHighlightStatusUnified(unifiedResult, {} as PlatformData)).toEqual(
            true,
        );
    });

    test('unavailable: platformData is null', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: { boundingRectangle: {} },
        } as UnifiedResult;

        expect(getUnavailableHighlightStatusUnified(unifiedResult, null)).toEqual(true);
    });

    test('unavailable: boundingRectangle left value is greater than platform width', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    left: 5,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4 },
        } as PlatformData;

        expect(getUnavailableHighlightStatusUnified(unifiedResult, platformData)).toEqual(true);
    });

    test('unavailable: boundingRectangle left value is negative', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    left: -5,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {} as PlatformData;

        expect(getUnavailableHighlightStatusUnified(unifiedResult, platformData)).toEqual(true);
    });

    test('unavailable: boundingRectangle top value is negative', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    top: -5,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {} as PlatformData;

        expect(getUnavailableHighlightStatusUnified(unifiedResult, platformData)).toEqual(true);
    });

    test('unavailable: boundingRectangle top value is greater than platform height', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    left: 0,
                    top: 50,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4, height: 10 },
        } as PlatformData;

        expect(getUnavailableHighlightStatusUnified(unifiedResult, platformData)).toEqual(true);
    });

    test('available: highlight is at least partially within the viewport', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    left: 0,
                    top: 0,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4, height: 10 },
        } as PlatformData;

        expect(getUnavailableHighlightStatusUnified(unifiedResult, platformData)).toEqual(false);
    });
});

describe('getUnavailableHighlightStatusWeb', () => {
    test('should always be available', () => {
        expect(getUnavailableHighlightStatusWeb(null, null)).toEqual(false);
    });
});
