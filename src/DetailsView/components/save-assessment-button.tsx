// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { IButton, IRefObject } from 'office-ui-fabric-react';
import * as React from 'react';
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { FlaggedComponent } from 'common/components/flagged-component';

export interface SaveAssessmentButtonProps {
}

export class SaveAssessmentButton extends React.Component<SaveAssessmentButtonProps> {
    public render(): JSX.Element {
        return (
            <InsightsCommandButton iconProps={{ iconName: 'Save' }}>
                Save assessment
            </InsightsCommandButton>
        )
    }
}
