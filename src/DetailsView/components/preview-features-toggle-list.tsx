// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DisplayableFeatureFlag } from 'common/types/store-data/displayable-feature-flag';
import * as React from 'react';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { GenericToggle } from './generic-toggle';
import styles from './preview-features-toggle-list.scss';

export type PreviewFeaturesToggleListDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface PreviewFeaturesToggleListProps {
    deps: PreviewFeaturesToggleListDeps;
    displayedFeatureFlags: DisplayableFeatureFlag[];
}

export const PreviewFeaturesToggleList = NamedFC<PreviewFeaturesToggleListProps>(
    'PreviewFeaturesToggleList',
    ({ deps, displayedFeatureFlags }) => {
        const generateToggleList = () =>
            displayedFeatureFlags.map(displayableFlag => (
                <GenericToggle
                    name={displayableFlag.displayableName}
                    description={displayableFlag.displayableDescription}
                    enabled={displayableFlag.enabled}
                    onClick={deps.detailsViewActionMessageCreator.setFeatureFlag}
                    key={getToggleKey(displayableFlag.id)}
                    id={displayableFlag.id}
                />
            ));

        const getToggleKey = (flagId: string) => `preview_feature_toggle${flagId}`;

        return <div className={styles.previewFeatureToggleList}>{generateToggleList()}</div>;
    },
);
