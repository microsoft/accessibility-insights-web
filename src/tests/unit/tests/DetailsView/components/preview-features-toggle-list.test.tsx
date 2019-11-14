// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { Mock } from 'typemoq';

import { shallow } from 'enzyme';
import { DisplayableFeatureFlag } from '../../../../../common/types/store-data/displayable-feature-flag';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    PreviewFeaturesToggleList,
    PreviewFeaturesToggleListProps,
} from '../../../../../DetailsView/components/preview-features-toggle-list';

describe('PreviewFeaturesToggleListTest', () => {
    test('constructor', () => {
        const testSubject = new PreviewFeaturesToggleList(
            {} as PreviewFeaturesToggleListProps,
        );
        expect(testSubject).toBeDefined();
    });

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
        const actionMessageCreatorMock = Mock.ofType(
            DetailsViewActionMessageCreator,
        );
        const props: PreviewFeaturesToggleListProps = {
            displayedFeatureFlags: displayableFeatureFlagsStub,
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        const testSubject = shallow(<PreviewFeaturesToggleList {...props} />);
        expect(testSubject.debug()).toMatchSnapshot();

        expect(testSubject.find({ id: 'test-id-1' }).props().onClick).toBe(
            actionMessageCreatorMock.object.setFeatureFlag,
        );
    });
});
