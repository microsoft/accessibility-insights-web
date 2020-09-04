// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Components must not require specific timings for individual keystrokes.</p>

        <h2>Why it matters</h2>
        <p>
            Some people use a keyboard because they have hand tremors or muscle weakness that makes it difficult to use a mouse. Such users
            can also find it difficult to use a keyboard when components require specific timings for individual keystrokes. For example, a
            component might require the user to execute multiple keystrokes quickly, or to press and hold a key for an extended period
            before the keystroke is registered. Such keystroke timings are allowed only where the underlying function requires the user to
            define a specific path (such as a freehand drawing or flight simulation) and not just the endpoints (such as drawing geometric
            shapes or drag-and-drop).
        </p>

        <h2>How to fix</h2>
        <p>Redesign the keyboard interaction so it does not require specific keystroke timings.</p>

        <h2>Example</h2>

        <Markup.PassFail
            failText={<p>A web app goes into a desired state when the user presses and holds a key.</p>}
            passText={<p>The web app allows the user to invoke the desired state by activating a button.</p>}
        />

        <h2>More examples</h2>
        <h3>Success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">
                Understanding Success Criterion 2.1.1: Keyboard
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
