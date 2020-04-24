// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Data tables',
    },
    ({ Markup, Link }) => (
        <>
            <p>Semantic elements in a data table must not be coded as presentational.</p>
            <h2>Why it matters</h2>
            <p>
                The semantic elements in a data table communicate relationships between cells and row or column headers. When{' '}
                <Markup.Code>role="presentation"</Markup.Code> is applied to a data table element, its semantics are suppressed, and
                critical relationships are consequently hidden from people who use assistive technologies. Moreover, they can't use the
                standard navigational shortcuts for data tables.
            </p>
            <p>
                (Applying <Markup.Code>role="presentation"</Markup.Code> is appropriate for layout tables, because their table semantics do
                not communicate any meaningful relationships.)
            </p>
            <h2>How to fix</h2>
            <p>
                Do not use <Markup.Code>role="presentation"</Markup.Code> on any of the semantic elements in a data table:
                <ul>
                    <li>
                        <Markup.Code>{'<table>'}</Markup.Code>
                    </li>
                    <li>
                        <Markup.Code>{'<tr>'}</Markup.Code>
                    </li>
                    <li>
                        <Markup.Code> {'<th>'}</Markup.Code>
                    </li>
                    <li>
                        <Markup.Code> {'<td>'}</Markup.Code>
                    </li>
                    <li>
                        <Markup.Code> {'<caption>'}</Markup.Code>
                    </li>
                    <li>
                        <Markup.Code> {'<col>'}</Markup.Code>
                    </li>
                    <li>
                        <Markup.Code> {'<colgroup>'}</Markup.Code>
                    </li>
                    <li>
                        <Markup.Code> {'<thead>'}</Markup.Code>
                    </li>
                    <li>
                        <Markup.Code> {'<tfoot>'}</Markup.Code>
                    </li>
                    <li>
                        <Markup.Code> {'<tbody>'}</Markup.Code>
                    </li>
                </ul>
            </p>
            <Markup.PassFail
                failText={
                    <p>
                        This data table is incorrectly coded as presentational. Assistive technologies are unaware of the table's semantic
                        elements.
                    </p>
                }
                failExample={`[<table role="presentation">]
           <tr>
           <th>Park name</th>
           <th>Location</th>
           </tr>
           <tr>
           <td>Bridle Trails State Park</td>
           <td>Kirkland, WA</td>
           </tr>
           <tr>
           <td>Lake Sammamish State Park</td>
           <td>Issaquah, WA</td>
           </tr>
           <tr>
           <td>Saltwater State Park</td>
           <td>Des Moines, WA<td>
           </tr>
           </table>`}
                passText={
                    <p>
                        With <Markup.Code>role="presentation"</Markup.Code> removed, assistive technologies can help users understand the
                        relationships between cells and column headers.{' '}
                    </p>
                }
                passExample={`[<table>]
            <tr>
            <th>Park name</th>
            <th>Location</th>
            </tr>
            <tr>
            <td>Bridle Trails State Park</td>
            <td>Kirkland, WA</td>
            </tr>
            <tr>
            <td>Lake Sammamish State Park</td>
            <td>Issaquah, WA</td>
            </tr>
            <tr>
            <td>Saltwater State Park</td>
            <td>Des Moines, WA<td>
            </tr>
            </table>`}
            />
            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                    Understanding Success Criterion 1.3.1: Info and Relationships
                </Markup.HyperLink>
            </Markup.Links>
            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H51">
                    Using table markup to present tabular information
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H39">
                    Using caption elements to associate data table captions with data tables
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H73">
                    Using the summary attribute of the table element to give an overview of data tables
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H63">
                    Using the scope attribute to associate header cells and data cells in data tables
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H43">
                    Using id and headers attributes to associate data cells with header cells in data tables
                </Markup.HyperLink>
            </Markup.Links>
            <h3>Common failures</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F92">
                    Failure of Success Criterion 1.3.1 due to the use of role presentation on content which conveys semantic information
                </Markup.HyperLink>
            </Markup.Links>
            <h3>Additional guidance</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/">
                    Intentionally Hiding Semantics with the Presentation Role
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
