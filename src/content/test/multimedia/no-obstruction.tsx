// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Captions must not obscure or obstruct relevant information in the video.</p>

        <h2>Why it matters</h2>
        <p>
            The goal of captioning is to provide equal access to all content in a multimedia presentation. If captions obstruct meaningful
            visual content, then people who are deaf or hard of hearing can’t access that content.
        </p>

        <h2>How to fix</h2>
        <p>Adjust the positioning or timing of captions to avoid obstructing meaningful visual content.</p>

        <h2>Example</h2>

        <Markup.PassFail
            failText={
                <p>
                    The video shows a close-up of a note in the hand of an actor, who is speaking. The captions reporting her speech are
                    timed and positioned so that they block viewing the content of the note.
                </p>
            }
            passText={<p>The timing of the captions is adjusted so that the note is briefly fully visible.</p>}
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
            <Markup.HyperLink href="http://www.captioningkey.org/">Captioning Key: Guidelines and Preferred Techniques</Markup.HyperLink>
        </Markup.Links>
    </>
));
