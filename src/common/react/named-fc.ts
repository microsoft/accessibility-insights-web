// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export type ReactFCWithDisplayName<P = {}> = React.FC<React.PropsWithChildren<P>> & {
    displayName: string;
};

export function NamedFC<P = {}>(
    displayName: string,
    component: React.FC<React.PropsWithChildren<P>>,
): ReactFCWithDisplayName<P> {
    component.displayName = displayName;

    return component as ReactFCWithDisplayName<P>;
}
