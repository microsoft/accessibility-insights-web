// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Cognitive'} />

        <h2>Why it matters</h2>

        <p>Placeholder</p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Provide users functionality to Copy & paste passwords for authentication. (<Link.WCAG_3_3_8 />)
                </h3>

                <h3>
                    Create systems with 2-factor authentication systems with verification codes to prevent higher cognitive recall. (
                    <Link.WCAG_3_3_8 />)
                </h3>
            </Markup.Do>

            <Markup.Dont>
                <h3>
                    Don’t rely on users memorizing or transcribing a username, password, or one-time verification code. (<Link.WCAG_3_3_8 />
                    )
                </h3>

                <h3>
                    Don’t require people to re-enter information they have already provided via other means. (<Link.WCAG_3_3_7 />)
                </h3>
                <ul>
                    <li>Ensure processes do not rely on memory.</li>
                    <li>
                        Memory barriers stop people with cognitive disabilities from using content. This includes long passwords to log in
                        and voice menus that involve remembering a specific number or term. Make sure there is an easier option for people
                        who need it.
                    </li>
                </ul>

                <h3>
                    Don't use <Markup.Code>display:none</Markup.Code>, <Markup.Code>visibility:hidden</Markup.Code> or{' '}
                    <Markup.Code>aria-hidden</Markup.Code> to make headings invisible <Markup.Emphasis>only</Markup.Emphasis> to sighted
                    users. (a11y tech tip)
                </h3>
                <ul>
                    <li>
                        Those properties make headings unavailable to everyone, including assistive technology users. Use this CSS instead:{' '}
                        <Markup.Code>className="element-invisible"</Markup.Code>
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Reduce Redundant Entry</h3>

        <h4>WCAG success Criteria</h4>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html#:~:text=Redundant%20Entry%20is%20asking%20for%20the%20website%20content,essential%20purposes%20such%20as%20asking%20for%20a%20password.">
            Understanding Success Criterion 3.3.7: Redundant Entry
        </Markup.HyperLink>

        <h4>Sufficient techniques</h4>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/general/G221">
            Provide data from a previous step in a process
        </Markup.HyperLink>

        <h4>Additional guidance</h4>
        <Markup.HyperLink href="https://www.w3.org/TR/coga-gap-analysis/#table3">
            Cognitive Accessibility Roadmap and Gap Analysis
        </Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/TR/coga-usable/">
            Making Content Usable for People with Cognitive and Learning Disabilities
        </Markup.HyperLink>

        <h3>Provide accessible authentication</h3>

        <h4>WCAG success Criteria</h4>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html">
            Understanding Success Criterion 3.3.8: Accessible Authentication
        </Markup.HyperLink>

        <h4>Sufficient techniques</h4>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/html/H100">
            Providing properly marked up email and password inputs
        </Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/general/G218">Email link authentication</Markup.HyperLink>

        <h4>Additional guidance and common failures</h4>
        <Markup.HyperLink href="https://www.w3.org/TR/coga-gap-analysis/#table3">
            Cognitive Accessibility Roadmap and Gap Analysis
        </Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/TR/coga-usable/#make-it-easy-%20%20%20%20%20%20%20%20%20%20%20%20%20to-find-help-and-give-feedback-pattern">
            Making Content Usable for People with Cognitive and Learning Disabilities
        </Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/failures/F109">
            Failure of Success Criterion 3.3.8 and 3.3.9 due to preventing password or code re-entry in the same format
        </Markup.HyperLink>
    </>
));
