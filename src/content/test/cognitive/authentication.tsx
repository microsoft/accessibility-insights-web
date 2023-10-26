// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>
            People with cognitive issues relating to memory, reading (for example, dyslexia), numbers (for example, dyscalculia), or
            perception-processing limitations will be able to authenticate irrespective of the level of their cognitive abilities.
        </p>
        <h2>Why it matters</h2>
        <p>
            This is value for people with certain cognitive disabilities to ensure that there is an accessible, easy-to-use, and secure
            method to log in. Most Web sites rely on usernames and passwords for logging in. Memorizing or transcribing a username,
            password, or one-time verification code places a very high or impossible burden upon people with certain cognitive disabilities.
        </p>

        <h2>How to fix</h2>
        <p>
            Ensure that login functionalities in the system don’t make people solve, recall, or transcribe something to log in. Consider
            using the following techniques to make authentication more accessible such as:
        </p>
        <ul>
            <li>Copy & paste functionality is enabled.</li>
            <li>2-factor authentication systems with verification codes to prevent higher cognitive recall.</li>
        </ul>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A fieldset that prompts a user to "Enter the 2nd, 6th and last characters of your password", with separate input fields
                    for each character.{' '}
                </p>
            }
            failExample={
                <p>The block paste functionality for the website is blocked and user is unable to copy credentials into the login form.</p>
            }
            passText={
                <p>
                    A social media website has a username and password based login mechanism. As part of the forgotten password feature,
                    there is a separate link to login with an email. When the user enters their email and submits the form, the site sends
                    an email to the user. Clicking the link in the email opens the website and the user is logged in.
                </p>
            }
            passExample={
                <p>
                    A web site does not block paste functionality. The user is able to use a third-party password manager to store
                    credentials, copy them, and paste them directly into a login form.
                </p>
            }
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html">
                Understanding Success Criterion 3.3.8: Accessible Authentication (Minimum) | WAI | W3C
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/html/H100">
                H100: Providing properly marked up email and password inputs | WAI | W3C
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/general/G218">
                G218: Email link authentication | WAI | W3C
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional Guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/coga-gap-analysis/#table3">
                Cognitive Accessibility Roadmap and Gap Analysis (w3.org)
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/coga-usable/#make-it-easy-%20%20%20%20%20%20%20%20%20%20%20%20%20to-find-help-and-give-feedback-pattern">
                Making Content Usable for People with Cognitive and Learning Disabilities (w3.org)
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
