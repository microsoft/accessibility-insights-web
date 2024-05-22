// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export const expectMockedComponentPropsToMatchSnapshots = (
    components: any[],
    snapshotName?: string,
) => {
    components.forEach(component => {
        const componentSnapshotName =
            snapshotName ||
            `${component.displayName || component.name || component?.render?.displayName || 'mocked component'} props`;
        expectMockedComponentPropsToMatchSnapshot(component, componentSnapshotName);
    });
};

export function getMockComponentCall(obj, callNum = 1) {
    const calls = (obj as any).mock?.calls || (obj as any).render.mock.calls;
    return calls.length > callNum - 1 ? calls[callNum - 1] : [];
}

export function getMockComponentClassPropsForCall(obj, callNum = 1) {
    return getMockComponentCall(obj, callNum)[0];
}

export function mockReactComponents(components: any[]) {
    components.forEach(component => {
        mockReactComponent(component);
    });
}

export function useOriginalReactElements(library: string, components: any[]) {
    const actualLibrary = jest.requireActual(library);
    components.forEach(component => {
        const mockComponent = jest.requireMock(library)[component];
        if (
            actualLibrary[component].prototype &&
            actualLibrary[component].prototype.isReactComponent
        ) {
            const mockClass = () => ({
                ...mockComponent,
                render: actualLibrary[component].prototype.render,
            });
            (mockComponent as any).mockImplementation(mockClass);
        } else {
            if ((mockComponent as any).render?.mockImplementation) {
                mockComponent.render.mockImplementation(actualLibrary[component].render);
            }
            if ((mockComponent as any).mockImplementation) {
                (mockComponent as any).mockImplementation(actualLibrary[component]);
            }
        }
    });
}

function mockReactComponent<T extends React.ComponentClass<P>, P = any>(component, elementName?) {
    if (component !== undefined) {
        let name;
        name =
            elementName || component?.displayName
                ? `mock-${component?.displayName}`
                : `mock-${component.name}`;

        if (name === 'mock-undefined') {
            name = component?.render?.displayName && `mock-${component?.render?.displayName}`;
        }
        if (
            !(component as any).mockImplementation &&
            !(component as any).render?.mockImplementation
        ) {
            throw new Error(
                `${name} is not a mockable component. Please add a jest.mock call for this component before using this component in the test function.`,
            );
        }
        const mockFunction = mockReactElement<P>(name);
        if (component.prototype && component.prototype.isReactComponent) {
            const mockClass = (props: P, context?: any, ...rest: any[]) => ({
                render: () => mockFunction(props, ...rest),
                props,
                context,
                ...rest,
            });
            (component as any).mockImplementation(mockClass);
        } else {
            //functional component
            if ((component as any).render?.mockImplementation) {
                component.render.mockImplementation(mockFunction);
            }
            if ((component as any).mockImplementation) {
                (component as any).mockImplementation(mockFunction);
            }
        }
    }
}

function expectMockedComponentPropsToMatchSnapshot(component: any, snapshotName?: string) {
    snapshotName !== undefined
        ? expect(getMockComponentClassPropsForCall(component as any)).toMatchSnapshot(snapshotName)
        : expect(getMockComponentClassPropsForCall(component as any)).toMatchSnapshot();
}

function mockReactElement<P = any>(elementName: string) {
    const element: React.FC<React.PropsWithChildren<React.PropsWithChildren<P>>> = elementProps => {
        try {
            const { children, ...props } = elementProps;
            return React.createElement(elementName, props, children);
        } catch (e) {
            if (e instanceof TypeError) {
                return React.createElement('pre', {}, e.message);
            }
            throw e;
        }
    };
    return element;
}
