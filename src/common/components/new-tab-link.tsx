// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { ILinkProps, Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

export const NewTabLink = NamedFC<ILinkProps>('NewTabLink', ({ className, ...props }) => {
    const classNames = ['insights-link', className];

    return <Link className={css(...classNames)} {...props} target="_blank" />;
});
