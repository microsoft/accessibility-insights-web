// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Error prevention',
    },
    ({ Markup }) => (
        <>
            <p>
                If submitting data might have serious consequences, users must be able to correct the data input before finalizing a
                submission.
            </p>

            <h2>Why it matters</h2>
            <p>
                Error prevention benefits everyone, especially people with reading or motor disabilities that make them more likely to make
                mistakes. Error prevention is critical when using a web page can:
            </p>
            <ul>
                <li>Result in legal commitments</li>
                <li>Initiate financial transactions</li>
                <li>Modify or delete user data</li>
                <li>Submit test responses</li>
            </ul>

            <h2>How to fix</h2>
            <p>Make sure at least one of the following is true:</p>
            <ul>
                <li>Submissions are reversible.</li>
                <li>User input is checked for errors, and users have an opportunity to make corrections.</li>
                <li>Users can review, correct, and confirm their input before finalizing a submission.</li>
            </ul>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        Unless a data validation error is detected, an online shopping site initiates a credit card transaction as soon as
                        all required input is entered. The user has no opportunity to review their input before the transaction occurs.
                    </p>
                }
                passText={
                    <p>
                        Before initiating a credit card transaction, the site provides the user a summary of their input, including the
                        items selected, the payment method, and the shipping address. The user can make corrections before initiating the
                        credit card transaction.
                    </p>
                }
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/error-prevention-legal-financial-data.html">
                    Understanding Success Criterion 3.3.4: Error Prevention (Legal, Financial, Data)
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient methods</h3>
            <p>Use one of these techniques if a legal commitment or financial transaction will occur:</p>
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
            <p>Use one of these techniques if information will be deleted:</p>
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
            <p>Use one of these techniques if the user will submit answers to a test:</p>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G98">
                    Providing the ability for the user to review and correct answers before submitting
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G168">
                    Requesting confirmation to continue with selected action
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Additional guidance</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR18">
                    Providing client-side validation and alert
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G199">
                    Providing success feedback when data is submitted successfully
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
