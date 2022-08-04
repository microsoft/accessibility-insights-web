// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { GenericToggle } from '../../../../generic-toggle';
import { SettingsProps } from '../settings-props';

export const SaveAssessmentDialogSettings = NamedFC<SettingsProps>(
    'SaveAssessmentDialog',
    props => {
        return (
            <GenericToggle
                enabled={props.userConfigurationStoreState.showSaveAssessmentDialog}
                id="enable-save-assessment-dialog"
                name="Enable the save assessment dialog"
                description="Show the save assessment dialog."
                onClick={(id, state) =>
                    props.deps.userConfigMessageCreator.setSaveAssessmentDialogState(state)
                }
            />
        );
    },
);
