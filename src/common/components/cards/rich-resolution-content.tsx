// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Markup from 'assessments/markup';
import { NamedFC } from 'common/react/named-fc';
import { LinkComponentType } from 'common/types/link-component-type';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';
import styles from './rich-resolution-content.scss';

export type RichResolutionContentDeps = {
    LinkComponent: LinkComponentType;
};

export type RichResolutionContentProps = {
    deps: RichResolutionContentDeps;
    contentId: string;
    contentVariables?: DictionaryStringTo<string>;
};

export const RichResolutionContent = NamedFC<RichResolutionContentProps>(
    'RichResolutionContent',
    ({ deps: { LinkComponent }, contentId, contentVariables }) => {
        switch (contentId) {
            case 'web/aria-input-field-name': {
                return (
                    <div>
                        Inspect the element using the{' '}
                        <LinkComponent href="https://developers.google.com/web/updates/2018/01/devtools">
                            Accessibility pane in the browser Developer Tools
                        </LinkComponent>{' '}
                        to verify that the field's accessible name is complete without its
                        associated{' '}
                        <b>
                            {'<'}label{'>'}
                        </b>
                        .
                    </div>
                );
            }
            case 'web/color-contrast': {
                return (
                    <div className={styles.combinationLists}>
                        <ul className={styles.multiLineTextYesBullet}>
                            <li>
                                If the instance is an icon or other non-text content, ignore it.
                                This rule applies only to text.
                            </li>
                            <li>
                                If the instance is text, use{' '}
                                <LinkComponent href="https://go.microsoft.com/fwlink/?linkid=2075365">
                                    Accessibility Insights for Windows
                                </LinkComponent>{' '}
                                (or the{' '}
                                <LinkComponent href="https://developer.paciellogroup.com/resources/contrastanalyser/">
                                    Colour Contrast Analyser
                                </LinkComponent>{' '}
                                if you're testing on a Mac) to manually verify that it has
                                sufficient contrast compared to the background. If the background is
                                an image or gradient, test an area where contrast appears to be
                                lowest.
                            </li>
                        </ul>
                        <ul className={styles.multiLineTextNoBullet}>
                            <li>
                                For detailed test instructions, see{' '}
                                <Markup.Term>
                                    Assessment {'>'} Adaptable content {'>'} Contrast
                                </Markup.Term>
                                .
                            </li>
                        </ul>
                    </div>
                );
            }
            case 'web/th-has-data-cells': {
                return (
                    <div>
                        Examine the header cell in the context of the table to verify that it has no
                        data cells.
                    </div>
                );
            }
            case 'web/label-content-name-mismatch': {
                return (
                    <span>
                        Inspect the element using the Accessibility pane in the browser Developer
                        tools and verify that the element’s accessible name contains its visible
                        text.
                    </span>
                );
            }
            case 'web/p-as-heading': {
                return (
                    <span>
                        Inspect the {`<p>`} element and verify that the element is not used as a
                        heading through visual styling with bold, italic text or font-size. If
                        headings are needed, use the appropriate heading tags.
                    </span>
                );
            }
            default: {
                throw new Error(
                    `Cannot render RichResolutionContent with unrecognized contentId ${contentId}`,
                );
            }
        }
    },
);
