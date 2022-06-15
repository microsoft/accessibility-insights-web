// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import styles from 'DetailsView/components/left-nav/common-left-nav-link.scss';
import * as React from 'react';

export type GettingStartedNavLinkProps = {};

export const GettingStartedNavLink = NamedFC<GettingStartedNavLinkProps>(
    'GettingStartedNavLink',
    _ => {
        return <span className={styles.leftNavLinkContainer}>Getting started</span>;
    },
);
