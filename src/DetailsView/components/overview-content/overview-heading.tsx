// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { productName } from 'content/strings/application';
import * as React from 'react';

import { NamedFC } from '../../../common/react/named-fc';
import styles from './overview-heading.scss';

export const overviewHeadingAutomationId = 'overview-heading';

export type OverviewHeadingProps = {
    introText: string;
};

export const OverviewHeading = NamedFC('OverviewHeading', (props: OverviewHeadingProps) => {
    return (
        <>
            <div
                className={styles.overviewHeading}
                data-automation-id={overviewHeadingAutomationId}
            >
                <h1>Overview</h1>
                <div className={styles.overviewHeadingContent}>
                    {props.introText}
                    <ul>
                        <li>Automated</li>
                        <li>Assisted</li>
                        <li>Manual</li>
                    </ul>
                    Where possible, {productName} "assists" the test process by generating a list of
                    instances to evaluate and highlighting them on the screen. {productName} also
                    allows you to manually record failure instances.
                </div>
            </div>
        </>
    );
});
