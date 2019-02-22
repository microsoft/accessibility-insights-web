// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import * as Markup from '../../markup';
import { link } from '../../../content/link';
import ManualTestRecordYourResults from '../../common/manual-test-record-your-results';
import { TestStep } from '../../types/test-step';
import { SemanticsTestStep } from './test-steps';
import { NewTabLink } from '../../../common/components/new-tab-link';

const dataTablesDescription: JSX.Element = <span>Semantic elements in a data table must not be coded as decorative.</span>;

const dataTablesHowToTest: JSX.Element = (
    <div>
        <p>
            This procedure uses the Chrome{' '}
            <NewTabLink href="https://chrome.google.com/webstore/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm">
                Web Developer
            </NewTabLink>{' '}
            extension.
        </p>
        <ol>
            <li>
                Use the Chrome Web Developer extension (<Markup.Term>Information > Outline tables</Markup.Term>) to highlight tables on the
                page.
            </li>
            <li>
                Examine the target page to identify any <Markup.Emphasis>data</Markup.Emphasis> tables.
                <ol>
                    <li>
                        A <Markup.Emphasis>data</Markup.Emphasis> table organizes content into rows and columns to show relationships.
                    </li>
                    <li>
                        A <Markup.Emphasis>layout</Markup.Emphasis> table is used to visually position content without implying any
                        relationships.
                    </li>
                </ol>
            </li>
            <li>
                Use the Chrome Web Developer extension (<Markup.Term>Information > Display ARIA Roles</Markup.Term>) to verify that none of
                its elements is coded with <Markup.Term>role="presentation"</Markup.Term>.
            </li>
            <ManualTestRecordYourResults isMultipleFailurePossible={true} />
        </ol>
    </div>
);

export const DataTables: TestStep = {
    key: SemanticsTestStep.dataTables,
    name: 'Data tables',
    description: dataTablesDescription,
    howToTest: dataTablesHowToTest,
    isManual: true,
    guidanceLinks: [link.WCAG_1_3_1],
    updateVisibility: false,
};
