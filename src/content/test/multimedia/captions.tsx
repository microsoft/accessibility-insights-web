// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Captions',
    },
    ({ Markup }) => (
        <>
            <p>Pre-recorded multimedia content must have captions.</p>

            <h2>Why it matters</h2>
            <p>
                Captions provide visual access to information in the audio track, allowing people who are deaf or hard of hearing to watch
                pre-recorded multimedia presentations. Captions are also helpful to non-native speakers and to people who have difficulty
                understanding auditory information.
            </p>

            <h3>From a user's perspective</h3>
            <p>
                <Markup.Emphasis>
                    "I often work once everyone has gone to sleep, so I mute the audio and use captions to enjoy and work with content.
                    Provide captions for any pre-recorded media so I can understand and enjoy content."
                </Markup.Emphasis>
            </p>

            <h2>How to fix</h2>
            <ul>
                <li>
                    {' '}
                    If captions are missing, add them.
                    <ul>
                        <li>Use closed captions (visible on demand) if possible. </li>
                        <li>
                            {' '}
                            Use open captions (always visible) if your media player or hosting provider doesn't support closed captions.{' '}
                        </li>
                    </ul>
                </li>
                <li>
                    {' '}
                    Make sure the captions provide an accurate and complete description of the audio content:
                    <ul>
                        <li>Include all speech.</li>
                        <li>Identify the speakers.</li>
                        <li>Describe any other meaningful sounds.</li>
                    </ul>
                </li>
            </ul>

            <h2>Example</h2>

            <Markup.PassFail
                failText={
                    <p>
                        The captions for a video recording of a play are based on the play’s script rather than its performance. Some dialog
                        is reported incorrectly, and sound effects and audience applause are omitted.
                    </p>
                }
                passText={<p>The captions are revised to accurately and completely describe the play as performed.</p>}
            />

            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html">
                    Understanding Success Criterion 1.2.2: Captions (Prerecorded)
                </Markup.HyperLink>
            </Markup.Links>

            <h4>Sufficient techniques</h4>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G93">
                    Providing open (always visible) captions
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G87">Providing closed captions</Markup.HyperLink>
            </Markup.Links>

            <h3>Additional guidance</h3>
            <Markup.Links>
                <Markup.HyperLink href="http://www.captioningkey.org/">
                    Captioning Key: Guidelines and Preferred Techniques
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
