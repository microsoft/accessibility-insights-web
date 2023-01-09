// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(({ Link }) => (
    <p>
        Most people find it easier to see and use UI Components when they have sufficient contrast against the background. People with low
        vision, limited color perception, or <Link.Presbyopia /> are especially likely to struggle with controls when contrast is too low.
    </p>
));

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>Visual information used to indicate states and boundaries of active UI Components must have sufficient contrast.</p>
        <h2>Why it matters</h2>
        <p>
            Most people find it easier to see and use UI Components when they have sufficient contrast against the background. People with
            low vision, limited color perception, or <Link.Presbyopia /> are especially likely to struggle with controls when contrast is
            too low.
        </p>
        <h2>How to fix</h2>
        <p>
            Make sure any visual information that helps users detect and operate a control has a contrast ratio ≥ 3:1. Such visual
            information includes:
        </p>
        <ul>
            <li>Any visual boundary that indicates the component's clickable area</li>
            <li>Any visual effect that indicates the component's state</li>
        </ul>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A button with a light gray boundary (#cccccc) is displayed on a white background (#ffffff). The boundary and background
                    have an insufficient contrast of 1.605:1.
                </p>
            }
            passText={
                <p>
                    The button has a medium gray boundary (#888888). The button and white background have a sufficient contrast of 3.544:1.
                </p>
            }
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html">
                Understanding Success Criterion 1.4.11: Non-text Contrast
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G195">
                Using an author-supplied, highly visible focus indicator
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F78">
                Failure of Success Criterion 2.4.7 due to styling element outlines and borders in a way that removes or renders non-visible
                the visual focus indicator
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G183">
                Using a contrast ratio of 3:1 with surrounding text and providing additional visual cues on focus for links or controls
                where color alone is used to identify them
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
