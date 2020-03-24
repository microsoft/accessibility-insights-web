// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export function getInnerTextFromJsxElement(element: JSX.Element): string {
    return getInnerTextFromJsxElementRecursive(element).replace(/\s+/g, ' ').trim();
}

function getInnerTextFromJsxElementRecursive(element: JSX.Element): string {
    if (typeof element !== 'object') {
        return `${element}`;
    }

    const childProps = element.props.children || [];
    if (Array.isArray(childProps)) {
        return childProps.map(child => getInnerTextFromJsxElementRecursive(child)).join('');
    }

    return `${childProps}`;
}
