// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PlatformData, ScreenshotData, UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { screenshotViewModelProvider } from 'electron/views/screenshot/screenshot-view-model-provider';
import { exampleUnifiedResult } from 'tests/unit/tests/common/components/cards/sample-view-model-data';

describe('screenshotViewModelProvider', () => {
    it('provides a null screenshotData when the UnifiedScanResultStore has no screenshotData', () => {
        const unifiedScanResultStoreData = {
            screenshotData: null,
            results: [],
        } as UnifiedScanResultStoreData;

        const output = screenshotViewModelProvider(unifiedScanResultStoreData, []);

        expect(output.screenshotData).toBeNull();
    });

    it('provides no highlight boxes when the UnifiedScanResultStore has no screenshotData', () => {
        const unifiedScanResultStoreData = {
            screenshotData: null,
            results: [exampleUnifiedResult],
        } as UnifiedScanResultStoreData;

        const output = screenshotViewModelProvider(unifiedScanResultStoreData, [exampleUnifiedResult.uid]);

        expect(output.highlightBoxRectangles).toStrictEqual([]);
    });

    it("provides the store's screenshotData when the UnifiedScanResultStore has screenshotData", () => {
        const storeScreenshotData: ScreenshotData = { base64PngData: 'test-data' };
        const unifiedScanResultStoreData = {
            screenshotData: storeScreenshotData,
            results: [],
        } as UnifiedScanResultStoreData;

        const output = screenshotViewModelProvider(unifiedScanResultStoreData, []);

        expect(output.screenshotData).toBe(storeScreenshotData);
    });

    const platformInfosWithoutDeviceName: PlatformData[] = [null, {} as PlatformData];
    it.each(platformInfosWithoutDeviceName)(
        'provides a null deviceName when the UnifiedScanResultStore has platformInfo %p',
        (platformInfo?: PlatformData) => {
            const unifiedScanResultStoreData = {
                screenshotData: null,
                results: [],
                platformInfo,
            } as UnifiedScanResultStoreData;

            const output = screenshotViewModelProvider(unifiedScanResultStoreData, []);

            expect(output.deviceName).toBeNull();
        },
    );

    it('provides highlightBoxRectangles for each result in highlightedResultUids with a boundingRectangle', () => {
        const expectedBoundingRectangle: BoundingRectangle = {
            top: 1,
            left: 2,
            bottom: 3,
            right: 4,
        };
        const unexpectedBoundingRectangle: BoundingRectangle = {
            top: 5,
            left: 6,
            bottom: 7,
            right: 8,
        };
        const highlightedUids = ['uid-highlighted-1', 'uid-highlighted-2'];
        const resultCases = {
            highlightedResultWithBoundingRectangle: {
                ...exampleUnifiedResult,
                uid: 'uid-highlighted-1',
                descriptors: {
                    boundingRectangle: expectedBoundingRectangle,
                },
            },
            highlightedResultWithoutBoundingRectangle: {
                ...exampleUnifiedResult,
                uid: 'uid-highlighted-2',
                descriptors: {},
            },
            nonHighlightedResultWithBoundingRectangle: {
                ...exampleUnifiedResult,
                uid: 'uid-non-highlighted-1',
                descriptors: {
                    boundingRectangle: unexpectedBoundingRectangle,
                },
            },
            nonHighlightedResultWithoutBoundingRectangle: {
                ...exampleUnifiedResult,
                uid: 'uid-non-highlighted-2',
                descriptors: {},
            },
        };

        const unifiedScanResultStoreData = {
            screenshotData: { base64PngData: 'any-non-null-screenshot-data' },
            results: Object.values(resultCases),
        } as UnifiedScanResultStoreData;

        const output = screenshotViewModelProvider(unifiedScanResultStoreData, highlightedUids);

        expect(output.highlightBoxRectangles).toStrictEqual([
            resultCases.highlightedResultWithBoundingRectangle.descriptors.boundingRectangle,
        ]);
    });
});
