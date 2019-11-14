// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { css } from '@uifabric/utilities';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';
import { BaseLeftNavLinkProps } from '../base-left-nav';

export const OverviewLeftNavLink = NamedFC<BaseLeftNavLinkProps>(
    'OverviewLeftNavLink',
    ({ link }) => {
        return (
            <div className={'button-flex-container'} aria-hidden="true">
                <div>
                    <Icon
                        iconName="home"
                        className={css('status-icon', 'dark-gray')}
                    />
                </div>
                <div className="ms-Button-label overview-label">
                    <div className="overview-name">{link.name}</div>
                    <div className="overview-percent">
                        {link.percentComplete}% Completed
                    </div>
                </div>
            </div>
        );
    },
);
