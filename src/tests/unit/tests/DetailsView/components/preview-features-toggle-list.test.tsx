// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { DisplayableFeatureFlag } from 'common/types/store-data/displayable-feature-flag';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    PreviewFeaturesToggleList,
    PreviewFeaturesToggleListProps,
} from 'DetailsView/components/preview-features-toggle-list';
import * as React from 'react';
import { Mock } from 'typemoq';
import { GenericToggle } from '../../../../../DetailsView/components/generic-toggle';
import {
    mockReactComponents,
    getMockComponentClassPropsForCall,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../DetailsView/components/generic-toggle');

describe('PreviewFeaturesToggleListTest', () => {
    mockReactComponents([GenericToggle]);
    test('render', () => {
        const displayableFeatureFlagsStub: DisplayableFeatureFlag[] = [
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
        const props: PreviewFeaturesToggleListProps = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            displayedFeatureFlags: displayableFeatureFlagsStub,
        };

        const renderResult = render(<PreviewFeaturesToggleList {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();

        const genericToggleProps = getMockComponentClassPropsForCall(GenericToggle);
        expect(genericToggleProps.onClick).toBe(
            detailsViewActionMessageCreatorMock.object.setFeatureFlag,
        );
    });
});
