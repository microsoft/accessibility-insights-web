// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>A frame or iframe must have an accessible name that describes its content.</p>

        <h2>Why it matters</h2>
        <p>
            Assistive technologies help users decide whether a frame or iframe is likely to contain content of interest by announcing its
            accessible name. If a frame or iframe has no accessible name, screen reader users won't know whether it's worth exploring.
        </p>

        <h2>How to fix</h2>
        <p>Provide an accessible name:</p>
        <ul>
            <li>
                If the element is a <Markup.Code>{'<frame>'}</Markup.Code>, provide a <Markup.Code>title</Markup.Code> attribute that
                describes the frame's content. (Note that the <Markup.Code>{'<frame>'}</Markup.Code> element is obsolete in HTML5.)
            </li>
            <li>
                If the element is an <Markup.Code>{'<iframe>'}</Markup.Code>, provide an <Markup.Code>aria-label</Markup.Code>,{' '}
                <Markup.Code>aria-labelledby</Markup.Code>, or <Markup.Code>title</Markup.Code> attribute that describes the iframe's
                content.
            </li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>This iframe has an accessible name that doesn't describe its content.</p>}
            failExample={`<body>
                ...
                <iframe src="https://holds.htm" [title="Hold"]>
                </iframe>
                ...
                </body>`}
            passText={<p>The iframe now has an accessible name that describe its content.</p>}
            passExample={`<body>
                ...
                <iframe src="https://holds.htm" [title="Books on Hold: Clive County Library"]>
                </iframe>
                ...
                </body>`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html">
                Understanding Success Criterion 4.1.2: Name, Role, Value
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
