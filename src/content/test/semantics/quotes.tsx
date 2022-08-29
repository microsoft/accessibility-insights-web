// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <h1>Quotes</h1>
        <p>
            The <Markup.Code>{'<blockquote>'}</Markup.Code> element must not be used to indent non-quote text.
        </p>
        <h2>Why it matters</h2>
        <p>
            The <Markup.Code>{'<blockquote>'}</Markup.Code> is a semantic element that conveys to assistive technologies that it contains a
            quote. People who use assistive technologies might be confused if this semantic element is used instead as a quick way to style
            non-quote text.
        </p>
        <h2>How to fix</h2>
        <p>
            Do not use the <Markup.Code>{'<blockquote>'}</Markup.Code> element. Instead, use CSS <Markup.Code>margin</Markup.Code>{' '}
            properties to create space around blocks of text.
        </p>
        <Markup.PassFail
            failText={
                <p>
                    A link is enclosed in a <Markup.Code>{'<blockquote>'}</Markup.Code> element to increase the spacing around it and
                    thereby make it visually prominent.
                </p>
            }
            failExample={`<p>Kurt Vonnegut was the author of Slaughterhouse-five and The Sirens of Titan.</p>
           [<blockquote>]
           <a href="/wiki/Kurt_Vonnegut" title="Kurt Vonnegut">Learn more about Kurt Vonnegut</a>
           [</blockquote>]`}
            passText={<p>Spacing around the link is achieved using the CSS margin property.</p>}
            passExample={`<style>
            [a {margin: 70px;}]
            </style>
            ...
            <p>Kurt Vonnegut was the author of Slaughterhouse-five and The Sirens of Titan.</p>
            <a href="/wiki/Kurt_Vonnegut" title="Kurt Vonnegut">Learn more about Kurt Vonnegut</a>`}
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F43">
                Failure of Success Criterion 1.3.1 due to using structural markup in a way that does not represent relationships in the
                content
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
