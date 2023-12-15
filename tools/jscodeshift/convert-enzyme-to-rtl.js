// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const rtlSourceName = '@testing-library/react';
const userEventSourceName = '@testing-library/user-event';
const placeholderVariableName = 'renderResult';

function addSourceImport(j, root, source, name) {
    const sourceImport = root.find(j.ImportDeclaration, {
        source: { value: source },
    });
    const importSpecifier = j.importSpecifier(j.identifier(name));
    const sourceLiteral = j.stringLiteral(source);
    if (sourceImport.length === 0) {
        const importDeclaration = j.importDeclaration([importSpecifier], sourceLiteral);
        root.get().node.program.body.unshift(importDeclaration);
    } else {
        const namedImport = sourceImport.find(j.ImportSpecifier, { imported: { name } });
        if (namedImport.length === 0) {
            const existingImportSpecifiers = sourceImport.get().value.specifiers;
            sourceImport.replaceWith(
                j.importDeclaration([...existingImportSpecifiers, importSpecifier], sourceLiteral),
            );
        }
    }
}

function removeImportSpecifier(j, root, importDeclaration, name) {
    const numberOfImportsFromSource = importDeclaration.get().value?.specifiers?.length;
    if (numberOfImportsFromSource) {
        if (numberOfImportsFromSource === 1) {
            importDeclaration.remove();
        } else {
            const namedImportSpecifier = root.find(j.ImportSpecifier, {
                imported: { name },
            });
            namedImportSpecifier.remove();
        }
    }
}

function getCallExpressionByCalleeName(j, root, name) {
    return root.find(j.CallExpression, { callee: { name } });
}

function getVariableDeclaratorByCalleeName(j, root, name) {
    return root.find(j.VariableDeclarator, { init: { callee: { name } } });
}

const renameVariableDeclarator = (j, path, newIdentifier) => {
    j(path).renameTo(newIdentifier);
};

const replaceCallExpressionIdentifier = (j, root, identifier, newIdentifier, args) => {
    getCallExpressionByCalleeName(j, root, identifier).forEach(ce => {
        j(ce).replaceWith(
            j.callExpression(
                j.identifier(newIdentifier),
                args !== undefined ? args : j(ce).get().value.arguments,
            ),
        );
    });
};

const appendIfNecessary = (name, newProperty, appendage) => {
    const appendageDefault = 'container.';
    return `${
        name === placeholderVariableName
            ? typeof appendage === 'string'
                ? appendage
                : appendageDefault
            : ''
    }${newProperty}`;
};

const replaceCallExpressionWithMemberExpression = (
    j,
    path,
    newProperty,
    appendage = '.container',
) => {
    const callee = path.get().value.callee || path.get().value;
    if (callee?.object?.name === placeholderVariableName) {
        callee.object.name += appendage;
    }
    path.replaceWith(j.memberExpression(callee.object, newProperty));
};

const replaceCallExpressionProperty = (j, callExpression, newProperty, args, appendage) => {
    const callee = j(callExpression).get().value.callee;
    if (appendage !== undefined) {
        newProperty = appendIfNecessary(callee.object.name, newProperty, appendage);
    }
    callee.property = j.identifier(newProperty);
    j(callExpression).replaceWith(
        j.callExpression(
            callee,
            args !== undefined ? args : j(callExpression).get().value.arguments,
        ),
    );
};

const getCallExpressionByProperty = (j, root, name) => {
    return root.find(j.CallExpression, { callee: { property: { name } } });
};

function transformer(fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);
    // find the enzyme import
    const enzymeImportDeclaration = root.find(j.ImportDeclaration, { source: { value: 'enzyme' } });
    if (enzymeImportDeclaration.length === 0) {
        return;
    }

    const getFirstNode = () => root.find(j.Program).get('body', 0).node;

    // save the comments attached to the first node then remove them
    const firstNode = getFirstNode();
    const { comments } = firstNode;
    firstNode.comments = null;

    // add render import
    addSourceImport(j, root, rtlSourceName, 'render');

    // remove shallow import
    removeImportSpecifier(j, root, enzymeImportDeclaration, 'shallow');
    getVariableDeclaratorByCalleeName(j, root, 'shallow').forEach(path => {
        renameVariableDeclarator(j, path, placeholderVariableName);
    });
    replaceCallExpressionIdentifier(j, root, 'shallow', 'render');

    // remove mount
    removeImportSpecifier(j, root, enzymeImportDeclaration, 'mount');
    getVariableDeclaratorByCalleeName(j, root, 'mount').forEach(path => {
        renameVariableDeclarator(j, path, placeholderVariableName);
    });
    replaceCallExpressionIdentifier(j, root, 'mount', 'render');

    let shallowTypeRef = root.find(j.TSTypeReference, { typeName: { name: 'ShallowWrapper' } });
    if (shallowTypeRef.length > 0) {
        addSourceImport(j, root, rtlSourceName, 'RenderResult');
        shallowTypeRef.replaceWith(j.tsTypeReference(j.identifier('RenderResult')));

        removeImportSpecifier(j, root, enzymeImportDeclaration, 'ShallowWrapper');
    }

    // expect(renderResult.getElement()).toBeNull() --> expect(renderResult.container.firstChild).toBeNull();
    getCallExpressionByProperty(j, root, 'toBeNull').forEach(path => {
        getCallExpressionByCalleeName(j, j(path), 'expect').forEach(p => {
            getCallExpressionByProperty(j, j(p), 'getElement').forEach(ge => {
                replaceCallExpressionWithMemberExpression(j, j(ge), j.identifier('firstChild'));
            });
        });
    });

    // expect(renderResult.getElement()).not.toBeNull() --> expect(renderResult.container.firstChild).not.toBeNull();
    getCallExpressionByProperty(j, root, 'not.toBeNull').forEach(path => {
        getCallExpressionByCalleeName(j, j(path), 'expect').forEach(p => {
            getCallExpressionByProperty(j, j(p), 'getElement').forEach(ge => {
                replaceCallExpressionWithMemberExpression(j, j(ge), j.identifier('firstChild'));
            });
        });
    });

    // wrapper.getElement() --> wrapper.asFragment()
    getCallExpressionByProperty(j, root, 'getElement').forEach(ce => {
        replaceCallExpressionProperty(j, ce, 'asFragment');
    });

    // renderResult.getDOMNode() --> renderResult.asFragment()
    getCallExpressionByProperty(j, root, 'getDOMNode').forEach(ce => {
        replaceCallExpressionProperty(j, ce, 'asFragment', undefined, '.container');
    });

    // replace element.debug() with element.asFragment()
    getCallExpressionByProperty(j, root, 'debug').forEach(ce => {
        replaceCallExpressionProperty(j, ce, 'asFragment');
    });

    // find('.selector') --> querySelector('.selector')
    getCallExpressionByProperty(j, root, 'find').forEach(path => {
        const args = j(path).get().value.arguments;
        replaceCallExpressionProperty(j, path, 'querySelector', args, true);
    });

    // expect(something.exists()).toBe(true) --> expect(something).not.toBeNull();
    getCallExpressionByProperty(j, root, 'toBe').forEach(path => {
        getCallExpressionByCalleeName(j, j(path), 'expect').forEach(p => {
            getCallExpressionByProperty(j, j(p), 'exists').forEach(ec => {
                j(ec).replaceWith(j(ec).get().value.callee.object);

                const identifier =
                    j(path).get().value.arguments[0].value === true ? 'not.toBeNull' : 'toBeNull';
                replaceCallExpressionProperty(j, path, identifier, [], 'container.firstChild');
            });
        });
    });

    // expect(something.exists()).toBeTruthy() --> expect(something).not.toBeNull();
    getCallExpressionByProperty(j, root, 'toBeTruthy').forEach(path => {
        getCallExpressionByCalleeName(j, j(path), 'expect').forEach(p => {
            const existsCall = getCallExpressionByProperty(j, j(p), 'exists');
            if (existsCall.length > 0) {
                existsCall.replaceWith(existsCall.get().value.callee.object);
                replaceCallExpressionProperty(j, path, 'not.toBeNull');
            }
        });
    });

    // element.children() --> element.children
    getCallExpressionByProperty(j, root, 'children').forEach(path => {
        replaceCallExpressionWithMemberExpression(j, j(path), j.identifier('children'));
    });

    // element.text() --> element.textContent
    getCallExpressionByProperty(j, root, 'text').forEach(path => {
        replaceCallExpressionWithMemberExpression(j, j(path), j.identifier('textContent'));
    });

    const replaceChildAtCall = path => {
        const property =
            j(path).get().value.arguments?.length > 0
                ? j.identifier(`children[${j(path).get().value.arguments[0].value}]`)
                : j(path).get().value.property;
        replaceCallExpressionWithMemberExpression(j, j(path), property);
    };

    // element.childAt(0) --> element.children[0]
    root.find(j.CallExpression, {
        callee: { property: { name: 'childAt' } },
    }).forEach(path => {
        // handle nested calls
        j(path)
            .find(j.CallExpression, {
                callee: { property: { name: 'childAt' } },
            })
            .forEach(replaceChildAtCall);

        // handle top level call
        replaceChildAtCall(path);
    });

    // Mock.ofType(MyType, MockBehavior.Strict) --> Mock.ofType(MyType)
    getCallExpressionByProperty(j, root, 'ofType').forEach(path => {
        const args = j(path).get().value.arguments;
        if (args.length !== 0) {
            path.replace(j.callExpression(j(path).get().value.callee, [args[0]]));
            const typeMoqImport = root.find(j.ImportDeclaration, {
                source: { value: 'typemoq' },
            });
            const mockBehaviors = root.find(j.Identifier, { name: 'MockBehavior' });
            if (mockBehaviors.length > 1) {
                removeImportSpecifier(j, root, typeMoqImport, 'MockBehavior');
            }
        }
    });

    // element.hasClass('className') --> element.classList.contains('className')
    getCallExpressionByProperty(j, root, 'hasClass').forEach(path => {
        replaceCallExpressionProperty(
            j,
            path,
            'classList.contains',
            j(path).get().value.arguments,
            true,
        );
    });

    // renderResult.simulate('click') --> await userEvent.click(renderResult.getByRole('button'));
    const replaceSimulateWithUserEvent = path => {
        getCallExpressionByProperty(j, j(path), 'simulate').forEach(p => {
            const args = j(p).get().value.arguments;
            const event = args[0].value;
            if (event === 'click') {
                addSourceImport(j, root, userEventSourceName, 'userEvent');
                const callObject = j(p).get().value.callee.object.name;
                const newCallObject = `${callObject}.getByRole`;
                const newCallExpression = j.callExpression(j.identifier(newCallObject), [
                    j.literal('button'),
                ]);
                const outsideCall = j.awaitExpression(
                    j.callExpression(j.identifier('userEvent.click'), [newCallExpression]),
                );
                j(p).replaceWith(outsideCall);
                const testFunction = j(path).get().value.arguments[1];
                testFunction.async = true;
            }
        });
    };

    // it('should do something', () => { --> it('should do something', async () => {
    getCallExpressionByCalleeName(j, root, 'it').forEach(path => {
        replaceSimulateWithUserEvent(path);
    });

    // test('should do something', () => { --> test('should do something', async () => {
    getCallExpressionByCalleeName(j, root, 'test').forEach(path => {
        replaceSimulateWithUserEvent(path);
    });

    // reattach the comments to the first node
    const firstNode2 = getFirstNode();
    if (firstNode2 !== firstNode) {
        firstNode2.comments = comments;
    }

    return root.toSource({ quote: 'single' });
}

module.exports = transformer;
