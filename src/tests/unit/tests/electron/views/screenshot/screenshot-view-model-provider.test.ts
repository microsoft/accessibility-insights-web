// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PlatformData, ScreenshotData, UnifiedScanResultStoreData } from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/scan-results';
import { HighlightBoxViewModel } from 'electron/views/screenshot/screenshot-view-model';
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

        expect(output.highlightBoxViewModels).toStrictEqual([]);
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

    const platformInfosWithoutDeviceName: PlatformData[] = [null, {} as PlatformData, { deviceName: '' } as PlatformData];
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

    it('provides the deviceName from UnifiedScanResultStore when present', () => {
        const deviceNameFromStore = 'device name from store';
        const unifiedScanResultStoreData = {
            screenshotData: null,
            results: [],
            platformInfo: {
                deviceName: deviceNameFromStore,
            },
        } as UnifiedScanResultStoreData;

        const output = screenshotViewModelProvider(unifiedScanResultStoreData, []);

        expect(output.deviceName).toBe(deviceNameFromStore);
    });

    it('provides highlight boxes only for those results which are both highlighted and have a boundingRectangle', () => {
        const stubBoundingRectangle: BoundingRectangle = { top: 1, left: 2, bottom: 3, right: 4 };
        const highlightedUids = ['uid-highlighted-with-rect', 'uid-highlighted-without-rect'];
        const resultCases = {
            highlightedResultWithBoundingRectangle: {
                ...exampleUnifiedResult,
                uid: 'uid-highlighted-with-rect',
                descriptors: { boundingRectangle: stubBoundingRectangle },
            },
            highlightedResultWithoutBoundingRectangle: {
                ...exampleUnifiedResult,
                uid: 'uid-highlighted-without-rect',
                descriptors: {},
            },
            nonHighlightedResultWithBoundingRectangle: {
                ...exampleUnifiedResult,
                uid: 'uid-non-highlighted-with-rect',
                descriptors: { boundingRectangle: stubBoundingRectangle },
            },
            nonHighlightedResultWithoutBoundingRectangle: {
                ...exampleUnifiedResult,
                uid: 'uid-non-highlighted-without-rect',
                descriptors: {},
            },
        };

        const unifiedScanResultStoreData = {
            screenshotData: { base64PngData: 'any-non-null-screenshot-data' },
            results: Object.values(resultCases),
            platformInfo: { viewPortInfo: { width: 1, height: 1 } },
        } as UnifiedScanResultStoreData;

        const output = screenshotViewModelProvider(unifiedScanResultStoreData, highlightedUids);

        expect(output.highlightBoxViewModels).toHaveLength(1);
        expect(output.highlightBoxViewModels[0].resultUid).toBe(resultCases.highlightedResultWithBoundingRectangle.uid);
    });

    it('calculates highlight box width/height as px values based on bounding box width/height', () => {
        const inputRectangle = {
            top: 1,
            left: 12,
            right: 123,
            bottom: 1234,
        };
        const highlightBoxViewModel = provideHighlightBoxViewModelForBoundingRectangle(inputRectangle);

        expect(highlightBoxViewModel.width).toBe('122px'); // right - left px
        expect(highlightBoxViewModel.height).toBe('1233px'); // bottom - top px
    });

    it('calculates highlight box top/left as percentages relative to the viewport size', () => {
        const viewPortWidth = 100;
        const viewPortHeight = 200;
        const inputRectangle = {
            left: 20,
            top: 50,
            right: 12345, // irrelevant
            bottom: 12345, // irrelevant
        };
        const highlightBoxViewModel = provideHighlightBoxViewModelForBoundingRectangle(inputRectangle, viewPortWidth, viewPortHeight);

        expect(highlightBoxViewModel.top).toBe('25%');
        expect(highlightBoxViewModel.left).toBe('20%');
    });

    function provideHighlightBoxViewModelForBoundingRectangle(
        boundingRectangle: BoundingRectangle,
        viewPortWidth: number = 10000,
        viewPortHeight: number = 10000,
    ): HighlightBoxViewModel {
        const result = {
            ...exampleUnifiedResult,
            descriptors: { boundingRectangle },
        };
        const unifiedScanResultStoreData = {
            screenshotData: { base64PngData: 'any-non-null-screenshot-data' },
            results: [result],
            platformInfo: { viewPortInfo: { width: viewPortWidth, height: viewPortHeight } },
        } as UnifiedScanResultStoreData;

        const output = screenshotViewModelProvider(unifiedScanResultStoreData, [result.uid]);
        expect(output.highlightBoxViewModels).toHaveLength(1);
        return output.highlightBoxViewModels[0];
    }
});
