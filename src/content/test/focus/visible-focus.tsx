// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Visible focus',
    },
    ({ Markup }) => (
        <>
            <p>Components must provide a visible indication when they have the input focus.</p>

            <h2>Why it matters</h2>
            <p>
                Keyboard users need to know which component currently has the input focus so they can predict the results of their key
                presses. By default, web browsers indicate focus visually, but custom programming, styling, and scripting can disrupt it.
            </p>
            <h3>From a user's perspective</h3>
            <p>
                <Markup.Emphasis>
                    "Having used your solution for some time, I have advanced in my skills to the point where using keyboard navigation and
                    commands is faster than pointing and clicking. Help me focus and keep track of where I am at with visual cues, such as a
                    focus ring, bolding text for labels that are in focus, etc."
                </Markup.Emphasis>
            </p>

            <h2>How to fix</h2>
            <p>The fix for no visible focus depends on its cause.</p>
            <ul>
                <li>If styling hides the focus indicator, remove the styling so the browser's default focus indicator is visible.</li>
                <li>
                    If styling makes the focus indicator difficult to see, modify the styling so the focus rectangle has a contrast ratio at
                    least as high as the default browser focus indicator.
                </li>
                <li>
                    If scripting removes focus from an element after it is received, modify the script so the element retains focus until
                    the user moves it.
                </li>
            </ul>

            <h2>Example</h2>
            <Markup.PassFail
                failText={<p>CSS styling is used to hide the default focus indicator.</p>}
                failExample={`:focus {[outline: none]}`}
                passText={<p>CSS styling is used to create a custom focus indicator.</p>}
                passExample={`:focus {[outline: 2px solid teal]}`}
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html">
                    Understanding Success Criterion 2.4.7: Focus Visible
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G149">
                    Using user interface components that are highlighted by the user agent when they receive focus
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C15">
                    Using CSS to change the presentation of a user interface component when it receives focus
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G165">
                    Using the default focus indicator for the platform so that high visibility default focus indicators will carry over
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G195">
                    Using an author-supplied, highly visible focus indicator
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR31">
                    Using script to change the background color or border of the element with focus
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Common failures</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F55">
                    Failure of Success Criteria 2.1.1, 2.4.7, and 3.2.1 due to using script to remove focus when focus is received
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F78">
                    Failure of Success Criterion 2.4.7 due to styling element outlines and borders in a way that removes or renders
                    non-visible the visual focus indicator
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
