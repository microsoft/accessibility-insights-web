// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { ContentPageInfo } from 'electron/types/content-page-info';
import * as React from 'react';
import * as styles from './header-section.scss';

export type HeaderSectionProps = {
    contentPageInfo: ContentPageInfo;
};

export const HeaderSection = NamedFC<HeaderSectionProps>('HeaderSection', props => {
    const { title, description } = props.contentPageInfo;
    return (
        <div className={styles.headerSection}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{description}</p>
        </div>
    );
});
