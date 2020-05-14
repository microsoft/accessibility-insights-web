// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autoPassIfNoLandmarks } from 'assessments/landmarks/auto-pass-if-no-landmarks';
import { ManualTestStatus } from 'common/types/manual-test-status';
import { InstanceIdToInstanceDataMap } from 'common/types/store-data/assessment-result-data';

describe('autoPassIfNoLandmarks', () => {
    it('returns PASS for instance data with no landmarks', () => {
        const input = makeInputDataWithLandmarkRoles([]);
        expect(autoPassIfNoLandmarks(input)).toBe(ManualTestStatus.PASS);
    });

    it.each(['main', 'complementary'])(
        'returns UNKNOWN for instance data with one %s landmark',
        (landmarkRole: string) => {
            const input = makeInputDataWithLandmarkRoles([landmarkRole]);
            expect(autoPassIfNoLandmarks(input)).toBe(ManualTestStatus.UNKNOWN);
        },
    );

    it('returns UNKNOWN for instance data with multiple landmarks', () => {
        const input = makeInputDataWithLandmarkRoles(['main', 'complementary', 'header']);
        expect(autoPassIfNoLandmarks(input)).toBe(ManualTestStatus.UNKNOWN);
    });

    function makeInputDataWithLandmarkRoles(landmarkRoles: string[]): InstanceIdToInstanceDataMap {
        const data: InstanceIdToInstanceDataMap = {};
        for (const landmarkRole of landmarkRoles) {
            data[`#element-with-${landmarkRole}`] = {
                target: [`#element-with-${landmarkRole}`],
                html: `<div id="element-with-${landmarkRole}" role="${landmarkRole}" />`,
                propertyBag: {
                    role: landmarkRole,
                },
                testStepResults: {},
            };
        }
        return data;
    }
});
