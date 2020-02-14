// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DisplayableFeatureFlag } from 'common/types/store-data/displayable-feature-flag';
import * as React from 'react';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { GenericToggle } from './generic-toggle';
import * as styles from './preview-features-toggle-list.scss';

export type PreviewFeaturesToggleListDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
};

export interface PreviewFeaturesToggleListProps {
    deps: PreviewFeaturesToggleListDeps;
    displayedFeatureFlags: DisplayableFeatureFlag[];
}

export class PreviewFeaturesToggleList extends React.Component<PreviewFeaturesToggleListProps> {
    public render(): JSX.Element {
        return <div className={styles.previewFeatureToggleList}>{this.generateToggleList()}</div>;
    }

    private generateToggleList(): JSX.Element[] {
        const flags = this.props.displayedFeatureFlags;

        const toggleList = flags.map(displayableFlag => (
            <GenericToggle
                name={displayableFlag.displayableName}
                description={displayableFlag.displayableDescription}
                enabled={displayableFlag.enabled}
                onClick={this.props.deps.detailsViewActionMessageCreator.setFeatureFlag}
                key={this.getToggleKey(displayableFlag.id)}
                id={displayableFlag.id}
            />
        ));

        return toggleList;
    }
    private getToggleKey = (flagId: string) => `preview_feature_toggle${flagId}`;
}
