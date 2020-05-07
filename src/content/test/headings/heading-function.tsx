// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>
            An element <Markup.Emphasis>coded</Markup.Emphasis> as a heading must <Markup.Emphasis>function</Markup.Emphasis> as a heading.
        </p>
        <h2>Why it matters</h2>
        <p>
            The function of a heading is to label a section of content. Assistive technologies allow users to quickly navigate through the
            coded headings on the page to find content of interest. Users are likely to be confused if they unexpectedly navigate to text
            that doesn't function as a heading.
        </p>
        <h2>How to fix</h2>
        <p>
            Re-implement without using heading tag or <Markup.Code>role="heading"</Markup.Code>.
        </p>
        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>This button is coded as a heading solely to achieve a desired appearance. It doesn't function as a heading.</p>}
            failExample={`<button>[<h2>]Save[</h2>]</button>`}
            passText={<p>The heading tag is removed, and the desired appearance is achieved through styling.</p>}
            passExample={`<button [style="font-size:1.25em; padding-top:.9em; padding-bottom:.9em; font-weight:bold"]>Save</button>`}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html">
                Understanding Success Criterion 2.4.6: Headings and Labels
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/G130.html">Providing descriptive headings</Markup.HyperLink>
            <Link.IdentifyHeadings>Using h1 - h6 to identify headings</Link.IdentifyHeadings>
            <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/G141.html">Organizing a page using headings</Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/F2.html">
                Failure of Success Criterion 1.3.1 due to using changes in text presentation to convey information without using the
                appropriate markup or text
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
