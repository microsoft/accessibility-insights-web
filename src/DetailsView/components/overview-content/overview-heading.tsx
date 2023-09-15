// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';
import styles from './overview-heading.scss';
import { OverviewHeadingIntroFactory } from 'DetailsView/components/overview-content/overview-heading-intro';

export const overviewHeadingAutomationId = 'overview-heading';

export type OverviewHeadingProps = {
    getIntroComponent: OverviewHeadingIntroFactory;
};

export const OverviewHeading = NamedFC('OverviewHeading', (props: OverviewHeadingProps) => {
    return (
        <>
            <div
                className={styles.overviewHeading}
                data-automation-id={overviewHeadingAutomationId}
            >
                <h1>Overview</h1>
                {props.getIntroComponent()}
            </div>
        </>
    );
});
