// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Landmark roles',
    },
    ({ Markup }) => (
        <>
            <p>A landmark region must have the role that best describes its content.</p>

            <h2>Why it matters</h2>
            <p>
                Assistive technologies allow users to quickly navigate through a page’s landmark regions to see what types of content the
                page contains. Users might not be able to find the content they want if it has an incorrect landmark role.
            </p>

            <h2>How to fix</h2>
            <p>
                Use the{' '}
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#landmark-roles">landmark role</Markup.HyperLink> that
                best describes the content.
            </p>

            <h2>Example</h2>

            <Markup.PassFail
                failText={
                    <p>
                        This div functions as a banner, but it has the <Markup.Term>navigation</Markup.Term> role.
                    </p>
                }
                failExample={`<div role="navigation">
            [A logo image and site name]
            </div>`}
                passText={
                    <p>
                        The div now has the <Markup.Term>banner</Markup.Term> role.
                    </p>
                }
                passExample={`<div role="banner"> [A logo image and site name] </div>`}
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                    Understanding Success Criterion 1.3.1: Info and Relationships
                </Markup.HyperLink>
            </Markup.Links>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html">
                    Understanding Success Criterion 2.4.1: Bypass Blocks
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11">
                    Using ARIA landmarks to identify regions of a page
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Additional guidance</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/landmarks/index.html">
                    ARIA Landmarks Example
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_landmark">
                    WAI-ARIA Authoring Practices 1.1: Landmark Regions
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
