// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Cues',
    },
    ({ Markup, Link }) => (
        <>
            <p>If a custom widget adopts certain interactive states, it must provide appropriate cues.</p>
            <h2>Why it matters</h2>
            <p>
                Users need to know whether a widget is disabled or read-only, so they know whether they can interact with it. They need to
                know whether it is required, so they can decide whether to skip it. To ensure users of assistive technology are aware of
                these states, the cues must be provided programmatically, and not just visually.
            </p>
            <h2>How to fix</h2>
            <p>Make sure each native widget has the appropriate HTML attribute when it is disabled, read-only, or required.</p>
            <ul>
                <li>
                    The <Markup.Term>disabled</Markup.Term> attribute is supported by all <Markup.Code>{`<button>`}</Markup.Code>,{' '}
                    <Markup.Code>{`<input>`}</Markup.Code>, <Markup.Code>{`<select>`}</Markup.Code>, and{' '}
                    <Markup.Code>{`<textarea>`}</Markup.Code> elements. A disabled widget is non-editable and non-focusable.
                </li>
                <li>
                    The <Markup.Term>readonly</Markup.Term> attribute is supported by <Markup.Code>{`<textarea>`}</Markup.Code> elements and
                    by
                    {' ' + ''}
                    <Markup.Code>{`<input>`}</Markup.Code> elements that accept text input. A read-only widget is non-editable, but it is
                    focusable, and users can select its text.
                </li>
                <li>
                    The <Markup.Term>required</Markup.Term> attribute is supported by all <Markup.Code>{`<input>`}</Markup.Code> elements
                    except those that function as buttons. A required widget must have input before a form can be submitted.
                </li>
            </ul>
            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        When this custom button is disabled, its background turns light gray, but it doesn't communicate its disabled state
                        programmatically.
                    </p>
                }
                failExample={`CSS
            [role="button"]:disabled {border-color: #cccccc; background-color: #cccccc;}
            HTML
            <div tabindex="0" role="button" id="action">Save</div>`}
                passText={<p>When the button is disabled, it has the aria-disabled attribute.</p>}
                passExample={`CSS
            [role="button"]:disabled {border-color: #cccccc; background-color: #cccccc;}
            HTML
            <div tabindex="0" role="button" [aria-disabled="true"] id="action">Save</div>`}
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
                <Link.WCAG21TechniquesG83 />
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H90">
                    Indicating required form controls using label or legend
                </Markup.HyperLink>
                <Link.WCAG21TechniquesG138 />
            </Markup.Links>
        </>
    ),
);
