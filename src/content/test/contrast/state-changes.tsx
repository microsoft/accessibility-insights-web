// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>
            If the only visual indication of a control's change of state is a change of color, the different colors must have sufficient
            contrast.
        </p>

        <h2>Why it matters</h2>

        <p>
            A control's state changes can be indicated through changes in visual characteristics, such as shape, size, and color. Sufficient
            contrast between states makes it easier for people with mild visual disabilities, low vision, limited color perception, or
            presbyopia to perceive such changes.
        </p>

        <h2>How to fix</h2>

        <p>Make the control's state changes visually perceptible:</p>
        <ul>
            <li>Good: Ensure colors used to indicate different states have a contrast ratio ≥ 3:1. </li>
            <li>
                Better: Indicate state changes by changing both color and another visual characteristic, such as shape, size, or styling.
            </li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A button uses changes in its border color alone to indicate whether it is enabled or disabled. When the button is
                    enabled, its border is medium gray (#777777). When it is disabled, the border is a lighter gray (#949494). The contrast
                    ratio between the two border colors is insufficient (1.476:1).
                </p>
            }
            passText={<p>When the button is disabled, its border becomes both lighter and dashed.</p>}
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
