// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Functional components that appear on multiple pages must be identified consistently.</p>

        <h2>Why it matters</h2>
        <p>
            When components with the same function are identified consistently across the pages of a website or web app, users can find and
            recognize them more easily. For example, a user who wants to update certain sections of an online form will find the task easier
            if the site consistently provides an 'Edit' button for each section. Consistent use of labels and icons are helpful for
            everyone, especially people who have cognitive or reading disabilities.
        </p>

        <h2>How to fix</h2>
        <p>
            For any functional component that repeats across pages, use a consistent label, icon, and/or text alternative every time it
            appears.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A web app has multiple pages. On every page, there's a link that navigates to the user's profile. On some pages, it's an
                    image link showing the user's avatar, and its text alternative says, "User profile." On other pages, it's a text link
                    that says, "Manage your profile."
                </p>
            }
            failExample={`Profile link, style 1
            [<a href="profile.asp">
            <img src="profile_user10204" alt="User profile" style="width:42px; height:42px; border:0;">
            </a>]

            Profile link, style 2
            [<a href="profile.asp">Manage your profile</a>]
            `}
            passText={
                <p>
                    On every page, the link that navigates to the user's profile is an image link showing the user's avatar, with a text
                    alternative that says, "User profile."
                </p>
            }
            passExample={`All profile links have the same style
            [<a href="profile.asp">
            <img src="profile_user10204" alt="User profile" style="width:42px; height:42px; border:0;">
            </a>]`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification">
                Understanding Success Criterion 3.2.4: Consistent Identification
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G197">
                Using labels, names, and text alternatives consistently for content that has the same functionality
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F31">
                Failure due to using two different labels for the same function on different pages
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
