// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>
            Ensure help – or mechanism(s) to request help – are consistently located in the same relative location across a{' '}
            <Markup.HyperLink href="https://w3c.github.io/wcag/guidelines/#dfn-set-of-web-pages">set of web pages/screens</Markup.HyperLink>.
        </p>

        <h2>Why it matters</h2>
        <p>
            People who may have difficulty locating help are more likely to find it when it is consistently located. This improves the
            overall user experience for everyone, including support for people with cognitive disabilities, and makes it easier to find help
            and support.
        </p>

        <h2>How to fix</h2>
        <p>
            Ensure all helpful information and mechanisms provided are consistent with other pages in terms of location, behavior and
            relative to the other content of the page &amp; UI for all components where help resides.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A chat widget to request help is present on select pages of a website but is not available on other pages which would be
                    considered part of a set of web pages.
                </p>
            }
            failExample={
                <p>
                    Finding a specific policy or procedure: An employee who needs to complete a work task may have difficulty locating the
                    specific policy or procedure document on their employer's Web site. A consistently located "How Do I" page may include
                    the information that enables them to independently complete this task.
                </p>
            }
            passText={
                <p>
                    A link to a help page exists as the third item in a list of five items within a web page’s navigation (the primary
                    navigation, or a footer navigation, for example). But on some of the linked pages from this navigation, the help link is
                    located in a different position in the list of the same navigation items, resulting in a failure of this rule.
                </p>
            }
            passExample={
                <p>
                    Finding a specific policy or procedure: An employee who needs to complete a work task may have difficulty locating the
                    specific policy or procedure document on their employer's Web site. A consistently located "How Do I" page may include
                    the information that enables them to independently complete this task.
                </p>
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://w3c.github.io/wcag/understanding/consistent-help">
                Understanding Success Criterion 3.2.6: Consistent Help
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://w3c.github.io/wcag/techniques/general/G220">
                G220: Provide a contact-us link in a consistent location
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/coga-gap-analysis/#table6">
                Cognitive Accessibility Roadmap and Gap Analysis
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/coga-usable/#make-it-easy-%20%20%20%20%20%20%20%20%20%20%20%20%20to-find-help-and-give-feedback-pattern">
                Making Content Usable for People with Cognitive and Learning Disabilities
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
