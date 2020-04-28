// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <h1>Headers attribute</h1>
        <p>
            The <Markup.Term>headers</Markup.Term> attribute of a <Markup.Term>{`<td>`}</Markup.Term> element must reference the correct{' '}
            <Markup.Term>{`<th>`}</Markup.Term> element.
        </p>

        <h2>Why it matters</h2>
        <p>
            When assistive technologies describe data tables, they mention both the data cells and their programmatically-related header
            cells. When incorrect header cells are reported, users are likely to find the table confusing.
        </p>

        <h2>How to fix</h2>
        <ul>
            <li>
                Good: Modify the <Markup.Term>headers</Markup.Term> attribute of the <Markup.Term>{`<td>`}</Markup.Term> element to match
                the <Markup.Term>id</Markup.Term> attribute of the correct <Markup.Term>{`<th>`}</Markup.Term> element(s), or
            </li>
            <li>
                Better: Eliminate multi-level headings and define headers using <Markup.Term>scope</Markup.Term> attributes.
            </li>
        </ul>
        <p />

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    This complex data table has two levels of headers. Three of the data cells' <Markup.Term>headers</Markup.Term>{' '}
                    attributes should refer to both levels, but incorrectly refer to only the top-level header. Assistive technologies will
                    announce only "Faculty" as the header for those data cells. Some users will find it difficult to understand the table.
                </p>
            }
            failExample={`<table border="1">
            <tr>
            <th rowspan="2" id="s">Students</th>
            <th colspan="3" id="f">Faculty</th>
            </tr>
            <tr>
            <th id="f1" headers="f">Teachers</th>
            <th id="f2" headers="f">Assistants</th>
            <th id="f3" headers="f">Observers</th>
            </tr>
            <tr>
            <td headers="s">275</td>
            <td [headers="f"]>10</td>
            <td [headers="f"]>16</td>
            <td [headers="f"]>5</td>
            </tr>
            </table> `}
            passText={
                <p>
                    All data cells refer to the correct headers. Assistive technologies will announce both header levels where appropriate:
                    "Faculty Teachers," "Faculty Assistants," and "Faculty Observers". Everyone can interpret the table correctly.
                </p>
            }
            passExample={`<table border="1">
            <tr>
            <th rowspan="2" id="s">Students</th>
            <th colspan="3" id="f">Faculty</th>
            </tr>
            <tr>
            <th id="f1" headers="f">Teachers</th>
            <th id="f2" headers="f">Assistants</th>
            <th id="f3" headers="f">Observers</th>
            </tr>
            <tr>
            <td headers="s">275</td>
            <td [headers="f f1"]>10</td>
            <td [headers="f f2"]>16</td>
            <td [headers="f f3"]>5</td>
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
            <Markup.HyperLink href="https://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/F90">
                Failure of Success Criterion 1.3.1 for incorrectly associating table headers and content via the headers and id attributes
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
