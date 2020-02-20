// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DocumentManipulator } from 'common/document-manipulator';
import * as React from 'react';

export type BodyClassModifierProps = {
    classNames: string[];
    documentManipulator: DocumentManipulator;
};

export class BodyClassModifier extends React.Component<BodyClassModifierProps> {
    public render(): JSX.Element {
        return null;
    }

    private updateClassNamesFrom(prevClassNames: string[]): void {
        const { classNames, documentManipulator } = this.props;

        const addedClassNames = classNames.filter(n => !prevClassNames.includes(n));
        const removedClassNames = prevClassNames.filter(n => !classNames.includes(n));

        // Note: may include class names not managed by us; leave them as-is
        let allBodyClassNames = documentManipulator.bodyClassNames;
        allBodyClassNames = allBodyClassNames.filter(n => !removedClassNames.includes(n));
        allBodyClassNames.push(...addedClassNames);

        documentManipulator.bodyClassNames = allBodyClassNames;
    }

    public componentDidMount(): void {
        this.updateClassNamesFrom([]);
    }

    public componentDidUpdate(prevProps: BodyClassModifierProps): void {
        this.updateClassNamesFrom(prevProps.classNames);
    }
}
