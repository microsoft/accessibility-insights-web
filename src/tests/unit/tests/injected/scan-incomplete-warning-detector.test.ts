// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseStore } from 'common/base-store';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { IframeDetector } from 'injected/iframe-detector';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { ScanResults } from 'scanner/iruleresults';
import { IMock, Mock } from 'typemoq';

describe('ScanIncompleteWarningDetector', () => {
    let testSubject: ScanIncompleteWarningDetector;
    let iframeDetectorMock: IMock<IframeDetector>;
    let permissionsStateStoreMock: IMock<BaseStore<PermissionsStateStoreData, Promise<void>>>;

    beforeEach(() => {
        permissionsStateStoreMock =
            Mock.ofType<BaseStore<PermissionsStateStoreData, Promise<void>>>();
        iframeDetectorMock = Mock.ofType<IframeDetector>();
        testSubject = new ScanIncompleteWarningDetector(
            iframeDetectorMock.object,
            permissionsStateStoreMock.object,
        );
    });

    it.each`
        iframesDetected | hasAllUrlAndFilePermissions | expectedResults
        ${true}         | ${true}                     | ${[]}
        ${true}         | ${false}                    | ${['missing-required-cross-origin-permissions']}
        ${false}        | ${true}                     | ${[]}
        ${false}        | ${false}                    | ${[]}
    `(
        'should detect $expectedResults if iframesDetected=$iframesDetected and crossOriginPermissions=$crossOriginPermissions',
        ({ iframesDetected, hasAllUrlAndFilePermissions, expectedResults }) => {
            iframeDetectorMock.setup(m => m.hasIframes()).returns(() => iframesDetected);
            permissionsStateStoreMock
                .setup(m => m.getState())
                .returns(() => ({ hasAllUrlAndFilePermissions }));

            expect(testSubject.detectScanIncompleteWarnings(null)).toStrictEqual(expectedResults);
        },
    );

    it('should detect no frames skipped if results are null', () => {
        expect(testSubject.detectScanIncompleteWarnings(null)).toStrictEqual([]);
    });

    it.each([true, false])(
        'should detect frames skipped correctly if results frames skipped is %s',
        (resultsFramesSkipped: boolean) => {
            const results = { framesSkipped: resultsFramesSkipped } as ScanResults;

            expect(testSubject.detectScanIncompleteWarnings(results)).toStrictEqual(
                resultsFramesSkipped ? ['frame-skipped'] : [],
            );
        },
    );
});
