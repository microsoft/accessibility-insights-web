// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { title } from '../../../content/strings/application';

export class ReportHead extends React.Component {
    private stylesheet: string = `
        body, h1, p, div {
            color: black;
            font-family: 'Segoe UI Web (West European)',
                'Segoe UI',
                '-apple-system',
                BlinkMacSystemFont,
                Roboto,
                'Helvetica Neue',
                Helvetica,
                Ubuntu,
                Arial,
                sans-serif,
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol';
            margin: 0px;
        }
        a {
            color: #106EBE;
            text-decoration: none;
        }
        a:hover {
            color: #004578;
        }
        h1 {
            font-size: 28px;
            font-weight: 100;
            margin-bottom: 16px;
        }
        h2 {
            font-weight: 100;
            margin-bottom: 12px;
        }
        h3 {
            font-size: 17px;
            font-weight: 300;
            margin: 16px 0px;
            padding: 5px 32px;
            background-color: #E1E8F5;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td {
            vertical-align: top;
        }
        td.label {
            font-weight: bold;
            width: 100px;
        }
        .report-header {
            padding: 32px;
            background-color: #F4F4F4;
        }
        .report-header h1 img {
            vertical-align: -12px;
            padding-right: 10px;
        }
        .report-header div img {
            padding-right: 6px;
        }
        .report-scan-details {
            margin: 16px 0px 16px 32px;
        }
        .report-scan-details td {
            font-size: 12px;
        }
        .report-congrats {
            margin: 16px 32px;
            width: 350px;
        }
        .report-congrats-message {
            border: 20px solid #252525;
            border-radius: 20px;
            font-size: 36px;
            top: -19px;
            z-index: -1;
            position: relative;
            text-align: center;
        }
        .report-congrats-message div:first-child {
            font-weight: 700;
        }
        .report-congrats-image {
            margin-top: 8px;
            text-align: center;
            left: 33px;
            position: relative;
        }
        .report-checks {
            margin: 16px 32px 16px 8px;
        }
        .report-check-top {
            font-size: 14px;
            font-weight: bold;
            margin: 2px 0px;
        }
        .report-instances {
            margin: 8px 0px 16px 4px;
        }
        .report-instances p {
            font-size: 14px;
        }
        .report-instance-table td {
            font-size: 11px;
        }
        .report-instance-table .snippet-row {
            border-bottom: 2px solid #EAEAEA
        }
        .report-instance-table .path-row td {
            padding: 6px 0px;
        }
        .report-instance-table .snippet-row td {
            padding: 0px 0px 6px 0px;
        }
        .report-instance-table .snippet-row .content {
            font-family: Menlo, Consolas, Courier New, monospace;
            word-break: break-all;
        }
        .report-footer {
            margin: 16px 32px 32px 32px;
            border-top: 2px solid #EAEAEA;
            padding-top: 10px;
            font-size: 12px;
        }
    `;

    public render(): JSX.Element {
        return (
            <head>
                <title>{title} automated checks result</title>
                <style dangerouslySetInnerHTML={{ __html: this.stylesheet }} />
            </head>
        );
    }
}
