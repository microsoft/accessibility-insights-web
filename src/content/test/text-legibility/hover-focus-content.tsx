// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Content that appears on focus or hover must be dismissible, hoverable, and persistent.</p>

        <h2>Why it matters</h2>
        <p>Additional content that appears on focus or hover can present problems if users can't easily see it or dismiss it.</p>
        <ul>
            <li>
                Making the additional content <Markup.Emphasis>dismissible</Markup.Emphasis> ensures that people can still see the
                underlying page content.
            </li>
            <li>
                Making the additional content <Markup.Emphasis>hoverable</Markup.Emphasis> ensures that people with low vision can view it
                using a screen magnifier.
            </li>
            <li>
                Making the additional content <Markup.Emphasis>persistent</Markup.Emphasis> ensures that everyone has enough time to read
                and understand it.
            </li>
        </ul>

        <h2>How to fix</h2>
        <p>Ensure that any content that appears on focus or hover is:</p>
        <ul>
            <li>
                <Markup.Term>Dismissible</Markup.Term>. The user can make the additional content disappear without moving focus or the
                mouse;
            </li>
            <li>
                <Markup.Term>Hoverable</Markup.Term>. The additional content remains visible when the mouse moves from the trigger element
                onto the additional content; and
            </li>
            <li>
                <Markup.Term>Persistent</Markup.Term>. The additional content remains visible until (1) the user removes focus or hover from
                the trigger element and the additional content, (2) the user explicitly dismisses it, or (3) the information in it becomes
                invalid.
            </li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>A tooltip appears when the user hovers over a button. The tooltip dismisses automatically after a few seconds.</p>}
            passText={
                <p>
                    The tooltip appears when the user hovers over a button, but it persists until the user moves the mouse away from both
                    the button and the tooltip, or presses the Esc key.
                </p>
            }
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html">
                Understanding Success Criterion 1.4.13 Content on Hover or Focus
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F95">
                Failure of Success Criterion 1.4.13 due to content shown on hover not being hoverable
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
