// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, MockBehavior } from 'typemoq';

import { VisualizationConfiguration } from '../../../../../common/configs/visualization-configuration';
import {
    DisplayableVisualizationTypeData,
    VisualizationConfigurationFactory,
} from '../../../../../common/configs/visualization-configuration-factory';
import {
    getOverviewTitle,
    getTestViewTitle,
    GetTestViewTitleProps,
} from '../../../../../DetailsView/handlers/get-document-title';

describe('getTestViewTitle', () => {
    it('should get title from displayable data from config factory', () => {
        const configFactory = Mock.ofType(VisualizationConfigurationFactory, MockBehavior.Strict);
        const displayableDataStub = {
            title: 'fake title',
        } as DisplayableVisualizationTypeData;
        const visualizationType = -1;
        const configStub = { displayableData: displayableDataStub } as VisualizationConfiguration;

        configFactory.setup(cf => cf.getConfiguration(visualizationType)).returns(() => configStub);

        const props: GetTestViewTitleProps = {
            visualizationConfigurationFactory: configFactory.object,
            selectedDetailsView: visualizationType,
        };

        expect(getTestViewTitle(props)).toEqual(displayableDataStub.title);
    });
});

describe('getOverviewTitle', () => {
    it('should return Overview', () => {
        expect(getOverviewTitle()).toEqual('Overview');
    });
});
