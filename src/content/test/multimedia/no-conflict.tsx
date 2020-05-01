// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'No conflict',
    },
    ({ Markup }) => (
        <React.Fragment>
            <p>An audio description must not conflict with audible information in the sound track.</p>

            <h2>Why it matters</h2>
            <p>
                The goal of audio description is to provide equal access all content in a multimedia presentation. If the description
                conflicts with meaningful audio content, then people who are blind or have low vision can’t access that content.
            </p>

            <h2>How to fix</h2>
            <p>Adjust the timing of the description so it does not conflict with meaningful audio content.</p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={<p>The audio description "talks over" the beginning of a presenter’s speech.</p>}
                passText={<p>The audio description is edited so it ends before presenter begins speaking.</p>}
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
