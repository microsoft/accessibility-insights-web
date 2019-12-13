// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IframeDetector } from 'injected/iframe-detector';
import { CrossOriginPermissionDetector, ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { IMock, Mock } from 'typemoq';

describe('ScanIncompleteWarningDetector', () => {
    let testSubject: ScanIncompleteWarningDetector;
    let iframeDetectorMock: IMock<IframeDetector>;
    let crossOriginPermissionDetectorMock: IMock<CrossOriginPermissionDetector>;

    beforeEach(() => {
        crossOriginPermissionDetectorMock = Mock.ofType<CrossOriginPermissionDetector>();
        iframeDetectorMock = Mock.ofType<IframeDetector>();
        testSubject = new ScanIncompleteWarningDetector(iframeDetectorMock.object, crossOriginPermissionDetectorMock.object);
    });

    it.each`
        iframesDetected | crossOriginPermissions | expectedResults
        ${true}         | ${true}                | ${[]}
        ${true}         | ${false}               | ${['missing-required-cross-origin-permissions']}
        ${false}        | ${true}                | ${[]}
        ${false}        | ${false}               | ${[]}
    `(
        'should detect $expectedResults if iframesDetected=$iframesDetected and crossOriginPermissions=$crossOriginPermissions',
        ({ iframesDetected, crossOriginPermissions, expectedResults }) => {
            iframeDetectorMock.setup(m => m.hasIframes()).returns(() => iframesDetected);
            crossOriginPermissionDetectorMock.setup(m => m.hasCrossOriginPermissions()).returns(() => crossOriginPermissions);

            expect(testSubject.detectScanIncompleteWarnings()).toStrictEqual(expectedResults);
        },
    );
});
