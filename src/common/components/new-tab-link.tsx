// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link, LinkProps, mergeClasses } from '@fluentui/react-components';
import * as React from 'react';

import { NamedFC } from '../react/named-fc';

export type NewTabLinkProps = LinkProps & { as?: 'a' };

export const NewTabLink = NamedFC<NewTabLinkProps>('NewTabLink', ({ className, ...props }) => {
    return <Link className={mergeClasses('insights-link', className)} target="_blank" {...props} />;
});
