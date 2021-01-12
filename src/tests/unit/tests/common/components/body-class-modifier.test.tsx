// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BodyClassModifier, BodyClassModifierDeps } from 'common/components/body-class-modifier';
import { DocumentManipulator } from 'common/document-manipulator';
import { shallow } from 'enzyme';
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
        const testSubject = shallow(<BodyClassModifier classNames={['any']} deps={deps} />);
        expect(testSubject.getElement()).toBeNull();
    });

    it('should not modify class names it is not responsible for', () => {
        bodyClassNames = ['pre-existing'];

        const testSubject = shallow(
            <BodyClassModifier classNames={['from-test-subject']} deps={deps} />,
        );
        expect(bodyClassNames).toContain('pre-existing');

        testSubject.setProps({ classNames: [] });
        expect(bodyClassNames).toContain('pre-existing');
    });

    it('should add classNames to documentManipulator.bodyClassNames when mounted', () => {
        shallow(<BodyClassModifier classNames={['test-class']} deps={deps} />).render();
        expect(bodyClassNames).toEqual(['test-class']);
    });

    it('should update classNames in documentManipulator.bodyClassNames when props are updated', () => {
        const testSubject = shallow(
            <BodyClassModifier classNames={['from-original-props']} deps={deps} />,
        );
        testSubject.setProps({ classNames: ['from-set-props'] });

        expect(bodyClassNames).toEqual(['from-set-props']);
    });

    it('should not change documentManipulator.bodyClassNames when props receive no-op updates', () => {
        const testSubject = shallow(<BodyClassModifier classNames={['test-class']} deps={deps} />);
        testSubject.setProps({ classNames: ['test-class'] });

        expect(bodyClassNames).toEqual(['test-class']);
    });

    it('should remove classNames to documentManipulator.bodyClassNames when unmounted', () => {
        const testSubject = shallow(<BodyClassModifier classNames={['test-class']} deps={deps} />);
        testSubject.unmount();

        expect(bodyClassNames).toEqual([]);
    });

    it('should cooperate with other BodyClassModifiers responsible for different classNames', () => {
        shallow(<BodyClassModifier classNames={['class-1']} deps={deps} />);
        shallow(<BodyClassModifier classNames={['class-2']} deps={deps} />);
        shallow(<BodyClassModifier classNames={['class-3']} deps={deps} />);

        expect(bodyClassNames).toEqual(['class-1', 'class-2', 'class-3']);
    });
});
