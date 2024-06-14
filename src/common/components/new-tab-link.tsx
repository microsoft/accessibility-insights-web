// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link, LinkProps } from '@fluentui/react-components';
import { css } from '@fluentui/utilities';
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

export type NewTabLinkProps = LinkProps & { href?: any; target?: any; };

export const NewTabLink = NamedFC<NewTabLinkProps>('NewTabLink', ({ className, ...props }) => {
    const classNames = ['insights-link', className];

    return <Link className={css(...classNames)} target="_blank" {...props} />
});
