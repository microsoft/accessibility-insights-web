// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Pointer cancellation',
    },
    ({ Markup }) => (
        <>
            <p>Users must be able to cancel functions that can be operated using a single pointer.</p>

            <h2>Why it matters</h2>
            <p>
                Everyone benefits when it's easy to recover from hitting the wrong mouse or touch target. People with motor, visual, or
                cognitive disabilities are more likely to inadvertently initiate mouse or touch events.
            </p>

            <h2>How to fix</h2>
            <p>For any function that can be operated using a single pointer, make sure at least one of the following is true:</p>
            <ul>
                <li> The down event doesn't trigger any part of the function, or</li>
                <li>
                    {' '}
                    The down event initiates the function, which is completed only on the up event, and users can abort or undo the
                    function, or
                </li>
                <li> The down event completes the function, and the up event reverses the outcome of the preceding down event.</li>
            </ul>
            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        An online survey allows respondents to rank the importance of certain list items by dragging and dropping them into
                        priority order. Once an item is selected (on the down event), the user has no way to cancel the drag operation. To
                        avoid moving the list item, the user must place it back in its original position before triggering the up event.
                    </p>
                }
                passText={
                    <p>
                        The user can cancel a drag operation by dropping the item (on the up event) with the pointer outside the boundaries
                        of the list.
                    </p>
                }
            />

            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html">
                    Understanding Success Criterion 2.5.2 Pointer Cancellation
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
