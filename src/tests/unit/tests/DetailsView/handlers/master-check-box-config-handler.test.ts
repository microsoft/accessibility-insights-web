// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentActionMessageCreator } from 'DetailsView/actions/assessment-action-message-creator';
import { Mock, Times } from 'typemoq';

import { AssessmentNavState } from '../../../../../common/types/store-data/assessment-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { MasterCheckBoxConfigProvider } from '../../../../../DetailsView/handlers/master-checkbox-config-provider';

describe('MasterCheckBoxConfigProviderTest', () => {
    test('getMasterCheckBoxProperty: allEnabled = true', () => {
        const allEnabled = true;
        const navState: AssessmentNavState = {
            selectedTestType: VisualizationType.HeadingsAssessment,
            selectedTestSubview: '',
        };
        const assessmentActionMessageCreatorMock = Mock.ofType(AssessmentActionMessageCreator);
        assessmentActionMessageCreatorMock
            .setup(acm =>
                acm.changeAssessmentVisualizationStateForAll(
                    false,
                    navState.selectedTestType,
                    navState.selectedTestSubview,
                ),
            )
            .verifiable(Times.once());
        const provider = new MasterCheckBoxConfigProvider(
            assessmentActionMessageCreatorMock.object,
        );

        const config = provider.getMasterCheckBoxProperty(navState, allEnabled);
        config.onColumnClick(null, null);

        expect(config.iconName).toBe('view');
        expect(config.iconClassName).toBe('master-visualization-column-header-selected');
        expect(config.name).toBe('Visualization toggle');
        expect(config.ariaLabel).toBe('Hide all visualizations');

        assessmentActionMessageCreatorMock.verifyAll();
    });

    test('getMasterCheckBoxProperty: allEnabled = false', () => {
        const allEnabled = false;
        const navState: AssessmentNavState = {
            selectedTestType: VisualizationType.HeadingsAssessment,
            selectedTestSubview: '',
        };

        const provider = new MasterCheckBoxConfigProvider(null);

        const config = provider.getMasterCheckBoxProperty(navState, allEnabled);

        expect(config.iconName).toBe('checkbox');
        expect(config.iconClassName).toBeDefined();
        expect(config.iconClassName.trim()).toHaveLength(0);
        expect(config.name).toBe('Visualization toggle');
        expect(config.ariaLabel).toBe('Show all visualizations');
    });
});
