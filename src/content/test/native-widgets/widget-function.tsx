// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>If a native widget functions as a custom widget, it must have the appropriate ARIA widget role.</p>
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
            However, a native widget can be programmed to function as a custom widget, For example, a button, a text field, and a listbox
            might function together as a combo box.
        </p>
        <p>
            A native widget that functions as a custom widget usually requires an ARIA widget role. The role communicates the correct
            function to assistive technologies and enables them to interact with the widget.
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
                Add the correct widget role specified by the design pattern. Exception: A few design patterns do not require a widget role.
            </li>
        </ol>
        <p>
            Most design patterns have additional requirements related to (1) roles, states, properties, and (2) keyboard interaction. These
            requirements are covered in the Custom widgets test.
        </p>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A textbox and list are coded so they function together as a combo box, but they do not have the roles associated with
                    comboboxes.
                </p>
            }
            passText={
                <p>
                    Following the{' '}
                    <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#combobox">
                        combo box design pattern
                    </Markup.HyperLink>
                    , the textbox and listbox are contained in a <Markup.Code>{`<div>`}</Markup.Code> with role="combobox".
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
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Link.WAIARIAAuthoringPractices />
        </Markup.Links>
    </>
));
