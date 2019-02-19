// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { React, create } from '../../common';
import { toolName } from '../../strings/application';

export const staticContent = create(({ Link }) => (
    <div>
        <h2>Why headings matter</h2>
        <div className="why-vis">
            Assistive technologies use markup tags to help users navigate pages and find content more quickly. Screen readers recognize
            markup tags for headings, and can announce the heading along with its level, or provide another audible cue like a beep. Other
            assistive technologies can change the visual display of a page, using properly coded headings to display an outline or alternate
            view.
        </div>

        <div className="more-info">
            For more information about how to make headings accessible, see&nbsp;
            <Link.IdentifyHeadings>Techniques for WCAG 2.0: Using h1-h6 to identify headings</Link.IdentifyHeadings>.
        </div>

        <h2>About the Headings visualization</h2>

        <div className="about-vis">
            The visualizations in {toolName} enable developers to see accessibility markup that’s normally invisible. The <b>Headings</b>{' '}
            visualization highlights programmatically-identified headings directly on the page. It does not highlight headings that are
            unavailable to assistive technology because they are empty or have <b>hidden</b>, <b>aria-hidden</b>, or <b>display:none</b>{' '}
            attributes.
        </div>

        <h2>Do</h2>

        <h3>Write headings that accurately describe the content that follows.</h3>

        <ul className="insights-list ">
            <li>
                Turn on the <b>Headings</b> visualization, then examine each heading and the content that follows it. If the heading doesn't
                provide an accurate label for the following content, that's a failure.
            </li>
        </ul>

        <h3>Use only one top-level heading.</h3>

        <ul className="insights-list ">
            <li>
                Top-level (<b>h1</b>) headings should give an overall description of the page content.
            </li>
            <li>
                Top-level (<b>h1</b>) headings can be similar, or even identical, to the page title.
            </li>
        </ul>

        <h3>Structure multiple headings on a page hierarchically.</h3>

        <ul className="insights-list ">
            <li>
                For example, try to follow nested content under an <b>h2</b> heading with <b>h3</b> before you use <b>h4</b>.
            </li>
            <li>
                Exception: For fixed content that repeats across pages (like a footer or a sidebar), the heading level should not change. In
                those cases, consistency across pages is more important.
            </li>
        </ul>

        <h3>Align programmatic hierarchy and visual hierarchy.</h3>

        <ul className="insights-list ">
            <li>Programmatic heading levels should match their visual appearance (like size and boldness).</li>
        </ul>

        <h3>Use native HTML heading elements.</h3>

        <ul className="insights-list ">
            <li>
                The <b>Headings</b> visualization uses an uppercase <b>H</b> to indicate headings made with heading tags. A lowercase{' '}
                <b>h</b> indicates headings made using <b>role="heading"</b>. Lowercase followed by a dash (<b>h-</b>) indicates that the
                element does not have an <b>aria-level</b> attribute.
            </li>
            <li>
                Exception: It's OK to use <b>role="heading"</b> if it's necessary for an accessibility retrofit.
            </li>
        </ul>

        <h2>Don't</h2>

        <h3>Don't use headings to style text that isn't a heading.</h3>

        <ul className="insights-list ">
            <li>Use styles instead, like font size, bolding, or italics.</li>
        </ul>

        <h3>Don't use styling alone to make text look like a heading.</h3>

        <ul className="insights-list ">
            <li>Assistive technology depends on explicit markup. It does not interpret visual styling to identify structural elements.</li>
        </ul>

        <h3>Don't use display:none or visibility:hidden to make elements invisible only to sighted users.</h3>

        <ul className="insights-list ">
            <li>
                Properties like <b>display:none</b> and <b>visibility:hidden</b> make headings unavailable to everyone, including assistive
                technology users. Use this CSS instead: <b>className="element-invisible"</b>.
            </li>
            <li>
                The <b>Headings</b> visualization does not display empty headings or headings with <b>display:none</b>,{' '}
                <b>visibility:hidden</b>, or <b>aria-hidden</b> properties.
            </li>
        </ul>
    </div>
));
