// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export type ReactSFCWithDisplayName<P = {}> = React.SFC<P> & { displayName: string };

export function NamedSFC<P = {}>(displayName: string, component: React.SFC<P>): ReactSFCWithDisplayName<P> {
    component.displayName = displayName;

    return component as ReactSFCWithDisplayName<P>;
}
