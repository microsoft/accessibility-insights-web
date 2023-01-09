// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(() => (
    <p>
        Understanding a link's purpose helps users decide whether they want to follow it. When the link text alone is unclear, sighted users
        can examine the surrounding context for clues about the link's purpose. Assistive technologies can similarly help non-sighted users
        by reporting the link's programmatically related context.
    </p>
));

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>A link's purpose must be described to users.</p>

        <h2>Why it matters</h2>
        <p>
            Understanding a link's purpose helps users decide whether they want to follow it. When the link text alone is unclear, sighted
            users can examine the surrounding context for clues about the link's purpose. Assistive technologies can similarly help
            non-sighted users by reporting the link's programmatically related context.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I utilize a screen reader and keyboard to enjoy content and operate software. For every link, provide unique text so I know
                what will happen if I click the link. For example, 'Shop Devices', 'Shop Software', 'Shop Games'."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>Describe the purpose of the link using any of the following:</p>
        <ul>
            <li>Good: Programmatically related context, or</li>
            <li>Better: Accessible name and/or accessible description, or</li>
            <li>Best: Link text</li>
        </ul>
        <p>Programmatically related context includes:</p>
        <ul>
            <li>Text in the same sentence, paragraph, list item, or table cell as the link</li>
            <li>Text in a parent list item</li>
            <li>Text in a table header cell associated with the cell that contains the link</li>
        </ul>
        <p>Writing tips:</p>
        <ul>
            <li>If a link's destination is a document or web application, the name of the document or application is sufficient.</li>
            <li>
                Links with different destinations should have different descriptions; links with the same destination should have the same
                description.
            </li>
            <li>Programmatically related context is easier to understand when it precedes the link.</li>
        </ul>

        <h2>Example</h2>

        <Markup.PassFail
            failText={
                <p>
                    In an online bookstore, each book has a title, a one-paragraph description, and a "Read more…" link. Because each link
                    is in a separate paragraph, all the links have identical programmatically related context.
                </p>
            }
            failExample={
                `<h2>Slaughterhouse-five</h2>
            <p>Kurt Vonnegut's absurdist classic introduces us to Billy Pilgrim, a man who becomes "unstuck in time" after he is ` +
                `abducted by aliens from the planet Tralfamadore."</p>
            [<p><a href="Von24242.html">Read more</a></p>]
            <h2>The Sirens of Titan</h2>
            <p>The richest and most depraved man on Earth takes a wild space journey to distant worlds, learning about the purpose ` +
                `of human life along the way.</p>
            [<p><a href="Von22495.html">Read more</a></p>]`
            }
            passText={<p>The unique purpose of each link is made clear by adding the name of the book to the link text.</p>}
            passExample={
                `<h2>Slaughterhouse-five</h2>
            <p>Kurt Vonnegut's absurdist classic introduces us to Billy Pilgrim, a man who becomes "unstuck in time" after he is ` +
                `abducted by aliens from the planet Tralfamadore."</p>
            [<p><a href="Von24242.html">Read more about Slaughterhouse-five</a></p>]
            <h2>The Sirens of Titan</h2>
            <p>The richest and most depraved man on Earth takes a wild space journey to distant worlds, learning about the purpose ` +
                `of human life along the way.</p>
            [<p><a href="Von22495.html">Read more about The Sirens of Titan</a></p>]`
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html">
                Understanding Success Criterion 2.4.4: Link Purpose (In Context)
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H30">
                Providing link text that describes the purpose of a link for anchor elements
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H33">
                Supplementing link text with the title attribute
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA7">
                Using aria-labelledby for link purpose
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA8">
                Using aria-label for link purpose
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G53">
                Identifying the purpose of a link using link text combined with the text of the enclosing sentence
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H77">
                Identifying the purpose of a link using link text combined with its enclosing list item
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H78">
                Identifying the purpose of a link using link text combined with its enclosing paragraph
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H79">
                Identifying the purpose of a link in a data table using the link text combined with its enclosing table cell and associated
                table header cells
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H81">
                Identifying the purpose of a link in a nested list using link text combined with the parent list item under which the list
                is nested
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F63">
                Failure of Success Criterion 2.4.4 due to providing link context only in content that is not related to the link
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F89">
                Failure of Success Criteria 2.4.4, 2.4.9 and 4.1.2 due to not providing an accessible name for an image which is the only
                content in a link
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.nngroup.com/articles/title-attribute/">
                Using the Title Attribute to Help Users Predict Where They Are Going
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
