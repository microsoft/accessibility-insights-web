// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { GenericToggle, GenericToggleProps } from '../../../../../DetailsView/components/generic-toggle';

class TestableGenericToggle extends GenericToggle {
    public getOnClick(): (event: React.MouseEvent<HTMLElement>) => void {
        return this.onClick;
    }
}

describe('GenericToggleTest', () => {
    let onClickMock: IMock<(id: string, enabled: boolean, event: React.MouseEvent<HTMLElement>) => void>;

    beforeEach(() => {
        onClickMock = Mock.ofInstance((id: string, enabled: boolean, event: React.MouseEvent<HTMLElement>) => { });
    });
    test('constructor', () => {
        const testSubject = new GenericToggle({} as GenericToggleProps);
        expect(testSubject).toBeDefined();
    });


    test.each([true, false])('render with string content', (toggleState: boolean) => {
        const props: GenericToggleProps = {
            name: 'test name',
            description: 'test description',
            enabled: toggleState,
            onClick: onClickMock.object,
            id: 'test-id-1',
        };
        const testSubject = new TestableGenericToggle(props);

        const expectedComponent = (
            <div className={'generic-toggle-component'}>
                <div className={'toggle-container'}>
                    <div className={'toggle-name'}>{props.name}</div>
                    <Toggle
                        className={'toggle'}
                        checked={toggleState}
                        onClick={testSubject.getOnClick()}
                        onText={'On'}
                        offText={'Off'}
                        onAriaLabel={props.name}
                        offAriaLabel={props.name}
                    />
                </div>
                <div className={'toggle-description'}>{props.description}</div>
            </div>
        );

        onClickMock.verifyAll();
        expect(testSubject.render()).toEqual(expectedComponent);
    });

    test('render with jsx content', () => {
        const props: GenericToggleProps = {
            name: 'test name',
            description: (<h1>hello</h1>),
            enabled: true,
            onClick: onClickMock.object,
            id: 'test-id-1',
        };
        const testSubject = new TestableGenericToggle(props);

        const expectedComponent = (
            <div className={'generic-toggle-component'}>
                <div className={'toggle-container'}>
                    <div className={'toggle-name'}>{props.name}</div>
                    <Toggle
                        className={'toggle'}
                        checked={true}
                        onClick={testSubject.getOnClick()}
                        onText={'On'}
                        offText={'Off'}
                        onAriaLabel={props.name}
                        offAriaLabel={props.name}
                    />
                </div>
                <div className={'toggle-description'}>{props.description}</div>
            </div>
        );

        onClickMock.verifyAll();
        expect(testSubject.render()).toEqual(expectedComponent);
    });

    test('verify onclick call', () => {
        const props: GenericToggleProps = {
            name: 'test name',
            description: 'test description',
            enabled: true,
            onClick: onClickMock.object,
            id: 'test-id-1',
        };
        const eventStub: any = {};

        const testSubject = new TestableGenericToggle(props);

        testSubject.getOnClick()(eventStub);

        onClickMock.verify(ocm => ocm(props.id, !props.enabled, eventStub), Times.once());
    });

    test('verify if the classname passed from prop is added properly', () => {
        const props: GenericToggleProps = {
            name: 'test name',
            description: 'test description',
            enabled: true,
            onClick: onClickMock.object,
            id: 'test-id-1',
        };

        const wrapper = shallow(<TestableGenericToggle {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
