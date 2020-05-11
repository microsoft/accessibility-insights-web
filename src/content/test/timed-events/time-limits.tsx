// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <React.Fragment>
        <p>If a time limit is set by the content, the user must be able to turn off, adjust, or extend the time limit.</p>

        <h2>Why it matters</h2>
        <p>
            A 'time limit' is any process that happens automatically after a set time or on a periodic basis. Examples of time limits
            include:
        </p>
        <ul>
            <li>Signing out a user after a period of inactivity</li>
            <li>Updating page content continuously or periodically</li>
            <li>Requiring a user to provide input within a specified time</li>
        </ul>
        <p>
            People who use screen readers or voice input and people with physical or cognitive disabilities might need more time to
            assimilate the information and execute the controls on a website or web app.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I recently suffered a concussion in a car accident, so it takes me a bit longer to understand and make sense of things.
                Provide me a way to increase time limits to 10 times the default allotted time or allow me to turn off time-restraints
                altogether."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>Use one of the following methods to make the time limit adjustable:</p>
        <ul>
            <li>
                Allow users to <Markup.Term>turn off the time limit</Markup.Term>.
            </li>
            <li>
                Allow users to <Markup.Term>adjust the time limit</Markup.Term> so it is at least 10 times longer than the default.
            </li>
            <li>
                Warn users about the time limit, give them at least 20 seconds to extend the time limit through a simple action (such as
                pressing the spacebar), and allow them to <Markup.Term>extend the time limit</Markup.Term> at least 10 times.
            </li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>A web app automatically signs out the user after 10 minutes of activity. No advance warning is provided.</p>}
            passText={
                <p>
                    After nine minutes of inactivity, the web app displays a message asking if the user wants to continue. The user can
                    respond 'yes' by selecting a button or pressing the keyboard's space bar. If no response is received within one minute,
                    the user is timed out. There is no limit to the number of times a user can continue.
                </p>
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html">
                Understanding Success Criterion 2.2.1: Timing Adjustable
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G198">
                Providing a way for the user to turn the time limit off
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G133">
                Providing a checkbox on the first page of a multipart form that allows users to ask for longer session time limit or no
                session time limit
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G180">
                Providing the user with a means to set the time limit to 10 times the default time limit
            </Markup.HyperLink>
            <Markup.Inline>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR16">
                    Providing a script that warns the user a time limit is about to expire
                </Markup.HyperLink>{' '}
                and{' '}
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR1">
                    Allowing the user to extend the default time limit
                </Markup.HyperLink>
            </Markup.Inline>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G4">
                Allowing the content to be paused and restarted from where it was paused
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR33">
                Using script to scroll content, and providing a mechanism to pause it
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR36">
                Providing a mechanism to allow user to display moving, scrolling, or repeating text in a static window
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F40">
                Failure due to using meta redirect with a time limit
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F41">
                Failure due to using meta refresh with a time limit
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F58">
                Failure due to using server-side techniques to automatically redirect pages after a time limit
            </Markup.HyperLink>
        </Markup.Links>
    </React.Fragment>
));
