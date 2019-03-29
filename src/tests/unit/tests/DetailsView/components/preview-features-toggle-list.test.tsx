// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { Mock } from 'typemoq';

import { DisplayableFeatureFlag } from '../../../../../common/types/store-data/displayable-feature-flag';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { GenericToggle } from '../../../../../DetailsView/components/generic-toggle';
import {
    PreviewFeaturesToggleList,
    PreviewFeaturesToggleListProps,
} from '../../../../../DetailsView/components/preview-features-toggle-list';

describe('PreviewFeaturesToggleListTest', () => {
    test('constructor', () => {
        const testSubject = new PreviewFeaturesToggleList({} as PreviewFeaturesToggleListProps);
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
        const setFeatureFlagStub = () => {};
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const props: PreviewFeaturesToggleListProps = {
            displayedFeatureFlags: displayableFeatureFlagsStub,
            actionMessageCreator: actionMessageCreatorMock.object,
        };
        const testSubject = new PreviewFeaturesToggleList(props);

        actionMessageCreatorMock.setup(acm => acm.setFeatureFlag).returns(() => setFeatureFlagStub);

        const expectedComponent = (
            <div className="preview-feature-toggle-list">
                <GenericToggle
                    name={props.displayedFeatureFlags[0].displayableName}
                    description={props.displayedFeatureFlags[0].displayableDescription}
                    enabled={props.displayedFeatureFlags[0].enabled}
                    onClick={setFeatureFlagStub}
                    id={props.displayedFeatureFlags[0].id}
                    key={`preview_feature_toggle${props.displayedFeatureFlags[0].id}`}
                />
                <GenericToggle
                    name={props.displayedFeatureFlags[1].displayableName}
                    description={props.displayedFeatureFlags[1].displayableDescription}
                    enabled={props.displayedFeatureFlags[1].enabled}
                    onClick={setFeatureFlagStub}
                    id={props.displayedFeatureFlags[1].id}
                    key={`preview_feature_toggle${props.displayedFeatureFlags[1].id}`}
                />
            </div>
        );

        expect(testSubject.render()).toEqual(expectedComponent);
    });
});
