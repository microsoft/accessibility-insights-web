// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Timed Events'} />
        <h2>Why it matters</h2>
        <p>
            People who use screen readers or voice input and people with
            cognitive disabilities might need more time than other users to
            understand the information and use the controls on a website or web
            app.
        </p>
        <p>
            People who have trouble focusing might need a way to decrease the
            distractions created by movement in an application.
        </p>
        <p>
            People who use screen readers might find it hard to hear speech
            output if other audio is playing at the same time.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Allow users to turn off, adjust, or extend any time limits
                    set by the content. (<Link.WCAG_2_2_1 />)
                </h3>
                <ul>
                    <li>
                        Allow users to{' '}
                        <Markup.Term>turn off the time limit</Markup.Term>, or
                    </li>
                    <li>
                        Allow users to{' '}
                        <Markup.Term>adjust the time limit</Markup.Term> so it
                        is at least 10 times longer than the default, or
                    </li>
                    <li>
                        Warn users about the time limit, give them at least 20
                        seconds to extend the time limit through a simple action
                        (such as pressing the spacebar), and allow them to
                        extend the time limit at least 10 times.
                    </li>
                </ul>
                <h3>
                    Allow users to pause, stop, or hide any content that moves,
                    blinks, or scrolls automatically for more than five seconds.
                    (<Link.WCAG_2_2_2 />)
                </h3>
                <ul>
                    <li>
                        Good: Provide a mechanism for users to pause, stop, or
                        hide the moving content, or
                    </li>
                    <li>
                        Better: Stop the moving content automatically after five
                        seconds, or
                    </li>
                    <li>Best: Don't show moving content automatically.</li>
                </ul>
                <h3>
                    Allow users to pause, stop, hide, or control the update
                    frequency of any content that updates automatically. (
                    <Link.WCAG_2_2_2 />)
                </h3>

                <h3>
                    Allow users to pause, stop, or mute any audio content that
                    plays automatically for more than three seconds. (
                    <Link.WCAG_1_4_2 />)
                </h3>
                <ul>
                    <li>
                        Good: Provide a mechanism for users to pause, stop, or
                        mute the audio content without affecting the overall
                        system volume, or
                    </li>
                    <li>Better: Make the audio stop after three seconds, or</li>
                    <li>Best: Do not play audio automatically.</li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don’t use <Markup.Code>http-equiv="refresh"</Markup.Code> on{' '}
                    <Markup.Code>{'<meta>'}</Markup.Code> tags. (
                    <Link.WCAG_2_2_1 />)
                </h3>
                <ul>
                    <li>
                        This attribute creates a timed refresh that users can't
                        control.
                    </li>
                    <li>
                        An automated check will fail if this this attribute is
                        detected.
                    </li>
                </ul>
                <h3>
                    Don’t use <Markup.Code>{'<blink>'}</Markup.Code> or{' '}
                    <Markup.Code>{'<marquee>'}</Markup.Code> tags.(
                    <Link.WCAG_2_2_2 />)
                </h3>
                <ul>
                    <li>
                        These tags create blinking and moving content that users
                        can't control.
                    </li>
                    <li>
                        An automated check will fail if these tags are detected.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Allow users to control time limits</h3>

        <h4>Success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/timing-adjustable.html">
                Understanding Success Criterion 2.2.1: Timing Adjustable
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G198">
                Providing a way for the user to turn the time limit off
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G133">
                Providing a checkbox on the first page of a multipart form that
                allows users to ask for longer session time limit or no session
                time limit
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G180">
                Providing the user with a means to set the time limit to 10
                times the default time limit
            </Markup.HyperLink>
            <Markup.Inline>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR16">
                    Providing a script that warns the user a time limit is about
                    to expire
                </Markup.HyperLink>{' '}
                and{' '}
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR1">
                    Allowing the user to extend the default time limit
                </Markup.HyperLink>
            </Markup.Inline>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G4">
                Allowing the content to be paused and restarted from where it
                was paused
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR33">
                Using script to scroll content, and providing a mechanism to
                pause it
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR36">
                Providing a mechanism to allow user to display moving,
                scrolling, or repeating text in a static window
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F40">
                Failure due to using meta redirect with a time limit
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F41">
                Failure due to using meta refresh with a time limit
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F58">
                Failure due to using server-side techniques to automatically
                redirect pages after a time limit
            </Markup.HyperLink>
        </Markup.Links>

        <h3>
            Allow users to control content that moves, blinks, scrolls, or
            auto-updates
        </h3>

        <h4>Success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html">
                Understanding Success Criterion 2.2.2: Pause, Stop, Hide
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G4">
                Allowing the content to be paused and restarted from where it
                was stopped
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR33">
                Using script to scroll content, and providing a mechanism to
                pause it
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G11">
                Creating content that blinks for less than 5 seconds
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G187">
                Using a technology to include blinking content that can be
                turned off via the user agent
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G152">
                Setting animated gif images to stop blinking after n cycles
                (within 5 seconds)
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR22">
                Using scripts to control blinking and stop it in five seconds or
                less
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G186">
                Using a control in the Web page that stops moving, blinking, or
                auto-updating content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G191">
                Providing a link, button, or other mechanism that reloads the
                page without the blinking content
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F23">
                Failure due to playing a sound longer than 3 seconds where there
                is no mechanism to turn it off
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F93">
                Failure of Success Criterion 1.4.2 for absence of a way to pause
                or stop an HTML5 media element that autoplays
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
