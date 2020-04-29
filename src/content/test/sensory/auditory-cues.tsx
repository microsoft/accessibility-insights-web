// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Auditory cues',
    },
    ({ Markup }) => (
        <>
            <p>Auditory cues must be accompanied by visual cues.</p>

            <h2>Why it matters</h2>
            <p>
                Auditory cues can help communicate system events to people with good hearing. However, auditory cues alone don't help people
                who are deaf or have a hearing loss, people who work in noisy environments, or people who mute their computer's audio to
                avoid disturbing others.
            </p>

            <h2>How to fix</h2>
            <p>For each auditory cue, also provide a visible cue.</p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        An online quiz provides feedback when an answer is submitted by playing a 'ding' when the answer is correct and a
                        'buzz' when it's incorrect (auditory only).
                    </p>
                }
                passText={<p>In addition to playing audio, text is displayed on the screen (auditory + visual).</p>}
            />

            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/sensory-characteristics.html">
                    Understanding Success Criterion 1.3.3: Sensory Characteristics
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
