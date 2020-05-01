// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Synchronization',
    },
    ({ Markup }) => (
        <React.Fragment>
            <p>An audio description must be synchronized with the video content.</p>

            <h2>Why it matters</h2>
            <p>
                Audio description provides access to the visual content in a multimedia presentation. When the audio description isn’t
                well-synchronized with the video content, listeners can become confused about what’s happening.
            </p>

            <h2>How to fix</h2>
            <p>
                Where possible, narrate events "real time", as they are happening onscreen. When events are naturally accompanied by audio
                (such as spoken dialog or sound effects), it’s usually best to narrate events just before they happen.
            </p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        The audio description track is poorly synchronized with the video’s sound effects (shown in brackets). "He turns and
                        looks out the window. <Markup.Highlight>(BANG, THUD) She pulls a gun from her purse</Markup.Highlight>. He falls to
                        the floor."
                    </p>
                }
                passText={
                    <p>
                        The audio description track is synchronized in a way that makes the overall narrative more understandable. "He turns
                        and looks out the window. <Markup.Highlight>She pulls a gun from her purse. (BANG, THUD)</Markup.Highlight> He falls
                        to the floor."
                    </p>
                }
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
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
    ),
);
