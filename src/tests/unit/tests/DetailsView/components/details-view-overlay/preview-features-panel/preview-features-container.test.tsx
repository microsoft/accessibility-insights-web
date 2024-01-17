// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { DisplayableFeatureFlag } from 'common/types/store-data/displayable-feature-flag';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    PreviewFeaturesContainer,
    PreviewFeaturesContainerProps,
} from 'DetailsView/components/details-view-overlay/preview-features-panel/preview-features-container';
import { PreviewFeatureFlagsHandler } from 'DetailsView/handlers/preview-feature-flags-handler';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('PreviewFeaturesContainerTest', () => {
    let displayableFeatureFlagsStub: DisplayableFeatureFlag[] = [
        {
            id: 'test-id-1',
            displayableName: 'test name 1',
            displayableDescription: 'test description 1',
            enabled: true,
        },
        {
            id: 'test-id-2',
            displayableName: 'test name 2',
            displayableDescription: 'test description 2',
            enabled: false,
        },
    ];

    const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
    const previewFeatureFlagsHandlerMock = Mock.ofType(PreviewFeatureFlagsHandler);

    const featureFlagStoreDataStub = {};
    const props: PreviewFeaturesContainerProps = {
        deps: {
            detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
        },
        featureFlagData: featureFlagStoreDataStub,
        previewFeatureFlagsHandler: previewFeatureFlagsHandlerMock.object,
    };

    describe('renders', () => {
        it('all available preview features', () => {
            previewFeatureFlagsHandlerMock
                .setup(handler => handler.getDisplayableFeatureFlags(featureFlagStoreDataStub))
                .returns(() => displayableFeatureFlagsStub);

            const renderResult = render(<PreviewFeaturesContainer {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('special message when there is no preview features available', () => {
            displayableFeatureFlagsStub = [];

            previewFeatureFlagsHandlerMock
                .setup(handler => handler.getDisplayableFeatureFlags(featureFlagStoreDataStub))
                .returns(() => displayableFeatureFlagsStub);
            const renderResult = render(<PreviewFeaturesContainer {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
