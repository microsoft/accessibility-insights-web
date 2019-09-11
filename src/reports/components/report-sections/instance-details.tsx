// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as classNames from 'classnames';
import * as React from 'react';

import { NamedFC } from 'common/react/named-fc';
import { CheckType } from 'injected/components/details-dialog';
import { FixInstructionPanel } from 'injected/components/fix-instruction-panel';
import { FixInstructionProcessor } from 'injected/fix-instruction-processor';

export type InstanceDetailsProps = Pick<AxeNodeResult, 'none' | 'all' | 'any' | 'html' | 'target'> & {
    index: number;
    fixInstructionProcessor: FixInstructionProcessor;
};

export const InstanceDetails = NamedFC<InstanceDetailsProps>('InstanceDetail', props => {
    const { html, target, index } = props;
    const anyCheck = props.any;
    const allCheck = props.all;
    const noneCheck = props.none;

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

    const renderFixInstructionsTitleElement = (titleText: string, className: string) => {
        return <div className={className}>{titleText}</div>;
    };

    const renderFixInstructionsContent = () => {
        const deps = {
            fixInstructionProcessor: props.fixInstructionProcessor,
        };
        return (
            <div className="how-to-fix-content">
                <FixInstructionPanel
                    deps={deps}
                    checkType={CheckType.All}
                    checks={allCheck.concat(noneCheck)}
                    renderTitleElement={renderFixInstructionsTitleElement}
                />
                <FixInstructionPanel
                    deps={deps}
                    checkType={CheckType.Any}
                    checks={anyCheck}
                    renderTitleElement={renderFixInstructionsTitleElement}
                />
            </div>
        );
    };

    return (
        <table className="report-instance-table">
            <tbody>
                {createTableRow('Path', target.join(', '), `path-row-${index}`)}
                {createTableRow('Snippet', html, `snippet-row-${index}`, true)}
                {createTableRow('How to fix', renderFixInstructionsContent(), `how-to-fix-row-${index}`)}
            </tbody>
        </table>
    );
});
