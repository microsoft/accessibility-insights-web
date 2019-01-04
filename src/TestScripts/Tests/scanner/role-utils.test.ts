// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RoleUtils } from '../../../scanner/role-utils';
import { createNodeStub } from './helpers';

describe('RoleUtils', () => {
    describe('isValidRoleIfPresent', () => {
        it('should return true if it is a valid role', () => {
            const testElement = createNodeStub('button', {
                'role' : 'button',
            });
            expect(RoleUtils.isValidRoleIfPresent(testElement)).toBeTruthy();
        });

        it('should return false if it is an invalid role', () => {
            const testElement = createNodeStub('button', {
                'role' : 'randomRole',
            });
            expect(RoleUtils.isValidRoleIfPresent(testElement)).toBeFalsy();
        });

        it('should return true if role is null (Incase an element does not have a role attribute)', () => {
            const testElement = createNodeStub('button', {});
            expect(RoleUtils.isValidRoleIfPresent(testElement)).toBeTruthy();
        });

        it('should return false if role is empty or whitespace', () => {
            const testElement = createNodeStub('button', {
                'role' : '',
            });
            expect(RoleUtils.isValidRoleIfPresent(testElement)).toBeFalsy();
        });
    });
});
