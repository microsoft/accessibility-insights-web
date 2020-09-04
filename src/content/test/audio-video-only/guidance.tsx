// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <React.Fragment>
        <GuidanceTitle name={'Audio-only / video-only'} />

        <h2>Why alternatives matter</h2>

        <p>
            Alternatives make the information in audio-only and video-only content available to everyone. Otherwise, audio-only content is
            unavailable to people who are deaf, are hard of hearing, or have difficulty understanding auditory information; and video-only
            content is unavailable to people who are blind, have low vision, or have difficulty understanding visual information.
        </p>

        <p>
            Audio-only content must have a text alternative (a document with correctly sequenced text descriptions of the audio content).
            Video-only content must have text alternative (a document with correctly sequenced text descriptions of the video content) or an
            audio alternative (a synchronized audio track that describes the video content).
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Provide a text alternative for audio-only content. (<Link.WCAG_1_2_1 />)
                </h3>

                <ul>
                    <li>Include all speech, identify the speakers, and describe any other meaningful sounds in the audio.</li>
                </ul>

                <h3>
                    Provide a text or audio alternative for video-only content. (<Link.WCAG_1_2_1 />)
                </h3>

                <ul>
                    <li>Include all textual and visual information, describe the actions, and identify the actors.</li>
                    <li>To serve as an audio alternative, the audio track must be synchronized with the video.</li>
                </ul>
            </Markup.Do>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Provide an alternative for audio-only content </h3>
        <Markup.Links>
            <Link.WCAG21UnderstandingAudioOnlyViewOnlyPrerecorded />
            <Link.WCAG21TechniquesG158 />
        </Markup.Links>

        <h3>Provide an alternative for video-only content </h3>
        <Markup.Links>
            <Link.WCAG21UnderstandingAudioOnlyViewOnlyPrerecorded />
            <Link.WCAG21TechniquesG159 />
            <Link.WCAG21TechniquesG166 />
        </Markup.Links>
    </React.Fragment>
));
