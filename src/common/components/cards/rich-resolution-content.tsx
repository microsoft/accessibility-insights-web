// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Markup from 'assessments/markup';
import { NamedFC } from 'common/react/named-fc';
import { LinkComponentType } from 'common/types/link-component-type';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';
import * as styles from './rich-resolution-content.scss';

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
            case 'android/ColorContrast': {
                return (
                    <div className={styles.combinationLists}>
                        <ul className={styles.multiLineTextYesBullet}>
                            <li list-style-type="disc">
                                If the text is intended to be invisible, it passes.
                            </li>
                            <li list-style-type="disc">
                                If the text is intended to be visible, use{' '}
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
                    </div>
                );
            }
            case 'android/TouchSizeWcag': {
                const { logicalWidth, logicalHeight } = contentVariables!;
                return (
                    <span>
                        The element has an insufficient target size (width: {logicalWidth}dp,
                        height: {logicalHeight}dp). Set the element's{' '}
                        <Markup.Code>minWidth</Markup.Code> and <Markup.Code>minHeight</Markup.Code>{' '}
                        attributes to at least 44dp.
                    </span>
                );
            }
            case 'android/ActiveViewName': {
                return (
                    <span>
                        The view is active but has no name available to assistive technologies.
                        Provide a name for the view using its{' '}
                        <Markup.Code>contentDescription</Markup.Code>,{' '}
                        <Markup.Code>hint</Markup.Code>, <Markup.Code>labelFor</Markup.Code>, or{' '}
                        <Markup.Code>text</Markup.Code> attribute (depending on the view type)
                    </span>
                );
            }
            case 'android/ImageViewName': {
                return (
                    <span>
                        The image has no alternate text and is not identified as decorative. If the
                        image conveys meaningful content, provide alternate text using the{' '}
                        <Markup.Code>contentDescription</Markup.Code> attribute. If the image is
                        decorative, give it an empty <Markup.Code>contentDescription</Markup.Code>,
                        or set its <Markup.Code>isImportantForAccessibility</Markup.Code> attribute
                        to false.
                    </span>
                );
            }
            case 'android/EditTextValue': {
                return (
                    <span>
                        The element's <Markup.Code>contentDescription</Markup.Code> overrides the
                        text value required by assistive technologies. Remove the element's{' '}
                        <Markup.Code>contentDescription</Markup.Code> attribute.
                    </span>
                );
            }
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
                            <li list-style-type="disc">
                                If the instance is an icon or other non-text content, ignore it.
                                This rule applies only to text.
                            </li>
                            <li list-style-type="disc">
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
            case 'web/link-in-text-block': {
                return (
                    <ul className={styles.multiLineTextNoBullet}>
                        <li>
                            Manually verify that the link text EITHER has a contrast ratio of at
                            least 3:1 compared to surrounding text OR has a distinct visual style
                            (such as underlined, bolded, or italicized).
                        </li>
                        <li>
                            To measure contrast, use{' '}
                            <LinkComponent href="https://go.microsoft.com/fwlink/?linkid=2075365">
                                Accessibility Insights for Windows
                            </LinkComponent>{' '}
                            (or the{' '}
                            <LinkComponent href="https://developer.paciellogroup.com/resources/contrastanalyser/">
                                Colour Contrast Analyser
                            </LinkComponent>{' '}
                            if you're testing on a Mac).
                        </li>
                    </ul>
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
            default: {
                throw new Error(
                    `Cannot render RichResolutionContent with unrecognized contentId ${contentId}`,
                );
            }
        }
    },
);
