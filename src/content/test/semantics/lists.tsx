// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>Lists must be coded with semantically correct elements.</p>
        <h2>Why it matters</h2>
        <p>
            When lists are coded with semantically correct elements, navigating them is easier for people who use assistive technologies.
            For example, most assistive technologies allow users to navigate from the first list item to the last, or to jump to the next
            list.
        </p>
        <h2>How to fix</h2>
        <p>
            Code the list using semantically correct elements:
            <ul>
                <li>
                    Unordered lists
                    <ul>
                        <li>
                            Use the <Markup.Code>{'<ul>'}</Markup.Code> element for the container.
                        </li>
                        <li>
                            Use the <Markup.Code>{'<li>'}</Markup.Code> element for list items.
                        </li>
                    </ul>
                </li>
                <li>
                    Ordered lists
                    <ul>
                        <li>
                            Use the <Markup.Code>{'<ol>'}</Markup.Code> element for the container.
                        </li>
                        <li>
                            Use the <Markup.Code>{'<li>'}</Markup.Code> element for list items.
                        </li>
                    </ul>
                </li>
                <li>
                    Definition lists
                    <ul>
                        <li>
                            Use the <Markup.Code>{'<dl>'}</Markup.Code> element for the container.
                        </li>
                        <li>
                            Use the <Markup.Code>{'<dt>'}</Markup.Code> element for terms.
                        </li>
                        <li>
                            Use the <Markup.Code>{'<dd>'}</Markup.Code> element for definitions.
                        </li>
                    </ul>
                </li>
            </ul>
        </p>
        <Markup.PassFail
            failText={<p>These links are visually formatted as an unordered list, but they are not coded list semantics.</p>}
            failExample={`<h4>Top Tutorials</h4>
           [<div>]
           <a href="/html/default.asp">HTML Tutorial</a>[<br>]
           <a href="/css/default.asp">CSS Tutorial</a>[<br>]
           <a href="/js/default.asp">JavaScript Tutorial</a>[<br>]
           <a href="/aria/default.asp">ARIA Tutorial</a>[<br>]
           [</div>]`}
            passText={
                <p>
                    The set of links is built using semantically correct <Markup.Code>{'<ul>'}</Markup.Code> and{' '}
                    <Markup.Code>{'<li>'}</Markup.Code> elements.
                </p>
            }
            passExample={`<h4>Top Tutorials</h4>
            [<ul>
            <li>]
            <a href="/html/default.asp">
            HTML Tutorial</a>
            [</li>
            <li>]
            <a href="/css/default.asp">
            CSS Tutorial</a>
            [</li>
            <li>]
            <a href="/js/default.asp">
            JavaScript Tutorial</a>
            [</li>
            <li>]
            <a href="/aria/default.asp">
            ARIA Tutorial</a>
            [</li>
            </ul>]`}
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
            <Markup.HyperLink href="http://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/H48">
                Using ol, ul and dl for lists or groups of links
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/H40.html">
                Using description lists
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
