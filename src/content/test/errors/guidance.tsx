// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Errors'} />
        <p>If an input error is automatically detected, the item in error must be identified, and the error described, in text.</p>

        <h2>Why it matters</h2>
        <p>
            An "input error" occurs when:
            <ul>
                <li> The user omits information that's expected by a web page, or </li>
                <li> The user provides information outside the allowed values, or </li>
                <li> The user provides information in an unexpected format. </li>
            </ul>
        </p>

        <p>
            <Markup.Term>Identifying and describing input errors</Markup.Term> in text allows people who use assistive technologies to learn
            what went wrong. It also helps people with certain cognitive disabilities who have difficulty understanding the meaning of icons
            and other visual cues.
        </p>

        <p>
            <Markup.Term>Providing instructions for correcting input errors</Markup.Term> can help everyone recover from mistakes,
            especially people who have learning disabilities. It also helps people with motion impairment by reducing the number of times
            they need to enter an input value.
        </p>

        <p>
            <Markup.Term>Error prevention</Markup.Term> benefits everyone, especially people with reading or motor disabilities that make
            them more likely to make mistakes. Error prevention is critical when using a web page can:
            <ul>
                <li>Result in legal commitments</li>
                <li>Initiate financial transactions </li>
                <li>Modify or delete user data</li>
                <li>Submit test responses</li>
            </ul>
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Identify and describe input errors in text. (<Link.WCAG_3_3_1 />)
                </h3>
                <ul>
                    <li>Clarify whether input is missing, out of the allowed range, or in an unexpected format.</li>
                    <li>It's ok to use visual cues in addition to the text.</li>
                </ul>
                <h3>
                    Provide suggestions for correcting input errors.(
                    <Link.WCAG_3_3_3 />)
                </h3>
                <ul>
                    <li>Clarify the type of input required, the allowed values, and the expected format.</li>
                </ul>
                <h3>
                    Allow users to correct input errors before finalizing a submission. (<Link.WCAG_3_3_4 />)
                </h3>
                <ul>
                    <li>Make submissions reversible, and/or</li>
                    <li>Check user input for errors, and give users an opportunity to make corrections, and/or</li>
                    <li>Allow users to review, correct, and confirm their input before finalizing a submission.</li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don't identify input errors using only visual cues, such as changes in color or icons. (<Link.WCAG_3_3_1 />)
                </h3>
                <ul>
                    <li>Always describe the error using text.</li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Identify input errors </h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html">
                Understanding Success Criterion 3.3.1: Error Identification
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>

        <h5>Use one of these techniques if a form contains required fields:</h5>
        <Markup.Links>
            <Link.WCAG21TechniquesG83 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21">
                Using Aria-Invalid to Indicate An Error Field
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18">
                Providing client-side validation and alert
            </Markup.HyperLink>
        </Markup.Links>

        <h5>Use one of these techniques if a field requires a specific data format or certain values:</h5>
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

        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G139">
                Creating a mechanism that allows users to jump to errors
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G199">
                Providing success feedback when data is submitted successfully
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Provide suggestions for correcting input errors</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html">
                Understanding Success Criterion 3.3.3: Error Suggestion
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>

        <h5>Use one of these techniques if a required field is empty:</h5>
        <Markup.Links>
            <Link.WCAG21TechniquesG83 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA2">
                Identifying a required field with the aria-required property
            </Markup.HyperLink>
        </Markup.Links>

        <h5>Use one of these techniques if a field requires a specific data format:</h5>
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

        <h5>Use one of these techniques if a field requires certain values:</h5>
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

        <h4>Additional guidance</h4>
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

        <h3>Prevent input errors</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/error-prevention-legal-financial-data.html">
                Understanding Success Criterion 3.3.4: Error Prevention (Legal, Financial, Data)
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient methods</h4>

        <h5>Use one of these techniques if a legal commitment or financial transaction will occur:</h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G164">
                Providing a stated period of time after submission of the form when the order can be updated or canceled by the user
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G98">
                Providing the ability for the user to review and correct answers before submitting
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G155">
                Providing a checkbox in addition to a submit button
            </Markup.HyperLink>
        </Markup.Links>

        <h5>Use one of these techniques if information will be deleted:</h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G99">
                Providing the ability to recover deleted information
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G168">
                Requesting confirmation to continue with selected action
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G155">
                Providing a checkbox in addition to a submit button
            </Markup.HyperLink>
        </Markup.Links>

        <h5>Use one of these techniques if the user will submit answers to a test:</h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G98">
                Providing the ability for the user to review and correct answers before submitting
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G168">
                Requesting confirmation to continue with selected action
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18">
                Providing client-side validation and alert
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G199">
                Providing success feedback when data is submitted successfully
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
