// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { It, Mock, MockBehavior } from 'typemoq';

import { VisualizationConfiguration } from '../../../../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../../../../common/configs/visualization-configuration-factory';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { TestViewContainer, TestViewContainerProps } from '../../../../../DetailsView/components/test-view-container';
import { exampleUnifiedStatusResults } from './cards/sample-view-model-data';

describe('TestViewContainerTest', () => {
    it('should not return the target page closed view', () => {
        const expectedTestView = <div />;
        const configFactoryMock = Mock.ofType<VisualizationConfigurationFactory>(null, MockBehavior.Strict);
        const getTestViewMock = Mock.ofInstance(_ => {}, MockBehavior.Strict);

        const configStub = {
            getTestView: getTestViewMock.object,
        } as VisualizationConfiguration;

        const props = {
            tabStoreData: {
                isClosed: false,
            },
            selectedTest: -1,
            visualizationConfigurationFactory: configFactoryMock.object,
            ruleResultsByStatus: exampleUnifiedStatusResults,
            featureFlagStoreData: { 'test-flag': true } as FeatureFlagStoreData,
        } as TestViewContainerProps;

        const expectedProps = {
            configuration: configStub,
            ...props,
            storeData: {
                featureFlagStoreData: { 'test-flag': true },
            },
        };

        configFactoryMock.setup(factory => factory.getConfiguration(props.selectedTest)).returns(() => configStub);

        getTestViewMock.setup(getter => getter(It.isValue(expectedProps))).returns(() => expectedTestView);

        const rendered = shallow(<TestViewContainer {...props} />);
        expect(rendered.getElement()).toMatchObject(expectedTestView);
    });
});
