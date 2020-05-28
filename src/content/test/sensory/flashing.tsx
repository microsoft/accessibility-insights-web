// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Web pages must not have content that flashes more than three times per second.</p>

        <h2>Why it matters</h2>
        <p>
            Content that flashes at certain frequencies can trigger seizures in people with photosensitive seizure disorders. Flashing
            content can trigger a seizure in less than a second.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "Many people don't know they are sensitive to flashing lights or, prone to seizures until it happens. Do not allow anything
                to flash or flicker more than three times a second as it may cause me anxiety, confusion, or a seizure. If flickering is
                essential to any content or functionality, such as a video game, warn me beforehand and allow me to decide if I want to take
                the risk."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <ul>
            <li>Good: Ensure the total flashing area is smaller than 21,824 pixels (in any shape), or</li>
            <li>
                Better: Ensure the relative luminance between the brightest and darkest portions of the flash is less 10% AND the flash does
                not include any saturated red, or
            </li>
            <li>Best: Modify content so it flashes no more than three times per second. </li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>A web page shows an animation of fireworks. In the grand finale, as many as five fireworks explode per second. </p>
            }
            passText={<p>The animation is edited so there are never more than three explosions per second.</p>}
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html">
                Understanding Success Criterion 2.3.1: Three Flashes or Below Threshold
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G19">
                Ensuring that no component of the content flashes more than three times in any 1-second period
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
