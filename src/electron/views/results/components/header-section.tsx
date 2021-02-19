// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import * as styles from './header-section.scss';

export type HeaderSectionProps = {
    title: string;
    description: JSX.Element;
};

export const HeaderSection = NamedFC<HeaderSectionProps>('HeaderSection', props => {
    const { title, description } = props;
    return (
        <div className={styles.headerSection}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.subtitle}>{description}</div>
        </div>
    );
});
