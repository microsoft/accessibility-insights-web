// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnumHelper } from '../../../../../../common/enum-helper';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import {
    getGettingStartedViewKey,
    getOverviewKey,
    getRequirementViewKey,
    getTestViewKey,
} from '../../../../../../DetailsView/components/left-nav/get-left-nav-selected-key';

describe('getOverviewKey', () => {
    it('returns Overview', () => {
        expect(getOverviewKey()).toEqual('Overview');
    });
});

describe('getTestviewKey', () => {
    const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
    describe.each(types)('returns using VisualizationType', visualizationType => {
        it('for ' + VisualizationType[visualizationType], () => {
            expect(
                getTestViewKey({ visualizationType: visualizationType, selectedSubview: 'test' }),
            ).toEqual(VisualizationType[visualizationType]);
        });
    });
});

describe('getRequirementViewKey', () => {
    it('returns requirement name', () => {
        const requirementName = 'requirement-name';
        expect(
            getRequirementViewKey({
                visualizationType: 1,
                selectedSubview: requirementName,
            }),
        ).toEqual(requirementName);
    });
});

describe('getGettingStartedViewKey', () => {
    it('returns prefixed with VisualizationType', () => {
        const selectedSubview = 'subview';
        const visualizationType: VisualizationType = 1;
        const expectedKey = `${VisualizationType[visualizationType]}: ${selectedSubview}`;
        expect(
            getGettingStartedViewKey({
                visualizationType,
                selectedSubview,
            }),
        ).toEqual(expectedKey);
    });
});
