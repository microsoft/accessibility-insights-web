// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>If an input error is automatically detected, guidance for correcting the error must be provided.</p>
        <h2>Why it matters</h2>
        <p>
            Providing instructions for correcting input errors helps everyone recover from mistakes, especially people who have learning
            disabilities. It also helps people with motion impairment by reducing the number of times they need to enter an input value.
        </p>
        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "Help me recover from mistakes by providing me the location of input mistakes and examples of valid input so I can get back
                to work and complete the task."
            </Markup.Emphasis>
        </p>
        <h2>How to fix</h2>
        <p>Provide suggestions for correcting input errors, including allowed values and expected format.</p>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A user booking a flight accidentally entered a flight date in the past. The web page identifies and describes the input
                    error but doesn't provide suggestions for correcting it.
                </p>
            }
            failExample={'<p id="errortext" aria-live="assertive">[Travel date is invalid.]</p>'}
            passText={<p>The web page provides a suggestion for correcting the input error.</p>}
            passExample={'<p id="errortext" aria-live="assertive">[Travel date is invalid. Enter a date in the future.]</p>'}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html">
                Understanding Success Criterion 3.3.3: Error Suggestion
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <p>Use one of these techniques if a required field is empty:</p>
        <Markup.Links>
            <Link.WCAG21TechniquesG83 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA2">
                Identifying a required field with the aria-required property
            </Markup.HyperLink>
        </Markup.Links>
        <p>Use one of these techniques if a field requires a specific data format:</p>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA18">
                Using aria-alertdialog to Identify Errors
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G85">
                Providing a text description when user input falls outside the required format or values
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G177">
                Providing suggested correction text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18">
                Providing client-side validation and alert
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR32">
                Providing client-side validation and adding error text via the DOM
            </Markup.HyperLink>
        </Markup.Links>
        <p>Use one of these techniques if a field requires certain values:</p>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA18">
                Using aria-alertdialog to Identify Errors
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G84">
                Providing a text description when the user provides information that is not in the list of allowed values
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G177">
                Providing suggested correction text
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18">
                Providing client-side validation and alert
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
