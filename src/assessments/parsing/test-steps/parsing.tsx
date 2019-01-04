// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../../common/components/new-tab-link';
import { link } from '../../../content/link';
import * as content from '../../../content/test/parsing/parsing';
import ManualTestRecordYourResults from '../../common/manual-test-record-your-results';
import { TestStep } from '../../types/test-step';
import { ParsingTestStep } from './test-steps';

const checkserializedDOMScript = 'javascript:(function()%7bfunction c(a,b)%7bvar c=document.createElement(%22textarea%22);c.name=a;c.value=b;d.appendChild(c)%7dvar e=function(a)%7bfor(var b=%22%22,a=a.firstChild;a;)%7bswitch(a.nodeType)%7bcase Node.ELEMENT_NODE:b+=a.outerHTML;break;case Node.TEXT_NODE:b+=a.nodeValue;break;case Node.CDATA_SECTION_NODE:b+=%22%3c![CDATA[%22+a.nodeValue+%22]]\%3e%22;break;case Node.COMMENT_NODE:b+=%22%3c\!--%22+a.nodeValue+%22--\%3e%22;break;case Node.DOCUMENT_TYPE_NODE:b+=%22%3c!DOCTYPE %22+a.name+%22%3e\n%22%7da=a.nextSibling%7dreturn b%7d(document),d=document.createElement(%22form%22);d.method=%22POST%22;d.action=%22https://validator.w3.org/nu/%22;d.enctype=%22multipart/form-data%22;d.target=%22_blank%22;d.acceptCharset=%22utf-8%22;c(%22showsource%22,%22yes%22);c(%22content%22,e);document.body.appendChild(d);d.submit()%7d)();';
const checkForWCAGScript = 'javascript:(function()%7bvar filterStrings=[%22tag seen%22,%22Stray end tag%22,%22Bad start tag%22,%22violates nesting rules%22,%22Duplicate ID%22,%22first occurrence of ID%22,%22Unclosed element%22,%22not allowed as child of element%22,%22unclosed elements%22,%22not allowed on element%22,%22unquoted attribute value%22,%22Duplicate attribute%22];var filterRE=filterStrings.join(%22|%22);var root=document.getElementById(%22results%22);if(!root)%7breturn;%7d var results=root.getElementsByTagName(%22li%22);var result,resultText;for(var i=0;i%3cresults.length;i++)%7bresult=results[i];if(results[i].className!==%22%22)%7bresultText=(result.innerText!==undefined?result.innerText:result.textContent)+%22%22;if(resultText.match(filterRE)===null)%7bresult.style.display=%22none%22;result.className=result.className+%22%20steveNoLike%22;%7d%7d%7d%7d)();';


const description: JSX.Element = <span>Elements must have complete start and end tags, must not contain duplicate attributes, and must be nested according to their specifications.</span>;

const howToTest: JSX.Element = (
    <div>
        <p>
            This test uses the <NewTabLink href="https://validator.w3.org/nu/">Nu HTML Checker</NewTabLink> and supporting bookmarklets.
        </p>
        <ol>
            <li>
                Add the following bookmarklets to your Chrome bookmarks:
                <ol>
                    <li>
                        <NewTabLink href={checkserializedDOMScript} >Check serialized DOM of current page</NewTabLink> (sends a page's DOM to the checker and shows results in a new browser tab)
                    </li>
                    <li>
                        <NewTabLink href={checkForWCAGScript}>Check for WCAG 2.0 parsing compliance</NewTabLink> (filters results to show only WCAG parsing errors)
                    </li>
                </ol>
            </li>
            <li>
                Run the first bookmarklet in the browser tab containing your target page.
            </li>
            <li>
                Run the second bookmarklet in the browser tab containing the checker results.
            </li>
            <li>
                Examine the filtered results to verify that there are no errors related to:
                <ol>
                    <li>
                        Missing start or end tags
                    </li>
                    <li>
                        Duplicate attributes
                    </li>
                    <li>
                        Improper nesting of elements
                    </li>
                </ol>
            </li>
            <ManualTestRecordYourResults
                isMultipleFailurePossible={true}
            />
        </ol>
    </div>
);

export const Parsing: TestStep = {
    key: ParsingTestStep.parsing,
    name: 'Parsing',
    description,
    howToTest,
    isManual: true,
    ...content,
    guidanceLinks: [link.WCAG_4_1_1],
};
