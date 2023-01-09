// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(() => (
    <p>
        Heading levels communicate the relative importance of headings within a page. People with good vision can infer heading levels
        through visual cues—higher-level headings typically have greater visual prominence than lower-level headings. Users of assistive
        technology rely on programmatic cues to perceive heading levels.
    </p>
));

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>A heading's programmatic level must match the level that's presented visually.</p>
        <h2>Why it matters</h2>
        <p>
            Heading levels communicate the relative importance of headings within a page. People with good vision can infer heading levels
            through visual cues—higher-level headings typically have greater visual prominence than lower-level headings. Users of assistive
            technology rely on programmatic cues to perceive heading levels.
        </p>
        <h2>How to fix</h2>
        <p>Specify a programmatic heading level that matches the visual level.</p>
        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>Both headings are coded as level 2, but styling makes the second heading visually less prominent.</p>}
            failExample={`<!--section title-->
           <h2>Web accessibility</h2>
           <p>Web accessibility refers to the inclusive practice of removing barriers that prevent interaction with, or access to websites, by people with disabilities. When sites are correctly designed, developed and edited, all users have equal access to information and functionality.</p>

            <!--subsection title-->
            [<h2 style="font-size: 1.17em; font-weight: "bold">]Designing for accessibility[</h2>]
            <p>The most important step you can take to ensure everyone can use your site is to design for accessibility in the first place.</p>`}
            passText={<p>The second heading is re-coded as level 3.</p>}
            passExample={`
                <!--section title-->
                <h2>Web accessibility</h2>
                <p>Web accessibility refers to the inclusive practice of removing barriers that prevent interaction with, or access to websites, by people with disabilities. When sites are correctly designed, developed and edited, all users have equal access to information and functionality.</p>

                <!--subsection title-->
               [<h3>]Designing for accessibility[</h3>]
                <p>The most important step you can take to ensure everyone can use your site is to design for accessibility in the first place.</p>`}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Link.IdentifyHeadings>Using h1 - h6 to identify headings</Link.IdentifyHeadings>
        </Markup.Links>
    </>
));
