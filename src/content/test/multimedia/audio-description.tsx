// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <React.Fragment>
        <p>Pre-recorded video with audio must have an audio description.</p>

        <h2>Why it matters</h2>
        <p>
            By providing auditory access to information in the video track, audio description allows people who are blind or have low vision
            to listen to pre-recorded multimedia presentations. Note: If the audio track already provides all the information in the video
            track, no audio description is necessary.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "Provide an audio description track for pre-recorded videos so I can understand the story as the content creator imagined
                it. Provide information on scene changes, actors, etc. This allows me to understand, enjoy, and share the story with
                others."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <ul>
            <li>
                If the audio description is missing, add it using one of these methods:
                <ul>
                    <li>Build the audio description into the video.</li>
                    <li>Make another video with the audio description.</li>
                    <li>Add an extra audio track that includes the audio description.</li>
                </ul>
            </li>
            <li>
                Make sure the audio description includes important visual details that cannot be understood from the main soundtrack alone.
                Include information about actions, characters, scene changes, on-screen text, and other meaningful visual content.
            </li>
        </ul>

        <h2>Example</h2>

        <Markup.PassFail
            failText={<p>A multimedia presentation has no soundtrack with audio description.</p>}
            passText={<p>The presentation offers an additional soundtrack with audio description.</p>}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/audio-description-or-media-alternative-prerecorded">
                Understanding Success Criterion 1.2.3: Audio Description or Media Alternative (Prerecorded)
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/audio-description-prerecorded">
                Understanding Success Criterion 1.2.5: Audio Description (Prerecorded)
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="http://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/G78">
                Providing a second, user-selectable, audio track that includes audio descriptions
            </Markup.HyperLink>
            <Markup.HyperLink href="http://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/G173">
                Providing a version of a movie with audio descriptions
            </Markup.HyperLink>
            <Markup.HyperLink href="http://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/G8">
                Providing a movie with extended audio descriptions
            </Markup.HyperLink>
            <Markup.HyperLink href="http://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/G203">
                Using a static text alternative to describe a “talking head” video{' '}
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H96">
                Using the track element to provide audio descriptions
            </Markup.HyperLink>
            <Markup.HyperLink href="http://joeclark.org/access/description/ad-principles.html">
                Standard Techniques in Audio Description
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.youtube.com/watch?v=fVytpQy3eaE">
                Microsoft Build: AI for Accessibility (Audio Description) (YouTube video)
            </Markup.HyperLink>
            <Markup.HyperLink href="http://www.acb.org/adp/samples.html">Samples of Audio Description</Markup.HyperLink>
        </Markup.Links>
    </React.Fragment>
));
