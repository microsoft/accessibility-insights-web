// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DisplayableVisualizationTypeData } from 'common/types/displayable-visualization-type-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import {
    ScanData,
    TestsEnabledState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    AdhocStaticTestView,
    AdhocStaticTestViewDeps,
    AdhocStaticTestViewProps,
} from 'DetailsView/components/adhoc-static-test-view';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, MockBehavior } from 'typemoq';
import { ContentReference } from 'views/content/content-page';

describe('AdhocStaticTestView', () => {
    let props: AdhocStaticTestViewProps;
    let getStoreDataMock: IMock<(data: TestsEnabledState) => ScanData>;
    let clickHandlerFactoryMock: IMock<DetailsViewToggleClickHandlerFactory>;
    let displayableDataStub: DisplayableVisualizationTypeData;
    let scanDataStub: ScanData;
    let clickHandlerStub: (event: any) => void;
    let visualizationStoreDataStub: VisualizationStoreData;
    let selectedTest: VisualizationType;
    let featureFlagStoreDataStub: FeatureFlagStoreData;

    beforeEach(() => {
        getStoreDataMock = Mock.ofInstance(() => null, MockBehavior.Strict);
        clickHandlerFactoryMock = Mock.ofType(
            DetailsViewToggleClickHandlerFactory,
            MockBehavior.Strict,
        );
        displayableDataStub = {
            title: 'test title',
            toggleLabel: 'test toggle label',
        } as DisplayableVisualizationTypeData;
        scanDataStub = {
            enabled: true,
        };
        visualizationStoreDataStub = {
            tests: {},
        } as VisualizationStoreData;
        clickHandlerStub = () => {};
        selectedTest = -1;
        featureFlagStoreDataStub = {};

        props = {
            configuration: {
                getStoreData: getStoreDataMock.object,
                displayableData: displayableDataStub,
            },
            clickHandlerFactory: clickHandlerFactoryMock.object,
            visualizationStoreData: visualizationStoreDataStub,
            selectedTest,
            featureFlagStoreData: featureFlagStoreDataStub,
            deps: Mock.ofType<AdhocStaticTestViewDeps>().object,
        } as AdhocStaticTestViewProps;

        getStoreDataMock
            .setup(gsdm => gsdm(visualizationStoreDataStub.tests))
            .returns(() => scanDataStub)
            .verifiable();

        clickHandlerFactoryMock
            .setup(chfm => chfm.createClickHandler(selectedTest, !scanDataStub.enabled))
            .returns(() => clickHandlerStub)
            .verifiable();
    });

    it('should return target page changed view as tab is changed', () => {
        props.tabStoreData = {
            isChanged: true,
        };
        props.content = Mock.ofType<ContentReference>().object;

        const actual = shallow(<AdhocStaticTestView {...props} />);
        expect(actual.debug()).toMatchSnapshot();
        verifyAll();
    });

    describe('render', () => {
        const stubGuidance = 'stub-guidance' as ContentReference;
        const stubContent = 'stub-content' as ContentReference;

        const scenarios = [
            ['content & guidance', stubContent, stubGuidance],
            ['content & no guidance', stubContent, null],
            ['no content & guidance', null, stubGuidance],
            ['no content & no guidance', null, null],
        ];

        it.each(scenarios)('handles %s', (_, content, guidance) => {
            props.deps = 'stub-deps' as unknown as AdhocStaticTestViewDeps;
            props.tabStoreData = {
                isChanged: false,
            };

            if (content) {
                props.content = content;
            }

            if (guidance) {
                props.guidance = guidance;
            }

            const wrapper = shallow(<AdhocStaticTestView {...props} />);
            expect(wrapper.debug()).toMatchSnapshot();
            verifyAll();
        });
    });

    function verifyAll(): void {
        getStoreDataMock.verifyAll();
        clickHandlerFactoryMock.verifyAll();
    }
});
