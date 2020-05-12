// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type GettingStartedNavLinkProps = {};

export const GettingStartedNavLink = NamedFC<GettingStartedNavLinkProps>(
    'GettingStartedNavLink',
    _ => {
        return <span className="getting-started">Getting Started</span>;
    },
);
