// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, MockBehavior } from 'typemoq';

import {
    IDisplayableVisualizationTypeData,
    IVisualizationConfiguration,
    VisualizationConfigurationFactory,
} from '../../../../../common/configs/visualization-configuration-factory';
import { getOverviewTitle, getTestViewTitle, GetTestViewTitleProps } from '../../../../../DetailsView/handlers/get-document-title';

describe('getTestViewTitle', () => {
    it('should get title from displayable data from config factory', () => {
        const configFactory = Mock.ofType(VisualizationConfigurationFactory, MockBehavior.Strict);
        const displayableDataStub = {
            title: 'fake title',
        } as IDisplayableVisualizationTypeData;
        const type = -1;
        const configStub = { displayableData: displayableDataStub } as IVisualizationConfiguration;

        configFactory.setup(cf => cf.getConfiguration(type)).returns(() => configStub);

        const props: GetTestViewTitleProps = {
            visualizationConfigurationFactory: configFactory.object,
            selectedDetailsView: type,
        };

        expect(getTestViewTitle(props)).toEqual(displayableDataStub.title);
    });
});

describe('getOverviewTitle', () => {
    it('should return Overview', () => {
        expect(getOverviewTitle()).toEqual('Overview');
    });
});
