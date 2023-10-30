// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>
            The action of dragging cannot be the only means available to perform an action, with exceptions on where dragging is essential
            to the functionality, or the dragging mechanism is not built by the web author (e.g., native browser functionality unmodified by
            the author).
        </p>
        <h2>Why it matters</h2>
        <p>Users who struggle with performing dragging movements need to still operate an interface with a pointer interface.</p>
        <p>
            Some people cannot perform dragging movements in a precise manner. Others use a specialized or adapted input device, such as a
            trackball, head pointer, eye-gaze system, or speech-controlled mouse emulator, which may make dragging cumbersome and
            error-prone. When an interface implements functionality that uses dragging movements, users perform discrete actions such as
            tapping or clicking to establish a starting point or press and hold that contact. Not all users can accurately press and hold
            that contact while also repositioning the pointer. An alternative method must be provided so that users with mobility
            impairments who use a pointer (mouse, pen, or touch contact) can use the functionality.
        </p>

        <h2>How to fix</h2>
        <p>
            For any function that can be operated through dragging, make sure that the user can (1) operate the function through dragging,
            or (2) there is a <a href="https://www.w3.org/TR/WCAG22/#dfn-single-pointer">single pointer</a> activation (for example single
            taps, clicks) alternative that does not require dragging to operate the same function.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A table’s columns can only be resized if someone can use a mouse to click on the column divider and then drag it to a
                    new position, adjusting the width of the column in the process.
                </p>
            }
            passText={
                <>
                    <p>
                        To pass this instance, an alternative "move" button could be provided, where if pressed, the next mouse click on
                        another area of the UI could result in the table column adjustments without the need to specifically drag the column
                        divider there.
                    </p>
                    <p>
                        Another way to pass this instance would be to provide alternative controls to adjust the width, such as with menus,
                        buttons, or text fields to adjust the value. These alternative methods would allow someone to click or press
                        different controls to adjust the table columns, without having to drag or use keyboard commands which may be
                        difficult to perform (e.g., rapidly pressing, or long-pressing different keys).
                    </p>
                </>
            }
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements">
                Understanding Success Criterion 2.5.7: Dragging Movements
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/general/G219">
                G219: Ensuring that an alternative is available for dragging movements that operate on content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/failures/F108">
                Failure of Success Criterion 2.5.7 Dragging Movements due to not providing a single pointer method for the user to
                operate a function that does not require a dragging movement
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures">
                Understanding Success Criterion 2.5.1: Pointer Gestures
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/general/G216">
                Providing single point activation for a control slider
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/failures/F105">
                Failure of Success Criterion 2.5.1 due to providing functionality via a path-based gesture without simple pointer
                alternative
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/general/G215">
                Providing controls to achieve the same result as path based or multipoint gestures
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
