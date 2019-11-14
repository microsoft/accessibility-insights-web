// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

import { DisplayableStrings } from '../../../../../common/constants/displayable-strings';
import { DisplayableFeatureFlag } from '../../../../../common/types/store-data/displayable-feature-flag';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { NoDisplayableFeatureFlagMessage } from '../../../../../DetailsView/components/no-displayable-preview-features-message';
import {
    PreviewFeaturesContainer,
    PreviewFeaturesContainerProps,
} from '../../../../../DetailsView/components/preview-features-container';
import { PreviewFeaturesToggleList } from '../../../../../DetailsView/components/preview-features-toggle-list';
import { PreviewFeatureFlagsHandler } from '../../../../../DetailsView/handlers/preview-feature-flags-handler';

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
    const actionMessageCreatorMock = Mock.ofType(
        DetailsViewActionMessageCreator,
    );
    const previewFeatureFlagsHandlerMock = Mock.ofType(
        PreviewFeatureFlagsHandler,
    );
    const featureFlagStoreDataStub = {};
    const props: PreviewFeaturesContainerProps = {
        featureFlagData: featureFlagStoreDataStub,
        previewFeatureFlagsHandler: previewFeatureFlagsHandlerMock.object,
        actionMessageCreator: actionMessageCreatorMock.object,
    };

    test('constructor', () => {
        const testSubject = new PreviewFeaturesContainer(
            {} as PreviewFeaturesContainerProps,
        );
        expect(testSubject).toBeDefined();
    });

    test('render', () => {
        previewFeatureFlagsHandlerMock
            .setup(pffm =>
                pffm.getDisplayableFeatureFlags(featureFlagStoreDataStub),
            )
            .returns(() => displayableFeatureFlagsStub)
            .verifiable();

        const testSubject = new PreviewFeaturesContainer(props);

        const expectedComponent = (
            <div>
                <div className="preview-features-description">
                    {DisplayableStrings.previewFeaturesDescription}
                </div>
                <PreviewFeaturesToggleList
                    displayedFeatureFlags={displayableFeatureFlagsStub}
                    actionMessageCreator={actionMessageCreatorMock.object}
                />
            </div>
        );

        expect(testSubject.render()).toEqual(expectedComponent);
        previewFeatureFlagsHandlerMock.verifyAll();
    });

    test('no feature flag component is rendered when no feature flag is displayable', () => {
        displayableFeatureFlagsStub = [];

        previewFeatureFlagsHandlerMock
            .setup(pffm =>
                pffm.getDisplayableFeatureFlags(featureFlagStoreDataStub),
            )
            .returns(() => displayableFeatureFlagsStub)
            .verifiable();

        const testSubject = shallow(<PreviewFeaturesContainer {...props} />);
        expect(testSubject.getElement()).toEqual(
            <NoDisplayableFeatureFlagMessage />,
        );
    });
});
