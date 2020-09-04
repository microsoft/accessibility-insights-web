// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <React.Fragment>
        <GuidanceTitle name={'Multimedia'} />
        <h2>Why it matters</h2>
        <p>
            When pre-recorded multimedia content (synchronized video and audio) is provided, equivalent alternatives also must be provided
            for people who either can't hear the audio or can't see the video.
        </p>
        <p>
            <Markup.Term>Captions</Markup.Term> help people who are deaf or have a hearing loss by providing access to the audio in
            multimedia content. Captions are also helpful to non-native speakers and to people who have difficulty understanding auditory
            information. Captions should convey the dialogue, identify who is speaking, and provide other information conveyed through
            audio, such as music and sound effects.
        </p>
        <p>
            <Markup.Term>Audio description</Markup.Term> helps blind and low vision people by providing access to the video in multimedia
            content. Audio description should include information about actions, characters, scene changes, on-screen text, and other visual
            content.
        </p>
        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Provide captions for multimedia content. (<Link.WCAG_1_2_2 />)
                </h3>
                <ul>
                    <li>
                        If captions are missing, add them.
                        <ul>
                            <li>Use closed captions (visible on demand) if possible.</li>
                            <li>
                                Use open captions (always visible) if your media player or hosting provider doesn't support closed captions.
                            </li>
                        </ul>
                    </li>

                    <li>
                        Make sure the captions provide an accurate and complete description of the audio content:
                        <ul>
                            <li>Include all speech.</li>
                            <li>Identify the speakers.</li>
                            <li> Describe any other meaningful sounds.</li>
                        </ul>
                    </li>
                </ul>

                <h3>
                    Provide audio description for multimedia content. (<Link.WCAG_1_2_5 />)
                </h3>
                <ul>
                    <li>
                        Use any of these approaches:
                        <ul>
                            <li>Build the audio description into the video’s main soundtrack.</li>
                            <li>Make another video with the audio description.</li>
                            <li> Add an extra audio track that includes the audio description.</li>
                        </ul>
                    </li>
                    <li>
                        Make sure the audio description includes important visual details that cannot be understood from the main soundtrack
                        alone, such as:
                        <ul>
                            <li>Actions</li>
                            <li>Characters</li>
                            <li> Scene changes</li>
                            <li>On-screen text</li>
                            <li>Any other meaningful visual content</li>
                        </ul>
                    </li>
                    <li>
                        Make sure the audio description is synchronized with the video content.
                        <ul>
                            <li>Ideally, narrate events “real time,” as they happen onscreen.</li>
                        </ul>
                    </li>
                    <li>screen events are accompanied by meaningful sounds, describe them just before they happen.</li>
                </ul>
            </Markup.Do>

            <Markup.Dont>
                <h3>
                    Don’t let captions obscure any meaningful visual content. (<Link.WCAG_1_2_2 />)
                </h3>
                <ul>
                    <li>Adjust the position or timing of the captions to avoid a conflict.</li>
                </ul>
                <h3>
                    Don’t let the audio description talk over any meaningful audio content.(
                    <Link.WCAG_1_2_5 />)
                </h3>
                <ul>
                    <li>the timing of the description to avoid a conflict.</li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Provide captions</h3>
        <h4>WCAG success criteria</h4>
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

        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="http://www.captioningkey.org/">Captioning Key: Guidelines and Preferred Techniques</Markup.HyperLink>
        </Markup.Links>

        <h3>Provide audio description</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/audio-description-prerecorded">
                Understanding Success Criterion 1.2.5: Audio Description (Prerecorded)
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
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
    </React.Fragment>
));
