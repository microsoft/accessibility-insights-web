// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    CommandBarProps,
    DetailsViewCommandBarProps,
} from 'DetailsView/components/details-view-command-bar';
import {
    shouldShowReportExportButtonForAssessment,
    shouldShowReportExportButtonForFastpass,
} from 'DetailsView/components/should-show-report-export-button';
import { ScanResults } from 'scanner/iruleresults';

describe('ReportExportDialogFactory', () => {
    let visualizationScanResultData: VisualizationScanResultData;
    let visualizationStoreData: VisualizationStoreData;
    let scanResult: ScanResults;

    beforeEach(() => {
        scanResult = null;
        visualizationStoreData = {} as VisualizationStoreData;
    });

    function getProps(): DetailsViewCommandBarProps {
        visualizationScanResultData = {
            issues: {
                scanResult: scanResult,
            },
        } as VisualizationScanResultData;

        return {
            visualizationScanResultData,
            visualizationStoreData,
        } as DetailsViewCommandBarProps;
    }

    function setSelectedFastPassDetailsView(test: VisualizationType): void {
        visualizationStoreData = {
            selectedFastPassDetailsView: test,
        } as VisualizationStoreData;
    }

    function setScanResults(): void {
        scanResult = {} as ScanResults;
    }

    describe('shouldShowReportExportButtonForAssessment', () => {
        test('returns true', () => {
            const props = {} as CommandBarProps;
            const shouldShowButton = shouldShowReportExportButtonForAssessment(props);

            expect(shouldShowButton).toBe(true);
        });
    });

    describe('shouldShowReportExportButtonForFastpass', () => {
        test('returns falls if scanResults is null', () => {
            const props = getProps();
            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);

            expect(shouldShowButton).toBe(false);
        });

        test('returns false if scanResults is not null, test is Tabstop', () => {
            setScanResults();
            setSelectedFastPassDetailsView(VisualizationType.TabStops);
            const props = getProps();

            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);

            expect(shouldShowButton).toBe(false);
        });

        test('returns true if scanResults is not null, test is Issues', () => {
            setScanResults();
            setSelectedFastPassDetailsView(VisualizationType.Issues);
            const props = getProps();

            const shouldShowButton = shouldShowReportExportButtonForFastpass(props);

            expect(shouldShowButton).toBe(true);
        });
    });
});
