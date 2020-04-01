// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DisplayableFeatureFlag } from 'common/types/store-data/displayable-feature-flag';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    PreviewFeaturesToggleList,
    PreviewFeaturesToggleListProps,
} from 'DetailsView/components/preview-features-toggle-list';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('PreviewFeaturesToggleListTest', () => {
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

        const testSubject = shallow(<PreviewFeaturesToggleList {...props} />);
        expect(testSubject.debug()).toMatchSnapshot();

        expect(testSubject.find({ id: 'test-id-1' }).props().onClick).toBe(
            detailsViewActionMessageCreatorMock.object.setFeatureFlag,
        );
    });
});
