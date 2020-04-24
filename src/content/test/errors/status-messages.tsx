// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Status messages',
    },
    ({ Markup }) => (
        <>
            <p>Status messages must be programmatically determinable without receiving focus.</p>

            <h2>Why it matters</h2>
            <p>
                Sometimes it's important for a website or web app to provide a status message without interrupting the user's work through a
                change of focus. People who have good vision can be expected to notice when a status message is added to the viewport, but
                people who are blind or have low vision can't. Instead, assistive technologies must be able to programmatically determine
                when a status message is provided.
            </p>

            <h2>How to fix</h2>
            <p>Ensure any status message that's displayed as visible text has the appropriate ARIA role: </p>
            <ul>
                <li>
                    If the status message contains important, time-sensitive information that should be communicated to users immediately
                    (potentially clearing the speech queue of previous updates), use{' '}
                    <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-1.2/#alert">role="alert"</Markup.HyperLink>, which has an
                    implicit <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-1.2/#aria-live">aria-live</Markup.HyperLink> value of{' '}
                    <Markup.Emphasis>assertive</Markup.Emphasis>.
                </li>
                <li>
                    Otherwise, use a role with an implicit aria-live value of <Markup.Emphasis>polite</Markup.Emphasis>:
                    <ul>
                        <li>
                            Use <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-1.2/#status">role="status"</Markup.HyperLink> for a
                            simple status message that's not urgent enough to justify interrupting the current task.
                        </li>
                        <li>
                            Use <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-1.2/#log">role="log"</Markup.HyperLink> if new
                            information is added to the status message in meaningful order, and old information might disappear (such as a
                            chat log, game log, error log, or messaging history).
                        </li>
                        <li>
                            Use{' '}
                            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-1.2/#progressbar">role="progressbar"</Markup.HyperLink>{' '}
                            if the message conveys the status of a long-running process.
                        </li>
                    </ul>
                </li>
            </ul>
            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        A form requires the user to enter their username. If the user fails to enter a username, a script displays a status
                        message as visible text. However, the text does not have an appropriate ARIA role, so assistive technologies do not
                        announce it.
                    </p>
                }
                failExample={`
                <form name="enroll" id="enroll" method="post" action="">
                <p [id="error"]>You must enter your username.</p>
                <p>
                <label for="username">Username (required): </label>
                <input type="text" name="username" id="username">
                </p>
                <p>
                <input type="submit" name="submit" id="submit" value="Submit">
                </p>
                </form>
            `}
                passText={<p>The status message has the appropriate role (alert), so it is announced </p>}
                passExample={`
                <form name="enroll" id="enroll" method="post" action="">
                <p id="error" [role="alert"]>You must enter your username.</p>
                <p>
                <label for="username">Username (required): </label>
                <input type="text" name="username" id="username">
                </p>
                <p>
                <input type="submit" name="submit" id="submit" value="Submit">
                </p>
                </form>
            `}
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html">
                    Understanding Success Criterion 4.1.3: Status Messages
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <p>If a status message conveys a suggestion, or a warning on the existence of an error:</p>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19">
                    Using ARIA role=alert or Live Regions to Identify Errors
                </Markup.HyperLink>
            </Markup.Links>
            <p>in combination with any of the following:</p>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G83">
                    Providing text descriptions to identify required fields that were not completed
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G84">
                    Providing a text description when the user provides information that is not in the list of allowed values
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G85">
                    Providing a text description when user input falls outside the required format or values
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G177">
                    Providing suggested correction text
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G194">
                    Providing spell checking and suggestions for text input
                </Markup.HyperLink>
            </Markup.Links>

            <p>If a status message advises on the success or results of an action, or the state of an application:</p>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22">
                    Using role=status to present status messages
                </Markup.HyperLink>
            </Markup.Links>
            <p>in combination with:</p>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G199">
                    Providing success feedback when data is submitted successfully
                </Markup.HyperLink>
            </Markup.Links>

            <p>If a status message conveys information on the progress of a process:</p>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA23">
                    Using role=log to identify sequential information updates
                </Markup.HyperLink>
            </Markup.Links>
            <p>Using role="progressbar"</p>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22">
                    Using role=status to present status messages
                </Markup.HyperLink>
            </Markup.Links>
            <p>in combination with:</p>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G193">
                    Providing help by an assistant in the Web page
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Common failures</h3>
            <p>
                Using <Markup.Code>role="alert"</Markup.Code> or <Markup.Code> aria-live="assertive"</Markup.Code> on content that's is not
                important and time-sensitive
            </p>
            <p>
                Using a <Markup.Code>visibilitychange</Markup.Code> event to hide or display a document without switching the document's
                live regions between active and inactive
            </p>
        </>
    ),
);
