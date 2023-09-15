// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedFC } from 'common/react/named-fc';
import { productName } from 'content/strings/application';
import styles from './overview-heading.scss';

export type OverviewHeadingIntroFactory = () => JSX.Element | null;

export const OverviewHeadingIntro = NamedFC('OverviewHeadingIntro', () => {
    return (
        <div className={styles.overviewHeadingContent}>
            This page contains a summary that indicates the progress of your assessment. An
            assessment is a manual experience in which you navigate through a set of tests that
            cover all WCAG 2.1 AA success criteria. Each test has one or more requirements that can
            be:
            <ul>
                <li>Automated</li>
                <li>Assisted</li>
                <li>Manual</li>
            </ul>
            Where possible, {productName} "assists" the test process by generating a list of
            instances to evaluate and highlighting them on the screen. {productName} also allows you
            to manually record failure instances.
        </div>
    );
});

export const getOverviewHeadingIntroForAssessment: OverviewHeadingIntroFactory = () => {
    return <OverviewHeadingIntro />;
};
