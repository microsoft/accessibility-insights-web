// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(() => (
    <p>
        People with good vision can quickly scan a page to identify headings based solely on their appearance, such as large or bold font,
        preceding white space, or indentation. Users of assistive technologies can't find headings that aren't properly coded.
    </p>
));

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>Text that looks like a heading must be coded as a heading.</p>
        <h2>Why it matters</h2>
        <p>
            People with good vision can quickly scan a page to identify headings based solely on their appearance, such as large or bold
            font, preceding white space, or indentation. Users of assistive technologies can't find headings that aren't properly coded.
        </p>
        <h3>From a user's perspective</h3>
        <p>
            <Link.HeadingsVideo>This short video on headings</Link.HeadingsVideo> shows how programmatically related headings help people
            who use screen readers.
        </p>

        <h2>How to fix</h2>
        <p>
            Re-implement using a heading tag. (You could add role="heading" to a different element, but the{' '}
            <Markup.HyperLink href="https://www.w3.org/TR/using-aria/#rule1">first rule of ARIA</Markup.HyperLink> is to use native HTML
            elements where possible, instead of repurposing an element by adding ARIA.)
        </p>
        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>This element looks like a heading, but it isn't coded as a heading.</p>}
            failExample={`[<p style="font-size:2em; font-weight:700;] color:#e81123">About Accessibility Insights for Web</p>`}
            passText={<p>The element is coded as a heading.</p>}
            passExample={`[<h1 ]style="color:#e81123">About Accessibility Insights for Web[</h1>]`}
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
            <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/F43.html">
                Failure of Success Criterion 1.3.1 due to using structural markup in a way that does not represent relationships in the
                content
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
