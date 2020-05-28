// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>If an input error is automatically detected, the item in error must be identified, and the error described, in text.</p>
        <h2>Why it matters</h2>
        <p>An "input error" occurs when:</p>
        <ul>
            <li>The user omits information that's expected by a web page, or</li>
            <li>The user provides information outside the allowed values, or</li>
            <li>The user provides information in an unexpected format.</li>
        </ul>
        <p>
            Identifying and describing input errors in text allows people who use assistive technologies to learn what went wrong. It also
            helps people with certain cognitive disabilities who have difficulty understanding the meaning of icons and other visual cues.
        </p>
        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>"Everyone makes mistakes. When I make a mistake, tell me what I need to do to fix it."</Markup.Emphasis>
        </p>
        <h2>How to fix</h2>
        <p>
            Use text to identify and describe input errors. (It's ok if you <Markup.Emphasis>also</Markup.Emphasis> provide visual cues,
            such as color changes or error icons.)
        </p>
        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>A web page uses colored borders to identify input fields with errors.</p>}
            passText={
                <p>
                    In addition to colored borders, the page uses text to identify input fields with errors. It also uses an aria-live
                    region to notify users when an input error is detected. See a{' '}
                    <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/working-examples/aria-invalid-required-fields/">
                        working example
                    </Markup.HyperLink>
                    .
                </p>
            }
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html">
                Understanding Success Criterion 3.3.1: Error Identification
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <h4>Use one of these techniques if a form contains required fields:</h4>
        <Markup.Links>
            <Link.WCAG21TechniquesG83 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21">
                Using Aria-Invalid to Indicate An Error Field
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18">
                Providing client-side validation and alert
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Use one of these techniques if a field requires a specific data format or certain values:</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA18">
                Using aria-alertdialog to Identify Errors
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA19">
                Using ARIA role=alert or Live Regions to Identify Errors
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21">
                Using Aria-Invalid to Indicate An Error Field
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G84">
                Providing a text description when the user provides information that is not in the list of allowed values
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G85">
                Providing a text description when user input falls outside the required format or values
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18">
                Providing client-side validation and alert
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR32">
                Providing client-side validation and adding error text via the DOM
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G139">
                Creating a mechanism that allows users to jump to errors
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G199">
                Providing success feedback when data is submitted successfully
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
