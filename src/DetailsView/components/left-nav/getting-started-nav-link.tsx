// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as styles from 'DetailsView/components/left-nav/getting-started-nav-link.scss';
import * as React from 'react';

export type GettingStartedNavLinkProps = {};

export const GettingStartedNavLink = NamedFC<GettingStartedNavLinkProps>(
    'GettingStartedNavLink',
    _ => {
        return <span className={styles.gettingStarted}>Getting started</span>;
    },
);
