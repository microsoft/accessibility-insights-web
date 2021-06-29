// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface AtfaBoundingRectangle {
    'Rect.bottom': number;
    'Rect.left': number;
    'Rect.right': number;
    'Rect.top': number;
}

// Source: https://github.com/google/Accessibility-Test-Framework-for-Android/blob/master/src/main/java/com/google/android/apps/common/testing/accessibility/framework/replacements/SpannableString.java
export interface SpannableString {
    'SpannableString.rawString': string;
}

// Source: https://github.com/google/Accessibility-Test-Framework-for-Android/blob/master/src/main/java/com/google/android/apps/common/testing/accessibility/framework/uielement/ViewHierarchyElement.java
export interface ViewHierarchyElement {
    'ViewHierarchyElement.accessibilityClassName': string;
    'ViewHierarchyElement.id': number;
    'ViewHierarchyElement.className': string;
    'ViewHierarchyElement.boundsInScreen'?: AtfaBoundingRectangle;
    'ViewHierarchyElement.contentDescription'?: SpannableString;
    'ViewHierarchyElement.text'?: SpannableString;
}

// Source: https://github.com/google/Accessibility-Test-Framework-for-Android/blob/master/src/main/java/com/google/android/apps/common/testing/accessibility/framework/AccessibilityHierarchyCheckResult.java
export interface AccessibilityHierarchyCheckResult {
    'AccessibilityHierarchyCheckResult.element': ViewHierarchyElement;
    'AccessibilityHierarchyCheckResult.resultId': number;
    'AccessibilityCheckResult.checkClass': string;
    'AccessibilityCheckResult.type': string; // TODO: make an enum?
    'AccessibilityHierarchyCheckResult.metadata'?: any;
}
