// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>If audio content plays automatically for longer than 3 seconds, users must be able to pause or mute it.</p>

        <h2>Why it matters</h2>
        <p>
            People who use screen readers might struggle to hear speech output when other audio is playing. Because screen reader volume is
            typically controlled by the overall system volume, users must be able to stop or mute the audio content independently.
        </p>
        <p>Audio that plays automatically can be distracting, especially to people with attention deficit disorders.</p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I use a screen reader and keyboard to operate software and enjoy content. Audio that plays automatically can interrupt the
                screen reader voice and break my concentration. Do not play audio automatically. If auto-playing audio is essential, provide
                me an immediate way to stop, pause, mute and control volume so I can focus on the task at hand."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>Implement one of the following:</p>
        <ul>
            <li>
                Good: Provide a mechanism for users to pause, stop, or mute the audio content without affecting the overall system volume,
                or
            </li>
            <li>Better: Make the audio stop automatically after three seconds, or</li>
            <li>Best: Play the audio only on user request.</li>
        </ul>
        <p>
            The first two solutions are preferred, as audio content that plays automatically can make it difficult for a person using a
            screen reader to find a mechanism for controlling the audio.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>When a web page opens, ambient music begins playing automatically. The music continues as long as the page is open.</p>
            }
            passText={
                <p>Music does not start automatically. The user can start the music by selecting a 'Play' button at the top of the page.</p>
            }
        />

        <h2>More examples </h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/audio-control.html">
                Understanding Success Criterion 1.4.2: Audio Control
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G171">
                Playing sounds only on user request
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G60">
                Playing a sound that turns off automatically within three seconds
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G170">
                Providing a control near the top of the Web page that turns off sounds that play automatically
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F23">
                Failure due to playing a sound longer than 3 seconds where there is no mechanism to turn it off
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F93">
                Failure of Success Criterion 1.4.2 for absence of a way to pause or stop an HTML5 media element that autoplays
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F31">
                Failure of Success Criterion 3.2.4 due to using two different labels for the same function on different Web pages within a
                set of Web pages
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
