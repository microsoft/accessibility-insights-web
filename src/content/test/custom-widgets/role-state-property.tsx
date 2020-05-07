// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>A custom widget must support the ARIA roles, states, and properties specified by its design pattern.</p>
        <h2>Why it matters</h2>
        <p>
            Making a custom widget involves modifying the role and/or function of one or more of the native HTML elements used as its
            building blocks. Additional coding is required to ensure that the widget provides the right information to browsers and
            assistive technologies.
        </p>
        <h2>How to fix</h2>
        <ol>
            <li>
                Familiarize yourself with the{' '}
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex">ARIA design patterns</Markup.HyperLink> for
                custom widgets.
            </li>
            <li>Determine which design pattern your widget should follow.</li>
            <li>Make sure your custom widget follows the design pattern's specifications for "WAI-ARIA Roles, States, and Properties."</li>
        </ol>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    This list functions as a single-select listbox, but it does not have the code necessary to communicate its roles and
                    states programmatically.
                </p>
            }
            failExample={`<span id="entree">Entree options:</span>
            [<ul id="entreeOptions" tabindex="0">
            <li id="entree1">Chicken Alfredo</li>
            <li id="entree2">Roasted Veggie Casserole</li>
            </ul>]`}
            passText={
                <p>
                    Code has been added to meet the{' '}
                    <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox">listbox</Markup.HyperLink> spec: (1) The{' '}
                    <Markup.Code>{`<ul>`}</Markup.Code> that contains all of the listbox options has{' '}
                    <Markup.Code>role="listbox"</Markup.Code>. (2) The <Markup.Code>{`<ul>`}</Markup.Code> has an accessible name through an{' '}
                    <Markup.Code>aria-labelledby</Markup.Code> attribute. (3) Each <Markup.Code>{`<li>`}</Markup.Code> has{' '}
                    <Markup.Code>role="option"</Markup.Code>. (4) The selected option has <Markup.Code>aria-selected="true"</Markup.Code>.
                </p>
            }
            passExample={`<span id="entree">Entree options:</span>
            <ul id="entreeOptions" tabindex="0" [role="listbox" aria-labelledby="entree"]>
            <li id="entree1" [role="option" aria-selected="true"]>Chicken Alfredo</li>
            <li id="entree2" [role="option"]>Roasted Veggie Casserole</li>
            </ul>`}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html">
                Understanding Success Criterion 4.1.2: Name, Role, Value
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA4">
                Using a WAI-ARIA role to expose the role of a user interface component
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA5">
                Using WAI-ARIA state and property attributes to expose the state of a user interface component
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F59">
                Failure of Success Criterion 4.1.2 due to using script to make div or span a user interface control in HTML without
                providing a role for the control
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F15">
                Failure of Success Criterion 4.1.2 due to implementing custom controls that do not use an accessibility API for the
                technology, or do so incompletely
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F79">
                Failure of Success Criterion 4.1.2 due to the focus state of a user interface component not being programmatically
                determinable or no notification of change of focus state available
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Link.WAIARIAAuthoringPractices />
        </Markup.Links>
    </>
));
