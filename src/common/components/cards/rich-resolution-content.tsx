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
            case 'android/atfa/ClassNameCheck': {
                return (
                    <span>
                        <LinkComponent href="https://developer.android.com/training/accessibility/testing.html#manual">
                            Manually test
                        </LinkComponent>{' '}
                        the control to verify that users receive sufficient information to
                        understand the object's function.
                    </span>
                );
            }
            case 'android/atfa/ClickableSpanCheck': {
                return (
                    <span>
                        <LinkComponent href="https://developer.android.com/training/accessibility/testing.html#manual">
                            Manually test
                        </LinkComponent>{' '}
                        the item containing the link and verify that the hyperlinked text is
                        announced and appears in the “Links” section of Talkback’s Context Menu.
                    </span>
                );
            }
            case 'android/atfa/DuplicateClickableBoundsCheck': {
                return (
                    <span>
                        Turn on{' '}
                        <LinkComponent href="https://support.google.com/accessibility/android/answer/6301490">
                            Switch Access for Android
                        </LinkComponent>{' '}
                        or use the{' '}
                        <LinkComponent href="https://accessibilityinsights.io/docs/en/android/getstarted/fastpass/#complete-the-manual-test-for-tab-stops">
                            TabStops feature
                        </LinkComponent>{' '}
                        to navigate through the elements in the application. If an element appears
                        to be focused more than once, there may be multiple interactive elements
                        occupying the same screen location.
                    </span>
                );
            }
            case 'android/atfa/DuplicateSpeakableTextCheck': {
                return (
                    <span>
                        If clickable <Markup.Code>View</Markup.Code> objects have the <i>same</i>{' '}
                        speakable text and perform the <i>same</i> function, they pass.
                        <br />
                        If clickable <Markup.Code>View</Markup.Code> objects have the <i>same</i>{' '}
                        speakable text but perform <i>different</i> functions, they fail.
                    </span>
                );
            }
            case 'android/atfa/LinkPurposeUnclearCheck': {
                return (
                    <span>
                        Examine the link in the context of the app to verify that the link's unique
                        purpose is described by the link together with its preceding page content,
                        which includes:
                        <ul>
                            <li>
                                Text in the same sentence, paragraph, list item, or table cell as
                                the link
                            </li>
                            <li>Text in a parent list item</li>
                            <li>
                                Text in the table header cell that's associated with cell that
                                contains the link
                            </li>
                        </ul>
                    </span>
                );
            }
            case 'android/atfa/RedundantDescriptionCheck': {
                return (
                    <span>
                        Listen to TalkBack's announcement of the element to verify that the item's
                        role (type), state, and/or available actions are announced only once.
                    </span>
                );
            }
            case 'android/atfa/TraversalOrderCheck': {
                return (
                    <span>
                        Turn on Talkback. Swipe right to move accessibility focus forward through
                        the elements on the screen, then swipe left to navigate backwards. Verify
                        that focus moves through the elements in a logical, consistent order when
                        navigating forwards or backwards.
                    </span>
                );
            }
            case 'android/atfa/TextContrastCheck': {
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
            case 'android/atfa/ImageContrastCheck': {
                return (
                    <span>
                        Use{' '}
                        <LinkComponent href="https://go.microsoft.com/fwlink/?linkid=2075365">
                            Accessibility Insights for Windows
                        </LinkComponent>{' '}
                        (or the{' '}
                        <LinkComponent href="https://developer.paciellogroup.com/resources/contrastanalyser/">
                            Colour Contrast Analyser
                        </LinkComponent>{' '}
                        if you're testing on a Mac) to manually verify that the{' '}
                        <Markup.Code>ImageView</Markup.Code> has sufficient contrast compared to the
                        background. If the background is an image or gradient, test an area where
                        the contrast appears to be the lowest.
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
            case 'web/scrollable-region-focusable': {
                return (
                    <span>
                        Examine the element and ensure that, if there is scrollable content, the
                        elements are accessible by keyboard.
                    </span>
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
                        Inspect the {`<p>`} element in the Accessibility pane in the browser
                        Developer tools and verify that the element is not used as a heading that is
                        styled with bold, italic text and font-size.
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
