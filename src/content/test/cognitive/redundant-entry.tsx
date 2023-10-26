// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>
            Do not require people to re-enter information they have already provided via other means – e.g., as part of a previous step in
            the same form.
        </p>
        <h2>Why it matters</h2>
        <p>
            The intent of this rule is to reduce the potential for people to have cognitive fatigue due to having to repeatedly enter the
            same data or recall specific data that had been previously entered. Another benefit here is to reduce the possibility of user
            error due to a memory lapse or typo compared to the previous entry of said data. This improves success for individuals with
            cognitive and learning disabilities and memory impairments.
        </p>

        <h2>How to fix</h2>
        <p>
            To fix this issue, ensure all previously provided information auto-populates into the recurring form fields. If this scenario if
            not possible, provide a mechanism for the user to select the previously populated information for re-entry. The objective of
            this technique is to provide information that was previously provided by the user or by the system, rather than requiring the
            user to remember and re-enter the information from a previous step.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A website provides no means to pre-populate information of the address entered by the user in the previous step and
                    create repetitive actions and redundant entries.
                </p>
            }
            passText={
                <p>
                    Populate previously entered information with a trigger: An ecommerce site provides a checkbox that triggers the shipping
                    address to be pre-populated based on the billing address the user had entered in a previous step.
                </p>
            }
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html#:~:text=Redundant%20Entry%20is%20asking%20for%20the%20website%20content,essential%20purposes%20such%20as%20asking%20for%20a%20password.">
                Understanding Success Criterion 3.3.7: Redundant Entry | WAI | W3C
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/general/G221">
                G221: Provide data from a previous step in a process | WAI | W3C
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional Guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/coga-gap-analysis/#table3">
                Cognitive Accessibility Roadmap and Gap Analysis (w3.org)
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/coga-usable/#make-it-easy-%20%20%20%20%20%20%20%20%20%20%20%20%20to-find-help-and-give-feedback-pattern">
                Making Content Usable for People with Cognitive and Learning Disabilities (w3.org)
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
