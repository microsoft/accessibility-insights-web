// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from 'common/configs/visualization-configuration-factory';
import { AutomatedChecksCardSelectionMessageCreator } from 'common/message-creators/automated-checks-card-selection-message-creator';
import { NeedsReviewCardSelectionMessageCreator } from 'common/message-creators/needs-review-card-selection-message-creator';
import { TabStopRequirementState } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    TestViewContainer,
    TestViewContainerProps,
} from 'DetailsView/components/test-view-container';
import {
    TestViewContainerProvider,
    TestViewContainerProviderProps,
} from 'DetailsView/components/test-view-container-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('TestViewContainer', () => {
    const selectedTest: VisualizationType = -1;
    const elementStub = <div />;
    const automatedChecksCardSelectionMessageCreatorStub =
        {} as AutomatedChecksCardSelectionMessageCreator;
    const needsReviewCardSelectionMessageCreatorStub = {} as NeedsReviewCardSelectionMessageCreator;
    let configStub: VisualizationConfiguration;
    let configFactoryStub: VisualizationConfigurationFactory;
    let props: TestViewContainerProps;
    let getTestViewContainerMock: IMock<
        (provider: TestViewContainerProvider, props: TestViewContainerProviderProps) => JSX.Element
    >;
    let testViewContainerProviderMock: IMock<TestViewContainerProvider>;

    beforeEach(() => {
        getTestViewContainerMock = Mock.ofInstance((provider, props) => null);
        testViewContainerProviderMock = Mock.ofType<TestViewContainerProvider>();

        configStub = {
            key: 'configStub',
            getTestViewContainer: getTestViewContainerMock.object,
        } as VisualizationConfiguration;

        configFactoryStub = {
            getConfiguration: _ => configStub,
        } as VisualizationConfigurationFactory;

        props = {
            deps: {
                automatedChecksCardSelectionMessageCreator:
                    automatedChecksCardSelectionMessageCreatorStub,
                needsReviewCardSelectionMessageCreator: needsReviewCardSelectionMessageCreatorStub,
            },
            someParentProp: 'parent-prop',
            visualizationConfigurationFactory: configFactoryStub,
            selectedTest,
            visualizationScanResultData: {
                tabStops: {
                    requirements: {} as TabStopRequirementState,
                },
            },
            testViewContainerProvider: testViewContainerProviderMock.object,
        } as unknown as TestViewContainerProps;
    });

    it('renders per snapshot', () => {
        getTestViewContainerMock
            .setup(gtc =>
                gtc(testViewContainerProviderMock.object, {
                    configuration: configStub,
                    ...props,
                    automatedChecksCardSelectionMessageCreator:
                        automatedChecksCardSelectionMessageCreatorStub,
                    needsReviewCardSelectionMessageCreator:
                        needsReviewCardSelectionMessageCreatorStub,
                }),
            )
            .returns(() => elementStub)
            .verifiable(Times.once());
        const rendered = shallow(<TestViewContainer {...props} />);
        expect(rendered.getElement()).toEqual(elementStub);
        getTestViewContainerMock.verifyAll();
    });
});
