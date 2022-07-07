// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>Coded headers must be used correctly.</p>

        <h2>Why it matters</h2>
        <p>
            When assistive technologies encounter a <Markup.Emphasis>data</Markup.Emphasis> table, they report the data cells and their
            coded headers in a way that shows they are related. When a <Markup.Emphasis>data</Markup.Emphasis> table has no coded headers,
            assistive technologies can't report these relationships. When a <Markup.Emphasis>layout</Markup.Emphasis> table has coded
            headers, assistive technologies report relationships between cells that don't actually exist. Some users are likely to find the
            table's content confusing.
        </p>
        <h3>From a user's perspective</h3>
        <p>
            <Link.TablesVideo>This short video on tables</Link.TablesVideo> shows how correct table markup helps people who use screen
            readers.
        </p>

        <h2>How to fix</h2>
        <p>
            Add programmatically identified headers to every data table:
            <ol>
                <li>
                    If the table has only one row or one column of headers, use <Markup.Code>{`<th>`}</Markup.Code> elements for header
                    cells and <Markup.Code>{`<td>`}</Markup.Code> elements for data cells.
                </li>
                <li>
                    If the table has both row and column headers, add <Markup.Code>scope="row"</Markup.Code> or{' '}
                    <Markup.Code>scope="column"</Markup.Code> to each header cell.
                </li>
                <li>
                    If the table has headers that span multiple rows or columns, add <Markup.Code>colgroup</Markup.Code> or{' '}
                    <Markup.Code>rowgroup</Markup.Code> and <Markup.Code>span</Markup.Code> attributes to each header cell.
                </li>
                <li>
                    If the table has multi-level headers (not recommended):
                    <ol>
                        <li>
                            Provide an <Markup.Code>id</Markup.Code> for each header cell.
                        </li>
                        <li>
                            For each data cell, provide a <Markup.Code>headers</Markup.Code> attribute that references the correct header
                            cell(s).{' '}
                        </li>
                    </ol>
                </li>
            </ol>
        </p>

        <h2>Example</h2>

        <Markup.PassFail
            failText={
                <p>
                    Because this data table has no programmatically-identified headers, assistive technologies will report the headers as
                    data cells. Some users will find the table difficult to understand.
                </p>
            }
            failExample={`<table>
            <tr>
            [<td>]Park name[</th>]
            [<td>]City[</th>]
            </tr>
            <tr>
            <td>Bridle Trails State Park</td>
            <td>Kirkland</td>
            </tr>
            <tr>
            <td>Lake Sammamish State Park</td>
            <td>Issaquah</td>
            </tr>
            <tr>
            <td>Saltwater State Park</td>
            <td>Des Moines</td>
            </tr>
            </table>`}
            passText={
                <p>
                    Using <Markup.Code>{`<th>`}</Markup.Code> elements for headers identifies them correctly to assistive technologies. All
                    users can distinguish between column headers and data cells.
                </p>
            }
            passExample={`<table>
            <tr>
            [<th>]Park name[</th>]
            [<th>]City[</th>]
            </tr>
            <tr>
            <td>Bridle Trails State Park</td>
            <td>Kirkland</td>
            </tr>
            <tr>
            <td>Lake Sammamish State Park</td>
            <td>Issaquah</td>
            </tr>
            <tr>
            <td>Saltwater State Park</td>
            <td>Des Moines</td>
            </tr>
            </table>`}
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H51">
                Using table markup to present tabular information
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F91">
                Failure of Success Criterion 1.3.1 for not correctly marking up table headers{' '}
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/tutorials/tables/">
                Tables Concepts – Tables – WAI Web Accessibility Tutorials
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
