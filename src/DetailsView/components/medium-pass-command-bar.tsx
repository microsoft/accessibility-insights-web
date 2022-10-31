// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

import { CommandBarProps, DetailsViewCommandBar } from './details-view-command-bar';

export const MediumPassCommandBar = NamedFC<CommandBarProps>('MediumPassCommandBar', props => {
    return <DetailsViewCommandBar {...props} />;
});
