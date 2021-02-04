// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanUnscannedRequirement } from 'background/scan-unscanned-requirement';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { AssessmentData } from '../../../../common/types/store-data/assessment-result-data';

describe('ScanUnscannedRequirement', () => {
    let scheduleScanMock: IMock<(step: string) => void>;

    beforeEach(() => {
        scheduleScanMock = Mock.ofInstance((step: string) => null, MockBehavior.Strict);
    });

    it('exists', () => {
        expect(ScanUnscannedRequirement).toBeDefined();
    });

    it('calls a non enabled test step', () => {
        const stepStub = 'step stub';
        const assessmentData: AssessmentData = {
            fullAxeResultsMap: null,
            testStepStatus: {
                'scanned step': {
                    isStepScanned: true,
                    stepFinalResult: null,
                },
                [stepStub]: {
                    isStepScanned: false,
                    stepFinalResult: null,
                },
            },
        };

        scheduleScanMock.setup(ssm => ssm(stepStub)).verifiable();

        ScanUnscannedRequirement(scheduleScanMock.object, assessmentData);

        scheduleScanMock.verifyAll();
    });

    it('do not scan when all steps enabled', () => {
        const assessmentData: AssessmentData = {
            fullAxeResultsMap: null,
            testStepStatus: {
                'scanned step': {
                    isStepScanned: true,
                    stepFinalResult: null,
                },
            },
        };

        scheduleScanMock.setup(ssm => ssm(It.isAny())).verifiable(Times.never());

        ScanUnscannedRequirement(scheduleScanMock.object, assessmentData);

        scheduleScanMock.verifyAll();
    });
});
