// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnumHelper } from '../../../../../../common/enum-helper';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import {
    getOverviewKey,
    getReflowRequirementViewKey,
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

describe('getReflowKey', () => {
    const types = EnumHelper.getNumericValues<VisualizationType>(VisualizationType);
    describe.each(types)('returns using VisualizationType', visualizationType => {
        it('for ' + VisualizationType[visualizationType], () => {
            const requirementName = 'requirement-name';
            expect(
                getReflowRequirementViewKey({
                    visualizationType: visualizationType,
                    selectedSubview: requirementName,
                }),
            ).toEqual(`${VisualizationType[visualizationType]}: ${requirementName}`);
        });
    });
});
