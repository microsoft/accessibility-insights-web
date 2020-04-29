// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Moving content',
    },
    ({ Markup }) => (
        <>
            <p>
                If content moves, blinks, or scrolls automatically for more than five seconds, users must be able to pause, stop, or hide
                it.
            </p>

            <h2>Why it matters</h2>
            <p>
                Content that moves or conveys a sense of motion can be distracting, especially to people with attention deficit disorders.
                People who have reading or cognitive disorders that make it difficult to read stationary text might struggle to read moving
                text.
            </p>

            <h3>From a user's perspective</h3>
            <p>
                <Markup.Emphasis>
                    "I enjoy content and operate interfaces via a screen reader and keyboard. Objects that refresh, or start automatically
                    interrupt me. If it is essential to the solution that something updates or plays content automatically, provide me a way
                    to pause, stop or disable that content so I can focus on my work."
                </Markup.Emphasis>
            </p>

            <h2>How to fix</h2>
            <p>Implement one of the following:</p>
            <ul>
                <li>Good: Provide a mechanism for users to pause, stop, or hide the moving content, or</li>
                <li>Better: Stop the moving content automatically after five seconds, or</li>
                <li>Best: Don't show moving content automatically.</li>
            </ul>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        A web page has links to news articles. To draw the user's attention to the latest articles, any link published
                        within the past hour is accompanied by a blinking icon. One hour after the link is published, the blinking icon
                        disappears.
                    </p>
                }
                passText={
                    <p>
                        The icon stops blinking five seconds after the page loads, and the (non-blinking) icon disappears an hour after the
                        link is published.
                    </p>
                }
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html">
                    Understanding Success Criterion 2.2.2: Pause, Stop, Hide
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G4">
                    Allowing the content to be paused and restarted from where it was stopped
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR33">
                    Using script to scroll content, and providing a mechanism to pause it
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G11">
                    Creating content that blinks for less than 5 seconds
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G187">
                    Using a technology to include blinking content that can be turned off via the user agent
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G152">
                    Setting animated gif images to stop blinking after n cycles (within 5 seconds)
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR22">
                    Using scripts to control blinking and stop it in five seconds or less
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G186">
                    Using a control in the Web page that stops moving, blinking, or auto-updating content
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G191">
                    Providing a link, button, or other mechanism that reloads the page without the blinking content
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Common failures</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F16">
                    Failure due to including scrolling content where there is not a mechanism to pause and restart the content
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F47">
                    Failure due to using the blink element
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F4">
                    Failure due to using text-decoration:blink without a mechanism to stop it in less than five seconds
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F50">
                    Failure due to a script that causes a blink effect without a mechanism to stop the blinking at 3 seconds or less
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F7">
                    Failure due to an object or applet, such as Java or Flash, that has blinking content without a mechanism to pause the
                    content that blinks for more than five seconds
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
