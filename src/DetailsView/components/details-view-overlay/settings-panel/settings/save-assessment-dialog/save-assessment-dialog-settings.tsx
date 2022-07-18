// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { GenericToggle } from '../../../../generic-toggle';
import { SettingsProps } from '../settings-props';

const SaveAssessmentDialogTitle = 'Enable save assessment dialog';
const SaveAssessmentDialogDescription = 'Show save assessment dialog.';

export const SaveAssessmentDialogSettings = NamedFC<SettingsProps>(
    'SaveAssessmentDialog',
    props => {
        const {
            deps: { userConfigMessageCreator },
            userConfigurationStoreState: { showSaveAssessmentDialog },
        } = props;

        return (
            <GenericToggle
                enabled={showSaveAssessmentDialog}
                id="enable-save-assessment-dialog"
                name={SaveAssessmentDialogTitle}
                description={SaveAssessmentDialogDescription}
                onClick={(id, state) =>
                    userConfigMessageCreator.setSaveAssessmentDialogState(state)
                }
            />
        );
    },
);
