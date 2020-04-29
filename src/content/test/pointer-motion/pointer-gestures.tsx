// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Pointer gestures',
    },
    ({ Markup }) => (
        <>
            <p>Functions must be operable without requiring multipoint or path-based gestures.</p>

            <h2>Why it matters</h2>
            <p>
                Multipoint and path-based gestures can be difficult or impossible to execute for people who have limited fine motor control
                or who use head tracking, gaze tracking, or speech commands to control their mouse pointer. Moreover, many users might not
                be aware that such gestures are supported, especially if they have cognitive or learning disabilities.
            </p>

            <h2>How to fix</h2>
            <p>
                For any function that can be operated using multipoint or path-based gestures, provide an alternative method that (1)
                requires only a single pointer, and (2) doesn't depend on the path of the pointer's movement.
            </p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        An online survey requires respondents to rank the importance of certain list items by dragging and dropping them
                        into priority order. Dragging requires path-based input, and no alternative method is provided.
                    </p>
                }
                passText={
                    <p>
                        Respondents can reorder list items either by dragging them or by selecting <Markup.Term>Up</Markup.Term> and{' '}
                        <Markup.Term>Down</Markup.Term> buttons associated with each item. The buttons can be selected using touch, mouse,
                        or keyboard.
                    </p>
                }
            />

            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures.html">
                    Understanding Success Criterion 2.5.1 Pointer Gestures
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
