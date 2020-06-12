// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Markup } from 'views/content/markup';
import { NamedFC } from '../../../common/react/named-fc';
import { React } from '../../common';

type LandmarkRoleProps = {
    markup: Markup;
    role: string;
    element: string;
    description: string;
};

export const LandmarkRole = NamedFC<LandmarkRoleProps>('LandmarkRole', ({ markup, role, element, description }) => (
    <tr>
        <td className={`landmark-role ${role}-landmark`}>{role}</td>
        <td>
            <markup.Code>{element}</markup.Code>
        </td>
        <td>{description}</td>
    </tr>
));

type LandmarkTableProps = {
    markup: Markup;
};

export const LandmarkTable = NamedFC<LandmarkTableProps>('LandmarkTable', ({ markup }) => (
    <table className="landmark-table">
        <colgroup>
            <col className="landmark-table-column" />
            <col className="landmark-table-column" />
            <col />
        </colgroup>
        <tr>
            <th>Role</th>
            <th>HTML element</th>
            <th>Description</th>
        </tr>

        <LandmarkRole
            markup={markup}
            role="banner"
            element="<header>"
            description="An area at the beginning of the page containing site-oriented content."
        />
        <LandmarkRole
            markup={markup}
            role="complementary"
            element="<aside>"
            description="An area of the page that supports the main content, yet remains meaningful on its own."
        />
        <LandmarkRole
            markup={markup}
            role="contentinfo"
            element="<footer>"
            description="An area at the end of the page containing info about the main content or website."
        />
        <LandmarkRole
            markup={markup}
            role="form"
            element="<form>"
            description="An area of the page containing a collection of form-related elements."
        />
        <LandmarkRole markup={markup} role="main" element="<main>" description="The area containing the page's primary content." />
        <LandmarkRole
            markup={markup}
            role="navigation"
            element="<nav>"
            description="An area of the page containing a group of links for website or page navigation."
        />
        <LandmarkRole
            markup={markup}
            role="region"
            element="<section>"
            description="An area of the page containing information sufficiently important for users to navigate to it."
        />
        <LandmarkRole
            markup={markup}
            role="search"
            element='<form role="search">'
            description="An area of the page containing search functionality."
        />
    </table>
));
