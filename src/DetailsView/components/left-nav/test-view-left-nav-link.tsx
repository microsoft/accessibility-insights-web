// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import commonStyles from 'DetailsView/components/left-nav/common-left-nav-link.scss';
import styles from 'DetailsView/components/left-nav/test-view-left-nav-link.scss';
import * as React from 'react';
import { NamedFC } from '../../../common/react/named-fc';
import { BaseLeftNavLinkProps } from '../base-left-nav';

export const testViewLeftNavLinkAutomationId = 'test-view-left-nav-link';

export const TestViewLeftNavLink = NamedFC<BaseLeftNavLinkProps>(
    'TestViewLeftNavLink',
    ({ link, renderIcon }) => {
        return (
            <span
                data-automation-id={testViewLeftNavLinkAutomationId}
                className={commonStyles.leftNavLinkContainer}
                aria-hidden="true"
            >
                {renderIcon(link)}
                <span className={styles.testName}>{link.name}</span>
            </span>
        );
    },
);
