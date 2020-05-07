// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>Pre-recorded audio-only content must be accompanied by an equivalent text alternative.</p>

        <h2>Why it matters</h2>

        <p>
            Text alternatives make the information in audio-only content available to everyone, including people who are deaf, are hard of
            hearing, or have difficulty understanding auditory information. They are also helpful in situations where listening to audio
            content is problematic, such as in environments that are noisy or require silence.
        </p>

        <h2>How to fix</h2>

        <p>Provide a transcript of the audio content</p>

        <h2>Example</h2>

        <Markup.PassFail
            failText={<>A web page provides a link to an audio recording of a radio comedy.</>}
            passText={
                <>
                    Next to the link to the audio recording is a link to a transcript that includes all speech, identifies the speakers,
                    describes the sound effects, and notes when the audience laughs or applauds.
                </>
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Link.WCAG21UnderstandingAudioOnlyViewOnlyPrerecorded />
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Link.WCAG21TechniquesG158 />
        </Markup.Links>
    </>
));
