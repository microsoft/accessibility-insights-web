// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import * as styles from 'DetailsView/components/left-nav/common-left-nav-link.scss';
import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { BaseLeftNavLinkProps } from '../base-left-nav';

export const OverviewLeftNavLink = NamedFC<Pick<BaseLeftNavLinkProps, 'link'>>(
    'OverviewLeftNavLink',
    ({ link }) => {
        return (
            <span className={styles.leftNavLinkContainer} aria-hidden="true">
                <span>
                    <Icon iconName="home" className={css(styles.linkIcon, 'left-nav-icon')} />
                </span>
                <span className="ms-Button-label overview-label">
                    <span className="overview-name">{link.name}</span>
                    <span className="overview-percent">{link.percentComplete}% Completed</span>
                </span>
            </span>
        );
    },
);
