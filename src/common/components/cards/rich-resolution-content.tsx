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
            case 'android/atfa/ClassNameCheck': {
                return (
                    <span>
                        Provide a <Markup.Code>className</Markup.Code> value within the element's{' '}
                        <LinkComponent href="https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo.html">
                            AccessibilityNodeInfo
                        </LinkComponent>{' '}
                        that:
                        <ol>
                            <li>Closely describes the element's function,</li>
                            <li>Matches a class that extends android.view.View,</li>
                            <li>Is provided with the Android SDK or support libraries, and</li>
                            <li>Is as far down Android's class hierarchy as possible.</li>
                        </ol>
                        Note: Do not attempt to fix this issue by adding the class name to the
                        object's ContentDescription, as that approach can cause some assistive
                        technologies to announce the class twice.
                    </span>
                );
            }
            case 'android/atfa/ClickableSpanCheck': {
                return (
                    <span>
                        <ul>
                            <li>
                                Implement the link using{' '}
                                <LinkComponent href="https://developer.android.com/reference/android/text/style/URLSpan.html">
                                    URLSpan
                                </LinkComponent>{' '}
                                or
                                <LinkComponent href="https://developer.android.com/reference/android/text/util/Linkify.html">
                                    Linkify
                                </LinkComponent>
                                .
                            </li>
                            <li>
                                If you use <Markup.Code>URLSpan</Markup.Code>, provide a non-null
                                absolute URL (such as{' '}
                                <Markup.Code>https://example.com/page.html</Markup.Code>), not a
                                relative URL (such as <Markup.Code>/page.html</Markup.Code>).
                            </li>
                        </ul>
                    </span>
                );
            }
            case 'android/atfa/DuplicateClickableBoundsCheck': {
                return (
                    <span>
                        When clickable <Markup.Code>Views</Markup.Code> are nested, implement click
                        handling so that only one
                        <Markup.Code>View</Markup.Code> handles clicks for any single action. <br />
                        If a <Markup.Code>View</Markup.Code> that's clickable by default (such as a{' '}
                        <Markup.Code>button</Markup.Code>) is not intended to be clickable, remove
                        its <Markup.Code>OnClickListener</Markup.Code>, or set{' '}
                        <Markup.Code>android:clickable="false"</Markup.Code>.
                    </span>
                );
            }
            case 'android/atfa/DuplicateSpeakableTextCheck': {
                return (
                    <span>
                        If clickable <Markup.Code>View</Markup.Code> objects perform the <i>same</i>{' '}
                        function, they can have the same speakable text; no changes are needed.
                        <br />
                        If two or more clickable <Markup.Code>View</Markup.Code> objects perform{' '}
                        <i>different</i> functions, give them unique speakable text.
                    </span>
                );
            }
            case 'android/atfa/LinkPurposeUnclearCheck': {
                return (
                    <span>
                        Describe the unique purpose of the link using any of the following:
                        <ul>
                            <li>Good: Programmatically related context, or</li>
                            <li>Better: Accessible name and/or accessible description, or</li>
                            <li>Best: Link text</li>
                        </ul>
                        Programmatically related context includes:
                        <ul>
                            <li>
                                Text in the same sentence, paragraph, list item, or table cell as
                                the link
                            </li>
                            <li>Text in a parent list item</li>
                            <li>
                                Text in a table header cell associated with the cell that contains
                                the link
                            </li>
                        </ul>
                        Writing tips:
                        <ul>
                            <li>
                                If a link's destination is a document or web application, the name
                                of the document or application is sufficient.
                            </li>
                            <li>
                                Links with different destinations should have different
                                descriptions; links with the same destination should have the same
                                description.
                            </li>
                            <li>
                                Programmatically related context is easier to understand when it
                                precedes the link.
                            </li>
                        </ul>
                    </span>
                );
            }
            case 'android/atfa/RedundantDescriptionCheck': {
                return (
                    <span>
                        Don't include an element's role (type), state, or available actions in the
                        following attributes: <Markup.Code>android:contentDescription</Markup.Code>,
                        <Markup.Code>android:text</Markup.Code>,{' '}
                        <Markup.Code>android:hint</Markup.Code>.
                    </span>
                );
            }
            case 'android/atfa/TraversalOrderCheck': {
                return (
                    <span>
                        Good: If the app's view hierarchy doesn't create a logical traversal order,
                        use <Markup.Code>android:accessibilityTraversalBefore</Markup.Code> or
                        <Markup.Code>android:accessibilityTraversalAfter</Markup.Code> attributes to
                        create an order that makes sense to TalkBack users. Make sure that the
                        attributes do not create any loops or traps that prevent the user from
                        accessing all interactive elements.
                        <br />
                        Better: Restructure the view hierarchy to create a logical traversal order
                        that does not require use of{' '}
                        <Markup.Code>android:accessibilityTraversalBefore</Markup.Code> or
                        <Markup.Code>android:accessibilityTraversalAfter</Markup.Code> attributes.
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
                        Make sure the meaningful elements in a graphic have a contrast ratio ≥ 3:1.
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
