// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(() => (
    <p>
        Users must be able to navigate to all interactive interface components using a keyboard. Users can't access a web app's
        functionality if they can't access its interactive interface components. Many people, including those who are blind or who have low
        vision or hand tremors, rely on a keyboard (or keyboard alternate) to access those components.
    </p>
));

export const infoAndExamples = create(({ Markup, Link }) => (
    <React.Fragment>
        <p>Users must be able to navigate to all interactive interface components using a keyboard.</p>

        <h2>Why it matters</h2>
        <p>
            Users can't access a web app's functionality if they can't access its interactive interface components. Many people, including
            those who are blind or who have low vision or hand tremors, rely on a keyboard (or keyboard alternate) to access those
            components.
        </p>
        <p>
            Keyboard users must be able to navigate using standard keyboard commands: <Markup.Term>Tab</Markup.Term> (which moves focus
            forward to the next component) and <Markup.Term>Shift+Tab</Markup.Term> (which moves focus backward to the previous component).
            They must be able to navigate between the focusable elements of a composite widget using <Markup.Term>arrow</Markup.Term> keys.
        </p>

        <h2>How to fix</h2>
        <p>The fix for a keyboard navigation failure depends on its cause:</p>
        <ul>
            <li>
                Links and native HTML form controls are in the tab sequence by default. If one of these elements can't be reached using the{' '}
                <Markup.Term>Tab</Markup.Term> key, it's likely to have been removed from the tab sequence using{' '}
                <Markup.Term>{'tabindex="-1"'}</Markup.Term>. To return the control to the tab sequence, simply delete the{' '}
                <Markup.Term>tabindex</Markup.Term> attribute.
            </li>
            <li>
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices/#aria_ex">Custom widgets</Markup.HyperLink> based on HTML
                elements that are not natively focusable must be added to the tab sequence using <Markup.Term>{'tabindex="0"'}</Markup.Term>
                .
            </li>
            <li>
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_general_within">
                    Composite custom widgets
                </Markup.HyperLink>{' '}
                (such as a combo boxes, grids, menus, or tree views) have multiple focusable elements, only one of which should be included
                in the tab sequence at any given time. The developer must ensure that a composite custom widget manages the movement of
                focus between its focusable elements.
            </li>
        </ul>

        <h2>Examples</h2>

        <Markup.PassFail
            failText={
                <p>
                    This listbox can't be accessed via the <Markup.Term>Tab</Markup.Term> key because it isn't based on any elements that
                    are in the tab sequence by default.
                </p>
            }
            failExample={`<div class="listbox-area">
            <div class="left-area">
            <span id="ss_elem">Transuranium
            elements:</span>
            <ul id="ss_elem_list" role="listbox" aria-
            labelledby="ss_elem">
            <li id="ss_elem_Np" role="option"
            class="focused"> Neptunium</li>
            <li id="ss_elem_Pu"
            role="option">Plutonium</li></ul>`}
            passText={
                <p>
                    The listbox has been added to the tab sequence by specifying <Markup.Term>{'tabindex="0"'}</Markup.Term> on the{' '}
                    <Markup.Term>{'<ul>'}</Markup.Term> element
                </p>
            }
            passExample={`<div class="listbox-area">
            <div class="left-area">
            <span id="ss_elem">Transuranium elements:</span>
            <ul id="ss_elem_list" role="listbox"
            aria-labelledby="ss_elem" [tabindex="0"]>
            <li id="ss_elem_Np" role="option" class="focused"> Neptunium</li>
            <li id="ss_elem_Pu" role="option">Plutonium</li></ul>`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">
                Understanding Success Criterion 2.1.1: Keyboard
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Link.WCAG21TechniquesG202 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H91">Using HTML form controls and links</Markup.HyperLink>
            <Link.WCAG21TechniquesG90 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR20">
                Using both keyboard and other device-specific functions
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR35">
                Making actions keyboard accessible by using the onclick event of anchors and buttons
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR2">
                Using redundant keyboard and mouse event handlers
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F54">
                Failure of Success Criterion 2.1.1 due to using only pointing-device-specific event handlers (including gesture) for a
                function
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F55">
                Failure of Success Criteria 2.1.1, 2.4.7, and 3.2.1 due to using script to remove focus when focus is received
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F42">
                Failure of Success Criteria 1.3.1, 2.1.1, 2.1.3, or 4.1.2 when emulating links
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices/#keyboard">
                WAI-ARIA Authoring Practices 1.1: Developing a Keyboard Interface
            </Markup.HyperLink>
        </Markup.Links>
    </React.Fragment>
));
