// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { BodyClassModifier } from 'common/components/body-class-modifier';
import { DocumentManipulator } from 'common/document-manipulator';

describe('BodyClassModifier', () => {
    let documentManipulator: DocumentManipulator;

    beforeEach(() => {
        documentManipulator = { bodyClassNames: [] } as DocumentManipulator;
    });

    it('should render as null', () => {
        const testSubject = shallow(<BodyClassModifier classNames={['any']} documentManipulator={documentManipulator} />);
        expect(testSubject.getElement()).toBeNull();
    });

    describe('componentDidUpdate', () => {
        it('should not modify class names it is not responsible for', () => {
            documentManipulator.bodyClassNames = ['pre-existing'];

            const testSubject = shallow(<BodyClassModifier classNames={['from-test-subject']} documentManipulator={documentManipulator} />);

            expect(documentManipulator.bodyClassNames).toContain('pre-existing');

            testSubject.setProps({ classNames: [] });

            expect(documentManipulator.bodyClassNames).toContain('pre-existing');
        });

        it('should add classNames to documentManipulator.bodyClassNames when used as a prop', () => {
            shallow(<BodyClassModifier classNames={['test-class']} documentManipulator={documentManipulator} />).render();
            expect(documentManipulator.bodyClassNames).toEqual(['test-class']);
        });

        it('should update classNames in documentManipulator.bodyClassNames when props are updated', () => {
            const testSubject = shallow(
                <BodyClassModifier classNames={['from-original-props']} documentManipulator={documentManipulator} />,
            );
            testSubject.render();
            testSubject.setProps({ classNames: ['from-set-props'] });

            expect(documentManipulator.bodyClassNames).toEqual(['from-set-props']);
        });

        it('should not change documentManipulator.bodyClassNames when props are not modified', () => {
            const testSubject = shallow(<BodyClassModifier classNames={['test-class']} documentManipulator={documentManipulator} />);
            testSubject.render();
            testSubject.setProps({ classNames: ['test-class'] });

            expect(documentManipulator.bodyClassNames).toEqual(['test-class']);
        });

        it('should cooperate with other BodyClassModifiers responsible for different classNames', () => {
            const testSubjects = [
                shallow(<BodyClassModifier classNames={['class-1']} documentManipulator={documentManipulator} />),
                shallow(<BodyClassModifier classNames={['class-2']} documentManipulator={documentManipulator} />),
                shallow(<BodyClassModifier classNames={['class-3']} documentManipulator={documentManipulator} />),
            ];
            testSubjects.forEach(s => s.render());

            expect(documentManipulator.bodyClassNames).toEqual(['class-1', 'class-2', 'class-3']);
        });
    });
});
