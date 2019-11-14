// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { create, GuidanceTitle } from '../../common';
import { toolName } from '../../strings/application';

export const guidance = create(({ Markup, Link }) => (
    <React.Fragment>
        <GuidanceTitle name={'Headings'} />

        <h2>Why headings matter</h2>

        <p>
            Assistive technologies use markup tags to help users navigate pages
            and find content more quickly. Screen readers recognize markup tags
            for headings, and can announce the heading along with its level, or
            provide another audible cue like a beep. Other assistive
            technologies can change the visual display of a page, using properly
            coded headings to display an outline or alternate view.
        </p>

        <p>
            For more information about how to make headings accessible, see{' '}
            <Link.IdentifyHeadings />.
        </p>

        <h2>About the Headings visualization</h2>

        <p>
            The visualizations in {toolName} enable developers to see
            accessibility markup that’s normally invisible. The{' '}
            <Markup.Term>Headings</Markup.Term> visualization highlights
            programmatically-identified headings directly on the page. It does
            not highlight headings that are unavailable to assistive technology
            because they are empty or have <Markup.Term>hidden</Markup.Term>,{' '}
            <Markup.Term>aria-hidden</Markup.Term>, or{' '}
            <Markup.Term>display:none</Markup.Term> attributes.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Write headings that accurately describe the content that
                    follows.
                </h3>

                <ul>
                    <li>
                        Turn on the <Markup.Term>Headings</Markup.Term>{' '}
                        visualization, then examine each heading and the content
                        that follows it. If the heading doesn't provide an
                        accurate label for the following content, that's a
                        failure.
                    </li>
                </ul>

                <h3>Use only one top-level heading.</h3>

                <ul>
                    <li>
                        Top-level (<Markup.Term>h1</Markup.Term>) headings
                        should give an overall description of the page content.
                    </li>
                    <li>
                        Top-level (<Markup.Term>h1</Markup.Term>) headings can
                        be similar, or even identical, to the page title.
                    </li>
                </ul>

                <h3>Structure multiple headings on a page hierarchically.</h3>

                <ul>
                    <li>
                        For example, try to follow nested content under an{' '}
                        <Markup.Term>h2</Markup.Term> heading with{' '}
                        <Markup.Term>h3</Markup.Term> before you use{' '}
                        <Markup.Term>h4</Markup.Term>.
                    </li>
                    <li>
                        Exception: For fixed content that repeats across pages
                        (like a footer or a sidebar), the heading level should
                        not change. In those cases, consistency across pages is
                        more important.
                    </li>
                </ul>

                <h3>Align programmatic hierarchy and visual hierarchy.</h3>

                <ul>
                    <li>
                        Programmatic heading levels should match their visual
                        appearance (like size and boldness).
                    </li>
                </ul>

                <h3>Use native HTML heading elements.</h3>

                <ul>
                    <li>
                        The <Markup.Term>Headings</Markup.Term> visualization
                        uses an uppercase <Markup.Term>H</Markup.Term> to
                        indicate headings made with heading tags. A lowercase{' '}
                        <Markup.Term>h</Markup.Term> indicates headings made
                        using <Markup.Term>role="heading"</Markup.Term>.
                        Lowercase followed by a dash (
                        <Markup.Term>h-</Markup.Term>) indicates that the
                        element does not have an{' '}
                        <Markup.Term>aria-level</Markup.Term> attribute.
                    </li>
                    <li>
                        Exception: It's OK to use{' '}
                        <Markup.Term>role="heading"</Markup.Term> if it's
                        necessary for an accessibility retrofit.
                    </li>
                </ul>
            </Markup.Do>

            <Markup.Dont>
                <h3>Don't use headings to style text that isn't a heading.</h3>

                <ul>
                    <li>
                        Use styles instead, like font size, bolding, or italics.
                    </li>
                </ul>

                <h3>
                    Don't use styling alone to make text look like a heading.
                </h3>

                <ul>
                    <li>
                        Assistive technology depends on explicit markup. It does
                        not interpret visual styling to identify structural
                        elements.
                    </li>
                </ul>

                <h3>
                    Don't use display:none or visibility:hidden to make elements
                    invisible only to sighted users.
                </h3>

                <ul>
                    <li>
                        Properties like <Markup.Term>display:none</Markup.Term>{' '}
                        and <Markup.Term>visibility:hidden</Markup.Term> make
                        headings unavailable to everyone, including assistive
                        technology users. Use this CSS instead:{' '}
                        <Markup.Term>className="element-invisible"</Markup.Term>
                        .
                    </li>
                    <li>
                        The <Markup.Term>Headings</Markup.Term> visualization
                        does not display empty headings or headings with{' '}
                        <Markup.Term>display:none</Markup.Term>,{' '}
                        <Markup.Term>visibility:hidden</Markup.Term>, or{' '}
                        <Markup.Term>aria-hidden</Markup.Term> properties.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>
    </React.Fragment>
));
