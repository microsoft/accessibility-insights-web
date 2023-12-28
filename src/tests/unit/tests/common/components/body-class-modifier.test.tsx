// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { BodyClassModifier, BodyClassModifierDeps } from 'common/components/body-class-modifier';
import { DocumentManipulator } from 'common/document-manipulator';
import * as React from 'react';

describe('BodyClassModifier', () => {
    let bodyClassNames: string[];
    let deps: BodyClassModifierDeps;

    beforeEach(() => {
        bodyClassNames = [];
        deps = {
            documentManipulator: {
                getBodyClassNames: () => bodyClassNames,
                setBodyClassNames: newClassNames => {
                    bodyClassNames = newClassNames;
                },
            } as DocumentManipulator,
        };
    });

    it('should render as null', () => {
        const renderResult = render(<BodyClassModifier classNames={['any']} deps={deps} />);
        expect(renderResult.container.firstChild).toBeNull();
    });

    it('should not modify class names it is not responsible for', () => {
        bodyClassNames = ['pre-existing'];

        const { rerender } = render(
            <BodyClassModifier classNames={['from-test-subject']} deps={deps} />,
        );
        expect(bodyClassNames).toContain('pre-existing');

        rerender(<BodyClassModifier classNames={[]} deps={deps} />);
        expect(bodyClassNames).toContain('pre-existing');
    });

    it('should add classNames to documentManipulator.bodyClassNames when mounted', () => {
        render(<BodyClassModifier classNames={['test-class']} deps={deps} />);
        expect(bodyClassNames).toEqual(['test-class']);
    });

    it('should update classNames in documentManipulator.bodyClassNames when props are updated', () => {
        const { rerender } = render(
            <BodyClassModifier classNames={['from-original-props']} deps={deps} />,
        );
        rerender(<BodyClassModifier classNames={['from-set-props']} deps={deps} />);
        expect(bodyClassNames).toEqual(['from-set-props']);
    });

    it('should not change documentManipulator.bodyClassNames when props receive no-op updates', () => {
        const { rerender } = render(<BodyClassModifier classNames={['test-class']} deps={deps} />);
        rerender(<BodyClassModifier classNames={['test-class']} deps={deps} />);
        expect(bodyClassNames).toEqual(['test-class']);
    });

    it('should remove classNames to documentManipulator.bodyClassNames when unmounted', () => {
        const renderResult = render(<BodyClassModifier classNames={['test-class']} deps={deps} />);
        renderResult.unmount();

        expect(bodyClassNames).toEqual([]);
    });

    it('should cooperate with other BodyClassModifiers responsible for different classNames', () => {
        render(<BodyClassModifier classNames={['class-1']} deps={deps} />);
        render(<BodyClassModifier classNames={['class-2']} deps={deps} />);
        render(<BodyClassModifier classNames={['class-3']} deps={deps} />);

        expect(bodyClassNames).toEqual(['class-1', 'class-2', 'class-3']);
    });
});
