// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { GenericToggle } from '../../../../generic-toggle';
import { SettingsProps } from '../settings-props';

const AutoDetectedFailuresDialogTitle = 'Enable automatically detected failures dialog';
const AutoDetectedFailuresDialogDescription =
    'Show the tab stops automatically detected failures dialog.';

export const AutoDetectedFailuresDialogSettings = NamedFC<SettingsProps>(
    'AutoDetectedFailuresDialog',
    props => {
        const { deps } = props;
        const { userConfigMessageCreator } = deps;

        return (
            <GenericToggle
                enabled={props.userConfigurationStoreState.showAutoDetectedFailuresDialog}
                id="enable-auto-detected-failures-dialog"
                name={AutoDetectedFailuresDialogTitle}
                description={AutoDetectedFailuresDialogDescription}
                onClick={(id, state) =>
                    userConfigMessageCreator.setAutoDetectedFailuresDialogState(state)
                }
            />
        );
    },
);
