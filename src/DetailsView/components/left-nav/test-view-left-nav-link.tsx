// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as commonStyles from 'DetailsView/components/left-nav/common-left-nav-link.scss';
import * as styles from 'DetailsView/components/left-nav/test-view-left-nav-link.scss';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { BaseLeftNavLinkProps } from '../base-left-nav';

export const TestViewLeftNavLink = NamedFC<BaseLeftNavLinkProps>(
    'TestViewLeftNavLink',
    ({ link, renderIcon }) => {
        return (
            <span className={commonStyles.leftNavLinkContainer} aria-hidden="true">
                {renderIcon(link)}
                <span className={styles.testName}>{link.name}</span>
            </span>
        );
    },
);
