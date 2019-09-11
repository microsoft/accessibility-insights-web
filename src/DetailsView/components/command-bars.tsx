// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import { DetailsViewCommandBar, DetailsViewCommandBarProps } from './details-view-command-bar';

export type CommandBarProps = Pick<DetailsViewCommandBarProps, Exclude<keyof DetailsViewCommandBarProps, 'renderExportAndStartOver'>>;

export const CommandBarWithExportAndStartOver = NamedFC<CommandBarProps>('CommandBarWithExportAndStartOver', props => {
    return <DetailsViewCommandBar renderExportAndStartOver={true} {...props} />;
});

export const BasicCommandBar = NamedFC<CommandBarProps>('BasicCommandBar', props => {
    return <DetailsViewCommandBar renderExportAndStartOver={false} {...props} />;
});
