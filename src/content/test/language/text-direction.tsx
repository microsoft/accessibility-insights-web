// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Text direction',
    },
    ({ Markup }) => (
        <>
            <p>If a page or a passage uses a script that is read right-to-left, it must have the correct text direction.</p>

            <h2>Why it matters</h2>
            <p>
                Identifying the correct text direction allows browsers to correctly render right-to-left scripts, such as Arabic and Hebrew.
            </p>

            <h2>How to fix</h2>
            <p>Add the correct text direction to the appropriate element:</p>
            <ul>
                <li>
                    If the default language of the page is read right-to-left, add <Markup.Code>dir="rtl"</Markup.Code> to the page's{' '}
                    <Markup.Code>{'<html>'}</Markup.Code> element.
                </li>
                <li>
                    If only a passage is read right-to-left, add <Markup.Code>dir="rtl"</Markup.Code> to the element that contains the
                    passage.
                </li>
            </ul>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        The default language of the page is English. The page contains a passage in Arabic, which uses a script that's read
                        right-to-left. The passage has the correct language (<Markup.Code>lang</Markup.Code>) attribute, but it doesn't have
                        a text direction attribute (<Markup.Code>dir</Markup.Code>).
                    </p>
                }
                failExample={`<html lang="en-US>
            …
            <body>
            …
            <span id="original">The quick brown fox jumps over the lazy dog.</span>
            …
            <span id="translation" lang="ar"> الثعلب البني السريع يقفز فوق الكلب الكسول</span>
            …`}
                passText={<p>The passage has the correct text direction for Arabic (right-to-left).</p>}
                passExample={`<html lang="en-US>
            …
            <body>
            …
            <span id="original">The quick brown fox jumps over the lazy dog.</span>
            …
            <span id="translation" lang="ar" [dir="rtl"]> الثعلب البني السريع يقفز فوق الكلب الكسول</span>
            …`}
            />

            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">
                    Understanding Success Criterion 1.3.2: Meaningful Sequence
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/International/questions/qa-html-dir">
                    Structural markup and right-to-left text in HTML
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/International/articles/inline-bidi-markup/">
                    Inline markup and bidirectional text in HTML
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H56">
                    Using the dir attribute on an inline element to resolve problems with nested directional runs
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
