// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>
            Words and phrases that are visually emphasized to convey semantic meaning or importance commonly should be contained within semantically
            correct elements.
        </p>
        <h2>Why it matters</h2>
        <p>
            People with good vision can infer from visual styling that a word or phrase is especially important. For example, it might be
            displayed using bold or italic font. Unless the visually emphasized word or phrase is also contained in a semantically correct
            element, people who use screen readers won't know that it's emphasized.
        </p>
        <p>
            However, not all bold or italic text requires semantic markup. Visual variations in font-weight or style used purely for design
            purposes, such as distinguishing labels from values or creating visual hierarchy, do not need to be marked up semantically
            unless they convey emphasis or importance.
        </p>
        <h2>How to fix</h2>
        <p>
            When visual emphasis conveys semantic meaning, contain the emphasized word or phrase in a semantically correct element:
            <ul>
                <li>
                    Use the <Markup.Code>{'<em>'}</Markup.Code> element when you want to stress a word or phrase within the context of a
                    sentence or paragraph. By default, browsers will render the text using an italic font. A sighted person is likely to
                    notice italic text when they read it, but it won't jump out at them when they skim the page.{' '}
                </li>
                <li>
                    Use the <Markup.Code>{'<strong>'}</Markup.Code> element when the word or phrase is important within the context of the
                    entire page. By default, browsers will render the text using a bold font. A sighted person will find it easy to spot
                    bold text when they skim the page.
                </li>
            </ul>
        </p>
        <p>
            Do not use <Markup.Code>{'<strong>'}</Markup.Code> or <Markup.Code>{'<em>'}</Markup.Code> for text that is bold or italic purely
            for visual design, such as labels, identifiers, or creating visual separation between parts of a heading.
        </p>
        <Markup.PassFail
            failText={
                <p>
                    Italic font is applied to visually emphasize certain words in a paragraph, but the emphasis is not conveyed to assistive
                    technologies.
                </p>
            }
            failExample={`<p>These carrots are [<span style="font-style:italic;>]not[</span>] crunchy!</p>`}
            passText={
                <p>
                    Containing the emphasized words in an <Markup.Code>{'<em>'}</Markup.Code> element conveys emphasis both visually and
                    semantically.
                </p>
            }
            passExample={`<p>These carrots are [<em>]not[</em>] crunchy!</p>`}
        />
        <Markup.PassFail
            failText={
                <p>
                    The bold "Warning:" label might appear to require a <Markup.Code>{'<strong>'}</Markup.Code> element, but it's actually
                    used as a visual label, not to convey emphasis.
                </p>
            }
            failExample={`<p>[<strong>]Warning:[</strong>] This action cannot be undone.</p>`}
            passText={<p>The word "cannot" is what's being emphasized to convey importance, while "Warning:" serves as a label.</p>}
            passExample={`<p><span class="label">Warning:</span> This action [<strong>]cannot[</strong>] be undone.</p>`}
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G115">
                Using semantic elements to mark up structure
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H49">
                Using semantic markup to mark emphasized or special text
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F2">
                Failure of Success Criterion 1.3.1 due to using changes in text presentation to convey information without using the
                appropriate markup or text
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
