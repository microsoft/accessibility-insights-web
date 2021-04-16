// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EnumHelper } from 'common/enum-helper';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ScanStoreData } from 'electron/flux/types/scan-store-data';
import { sharedScanResultsStartOverButtonSettings } from 'electron/platform/android/test-configs/shared-scan-results/start-over-button-settings';
import {
    ReflowCommandBarDeps,
    ReflowCommandBarProps,
} from 'electron/views/results/components/reflow-command-bar';
import { Mock, MockBehavior, Times } from 'typemoq';

describe('sharedScanResultsStartOverButtonSettings', () => {
    let props: ReflowCommandBarProps;

    beforeEach(() => {
        props = {
            scanStoreData: {
                status: ScanStatus.Completed,
            },
        } as ReflowCommandBarProps;
    });

    it('Disabled when status is Scanning', () => {
        props.scanStoreData = {
            status: ScanStatus.Scanning,
        } as ScanStoreData;

        expect(sharedScanResultsStartOverButtonSettings(props).disabled).toBeTruthy();
    });

    const notScanningStatuses = EnumHelper.getNumericValues<ScanStatus>(ScanStatus)
        .filter(status => status !== ScanStatus.Scanning)
        .map(status => ScanStatus[status]);

    it.each(notScanningStatuses)('Not Disabled when status is <%s>', status => {
        props.scanStoreData = {
            status: ScanStatus[status],
        } as ScanStoreData;

        expect(sharedScanResultsStartOverButtonSettings(props).disabled).toBeFalsy();
    });

    it('clickHandler is called properly', () => {
        const scanPort = 1234;
        const scanActionCreatorMock = Mock.ofType<ScanActionCreator>(
            undefined,
            MockBehavior.Strict,
        );
        scanActionCreatorMock.setup(m => m.scan(scanPort)).verifiable(Times.once());
        props.deps = {
            scanActionCreator: scanActionCreatorMock.object,
        } as ReflowCommandBarDeps;
        props.scanPort = scanPort;

        sharedScanResultsStartOverButtonSettings(props).onClick(null);

        scanActionCreatorMock.verifyAll();
    });
});
