// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>The content in an HTML layout table must make sense when presented in DOM order.</p>
        <h2>Why it matters</h2>
        <p>
            Assistive technologies present content in DOM order (the order that content appears in the HTML). Because layout tables are
            structured in HTML as a series of rows, they are presented to users row-by-row. If a layout table's expected reading order is
            different from the DOM order, it won't make sense to people who use assistive technologies.
        </p>
        <h2>How to fix</h2>
        <p>Restructure the layout table so the DOM order matches the expected reading order.</p>
        <Markup.PassFail
            failText={
                <p>
                    The expected reading order of this layout table is column-by-column instead of row-by-row. When read column-by-column,
                    it says, "When life gives you lemons, make lemonade." When read in DOM order, it says, "When gives you make life lemons
                    lemonade."{' '}
                </p>
            }
            failExample={`<table role="presentation" width="100%">
           <tr>
           [<td width="33%">When</td>
           <td width="33%">gives you</td>
           <td width="33%">make</td>]
           </tr>
           <tr>
           [<td>LIFE</td>
           <td>LEMONS</td>
           <td>LEMONADE</td>]
           </tr>
           </table>
           `}
            passText={<p>The layout table is simplified so that the DOM order matches the expected reading order. </p>}
            passExample={`<table role="presentation" width="100%">
            <tr>
            [<td width="33%">When<br>LIFE</td>
            <td width="33%">gives you<br>
            LEMONS</td>
            <td width="33%">make<br>
            LEMONADE</td>]
            </tr>
            </table>
            `}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">
                Understanding Success Criterion 1.3.2: Meaningful Sequence
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G57">
                Ordering the content in a meaningful sequence
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F49">
                Failure of Success Criterion 1.3.2 due to using an HTML layout table that does not make sense when linearized
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
