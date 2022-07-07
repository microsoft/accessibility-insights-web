// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>Meaningful content positioned on the page using CSS must retain its meaning when CSS is disabled.</p>
        <h2>Why it matters</h2>
        <p>
            Assistive technologies present content to users in DOM order (the order that content appears in the HTML). When CSS is used to
            modify only the <Markup.Emphasis>visual</Markup.Emphasis> order of content, assistive technologies might not be able to
            programmatically determine the expected reading order. As a result, people who use assistive technologies might receive content
            in an order that makes no sense.
        </p>
        <p>
            Also, some people with limited vision need to customize the styling of a web page in order to see its content. When they modify
            or disable CSS styling, positioned content might move to a location where its meaning is changed or lost.
        </p>
        <h2>How to fix</h2>
        <ul>
            <li>
                If you use <Markup.Code>position:absolute</Markup.Code>, be sure the DOM order matches the expected reading order.{' '}
            </li>
            <li>
                Avoid using <Markup.Code>float:right</Markup.Code>, as it <Markup.Emphasis>always</Markup.Emphasis> creates a mismatch:
                elements displayed on the right of the screen appear in the DOM before those on the left.{' '}
            </li>
        </ul>
        <Markup.PassFail
            failText={
                <p>
                    An online bookstore uses <Markup.Code>float:right</Markup.Code> to display an image of the author of each book. In the{' '}
                    <Markup.Emphasis>visual</Markup.Emphasis> reading order, the content says, "Slaughterhouse-five was written by Kurt
                    Vonnegut. A Game of Thrones was written by George RR Martin…" The DOM order is reversed, so people who use assistive
                    technology will encounter the content in an incorrect order: "Kurt Vonnegut. Slaughterhouse-five was written by George
                    RR Martin. A Game of Thrones was written by…"
                </p>
            }
            failExample={`<style>
           [.right {float:right;}]
           </style>
           ...
           <p><img class="right" source="Kurt_Vonnegut.jpg" alt="[Kurt Vonnegut.]">
           [Slaughterhouse-five was written by]</p>
           <p><img class="right" source="George_RR_Martin.jpg" alt= "[George RR Martin.]">
           [A Game of Thrones was written by]</p>
           ...`}
            passText={
                <p>
                    The content is displayed in a layout table. The visual reading order matches the DOM order, so the author's name always
                    come first.
                </p>
            }
            passExample={`<table role="presentation">
            <tr>
            <td>[Slaughterhouse-five was written by]</td>
            <td><img src="Kurt_Vonnegut.jpg" alt="[Kurt Vonnegut.]"</td>
            </tr>
            <tr>
            <td>[A Game of Thrones was written by]</td>
            <td><img src="George_RR_Martin.jpg" alt="[George RR Martin.]"</td>
            </tr>
            ...`}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">
                Understanding Success Criterion 1.3.2: Meaningful Sequence
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G57">
                Ordering the content in a meaningful sequence
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C6">
                Positioning content based on structural markup
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C27">
                Making the DOM order match the visual order
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F1">
                Failure of Success Criterion 1.3.2 due to changing the meaning of content by positioning information with CSS
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
