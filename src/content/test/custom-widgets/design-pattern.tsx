// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>A custom widget must have the appropriate ARIA widget role for its design pattern.</p>
        <h2>Why it matters</h2>
        <p>Widgets are interactive interface components, such as links, buttons, and combo boxes.</p>
        <p>Native widgets include the following simple, interactive HTML elements:</p>
        <ul>
            <li>
                <Markup.Code>{`<button>`}</Markup.Code>
            </li>
            <li>
                <Markup.Code>{`<input>`}</Markup.Code>
            </li>
            <li>
                <Markup.Code>{`<select>`}</Markup.Code>
            </li>
            <li>
                <Markup.Code>{`<textarea>`}</Markup.Code>
            </li>
        </ul>
        <p>
            Custom widgets are interactive interface components designed to meet unique UX needs. They are created by adding functionality
            to native widgets or to non-interactive components such as <Markup.Code>{`<div>`}</Markup.Code> elements.
        </p>
        <p>
            Custom widgets are most appropriate for complex controls (such as a text field, listbox, and button that together function as a
            combo box). For simple controls (such as buttons or links), it's better to use native widgets, as they require significantly
            less coding to make them accessible.
        </p>
        <p>
            A custom widget usually requires an ARIA widget role to communicate the correct function to assistive technologies and enable
            them to interact with the widget.
        </p>
        <h2>How to fix</h2>
        <p>
            If possible, replace the custom widget with a native HTML control. (As a rule, it's better to use native semantics than to
            modify them using ARIA roles.) If needed, use CSS styling to achieve the desired appearance.
        </p>
        <p>If you can't use a native HTML control:</p>
        <ol>
            <li>
                Familiarize yourself with the{' '}
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex">ARIA design patterns</Markup.HyperLink> for
                custom widgets.
            </li>
            <li>Determine which design pattern your widget should follow.</li>
            <li>
                Add the correct widget role to the container specified by the design pattern. Exception: A few design patterns do not
                require a widget role.
            </li>
        </ol>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A <Markup.Code>{`<div>`}</Markup.Code> and its contents are coded to function as an{' '}
                    <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#alertdialog">alert dialog</Markup.HyperLink>, but
                    the <Markup.Code>{`<div>`}</Markup.Code> has been given the more generic role of a{' '}
                    <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal">modal dialog</Markup.HyperLink>.
                </p>
            }
            passText={
                <p>
                    The <Markup.Code>{`<div>`}</Markup.Code> is given the correct role for an alert dialog. The{' '}
                    <Markup.Code>alertdialog</Markup.Code> role enables browsers and assistive technologies to handle it differently from
                    other modal dialogs, for example, by playing a system alert sound when it opens.
                </p>
            }
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html">
                Understanding Success Criterion 4.1.2: Name, Role, Value
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA4">
                Using a WAI-ARIA role to expose the role of a user interface component
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F59">
                Failure of Success Criterion 4.1.2 due to using script to make div or span a user interface control in HTML without
                providing a role for the control
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Link.WAIARIAAuthoringPractices />
        </Markup.Links>
    </>
));
