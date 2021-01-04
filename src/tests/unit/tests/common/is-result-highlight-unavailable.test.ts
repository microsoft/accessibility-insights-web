// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    isResultHighlightUnavailableUnified,
    isResultHighlightUnavailableWeb,
} from 'common/is-result-highlight-unavailable';
import { PlatformData, UnifiedResult } from 'common/types/store-data/unified-data-interface';

describe('isResultHighlightUnavailableUnified', () => {
    test('unavailable: boundingRectangle is null', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {},
        } as UnifiedResult;

        expect(isResultHighlightUnavailableUnified(unifiedResult, {} as PlatformData)).toEqual(
            true,
        );
    });

    test('unavailable: platformData is null', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: { boundingRectangle: {} },
        } as UnifiedResult;

        expect(isResultHighlightUnavailableUnified(unifiedResult, null)).toEqual(true);
    });

    test('unavailable: viewPort data missing height', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    left: 0,
                    right: 1,
                    top: 0,
                    bottom: 1,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(true);
    });

    test('unavailable: viewPort data missing width', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    left: 0,
                    right: 1,
                    top: 0,
                    bottom: 1,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { height: 4 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(true);
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
            viewPortInfo: { width: 4, height: 10 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(true);
    });

    test('unavailable: boundingRectangle right value is negative', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    right: -5,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 1, height: 1 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(true);
    });

    test('unavailable: boundingRectangle bottom value is negative', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    bottom: -5,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 1, height: 1 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(true);
    });

    test('unavailable: boundingRectangle top value is greater than platform height', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    bottom: 0,
                    top: 50,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4, height: 10 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(true);
    });

    test('available: highlight is completely within the viewport', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    right: 2,
                    left: 0,
                    top: 2,
                    bottom: 5,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4, height: 10 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(false);
    });

    test('available: highlight is partially out of the viewport from the left', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    right: 2,
                    left: -5,
                    top: 2,
                    bottom: 5,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4, height: 10 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(false);
    });

    test('available: highlight is partially out of the viewport from the top', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    right: 2,
                    left: 0,
                    top: -2,
                    bottom: 5,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4, height: 10 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(false);
    });

    test('available: highlight is partially out of the viewport from the right', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    right: 5,
                    left: 1,
                    top: 2,
                    bottom: 5,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4, height: 10 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(false);
    });

    test('available: highlight is partially out of the viewport from the bottom', () => {
        const unifiedResult: UnifiedResult = {
            descriptors: {
                boundingRectangle: {
                    right: 2,
                    left: 1,
                    top: 2,
                    bottom: 15,
                },
            },
        } as UnifiedResult;
        const platformData: PlatformData = {
            viewPortInfo: { width: 4, height: 10 },
        } as PlatformData;

        expect(isResultHighlightUnavailableUnified(unifiedResult, platformData)).toEqual(false);
    });
});

describe('isResultHighlightUnavailableWeb', () => {
    test('should always be available', () => {
        expect(isResultHighlightUnavailableWeb(null, null)).toEqual(false);
    });
});
