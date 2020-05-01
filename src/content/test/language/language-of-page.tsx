// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Language of page',
    },
    ({ Markup }) => (
        <>
            <p>A page must have the correct default language.</p>

            <h2>Why it matters</h2>
            <p>
                When a web page's default language is programmatically identified, browsers and assistive technologies can render the text
                more accurately; screen readers can use the correct pronunciation; visual browsers can display the correct characters; and
                media players can show captions correctly. All users find it easier to understand the page's content.
            </p>

            <h2>How to fix</h2>
            <p>
                Make sure the page's <Markup.Code>{'<html>'}</Markup.Code> tag has the correct{' '}
                <Markup.HyperLink href="http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry">
                    lang attribute
                </Markup.HyperLink>
                .
            </p>

            <h3>From a user's perspective</h3>
            <p>
                <Markup.Emphasis>
                    "If you do not define the language for a web page, the software I use to enjoy content may get stuck or not work at
                    all."
                </Markup.Emphasis>
            </p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        The page's <Markup.Code>{'<html>'}</Markup.Code> tag has English attribute but the content is in Spanish.
                    </p>
                }
                failExample={`<html [lang="en"] style="height: 100%;>…</html>`}
                passText={
                    <p>
                        The page's <Markup.Code>{'<html>'}</Markup.Code> tag has the correct language attribute. (Most of the page's content
                        is in Spanish.)
                    </p>
                }
                passExample={`<html [lang="es"] style="height: 100%;>…</html>`}
            />

            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html">
                    Understanding Success Criterion 3.1.1: Language of Page
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H57">
                    Using language attributes on the html element
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
