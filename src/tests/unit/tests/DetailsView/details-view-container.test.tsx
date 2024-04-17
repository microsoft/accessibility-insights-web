// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Spinner } from '@fluentui/react';
import { render } from '@testing-library/react';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    DetailsViewContainer,
    DetailsViewContainerProps,
} from 'DetailsView/details-view-container';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';
import { NarrowModeDetector } from '../../../../DetailsView/components/narrow-mode-detector';
import { NoContentAvailable } from '../../../../DetailsView/components/no-content-available/no-content-available';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../mock-helpers/mock-module-helpers';
jest.mock('../../../../DetailsView/components/no-content-available/no-content-available');
jest.mock('@fluentui/react');
jest.mock('../../../../DetailsView/components/narrow-mode-detector');
describe('DetailsViewContainer', () => {
    mockReactComponents([NarrowModeDetector, NoContentAvailable, Spinner]);
    let detailsViewActionMessageCreator: IMock<DetailsViewActionMessageCreator>;

    beforeEach(() => {
        detailsViewActionMessageCreator = Mock.ofType(DetailsViewActionMessageCreator);
    });

    describe('render', () => {
        it('renders spinner when stores not ready', () => {
            const storesHubMock = Mock.ofType(ClientStoresHub);

            const props: DetailsViewContainerProps = {
                storeState: null,
                deps: {
                    storesHub: storesHubMock.object,
                },
            } as DetailsViewContainerProps;

            storesHubMock.setup(mock => mock.hasStores()).returns(() => true);
            storesHubMock.setup(mock => mock.hasStoreData()).returns(() => false);

            const renderResult = render(<DetailsViewContainer {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([NarrowModeDetector]);
        });
    });

    describe('render content', () => {
        it('show NoContentAvailable when stores are not loaded', () => {
            const storesHubMock = Mock.ofType(ClientStoresHub);

            const props: DetailsViewContainerProps = {
                storeState: null,
                deps: {
                    storesHub: storesHubMock.object,
                },
            } as DetailsViewContainerProps;

            storesHubMock.setup(mock => mock.hasStores()).returns(() => false);

            const renderResult = render(<DetailsViewContainer {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([NarrowModeDetector]);
        });

        it('show NoContentAvailable when target tab is closed', () => {
            const storesHubMock = Mock.ofType(ClientStoresHub);

            const props: DetailsViewContainerProps = {
                storeState: {
                    tabStoreData: {
                        isClosed: true,
                    },
                    featureFlagStoreData: {} as FeatureFlagStoreData,
                },
                deps: {
                    storesHub: storesHubMock.object,
                },
            } as DetailsViewContainerProps;

            storesHubMock.setup(mock => mock.hasStores()).returns(() => true);
            storesHubMock.setup(mock => mock.hasStoreData()).returns(() => true);

            const renderResult = render(<DetailsViewContainer {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([NarrowModeDetector]);
        });

        it('shows NoContentAvailable when target page is changed and no permissions granted', () => {
            const storesHubMock = Mock.ofType(ClientStoresHub);

            const props: DetailsViewContainerProps = {
                storeState: {
                    tabStoreData: {
                        isClosed: false,
                        isOriginChanged: true,
                    },
                    permissionsStateStoreData: {
                        hasAllUrlAndFilePermissions: false,
                    },
                    featureFlagStoreData: {} as FeatureFlagStoreData,
                },
                deps: {
                    storesHub: storesHubMock.object,
                },
            } as DetailsViewContainerProps;

            storesHubMock.setup(mock => mock.hasStores()).returns(() => true);
            storesHubMock.setup(mock => mock.hasStoreData()).returns(() => true);

            const renderResult = render(<DetailsViewContainer {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([NarrowModeDetector]);
        });

        it('render once; should call details view opened', () => {
            const storesHubMock = Mock.ofType(ClientStoresHub);
            const selectedDetailsViewPivotStub: DetailsViewPivotType = -1 as DetailsViewPivotType;
            const props: DetailsViewContainerProps = {
                storeState: {
                    tabStoreData: {
                        isClosed: false,
                        isOriginChanged: false,
                    },
                    visualizationStoreData: {
                        selectedDetailsViewPivot: selectedDetailsViewPivotStub,
                    },
                },
                deps: {
                    storesHub: storesHubMock.object,
                    detailsViewActionMessageCreator: detailsViewActionMessageCreator.object,
                },
            } as DetailsViewContainerProps;

            storesHubMock.setup(mock => mock.hasStores()).returns(() => true);
            storesHubMock.setup(mock => mock.hasStoreData()).returns(() => true);

            detailsViewActionMessageCreator
                .setup(mock => mock.detailsViewOpened(selectedDetailsViewPivotStub))
                .verifiable();

            const renderResult = render(<DetailsViewContainer {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
            expectMockedComponentPropsToMatchSnapshots([NarrowModeDetector]);
            detailsViewActionMessageCreator.verifyAll();
        });

        it('render twice; should not call details view opened on second render', () => {
            const storesHubMock = Mock.ofType(ClientStoresHub);
            const selectedDetailsViewPivotStub: DetailsViewPivotType = -1 as DetailsViewPivotType;
            const props: DetailsViewContainerProps = {
                storeState: {
                    tabStoreData: {
                        isClosed: false,
                        isOriginChanged: false,
                    },
                    visualizationStoreData: {
                        selectedDetailsViewPivot: selectedDetailsViewPivotStub,
                    },
                },
                deps: {
                    storesHub: storesHubMock.object,
                    detailsViewActionMessageCreator: detailsViewActionMessageCreator.object,
                },
            } as DetailsViewContainerProps;

            storesHubMock.setup(mock => mock.hasStores()).returns(() => true);
            storesHubMock.setup(mock => mock.hasStoreData()).returns(() => true);

            const testObject = new DetailsViewContainer(props);

            setupActionMessageCreatorMock(
                detailsViewActionMessageCreator,
                selectedDetailsViewPivotStub,
                1,
            );
            testObject.render();
            detailsViewActionMessageCreator.verifyAll();
            detailsViewActionMessageCreator.reset();
            setupActionMessageCreatorMock(
                detailsViewActionMessageCreator,
                selectedDetailsViewPivotStub,
                0,
            );

            testObject.render();
            detailsViewActionMessageCreator.verifyAll();
        });
    });

    function setupActionMessageCreatorMock(
        mock: IMock<DetailsViewActionMessageCreator>,
        pivot: DetailsViewPivotType,
        timesCalled: number,
    ): void {
        mock.setup(acm => acm.detailsViewOpened(pivot)).verifiable(Times.exactly(timesCalled));
    }
});
