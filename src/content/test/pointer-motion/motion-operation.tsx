// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>If any function can be operated through motion, it must also be operable through user interface components.</p>

        <h2>Why it matters</h2>
        <p>
            Many devices have sensors that can act as inputs and allow users to operate functions by tilting, shaking, or reorienting the
            device. People can't use motion operation if they use a mounted device, they are unable to perform the triggering movement, or
            their hands are otherwise occupied.
        </p>

        <h2>How to fix</h2>
        <p>
            For any function that can be operated through motion, make sure that the user can (1) operate the function through user
            interface components, and (2) disable motion operation.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A social media app allows the user to vote photographs up or down by tilting the device up or down. No alternative
                    method is provided, and the user can't disable the tilt-to-vote functionality.
                </p>
            }
            passText={
                <p>
                    The user can vote by tilting the device or by using <Markup.Term>Up</Markup.Term> and <Markup.Term>Down</Markup.Term>{' '}
                    buttons associated with each photograph. The user can also disable the tilt-to-vote functionality.
                </p>
            }
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/motion-actuation.html">
                Understanding Success Criterion 2.5.4 Motion Actuation
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
