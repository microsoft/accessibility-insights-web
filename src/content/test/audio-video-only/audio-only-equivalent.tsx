// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { React, create } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => <>

    <h1>Audio-only equivalent</h1>

    <p>Pre-recorded audio-only content must be accompanied by an equivalent text alternative. (<Link.WCAG_1_2_1 />)</p>


    <h2>Why it matters</h2>

    <p>
        Text alternatives make the information in audio-only content available to everyone, including people who are deaf,
        are hard of hearing, or have difficulty understanding auditory information. They are also helpful in situations
        where listening to audio content is problematic, such as in environments that are noisy or require silence.
    </p>

    <h2>How to fix</h2>

    <p>
        Provide a transcript of the audio content
    </p>

    <h2>Example</h2>

    <Markup.PassFail

        failText={
            <>A web page provides a link to an audio recording of a radio comedy.</>
        }

        passText={
            <>Next to the link to the audio recording is a link to a transcript that includes all speech, identifies
            the speakers, describes the sound effects, and notes when the audience laughs or applauds.</>
        }

    />

    <h4>For more examples, see the following articles:</h4>
    <Markup.Links>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/audio-only-and-video-only-prerecorded.html">
            Understanding Success Criterion 1.2.1: Audio-only and Video-only (Prerecorded)</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G158">
            Providing an alternative for time-based media for audio-only content</Markup.HyperLink>
    </Markup.Links>
</>);
