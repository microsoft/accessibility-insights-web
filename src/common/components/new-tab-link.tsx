// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ILinkProps, Link } from '@fluentui/react';
import { css } from '@fluentui/utilities';
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

export const NewTabLink = NamedFC<ILinkProps>('NewTabLink', ({ className, ...props }) => {
    const classNames = ['insights-link', className];

    return <Link className={css(...classNames)} {...props} target="_blank" />;
});
