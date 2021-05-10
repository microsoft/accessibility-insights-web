// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DocumentManipulator } from 'common/document-manipulator';
import * as React from 'react';

export type BodyClassModifierDeps = {
    documentManipulator: DocumentManipulator;
};

export type BodyClassModifierProps = {
    classNames: string[];
    deps: BodyClassModifierDeps;
};

// We use our own BodyClassModifier rather than using Helmet's similar functionality because we
// need multiple BodyClassModifiers to be able to co-exist without overwriting each other or the
// body classes office fabric maintains.
export class BodyClassModifier extends React.Component<BodyClassModifierProps> {
    public render(): JSX.Element | null {
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

    private updateClassNames(oldClassNames: string[], newClassNames: string[]): void {
        const { documentManipulator } = this.props.deps;

        const addedClassNames = newClassNames.filter(newName => !oldClassNames.includes(newName));
        const removedClassNames = oldClassNames.filter(oldName => !newClassNames.includes(oldName));

        // document.body may include classes not managed by this BodyClassModifier; leave them as-is
        let allBodyClassNames = documentManipulator.getBodyClassNames();
        allBodyClassNames = allBodyClassNames.filter(n => !removedClassNames.includes(n));
        allBodyClassNames.push(...addedClassNames);

        documentManipulator.setBodyClassNames(allBodyClassNames);
    }
}
