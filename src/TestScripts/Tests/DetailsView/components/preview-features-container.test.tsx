// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { Mock } from 'typemoq';

import { DisplayableStrings } from '../../../../common/constants/displayable-strings';
import { IDisplayableFeatureFlag } from '../../../../common/types/store-data/idisplayable-feature-flag';
import { DetailsViewActionMessageCreator } from '../../../../DetailsView/actions/details-view-action-message-creator';
import { IPreviewFeaturesContainerProps, PreviewFeaturesContainer } from '../../../../DetailsView/components/preview-features-container';
import { PreviewFeaturesToggleList } from '../../../../DetailsView/components/preview-features-toggle-list';
import { PreviewFeatureFlagsHandler } from '../../../../DetailsView/handlers/preview-feature-flags-handler';

describe('PreviewFeaturesContainerTest', () => {
    test('constructor', () => {
        const testSubject = new PreviewFeaturesContainer({} as IPreviewFeaturesContainerProps);
        expect(testSubject).toBeDefined();
    });

    test('render', () => {
        const displayableFeatureFlagsStub: IDisplayableFeatureFlag[] = [
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
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const previewFeatureFlagsHandlerMock = Mock.ofType(PreviewFeatureFlagsHandler);
        const featureFlagStoreDataStub = {};
        const props: IPreviewFeaturesContainerProps = {
            featureFlagData: featureFlagStoreDataStub,
            previewFeatureFlagsHandler: previewFeatureFlagsHandlerMock.object,
            actionMessageCreator: actionMessageCreatorMock.object,
        };

        previewFeatureFlagsHandlerMock
            .setup(pffm => pffm.getDisplayableFeatureFlags(featureFlagStoreDataStub))
            .returns(() => displayableFeatureFlagsStub)
            .verifiable();

        const testSubject = new PreviewFeaturesContainer(props);

        const expectedComponent = (
            <div>
                <div className="preview-features-description">{DisplayableStrings.previewFeaturesDescription}</div>
                <PreviewFeaturesToggleList
                    displayedFeatureFlags={displayableFeatureFlagsStub}
                    actionMessageCreator={actionMessageCreatorMock.object}
                />
            </div>
        );

        expect(testSubject.render()).toEqual(expectedComponent);
        previewFeatureFlagsHandlerMock.verifyAll();
    });
});
