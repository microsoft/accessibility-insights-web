// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';
export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Autocomplete',
    },
    ({ Markup }) => (
        <>
            <p>Form fields that serve certain purposes must have the correct HTML5 autocomplete attribute.</p>

            <h2>Why it matters</h2>
            <p>
                When the HTML 5.2 autocomplete attribute is used in a form's text field, browsers and assistive technologies can (1) present
                the purpose of the field to users in various modalities, such as speech, text, or icons; and (2) auto-fill the right content
                based on past user input. People with different abilities can choose the modality that best meets their needs. People who
                have problems with motor control, language, memory, or decision-making benefit from reducing the need for manual input in
                forms.
            </p>

            <h2>How to fix</h2>
            <p>
                For any form field that serves an{' '}
                <Markup.HyperLink href="https://www.w3.org/TR/WCAG21/#input-purposes">identified input purpose</Markup.HyperLink>, provide
                the appropriate autocomplete attribute.
            </p>
            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        A form has fields for entering a username and password, and both have autocomplete attributes. However, the password
                        field's autocomplete attribute is invalid.
                    </p>
                }
                failExample={`
            <form method="post" action="step2">
            <div>
                <label for="username">
                    Username
                </label>
                <input id="username" type="text" autocomplete="username">
            </div>
            <div>
                <label for="password">
                    Password
                </label>
                <input id="password" type="password" [autocomplete="password"]>
            </div>
            </form>
            `}
                passText={<p>The password field field has the correct autocomplete attribute.</p>}
                passExample={`
            <form method="post" action="step2">
            <div>
                <label for="username">
                    Username
                </label>
                <input id="username" type="text" autocomplete="username">
            </div>
            <div>
                <label for="password">
                    Password
                </label>
                <input id="password" type="password" [autocomplete="current-password"]>
            </div>
            </form>
            `}
            />
            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html">
                    Understanding 1.3.5 Identify Input Purpose
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H98">
                    Using HTML 5.2 autocomplete attributes
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
