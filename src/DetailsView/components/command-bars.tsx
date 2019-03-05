// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedSFC } from '../../common/react/named-sfc';
import { DetailsViewCommandBar, DetailsViewCommandBarProps } from './details-view-command-bar';

export type CommandBarProps = Pick<DetailsViewCommandBarProps, Exclude<keyof DetailsViewCommandBarProps, 'renderExportAndStartOver'>>;

export const CommandBarWithExportAndStartOver = NamedSFC<CommandBarProps>('CommandBarWithExportAndStartOver', props => {
    return <DetailsViewCommandBar renderExportAndStartOver={true} {...props} />;
});

export const BasicCommandBar = NamedSFC<CommandBarProps>('BasicCommandBar', props => {
    return <DetailsViewCommandBar renderExportAndStartOver={false} {...props} />;
});
