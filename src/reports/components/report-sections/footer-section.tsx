// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NewTabLink } from 'common/components/new-tab-link';
import { NamedFC } from 'common/react/named-fc';
import { toolName } from 'content/strings/application';
import * as React from 'react';

import * as styles from './footer-section.scss';

export const FooterSection = NamedFC('FooterSection', () => {
    return (
        <div className={styles.reportFooterContainer}>
            <div className={styles.reportFooter} role="contentinfo">
                This automated checks result was generated using <b id="tool-name">{toolName}</b>, a
                tool that helps debug and find accessibility issues earlier. Get more information &
                download this tool at{' '}
                <NewTabLink
                    href="http://aka.ms/AccessibilityInsights"
                    aria-labelledby="tool-name"
                    title={`Get more information and download ${toolName}`}
                >
                    http://aka.ms/AccessibilityInsights
                </NewTabLink>
                .
            </div>
        </div>
    );
});
