// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>A link's accessible name must contain its visible text label. </p>

        <h2>Why it matters</h2>
        <p>
            Mismatches between a link's visible text label and its accessible name can create problems for people who use speech input.
            Because speech input commands are typically based on accessible names, using the visible text label to select a link might fail
            if the accessible name is different. Moreover, when an accessible label is different from the visible text label, it might be
            activated accidentally by speech input users. Mismatches can be especially burdensome for speech users with cognitive
            challenges, who must remember to use a command that's different from the visible label.
        </p>

        <h2>How to fix</h2>
        <p>
            Modify the link's accessible name and/or visible text label to ensure that the accessible name is (or contains) and exact match
            of the visible text label.
        </p>

        <h2>Example</h2>

        <Markup.PassFail
            failText={
                <p>
                    In an online bookstore, each book has a title, a one-paragraph description, and a link with a visible text label that
                    says, "Read more." To make the link purpose clearer to people who use screen readers, an invisible{' '}
                    <Markup.Code>aria-label</Markup.Code> attribute has been added to each link. Because the resulting accessible names do
                    not contain an exact match of the visible text labels, speech input users who can see the labels will find it difficult
                    to select the links.
                </p>
            }
            failExample={
                `<h2>Slaughterhouse-five</h2>
            <p>Kurt Vonnegut's absurdist classic introduces us to Billy Pilgrim, a man who becomes "unstuck in time" after he is ` +
                `abducted by aliens from the planet Tralfamadore."</p>
            [<p><a href="Von24242.html">Read more</a></p>]
            <h2>The Sirens of Titan</h2>
            <p>The richest and most depraved man on Earth takes a wild space journey to distant worlds, learning about the purpose ` +
                `of human life along the way.</p>
            [<p><a href="Von22495.html">Read more</a></p>]`
            }
            passText={
                <p>
                    The <Markup.Code>aria-label</Markup.Code> attributes are removed, and the names of the book are added to the links'
                    text. Because the accessible names exactly match the visible text labels, all users find it easy to select the links. .
                </p>
            }
            passExample={
                `<h2>Slaughterhouse-five</h2>
            <p>Kurt Vonnegut's absurdist classic introduces us to Billy Pilgrim, a man who becomes "unstuck in time" after he is ` +
                `abducted by aliens from the planet Tralfamadore."</p>
            [<p><a href="Von24242.html">Read more about Slaughterhouse-five</a></p>]
            <h2>The Sirens of Titan</h2>
            <p>The richest and most depraved man on Earth takes a wild space journey to distant worlds, learning about the purpose ` +
                `of human life along the way.</p>
            [<p><a href="Von22495.html">Read more about The Sirens of Titan</a></p>]`
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html">
                Understanding Success Criterion 2.5.3; Label in Name
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G208">
                Including the text of the visible label as part of the accessible name
            </Markup.HyperLink>
        </Markup.Links>

        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G211">
                Matching the accessible name to the visible label
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common Failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F96">
                Failure due to the accessible name not containing the visible label text
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G162">
                Positioning labels to maximize predictability of relationships (w3.org)
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
