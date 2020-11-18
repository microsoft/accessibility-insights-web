// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InstanceResultStatus,
    ScreenshotData,
    UnifiedResult,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { BoundingRectangle } from 'electron/platform/android/android-scan-results';
import { screenshotViewModelProvider } from 'electron/views/screenshot/screenshot-view-model-provider';
import {
    exampleUnifiedResult,
    exampleUnifiedResultWithBoundingRectangle,
} from 'tests/unit/tests/common/components/cards/sample-view-model-data';

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
            platformInfo: { viewPortInfo: { width: 1, height: 1 } },
        } as UnifiedScanResultStoreData;

        const output = screenshotViewModelProvider(unifiedScanResultStoreData, [
            exampleUnifiedResult.uid,
        ]);

        expect(output.highlightBoxViewModels).toStrictEqual([]);
    });

    it('provides no highlight boxes when the UnifiedScanResultStore has no viewPortInfo', () => {
        const storeScreenshotData: ScreenshotData = { base64PngData: 'test-data' };
        const unifiedScanResultStoreData = {
            screenshotData: storeScreenshotData,
            results: [exampleUnifiedResult],
        } as UnifiedScanResultStoreData;

        const output = screenshotViewModelProvider(unifiedScanResultStoreData, [
            exampleUnifiedResult.uid,
        ]);

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
        expect(output.highlightBoxViewModels[0].resultUid).toBe(
            resultCases.highlightedResultWithBoundingRectangle.uid,
        );
    });

    it('calculates highlight box positional values as percentages relative to the viewport size', () => {
        const viewPortWidth = 100;
        const viewPortHeight = 200;
        const boundingRectangle = {
            left: 20,
            top: 50,
            right: 80,
            bottom: 150,
        };
        const highlightBoxViewModel = provideHighlightBoxViewModelForResult(
            {
                ...exampleUnifiedResult,
                descriptors: { boundingRectangle },
            },
            viewPortWidth,
            viewPortHeight,
        );

        expect(highlightBoxViewModel.top).toBe('25%');
        expect(highlightBoxViewModel.left).toBe('20%');
        expect(highlightBoxViewModel.width).toBe('60%');
        expect(highlightBoxViewModel.height).toBe('50%');
    });

    it('uses ! to label failed results', () => {
        const highlightBoxViewModel = provideHighlightBoxViewModelForResult({
            ...exampleUnifiedResultWithBoundingRectangle,
            status: 'fail',
        });

        expect(highlightBoxViewModel.label).toBe('!');
    });

    it.each(['unknown', 'pass'])(
        'uses a null label for %s results',
        (status: InstanceResultStatus) => {
            const highlightBoxViewModel = provideHighlightBoxViewModelForResult({
                ...exampleUnifiedResultWithBoundingRectangle,
                status,
            });

            expect(highlightBoxViewModel.label).toBeNull();
        },
    );

    function provideHighlightBoxViewModelForResult(
        result: UnifiedResult,
        viewPortWidth: number = 10000,
        viewPortHeight: number = 10000,
    ) {
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
