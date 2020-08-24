// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>If the language of a passage differs from the default language of the page, the passage must have its own language attribute.</p>

        <h2>Why it matters</h2>
        <p>
            When a passage has the correct language attribute, browsers and assistive technologies can render the text more accurately;
            screen readers can use the correct pronunciation; visual browsers can display the correct characters; and media players can show
            captions correctly. All users find it easier to understand the page's content.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "If you do not declare the language of a phrase that comes from a language other than the declared language of the document,
                my screen reader may mispronounce the word or phrase, confusing me."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>
            Add the correct{' '}
            <Markup.HyperLink href="http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry">
                lang attribute
            </Markup.HyperLink>{' '}
            to the element that contains the passage.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    The default language of the page is English. A passage in Spanish doesn't have the correct language (
                    <Markup.Code>lang</Markup.Code>) attribute.
                </p>
            }
            failExample={`<html lang="en-US>
            …
            <body>
            …
            <span id="original">The quick brown fox jumps over the lazy dog.</span>
            …
            <span id="translation"> El rápido zorro marrón salta sobre el perro perezoso.</span>`}
            passText={<p>The passage has the correct language attribute: Spanish (Latin America).</p>}
            passExample={`<html lang="en-US>
            …
            <body>
            …
            <span id="original"> The quick brown fox jumps over the lazy dog.</span>
            …
            <span id="translation" [lang="es-419"]> El rápido zorro marrón rápido salta sobre el perro perezoso.</span>
            …`}
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html">
                Understanding Success Criterion 3.1.2: Language of Parts
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H58">
                Using the lang attribute to identify changes in the human language
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
