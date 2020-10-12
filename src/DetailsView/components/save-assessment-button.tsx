// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InsightsCommandButton } from 'common/components/controls/insights-command-button';
import { NamedFC } from 'common/react/named-fc';
import { IButton, IRefObject } from 'office-ui-fabric-react';
import * as React from 'react';

export interface SaveAssessmentButtonProps {

}

export const SaveAssessmentButton = NamedFC<SaveAssessmentButtonProps>('SaveAssessmentButton', props => {
    return (
        <InsightsCommandButton
            iconProps={{ iconName: 'Save'}}
        >
           Save assessment
        </InsightsCommandButton>
    );
});
