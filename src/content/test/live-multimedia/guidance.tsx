// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <React.Fragment>
        <GuidanceTitle name={'Live multimedia'} />

        <h2>Why it matters</h2>

        <p>
            Captions for live (streaming) presentations allow people who are
            deaf or have a hearing loss to access information contained in the
            audio track.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    {' '}
                    Provide real-time captions for live (streaming) multimedia
                    presentations. (<Link.WCAG_1_2_4 />)
                </h3>

                <ul>
                    <li>
                        Include all speech, identify who is speaking, and
                        describe sound effects and other significant audio
                    </li>
                </ul>
            </Markup.Do>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Write descriptive headings</h3>

        <h4>WCAG success Criteria</h4>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/captions-live.html">
            Understanding Success Criterion 1.2.4: Captions (Live)
        </Markup.HyperLink>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G9">
                Creating captions for live synchronized media
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G93">
                Providing open (always visible) captions
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G87">
                Providing closed captions
            </Markup.HyperLink>
        </Markup.Links>
    </React.Fragment>
));
