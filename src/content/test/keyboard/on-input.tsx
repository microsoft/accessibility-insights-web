// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Changing a component's settings must not trigger any unexpected change of context.</p>

        <h2>Why it matters</h2>
        <p>
            A "change of context" is a major change in the content of a web page that might disorient users who aren't expecting the change.
            For example, opening a new window, moving focus to a different component, going to a new page, or significantly re-arranging the
            content of a page are all changes in context. <Markup.Term>Unexpected</Markup.Term> changes in context can be disorienting for
            anyone, but especially for people with visual disabilities, cognitive limitations, or motor impairments. Unless users are
            notified in advance, they will not expect changing a component's settings to trigger a change in context.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I get disoriented when a solution changes context automatically, like when I enter my name and the page changes
                automatically. Be sure your solution doesn't automatically change context based on user input. Let me guide the action."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>
            Use a different trigger to initiate a change of context. For example, instead of initiating the change of context when a radio
            button is selected, provide a separate command button that triggers the change.
        </p>

        <h2>Example</h2>

        <Markup.PassFail
            failText={<p>A web form is submitted automatically when the user tabs out of the last field in the form.</p>}
            failExample={`<form method="get" id="form1">
            <input type="text" name="text1" size="3" maxlength="3"> …
            <input type="text" name="text2" size="3" maxlength="3"> …
            <input type="text" name="text3" size="4" maxlength="4" [onchange="form1.submit();]">
            </form>`}
            passText={<p>Tabbing away from the last field moves focus to a 'Save' button. Activating the button submits the form. </p>}
            passExample={`<form method="get" id="form1">
            <input type="text" name="text1" size="3" maxlength="3"> …
            <input type="text" name="text2" size="3" maxlength="3"> …
            <input type="text" name="text3" size="4" maxlength="4"> …
            [<input type="submit" name="submit" value="Save">… ]
            </form>`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/on-input.html">
                Understanding Success Criterion 3.2.2: On Input
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G80">
                Providing a submit button to initiate a change of context
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H32">Providing submit buttons</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H84">
                Using a button with a select element to perform an action
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G13">
                Describing what will happen before a change to a form control is made
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR19">
                Using an onchange event on a select element without causing a change of context
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F36">
                Failure due to automatically submitting a form and presenting new content without prior warning when the last field in the
                form is given a value
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F37">
                Failure due to launching a new window without prior warning when the status of a radio button, check box or select list is
                changed
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Best practices</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G201">
                Giving users advanced warning when opening a new window
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
