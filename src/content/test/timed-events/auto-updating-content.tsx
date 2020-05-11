// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>If content updates automatically, users must be able to pause, stop, hide, or control the frequency of updates.</p>

        <h2>Why it matters</h2>
        <p>
            Some users might need extra time to read web content before it updates, including people with reading or cognitive disorders and
            people who are not reading in their native language.
        </p>

        <h2>How to fix</h2>
        <p>Provide a mechanism for users to pause, stop, hide, or control the frequency of updates</p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A web page containing a news article allows users to post comments about the article. User comments are displayed in a
                    sidebar (adjacent to the article), with the newest comments at the top. The comments are updated automatically every 10
                    seconds.
                </p>
            }
            passText={
                <p>
                    At the top of the comments sidebar is an 'Update comments' dropdown that allows users to choose the frequency of
                    updates. One option is 'Never.'
                </p>
            }
        />

        <h2>More examples </h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html">
                Understanding Success Criterion 2.2.2: Pause, Stop, Hide
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G4">
                Allowing the content to be paused and restarted from where it was stopped
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
