// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>A custom widget must support the keyboard interaction specified by its design pattern.</p>
        <h2>Why it matters</h2>
        <p>
            For a web page to be accessible, all of its interactive interface components—including custom widgets—must be operable using a
            keyboard. Supporting the standard keyboard interactions specified by the design patterns makes it easy for keyboard and
            assistive technology users to interact with custom controls.
        </p>
        <ol>
            <li>
                Familiarize yourself with the{' '}
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex">ARIA design patterns</Markup.HyperLink> for
                custom widgets.
            </li>
            <li>Determine which design pattern your widget should follow.</li>
            <li>Make sure your custom widget follows the design pattern's specifications for "Keyboard interaction."</li>
        </ol>
        <h2>How to fix</h2>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A custom button opens a dialog. It does not support the keyboard interaction specified by the{' '}
                    <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#button">button design pattern</Markup.HyperLink>:
                    (1) It is not focusable. (2) When the button is clicked, focus does not move into the dialog.
                </p>
            }
            passText={
                <p>
                    In accordance with the{' '}
                    <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#button">button design pattern</Markup.HyperLink>,
                    the button is focusable, and clicking it moves focus into the dialog.
                </p>
            }
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">
                Understanding Success Criterion 2.1.1: Keyboard
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Link.WCAG21TechniquesG202 />
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F42">
                Failure of Success Criteria 1.3.1, 2.1.1, 2.1.3, or 4.1.2 when emulating links
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Link.WAIARIAAuthoringPractices />
        </Markup.Links>
    </>
));
