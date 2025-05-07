// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>
            Users must be able to <Markup.Emphasis>navigate away</Markup.Emphasis> from all components using a keyboard.
        </p>

        <h2>Why it matters</h2>
        <p>
            If a keyboard-only user navigates to an interactive interface component but can't navigate{' '}
            <Markup.Emphasis>away</Markup.Emphasis>, they can become completely unable to interact with their computer.
        </p>
        <h3>From a user's perspective </h3>
        <p>
            <Markup.Emphasis>
                "I rely on a screen reader and keyboard to navigate content and software interfaces. When creating keyboard navigation,
                ensure I can get in and out of any area via keyboard alone. If an action requires a special keyboard command or, something
                prevents me from progressing with my keyboard, then provide explicit information on how I can leave that area."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>The fix for a keyboard trap depends on its cause: </p>
        <ul>
            <li>
                The text field of a rich text editor can become a keyboard trap if pressing the <Markup.Term>Tab</Markup.Term> key inserts a
                tab character. The user interface must (1) provide an alternative method for navigating away, and (2) inform users about
                it.{' '}
            </li>
            <li>
                Keyboard traps can result from scripts that use <Markup.Term>blur</Markup.Term> or <Markup.Term>keypress</Markup.Term>{' '}
                events to modify an element's behavior. The script must be modified so it doesn't interfere with default keypress behaviors.
            </li>
            <li>
                Any text field can become a keyboard trap if scripting returns focus to the field when the user enters data incorrectly.
            </li>
        </ul>

        <h2>Example</h2>

        <Markup.PassFail
            failText={<p>Users can't tab away from a text field because scripting keeps returning focus to it.</p>}
            failExample={`<script type="text/javascript">
            function check() {
                if (isValid()) {
                document. getElementById("name1"). focus();
                }
            }
            </script>
            <label for="name1"> First name</label>
            <input onBlur="check();" type="text"
            id="name1">`}
            passText={<p>The text field's label updates to indicate an error, but focus isn't trapped. </p>}
            passExample={`<script type="text/javascript">
            function check()
            { if (isValid()) {
                [var s = createElement("span");
                s.innerText = "(Invalid name)";
                 document. getElementById("l1"). appendChild(s);]
                }
            }
            </script>
            <label id="l1" for="name1"> First name</label>
            <input onBlur="check();" type="text" id="name1">`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html">
                Understanding Success Criterion 2.1.2: No Keyboard Trap
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G21">
                Ensuring that users are not trapped in content
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F10">
                Failure of Success Criterion 2.1.2 due to combining multiple content formats in a way that traps users inside one format
                type
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
