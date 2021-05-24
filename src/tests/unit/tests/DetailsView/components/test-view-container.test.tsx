// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { TestViewType } from 'common/types/test-view-type';
import { VisualizationType } from 'common/types/visualization-type';
import {
    TestViewContainer,
    TestViewContainerProps,
} from 'DetailsView/components/test-view-container';
import { shallow } from 'enzyme';
import * as React from 'react';
import { ContentPageComponent } from 'views/content/content-page';

describe('TestViewContainer', () => {
    describe.each(['AdhocStatic', 'AdhocFailure', 'AdhocNeedsReview', 'Assessment'])(
        'for testViewType=%s',
        (testViewType: TestViewType) => {
            const selectedTest: VisualizationType = -1;
            let configStub: VisualizationConfiguration;
            let configFactoryStub: VisualizationConfigurationFactory;
            let props: TestViewContainerProps;
            beforeEach(() => {
                configStub = {
                    key: 'configStub',
                    testViewType,
                } as VisualizationConfiguration;

                configFactoryStub = {
                    getConfiguration: (visualizationType: VisualizationType) => configStub,
                } as VisualizationConfigurationFactory;

                props = {
                    someParentProp: 'parent-prop',
                    visualizationConfigurationFactory: configFactoryStub,
                    selectedTest,
                } as unknown as TestViewContainerProps;
            });

            it('renders per snapshot with no testViewOverrides', () => {
                configStub.testViewOverrides = undefined;
                const rendered = shallow(<TestViewContainer {...props} />);
                expect(rendered.getElement()).toMatchSnapshot();
            });

            it('renders per snapshot with testViewOverrides', () => {
                configStub.testViewOverrides = {
                    content: stubContentPageComponent('content'),
                    guidance: stubContentPageComponent('guidance'),
                };
                const rendered = shallow(<TestViewContainer {...props} />);
                expect(rendered.getElement()).toMatchSnapshot();
            });

            function stubContentPageComponent(identifier: string): ContentPageComponent {
                return `stub content page component "${identifier}"` as unknown as ContentPageComponent;
            }
        },
    );
});
