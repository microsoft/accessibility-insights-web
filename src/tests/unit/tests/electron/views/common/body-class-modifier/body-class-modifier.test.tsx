// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BodyClassModifier, BodyClassModifierProps } from 'electron/views/common/body-class-modifier/body-class-modifier';
import { ClassAssigner } from 'electron/views/common/body-class-modifier/class-assigner';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('BodyClassModifier', () => {
    let classAssigners: ClassAssigner[];
    let props: BodyClassModifierProps;

    beforeEach(() => {
        classAssigners = [];

        classAssigners.push(createClassAssignerMock('test-class-one').object);
        classAssigners.push(createClassAssignerMock('test-class-two').object);
        classAssigners.push(createClassAssignerMock('duplicated-class').object);
        classAssigners.push(createClassAssignerMock('duplicated-class').object);
        classAssigners.push(createClassAssignerMock(null).object);
        classAssigners.push(createClassAssignerMock(undefined).object);

        props = {
            deps: {
                classAssigners,
                storeActionMessageCreator: null,
                storesHub: null,
            },
            storeState: null,
        };
    });

    it('renders', () => {
        const wrapped = shallow(<BodyClassModifier {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
    });

    const createClassAssignerMock = (classToAssign: string) => {
        const mock = Mock.ofType<ClassAssigner>();

        mock.setup(assigner => assigner.assign()).returns(() => classToAssign);

        return mock;
    };
});
