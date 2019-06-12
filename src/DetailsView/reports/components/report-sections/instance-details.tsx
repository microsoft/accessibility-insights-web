// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as classNames from 'classnames';
import { isEmpty } from 'lodash';
import * as React from 'react';

import { NamedSFC } from '../../../../common/react/named-sfc';

export type InstanceDetailsProps = Pick<AxeNodeResult, 'failureSummary' | 'html' | 'target'> & { index: number };

export const InstanceDetails = NamedSFC<InstanceDetailsProps>('InstanceDetail', props => {
    const { failureSummary, html, target, index } = props;

    const createTableRow = (label: string, content: string | JSX.Element, rowKey: string, needsExtraClassname?: boolean) => {
        const contentStyling = classNames({
            'instance-list-row-content': true,
            'content-snipppet': !!needsExtraClassname,
        });
        return (
            <tr className="row" key={rowKey}>
                <th className="label">{label}</th>
                <td className={contentStyling}>{content}</td>
            </tr>
        );
    };

    const renderInstructions = (howToFixString: string) => {
        const lines = howToFixString.split(/\r?\n/);
        const title = lines[0];
        const instructions = lines.slice(1).filter(instruction => !isEmpty(instruction));
        return (
            <div>
                <div className="fix-instruction-title">{title}</div>
                <ul>
                    {instructions.map((instruction, idx) => {
                        return (
                            <li className={`fix-instruction-listitem`} key={`fix-instruction-${idx + 1}`}>
                                {instruction}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    const renderHowToFix = (summary: string) => {
        const titleRegex = /fix (one of the|all of the|any of the|the) following:/gi;
        const titles = summary.match(titleRegex);
        const howToFixStringGroups: string[] = [];
        let startAt = 0;

        for (let titleIdx = 0; titleIdx < titles.length; titleIdx++) {
            const endAt = titleIdx === titles.length - 1 ? summary.length - 1 : summary.indexOf(titles[titleIdx + 1], startAt);
            const howToFixString = summary.substring(startAt, endAt);
            startAt = endAt;
            howToFixStringGroups.push(howToFixString);
        }

        return (
            <div className="how-to-fix-content">
                {howToFixStringGroups.map((howToFix, idx) => {
                    return <div key={`how-to-fix-instructions-group-${idx + 1}`}>{renderInstructions(howToFix)}</div>;
                })}
            </div>
        );
    };

    return (
        <table className="report-instance-table">
            <tbody>
                {createTableRow('Path', target.join(', '), `path-row-${index}`)}
                {createTableRow('Snippet', html, `snippet-row-${index}`, true)}
                {createTableRow('How to fix', renderHowToFix(failureSummary), `how-to-fix-row-${index}`)}
            </tbody>
        </table>
    );
});
