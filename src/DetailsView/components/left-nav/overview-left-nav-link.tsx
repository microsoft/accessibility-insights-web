// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';
import { BaseLeftNavLinkProps } from '../base-left-nav';

export const OverviewLeftNavLink = NamedFC<Pick<BaseLeftNavLinkProps, 'link'>>(
    'OverviewLeftNavLink',
    ({ link }) => {
        return (
            <span className={'button-flex-container'} aria-hidden="true">
                <span>
                    <Icon iconName="home" className={css('status-icon', 'dark-gray')} />
                </span>
                <span className="ms-Button-label overview-label">
                    <span className="overview-name">{link.name}</span>
                    <span className="overview-percent">{link.percentComplete}% Completed</span>
                </span>
            </span>
        );
    },
);
