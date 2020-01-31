// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { Mock } from 'typemoq';

import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { GenericPanel } from '../../../../../DetailsView/components/generic-panel';
import { PreviewFeaturesContainer } from '../../../../../DetailsView/components/preview-features-container';
import { PreviewFeaturesPanel, PreviewFeaturesPanelProps } from '../../../../../DetailsView/components/preview-features-panel';
import { PreviewFeatureFlagsHandler } from '../../../../../DetailsView/handlers/preview-feature-flags-handler';

describe('PreviewFeaturesPanelTest', () => {
    test('constructor', () => {
        const testSubject = new PreviewFeaturesPanel({} as PreviewFeaturesPanelProps);
        expect(testSubject).toBeDefined();
    });

    test('render', () => {
        const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const previewFeatureFlagsHandler = Mock.ofType(PreviewFeatureFlagsHandler);

        const testProps: PreviewFeaturesPanelProps = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
            },
            isOpen: true,
            previewFeatureFlagsHandler: previewFeatureFlagsHandler.object,
            featureFlagData: {},
        };

        const testSubject = new PreviewFeaturesPanel(testProps);

        const expected = (
            <GenericPanel
                headerText="Preview features"
                isOpen={true}
                className={'preview-features-panel'}
                onDismiss={testProps.deps.detailsViewActionMessageCreator.closePreviewFeaturesPanel}
                closeButtonAriaLabel={'Close preview features panel'}
                hasCloseButton={true}
            >
                <PreviewFeaturesContainer
                    deps={testProps.deps}
                    featureFlagData={testProps.featureFlagData}
                    previewFeatureFlagsHandler={testProps.previewFeatureFlagsHandler}
                />
            </GenericPanel>
        );

        expect(testSubject.render()).toEqual(expected);
    });
});
