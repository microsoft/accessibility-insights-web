// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlags } from 'common/feature-flags';
import { CommandBarProps } from 'DetailsView/components/details-view-command-bar';
import { StartOverComponentProps } from 'DetailsView/components/start-over-component';

export function getStartOverComponentPropsForAssessment(props: CommandBarProps): StartOverComponentProps {
    return {
        render: true,
        ...props,
    };
}

export function getStartOverComponentPropsForAutomatedChecks(props: CommandBarProps): StartOverComponentProps {
    return {
        render: props.featureFlagStoreData[FeatureFlags.universalCardsUI] === true,
        ...props,
    };
}
