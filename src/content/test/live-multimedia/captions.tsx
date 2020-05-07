// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Captions must be provided for live (streaming) video with audio</p>

        <h2>Why it matters</h2>
        <p>
            Captions for live presentations allow people who are deaf or have a hearing loss to access information contained in the audio
            track.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I have a hearing impairment, so I rely on captions to enjoy content. Provide captions for events with live audio or video
                so I can understand and discuss the event with everyone else."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>Provide real-time captions for live (streaming) multimedia presentations.</p>

        <h2>Example</h2>

        <Markup.PassFail
            failText={
                <p>
                    A gaming website provides live multimedia (video with audio) coverage of a video game competition. No captions are
                    provided.
                </p>
            }
            passText={
                <p>
                    The website provides real-time captions for the audio track. The captions include all speech, identify the speakers, and
                    describe other significant audio, such as the buzzers that start and end each match and audience applause.
                </p>
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/captions-live.html">
                Understanding Success Criterion 1.2.4: Captions (Live)
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G9">
                Creating captions for live synchronized media
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G93">
                Providing open (always visible) captions
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G87">Providing closed captions</Markup.HyperLink>
        </Markup.Links>
    </>
));
