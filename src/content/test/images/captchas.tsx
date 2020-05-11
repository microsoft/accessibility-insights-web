// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>If a non-text CAPTCHA is used, alternative methods must be provided for both users without vision and users without hearing.</p>

        <h2>Why it matters </h2>
        <p>
            A traditional CAPTCHA requires the user to perform a visual task that's intended to be easy for humans but difficult for robots.
            Unfortunately, such a task can be impossible for people with visual disabilities, with the result that they're denied access.
            Providing an alternative CAPTCHA (such as text or auditory) increases the likelihood that users will be able to prove they're
            human.
        </p>

        <h2>How to fix </h2>
        <p>Wherever a non-text CAPTCHA is used:</p>
        <ul>
            <li>Good: Provide both visual and auditory CAPTCHAs.</li>
            <li>Better: Provide a text-based CAPTCHA.</li>
            <li>Best: Use a non-interactive (observational) method to check for robot activity.</li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A web page requires users to prove they are human using only a visual CAPTCHA requiring them to identify images that
                    portray specific objects, such as vehicles or store fronts.
                </p>
            }
            passText={
                <p>
                    The web page requires the user to select a checkbox that says, "I am a human." It monitors mouse and keyboard activity
                    to determine whether input is being provided by a human or a robot.
                </p>
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html">
                Understanding Success Criterion 1.1.1: Non-text Content
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G144">
                Ensuring that the Web Page contains another CAPTCHA serving the same purpose using a different modality
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/turingtest/">Inaccessibility of CAPTCHA</Markup.HyperLink>
        </Markup.Links>
    </>
));
