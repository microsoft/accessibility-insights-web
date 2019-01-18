// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export function getInnerTextFromJsxElement(element: JSX.Element): string {
    return getInnerTextFromJsxElementRecursive(element).replace(/\s+/g, ' ').trim();
}

function getInnerTextFromJsxElementRecursive(element: JSX.Element): string {
    let content = '';

    if (typeof element === 'object') {
        const childProps = element.props.children || [];

        for (let pos = 0; pos < childProps.length; pos++) {
            content += getInnerTextFromJsxElementRecursive(childProps[pos]);
        }

        return content;
    }
    else {
        content = `${element}`;
    }

    return content;
}




