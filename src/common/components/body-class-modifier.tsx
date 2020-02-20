// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DocumentManipulator } from 'common/document-manipulator';
import * as React from 'react';

export type BodyClassModifierProps = {
    classNames: string[];
    documentManipulator: DocumentManipulator;
};

// We user our own BodyClassModifier rather than using Helmet's similar functionality because we
// need multiple BodyClassModifiers to be able to co-exist without overwriting each other or the
// body classes office fabric maintains.
export class BodyClassModifier extends React.Component<BodyClassModifierProps> {
    public render(): JSX.Element {
        return null;
    }

    public componentDidMount(): void {
        this.updateClassNames([], this.props.classNames);
    }

    public componentDidUpdate(prevProps: BodyClassModifierProps): void {
        this.updateClassNames(prevProps.classNames, this.props.classNames);
    }

    public componentWillUnmount(): void {
        this.updateClassNames(this.props.classNames, []);
    }

    private updateClassNames(oldClassNames: string[], newClassNames): void {
        const { documentManipulator } = this.props;

        const addedClassNames = newClassNames.filter(n => !oldClassNames.includes(n));
        const removedClassNames = oldClassNames.filter(n => !newClassNames.includes(n));

        // document.body may include classes not managed by this BodyClassModifier; leave them as-is
        let allBodyClassNames = documentManipulator.bodyClassNames;
        allBodyClassNames = allBodyClassNames.filter(n => !removedClassNames.includes(n));
        allBodyClassNames.push(...addedClassNames);

        documentManipulator.bodyClassNames = allBodyClassNames;
    }
}
