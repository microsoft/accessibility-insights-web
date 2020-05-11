// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>Spacing characters must not be used to increase the space between letters in a word.</p>
        <h2>Why it matters</h2>
        <p>
            When spacing characters —such as spaces, tabs, line breaks, or carriage returns— are inserted to increase letter spacing,
            assistive technologies might not recognize the word, with the result that they mispronounce it or spell it out. In some scripts,
            such as Kanji, adding a space between characters can completely change their meaning.
        </p>
        <h2>How to fix</h2>
        <p>
            Use the CSS <Markup.Code>letter-spacing</Markup.Code> property to adjust the space between the letters in a word. To maintain
            consistent spacing when users adjust the font size, use a relative unit, such as <Markup.Code>em</Markup.Code>.
        </p>
        <Markup.PassFail
            failText={<p>Spaces are inserted between the letters of headings.</p>}
            failExample={`<h2>[C O N T E N T S]</h2>`}
            passText={
                <p>
                    Spacing around the link is achieved using the CSS <Markup.Code>letter-spacing</Markup.Code> property.
                </p>
            }
            passExample={`[<style>
            h2 {letter-spacing:.5em;}
            </style>]
            ...
            <h2>[CONTENTS]</h2>`}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">
                Understanding Success Criterion 1.3.2: Meaningful Sequence
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C8">
                Using CSS letter-spacing to control spacing within a word
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F32">
                Failure of Success Criterion 1.3.2 due to using white space characters to control spacing within a word
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
