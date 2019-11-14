// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Pointer Cancellation'} />

        <h2>Why it matters</h2>
        <p>
            Because people with motor, visual, or cognitive disabilities are
            more likely to inadvertently initiate mouse or touch events, they
            need a way to cancel or undo the consequences. Multipoint gestures
            (such as pinch-to-zoom) and path-based gestures (such as swiping)
            can be difficult or impossible to execute for people who have
            limited fine motor control or who use head tracking, gaze tracking,
            or speech commands to control their mouse pointer. People can't use
            motion operation (such shake-to-undo) if they use a mounted device,
            they are unable to perform the triggering action, or their hands are
            otherwise occupied.
        </p>
        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Give users a method to cancel any function that they
                    initiate using a single pointer. (<Link.WCAG_2_5_2 />)
                </h3>
                <ul>
                    <li>
                        Don't use the down event to trigger any part of the
                        function, or
                    </li>
                    <li>
                        Initiate the function using the down event, but complete
                        the function only on the up event, and provide a way for
                        users abort or undo the function, or
                    </li>
                    <li>
                        Complete the function on the down event, but use the up
                        event to reverse the outcome of the preceding down
                        event.
                    </li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don't require multipoint or path-based gestures. (
                    <Link.WCAG_2_5_1 />)
                </h3>
                <ul>
                    <li>
                        {' '}
                        Provide an alternative method that requires only a
                        single pointer and doesn't depend on the path of the
                        pointer's movement.
                    </li>
                </ul>
                <h3>
                    Don't require motion operation. (<Link.WCAG_2_5_4 />)
                </h3>
                <ul>
                    <li>
                        Make sure users can operate all functionality using UI
                        components, and
                    </li>
                    <li>
                        Give users the option of disabling motion operation.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Pointer cancellation</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/pointer-cancellation.html">
                Understanding Success Criterion 2.5.2 Pointer Cancellation
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Multipoint and path-based gestures</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/pointer-gestures">
                Understanding Success Criterion 2.5.1 Pointer Gestures
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Motion operation</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/motion-actuation.html">
                Understanding Success Criterion 2.5.4 Motion Actuation
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
