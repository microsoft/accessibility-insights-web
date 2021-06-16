// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeReportParameters } from 'accessibility-insights-report';

export const axeResultsWithoutIssues: AxeReportParameters = {
    description: 'Description for Axe Results Without Issues',
    scanContext: {
        pageTitle: 'Page Title for Axe Results Without Issues',
    },
    serviceName: 'Service Name for Axe Results Without Issues',
    results: {
        inapplicable: [
            {
                description: 'Ensures every accesskey attribute value is unique',
                help: 'accesskey attribute value must be unique',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/accesskeys?application=webdriverjs',
                id: 'accesskeys',
                impact: null,
                nodes: [],
                tags: ['best-practice', 'cat.keyboard'],
            },
            {
                description: 'Ensures <area> elements of image maps have alternate text',
                help: 'Active <area> elements must have alternate text',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/area-alt?application=webdriverjs',
                id: 'area-alt',
                impact: null,
                nodes: [],
                tags: [
                    'cat.text-alternatives',
                    'wcag2a',
                    'wcag111',
                    'section508',
                    'section508.22.a',
                ],
            },
            {
                description: 'Ensures aria-hidden elements do not contain focusable elements',
                help: 'ARIA hidden element must not contain focusable elements',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-hidden-focus?application=webdriverjs',
                id: 'aria-hidden-focus',
                impact: null,
                nodes: [],
                tags: ['cat.name-role-value', 'wcag2a', 'wcag412', 'wcag131'],
            },
            {
                description: 'Ensures every ARIA input field has an accessible name',
                help: 'ARIA input fields have an accessible name',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-input-field-name?application=webdriverjs',
                id: 'aria-input-field-name',
                impact: null,
                nodes: [],
                tags: ['wcag2a', 'wcag412'],
            },
            {
                description: 'Ensures every ARIA toggle field has an accessible name',
                help: 'ARIA toggle fields have an accessible name',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-toggle-field-name?application=webdriverjs',
                id: 'aria-toggle-field-name',
                impact: null,
                nodes: [],
                tags: ['wcag2a', 'wcag412'],
            },
            {
                description:
                    'Ensure the autocomplete attribute is correct and suitable for the form field',
                help: 'autocomplete attribute must be used correctly',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/autocomplete-valid?application=webdriverjs',
                id: 'autocomplete-valid',
                impact: null,
                nodes: [],
                tags: ['cat.forms', 'wcag21aa', 'wcag135'],
            },
            {
                description: 'Ensures <blink> elements are not used',
                help: '<blink> elements are deprecated and must not be used',
                helpUrl: 'https://dequeuniversity.com/rules/axe/3.3/blink?application=webdriverjs',
                id: 'blink',
                impact: null,
                nodes: [],
                tags: ['cat.time-and-media', 'wcag2a', 'wcag222', 'section508', 'section508.22.j'],
            },
            {
                description: 'Ensures <dl> elements are structured correctly',
                help: '<dl> elements must only directly contain properly-ordered <dt> and <dd> groups, <script> or <template> elements',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/definition-list?application=webdriverjs',
                id: 'definition-list',
                impact: null,
                nodes: [],
                tags: ['cat.structure', 'wcag2a', 'wcag131'],
            },
            {
                description: 'Ensures <dt> and <dd> elements are contained by a <dl>',
                help: '<dt> and <dd> elements must be contained by a <dl>',
                helpUrl: 'https://dequeuniversity.com/rules/axe/3.3/dlitem?application=webdriverjs',
                id: 'dlitem',
                impact: null,
                nodes: [],
                tags: ['cat.structure', 'wcag2a', 'wcag131'],
            },
            {
                description: 'Ensures <iframe> and <frame> elements contain the axe-core script',
                help: 'Frames must be tested with axe-core',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/frame-tested?application=webdriverjs',
                id: 'frame-tested',
                impact: null,
                nodes: [],
                tags: ['cat.structure', 'review-item', 'best-practice'],
            },
            {
                description:
                    'Ensures <iframe> and <frame> elements contain a unique title attribute',
                help: 'Frames must have a unique title attribute',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/frame-title-unique?application=webdriverjs',
                id: 'frame-title-unique',
                impact: null,
                nodes: [],
                tags: ['cat.text-alternatives', 'best-practice'],
            },
            {
                description:
                    'Ensures <iframe> and <frame> elements contain a non-empty title attribute',
                help: 'Frames must have title attribute',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/frame-title?application=webdriverjs',
                id: 'frame-title',
                impact: null,
                nodes: [],
                tags: [
                    'cat.text-alternatives',
                    'wcag2a',
                    'wcag241',
                    'wcag412',
                    'section508',
                    'section508.22.i',
                ],
            },
            {
                description:
                    'Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page',
                help: 'HTML elements with lang and xml:lang must have the same base language',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/html-xml-lang-mismatch?application=webdriverjs',
                id: 'html-xml-lang-mismatch',
                impact: null,
                nodes: [],
                tags: ['cat.language', 'wcag2a', 'wcag311'],
            },
            {
                description: 'Ensures <input type="image"> elements have alternate text',
                help: 'Image buttons must have alternate text',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/input-image-alt?application=webdriverjs',
                id: 'input-image-alt',
                impact: null,
                nodes: [],
                tags: [
                    'cat.text-alternatives',
                    'wcag2a',
                    'wcag111',
                    'section508',
                    'section508.22.a',
                ],
            },
            {
                description: 'Ensures the complementary landmark or aside is at top level',
                help: 'Aside must not be contained in another landmark',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/landmark-complementary-is-top-level?application=webdriverjs',
                id: 'landmark-complementary-is-top-level',
                impact: null,
                nodes: [],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description: 'Ensures <marquee> elements are not used',
                help: '<marquee> elements are deprecated and must not be used',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/marquee?application=webdriverjs',
                id: 'marquee',
                impact: null,
                nodes: [],
                tags: ['cat.parsing', 'wcag2a', 'wcag222'],
            },
            {
                description: 'Ensures <meta http-equiv="refresh"> is not used',
                help: 'Timed refresh must not exist',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/meta-refresh?application=webdriverjs',
                id: 'meta-refresh',
                impact: null,
                nodes: [],
                tags: ['cat.time', 'wcag2a', 'wcag2aaa', 'wcag221', 'wcag224', 'wcag325'],
            },
            {
                description: 'Ensures <meta name="viewport"> can scale a significant amount',
                help: 'Users should be able to zoom and scale the text up to 500%',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/meta-viewport-large?application=webdriverjs',
                id: 'meta-viewport-large',
                impact: null,
                nodes: [],
                tags: ['cat.sensory-and-visual-cues', 'best-practice'],
            },
            {
                description:
                    'Ensures <meta name="viewport"> does not disable text scaling and zooming',
                help: 'Zooming and scaling must not be disabled',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/meta-viewport?application=webdriverjs',
                id: 'meta-viewport',
                impact: null,
                nodes: [],
                tags: ['cat.sensory-and-visual-cues', 'wcag2aa', 'wcag144'],
            },
            {
                description: 'Ensures <object> elements have alternate text',
                help: '<object> elements must have alternate text',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/object-alt?application=webdriverjs',
                id: 'object-alt',
                impact: null,
                nodes: [],
                tags: [
                    'cat.text-alternatives',
                    'wcag2a',
                    'wcag111',
                    'section508',
                    'section508.22.a',
                ],
            },
            {
                description: "Ensures [role='img'] elements have alternate text",
                help: "[role='img'] elements have an alternative text",
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/role-img-alt?application=webdriverjs',
                id: 'role-img-alt',
                impact: null,
                nodes: [],
                tags: [
                    'cat.text-alternatives',
                    'wcag2a',
                    'wcag111',
                    'section508',
                    'section508.22.a',
                ],
            },
            {
                description:
                    'Elements that have scrollable content should be accessible by keyboard',
                help: 'Ensure that scrollable region has keyboard access',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/scrollable-region-focusable?application=webdriverjs',
                id: 'scrollable-region-focusable',
                impact: null,
                nodes: [],
                tags: ['wcag2a', 'wcag211'],
            },
            {
                description: 'Ensures that server-side image maps are not used',
                help: 'Server-side image maps must not be used',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/server-side-image-map?application=webdriverjs',
                id: 'server-side-image-map',
                impact: null,
                nodes: [],
                tags: [
                    'cat.text-alternatives',
                    'wcag2a',
                    'wcag211',
                    'section508',
                    'section508.22.f',
                ],
            },
            {
                description: 'Ensure all skip links have a focusable target',
                help: 'The skip-link target should exist and be focusable',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/skip-link?application=webdriverjs',
                id: 'skip-link',
                impact: null,
                nodes: [],
                tags: ['cat.keyboard', 'best-practice'],
            },
            {
                description: 'Ensures tabindex attribute values are not greater than 0',
                help: 'Elements should not have tabindex greater than zero',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/tabindex?application=webdriverjs',
                id: 'tabindex',
                impact: null,
                nodes: [],
                tags: ['cat.keyboard', 'best-practice'],
            },
            {
                description: 'Ensures <video> elements have captions',
                help: '<video> elements must have captions',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/video-caption?application=webdriverjs',
                id: 'video-caption',
                impact: null,
                nodes: [],
                tags: [
                    'cat.text-alternatives',
                    'wcag2a',
                    'wcag122',
                    'section508',
                    'section508.22.a',
                ],
            },
        ],
        incomplete: [
            {
                description:
                    'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
                help: 'Elements must have sufficient color contrast',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/color-contrast?application=webdriverjs',
                id: 'color-contrast',
                impact: 'serious',
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: null,
                                    contrastRatio: 0,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#000000',
                                    fontSize: '19.2pt (25.6px)',
                                    fontWeight: 'normal',
                                    missingData: 'bgGradient',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message:
                                    "Element's background color could not be determined due to a background gradient",
                                relatedNodes: [
                                    {
                                        html: '<div class="section">',
                                        target: ['.section:nth-child(2)'],
                                    },
                                ],
                            },
                        ],
                        html: '<h2>Welcome!</h2>',
                        impact: 'serious',
                        none: [],
                        target: ['.section:nth-child(2) > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: null,
                                    contrastRatio: 0,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: 'bgGradient',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message:
                                    "Element's background color could not be determined due to a background gradient",
                                relatedNodes: [
                                    {
                                        html: '<div class="section">',
                                        target: ['.section:nth-child(2)'],
                                    },
                                ],
                            },
                        ],
                        html: '<p>',
                        impact: 'serious',
                        none: [],
                        target: ['.section:nth-child(2) > p'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: null,
                                    contrastRatio: 0,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#000000',
                                    fontSize: '19.2pt (25.6px)',
                                    fontWeight: 'normal',
                                    missingData: 'bgGradient',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message:
                                    "Element's background color could not be determined due to a background gradient",
                                relatedNodes: [
                                    {
                                        html: '<div class="section" lang="es">',
                                        target: ['.section[lang="es"]'],
                                    },
                                ],
                            },
                        ],
                        html: '<h2>Bienvenido!</h2>',
                        impact: 'serious',
                        none: [],
                        target: ['.section[lang="es"] > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: null,
                                    contrastRatio: 0,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: 'bgGradient',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message:
                                    "Element's background color could not be determined due to a background gradient",
                                relatedNodes: [
                                    {
                                        html: '<div class="section" lang="es">',
                                        target: ['.section[lang="es"]'],
                                    },
                                ],
                            },
                        ],
                        html: '<p lang="es">',
                        impact: 'serious',
                        none: [],
                        target: ['p[lang="es"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: null,
                                    contrastRatio: 0,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#000000',
                                    fontSize: '19.2pt (25.6px)',
                                    fontWeight: 'normal',
                                    missingData: 'bgGradient',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message:
                                    "Element's background color could not be determined due to a background gradient",
                                relatedNodes: [
                                    {
                                        html: '<div class="section">',
                                        target: ['.section:nth-child(4)'],
                                    },
                                ],
                            },
                        ],
                        html: '<h2>Can you spot the barriers?</h2>',
                        impact: 'serious',
                        none: [],
                        target: ['.section:nth-child(4) > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: null,
                                    contrastRatio: 0,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: 'bgGradient',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message:
                                    "Element's background color could not be determined due to a background gradient",
                                relatedNodes: [
                                    {
                                        html: '<div class="section">',
                                        target: ['.section:nth-child(4)'],
                                    },
                                ],
                            },
                        ],
                        html: '<p>',
                        impact: 'serious',
                        none: [],
                        target: ['.section:nth-child(4) > p'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: null,
                                    contrastRatio: 0,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#3e0087',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: 'bgGradient',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message:
                                    "Element's background color could not be determined due to a background gradient",
                                relatedNodes: [
                                    {
                                        html: '<div class="section">',
                                        target: ['.section:nth-child(4)'],
                                    },
                                ],
                            },
                        ],
                        html: '<a href="issues.html">List of Issues</a>',
                        impact: 'serious',
                        none: [],
                        target: ['a[href$="issues\\.html"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: null,
                                    contrastRatio: 0,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#3e0087',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: 'bgGradient',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message:
                                    "Element's background color could not be determined due to a background gradient",
                                relatedNodes: [
                                    {
                                        html: '<div class="section">',
                                        target: ['.section:nth-child(4)'],
                                    },
                                ],
                            },
                        ],
                        html: '<a href="before.html">Inaccessible version</a>',
                        impact: 'serious',
                        none: [],
                        target: ['a[href$="before\\.html"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: null,
                                    contrastRatio: 0,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#3e0087',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: 'bgGradient',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message:
                                    "Element's background color could not be determined due to a background gradient",
                                relatedNodes: [
                                    {
                                        html: '<div class="section">',
                                        target: ['.section:nth-child(4)'],
                                    },
                                ],
                            },
                        ],
                        html: '<a href="cheatsheet.html">Cheat Sheet of Accessibility Issues</a>',
                        impact: 'serious',
                        none: [],
                        target: ['a[href$="cheatsheet\\.html"]'],
                    },
                ],
                tags: ['cat.color', 'wcag2aa', 'wcag143'],
            },
        ],
        passes: [
            {
                description: "Ensures ARIA attributes are allowed for an element's role",
                help: 'Elements must only use allowed ARIA attributes',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-allowed-attr?application=webdriverjs',
                id: 'aria-allowed-attr',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-attr',
                                impact: 'critical',
                                message: 'ARIA attributes are used correctly for the defined role',
                                relatedNodes: [],
                            },
                        ],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'aria-unsupported-attr',
                                impact: 'critical',
                                message: 'ARIA attribute is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#main-nav'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-attr',
                                impact: 'critical',
                                message: 'ARIA attributes are used correctly for the defined role',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=About" id="ablemenu__link_1" aria-owns="ablemenu__sub_1" aria-controls="ablemenu__sub_1" aria-haspopup="true" aria-expanded="false">About</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'aria-unsupported-attr',
                                impact: 'critical',
                                message: 'ARIA attribute is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#ablemenu__link_1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-attr',
                                impact: 'critical',
                                message: 'ARIA attributes are used correctly for the defined role',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Academics" id="ablemenu__link_2" aria-owns="ablemenu__sub_2" aria-controls="ablemenu__sub_2" aria-haspopup="true" aria-expanded="false">Academics</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'aria-unsupported-attr',
                                impact: 'critical',
                                message: 'ARIA attribute is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#ablemenu__link_2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-attr',
                                impact: 'critical',
                                message: 'ARIA attributes are used correctly for the defined role',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Admissions" id="ablemenu__link_3" aria-owns="ablemenu__sub_3" aria-controls="ablemenu__sub_3" aria-haspopup="true" aria-expanded="false">Admissions</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'aria-unsupported-attr',
                                impact: 'critical',
                                message: 'ARIA attribute is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#ablemenu__link_3'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-attr',
                                impact: 'critical',
                                message: 'ARIA attributes are used correctly for the defined role',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Visitors" id="ablemenu__link_4" aria-owns="ablemenu__sub_4" aria-controls="ablemenu__sub_4" aria-haspopup="true" aria-expanded="false">Visitors</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'aria-unsupported-attr',
                                impact: 'critical',
                                message: 'ARIA attribute is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#ablemenu__link_4'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-attr',
                                impact: 'critical',
                                message: 'ARIA attributes are used correctly for the defined role',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'aria-unsupported-attr',
                                impact: 'critical',
                                message: 'ARIA attribute is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#carousel'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-attr',
                                impact: 'critical',
                                message: 'ARIA attributes are used correctly for the defined role',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div class="slide current" aria-live="assertive">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'aria-unsupported-attr',
                                impact: 'critical',
                                message: 'ARIA attribute is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['.current'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-attr',
                                impact: 'critical',
                                message: 'ARIA attributes are used correctly for the defined role',
                                relatedNodes: [],
                            },
                        ],
                        html: '<table id="enrollment" aria-describedby="table-summary">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'aria-unsupported-attr',
                                impact: 'critical',
                                message: 'ARIA attribute is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#enrollment'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-attr',
                                impact: 'critical',
                                message: 'ARIA attributes are used correctly for the defined role',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'aria-unsupported-attr',
                                impact: 'critical',
                                message: 'ARIA attribute is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#appForm'],
                    },
                ],
                tags: ['cat.aria', 'wcag2a', 'wcag412'],
            },
            {
                description: 'Ensures role attribute has an appropriate value for the element',
                help: 'ARIA role must be appropriate for the element',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-allowed-role?application=webdriverjs',
                id: 'aria-allowed-role',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<header role="banner">\n\t    <h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>\n    </header>',
                        impact: null,
                        none: [],
                        target: ['header'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [],
                        target: ['#main-nav'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="nav-help" role="alert">',
                        impact: null,
                        none: [],
                        target: ['#nav-help'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img src="images/help.png" alt="" role="presentation">',
                        impact: null,
                        none: [],
                        target: ['img[src$="help\\.png"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul id="menu" data-able-menu="" role="menubar">',
                        impact: null,
                        none: [],
                        target: ['#menu'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul role="menu" id="ablemenu__sub_1" aria-labelledby="ablemenu__link_1">',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=News">News</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_1 > li[role="menuitem"]:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Governance">Governance</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_1 > li[role="menuitem"]:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Diversity">Diversity</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_1 > li[role="menuitem"]:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Contact%20Us">Contact Us</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_1 > li[role="menuitem"]:nth-child(4)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul role="menu" id="ablemenu__sub_2" aria-labelledby="ablemenu__link_2">',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Degree%20Programs">Degree Programs</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_2 > li[role="menuitem"]:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=AU%20Faculty">AU Faculty</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_2 > li[role="menuitem"]:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Distance%20Learning">Distance Learning</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_2 > li[role="menuitem"]:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Libraries">Libraries</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_2 > li[role="menuitem"]:nth-child(4)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul role="menu" id="ablemenu__sub_3" aria-labelledby="ablemenu__link_3">',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_3'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Undergraduate">Undergraduate</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_3 > li[role="menuitem"]:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Graduate">Graduate</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_3 > li[role="menuitem"]:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Tuition">Tuition</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_3 > li[role="menuitem"]:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Financial%20Aid">Financial Aid</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_3 > li[role="menuitem"]:nth-child(4)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(4)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul role="menu" id="ablemenu__sub_4" aria-labelledby="ablemenu__link_4">',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_4'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Events">Events</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_4 > li[role="menuitem"]:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Campus_Map">Campus Map</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_4 > li[role="menuitem"]:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">\n              <a href="somepage.html?ref=Parking">Parking</a>\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_4 > li[role="menuitem"]:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="errorMsg" role="alert"></div>',
                        impact: null,
                        none: [],
                        target: ['#errorMsg'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<main role="main">',
                        impact: null,
                        none: [],
                        target: ['main'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [],
                        target: ['#carousel'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [],
                        target: ['#appForm'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="feedback" role="alert"></div>',
                        impact: null,
                        none: [],
                        target: ['#feedback'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<footer role="contentinfo">',
                        impact: null,
                        none: [],
                        target: ['footer'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="error" role="alert"></div>',
                        impact: null,
                        none: [],
                        target: ['#error'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-allowed-role',
                                impact: 'minor',
                                message: 'ARIA role is allowed for given element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="modalContent" role="dialog" aria-labelledby="modalHeading">',
                        impact: null,
                        none: [],
                        target: ['#modalContent'],
                    },
                ],
                tags: ['cat.aria', 'best-practice'],
            },
            {
                description: "Ensures aria-hidden='true' is not present on the document body.",
                help: "aria-hidden='true' must not be present on the document body",
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-hidden-body?application=webdriverjs',
                id: 'aria-hidden-body',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-hidden-body',
                                impact: 'critical',
                                message: 'No aria-hidden attribute is present on document body',
                                relatedNodes: [],
                            },
                        ],
                        html: '<body>',
                        impact: null,
                        none: [],
                        target: ['body'],
                    },
                ],
                tags: ['cat.aria', 'wcag2a', 'wcag412'],
            },
            {
                description: 'Ensures elements with ARIA roles have all required ARIA attributes',
                help: 'Required ARIA attributes must be provided',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-required-attr?application=webdriverjs',
                id: 'aria-required-attr',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<header role="banner">\n\t    <h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>\n    </header>',
                        impact: null,
                        none: [],
                        target: ['header'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [],
                        target: ['#main-nav'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img src="images/help.png" alt="" role="presentation">',
                        impact: null,
                        none: [],
                        target: ['img[src$="help\\.png"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul id="menu" data-able-menu="" role="menubar">',
                        impact: null,
                        none: [],
                        target: ['#menu'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(4)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<main role="main">',
                        impact: null,
                        none: [],
                        target: ['main'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [],
                        target: ['#carousel'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [],
                        target: ['#appForm'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<footer role="contentinfo">',
                        impact: null,
                        none: [],
                        target: ['footer'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-attr',
                                impact: 'critical',
                                message: 'All required ARIA attributes are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="error" role="alert"></div>',
                        impact: null,
                        none: [],
                        target: ['#error'],
                    },
                ],
                tags: ['cat.aria', 'wcag2a', 'wcag412'],
            },
            {
                description:
                    'Ensures elements with an ARIA role that require child roles contain them',
                help: 'Certain ARIA roles must contain particular children',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-required-children?application=webdriverjs',
                id: 'aria-required-children',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<header role="banner">\n\t    <h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>\n    </header>',
                        impact: null,
                        none: [],
                        target: ['header'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [],
                        target: ['#main-nav'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img src="images/help.png" alt="" role="presentation">',
                        impact: null,
                        none: [],
                        target: ['img[src$="help\\.png"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul id="menu" data-able-menu="" role="menubar">',
                        impact: null,
                        none: [],
                        target: ['#menu'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(4)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<main role="main">',
                        impact: null,
                        none: [],
                        target: ['main'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [],
                        target: ['#carousel'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [],
                        target: ['#appForm'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<footer role="contentinfo">',
                        impact: null,
                        none: [],
                        target: ['footer'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-children',
                                impact: 'critical',
                                message: 'Required ARIA children are present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="error" role="alert"></div>',
                        impact: null,
                        none: [],
                        target: ['#error'],
                    },
                ],
                tags: ['cat.aria', 'wcag2a', 'wcag131'],
            },
            {
                description:
                    'Ensures elements with an ARIA role that require parent roles are contained by them',
                help: 'Certain ARIA roles must be contained by particular parents',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-required-parent?application=webdriverjs',
                id: 'aria-required-parent',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<header role="banner">\n\t    <h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>\n    </header>',
                        impact: null,
                        none: [],
                        target: ['header'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [],
                        target: ['#main-nav'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img src="images/help.png" alt="" role="presentation">',
                        impact: null,
                        none: [],
                        target: ['img[src$="help\\.png"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul id="menu" data-able-menu="" role="menubar">',
                        impact: null,
                        none: [],
                        target: ['#menu'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [],
                        target: ['#menu > li[role="menuitem"]:nth-child(4)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<main role="main">',
                        impact: null,
                        none: [],
                        target: ['main'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [],
                        target: ['#carousel'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [],
                        target: ['#appForm'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<footer role="contentinfo">',
                        impact: null,
                        none: [],
                        target: ['footer'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-required-parent',
                                impact: 'critical',
                                message: 'Required ARIA parent role present',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="error" role="alert"></div>',
                        impact: null,
                        none: [],
                        target: ['#error'],
                    },
                ],
                tags: ['cat.aria', 'wcag2a', 'wcag131'],
            },
            {
                description: 'Ensures all elements with a role attribute use a valid value',
                help: 'ARIA roles used must conform to valid values',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-roles?application=webdriverjs',
                id: 'aria-roles',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [],
                        html: '<header role="banner">\n\t    <h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>\n    </header>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['header'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#main-nav'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<img src="images/help.png" alt="" role="presentation">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[src$="help\\.png"]'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<ul id="menu" data-able-menu="" role="menubar">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#menu'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#menu > li[role="menuitem"]:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#menu > li[role="menuitem"]:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#menu > li[role="menuitem"]:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<li role="menuitem">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#menu > li[role="menuitem"]:nth-child(4)'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<main role="main">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['main'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#carousel'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#appForm'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<footer role="contentinfo">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['footer'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<div id="error" role="alert"></div>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'invalidrole',
                                impact: 'critical',
                                message: 'ARIA role is valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'abstractrole',
                                impact: 'serious',
                                message: 'Abstract roles are not used',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'unsupportedrole',
                                impact: 'critical',
                                message: 'ARIA role is supported',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#error'],
                    },
                ],
                tags: ['cat.aria', 'wcag2a', 'wcag412'],
            },
            {
                description: 'Ensures all ARIA attributes have valid values',
                help: 'ARIA attributes must conform to valid values',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-valid-attr-value?application=webdriverjs',
                id: 'aria-valid-attr-value',
                impact: null,
                nodes: [
                    {
                        all: [
                            {
                                data: null,
                                id: 'aria-valid-attr-value',
                                impact: 'critical',
                                message: 'ARIA attribute values are valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'aria-errormessage',
                                impact: 'critical',
                                message: 'Uses a supported aria-errormessage technique',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [],
                        target: ['#main-nav'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'aria-valid-attr-value',
                                impact: 'critical',
                                message: 'ARIA attribute values are valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'aria-errormessage',
                                impact: 'critical',
                                message: 'Uses a supported aria-errormessage technique',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<a href="somepage.html?ref=About" id="ablemenu__link_1" aria-owns="ablemenu__sub_1" aria-controls="ablemenu__sub_1" aria-haspopup="true" aria-expanded="false">About</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_1'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'aria-valid-attr-value',
                                impact: 'critical',
                                message: 'ARIA attribute values are valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'aria-errormessage',
                                impact: 'critical',
                                message: 'Uses a supported aria-errormessage technique',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<a href="somepage.html?ref=Academics" id="ablemenu__link_2" aria-owns="ablemenu__sub_2" aria-controls="ablemenu__sub_2" aria-haspopup="true" aria-expanded="false">Academics</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_2'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'aria-valid-attr-value',
                                impact: 'critical',
                                message: 'ARIA attribute values are valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'aria-errormessage',
                                impact: 'critical',
                                message: 'Uses a supported aria-errormessage technique',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<a href="somepage.html?ref=Admissions" id="ablemenu__link_3" aria-owns="ablemenu__sub_3" aria-controls="ablemenu__sub_3" aria-haspopup="true" aria-expanded="false">Admissions</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_3'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'aria-valid-attr-value',
                                impact: 'critical',
                                message: 'ARIA attribute values are valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'aria-errormessage',
                                impact: 'critical',
                                message: 'Uses a supported aria-errormessage technique',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<a href="somepage.html?ref=Visitors" id="ablemenu__link_4" aria-owns="ablemenu__sub_4" aria-controls="ablemenu__sub_4" aria-haspopup="true" aria-expanded="false">Visitors</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_4'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'aria-valid-attr-value',
                                impact: 'critical',
                                message: 'ARIA attribute values are valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'aria-errormessage',
                                impact: 'critical',
                                message: 'Uses a supported aria-errormessage technique',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [],
                        target: ['#carousel'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'aria-valid-attr-value',
                                impact: 'critical',
                                message: 'ARIA attribute values are valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'aria-errormessage',
                                impact: 'critical',
                                message: 'Uses a supported aria-errormessage technique',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<div class="slide current" aria-live="assertive">',
                        impact: null,
                        none: [],
                        target: ['.current'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'aria-valid-attr-value',
                                impact: 'critical',
                                message: 'ARIA attribute values are valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'aria-errormessage',
                                impact: 'critical',
                                message: 'Uses a supported aria-errormessage technique',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<table id="enrollment" aria-describedby="table-summary">',
                        impact: null,
                        none: [],
                        target: ['#enrollment'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'aria-valid-attr-value',
                                impact: 'critical',
                                message: 'ARIA attribute values are valid',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'aria-errormessage',
                                impact: 'critical',
                                message: 'Uses a supported aria-errormessage technique',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [],
                        target: ['#appForm'],
                    },
                ],
                tags: ['cat.aria', 'wcag2a', 'wcag412'],
            },
            {
                description: 'Ensures attributes that begin with aria- are valid ARIA attributes',
                help: 'ARIA attributes must conform to valid names',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/aria-valid-attr?application=webdriverjs',
                id: 'aria-valid-attr',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-valid-attr',
                                impact: 'critical',
                                message: 'ARIA attribute name are valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [],
                        target: ['#main-nav'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-valid-attr',
                                impact: 'critical',
                                message: 'ARIA attribute name are valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=About" id="ablemenu__link_1" aria-owns="ablemenu__sub_1" aria-controls="ablemenu__sub_1" aria-haspopup="true" aria-expanded="false">About</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-valid-attr',
                                impact: 'critical',
                                message: 'ARIA attribute name are valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Academics" id="ablemenu__link_2" aria-owns="ablemenu__sub_2" aria-controls="ablemenu__sub_2" aria-haspopup="true" aria-expanded="false">Academics</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-valid-attr',
                                impact: 'critical',
                                message: 'ARIA attribute name are valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Admissions" id="ablemenu__link_3" aria-owns="ablemenu__sub_3" aria-controls="ablemenu__sub_3" aria-haspopup="true" aria-expanded="false">Admissions</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_3'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-valid-attr',
                                impact: 'critical',
                                message: 'ARIA attribute name are valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Visitors" id="ablemenu__link_4" aria-owns="ablemenu__sub_4" aria-controls="ablemenu__sub_4" aria-haspopup="true" aria-expanded="false">Visitors</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_4'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-valid-attr',
                                impact: 'critical',
                                message: 'ARIA attribute name are valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [],
                        target: ['#carousel'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-valid-attr',
                                impact: 'critical',
                                message: 'ARIA attribute name are valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div class="slide current" aria-live="assertive">',
                        impact: null,
                        none: [],
                        target: ['.current'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-valid-attr',
                                impact: 'critical',
                                message: 'ARIA attribute name are valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<table id="enrollment" aria-describedby="table-summary">',
                        impact: null,
                        none: [],
                        target: ['#enrollment'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'aria-valid-attr',
                                impact: 'critical',
                                message: 'ARIA attribute name are valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [],
                        target: ['#appForm'],
                    },
                ],
                tags: ['cat.aria', 'wcag2a', 'wcag412'],
            },
            {
                description:
                    'Ensure that text spacing set through style attributes can be adjusted with custom stylesheets',
                help: 'Inline text spacing must be adjustable with custom stylesheets',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/avoid-inline-spacing?application=webdriverjs',
                id: 'avoid-inline-spacing',
                impact: null,
                nodes: [
                    {
                        all: [
                            {
                                data: null,
                                id: 'avoid-inline-spacing',
                                impact: 'serious',
                                message:
                                    "No inline styles with '!important' that affect text spacing has been specified",
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<td style="width:6em">&nbsp;</td>',
                        impact: null,
                        none: [],
                        target: ['thead > tr:nth-child(1) > td'],
                    },
                ],
                tags: ['wcag21aa', 'wcag1412'],
            },
            {
                description: 'Ensures buttons have discernible text',
                help: 'Buttons must have discernible text',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/button-name?application=webdriverjs',
                id: 'button-name',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: 'Show menu keyboard shortcuts',
                                id: 'button-has-visible-text',
                                impact: 'critical',
                                message: 'Element has inner text that is visible to screen readers',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'non-empty-title',
                                impact: 'serious',
                                message: 'Element has a title attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button type="button" title="Show menu keyboard shortcuts"><img src="images/help.png" alt="" role="presentation"></button>',
                        impact: null,
                        none: [],
                        target: ['button[title="Show\\ menu\\ keyboard\\ shortcuts"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'Previous slide',
                                id: 'button-has-visible-text',
                                impact: 'critical',
                                message: 'Element has inner text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button type="button" class="btn-prev"><img src="images/arrow-left.png" alt="Previous slide"></button>',
                        impact: null,
                        none: [],
                        target: ['.btn-prev'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'Next slide',
                                id: 'button-has-visible-text',
                                impact: 'critical',
                                message: 'Element has inner text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button type="button" class="btn-next"><img src="images/arrow-right.png" alt="Next slide"></button>',
                        impact: null,
                        none: [],
                        target: ['.btn-next'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'Slide 1(current slide)',
                                id: 'button-has-visible-text',
                                impact: 'critical',
                                message: 'Element has inner text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button data-slide="0"><span class="clipped">Slide </span> 1<span class="clipped current-slide">(current slide)</span></button>',
                        impact: null,
                        none: [],
                        target: ['button[data-slide="\\30 "]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'Slide 2',
                                id: 'button-has-visible-text',
                                impact: 'critical',
                                message: 'Element has inner text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button data-slide="1"><span class="clipped">Slide </span> 2</button>',
                        impact: null,
                        none: [],
                        target: ['button[data-slide="\\31 "]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'Slide 3',
                                id: 'button-has-visible-text',
                                impact: 'critical',
                                message: 'Element has inner text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button data-slide="2"><span class="clipped">Slide </span> 3</button>',
                        impact: null,
                        none: [],
                        target: ['button[data-slide="\\32 "]'],
                    },
                ],
                tags: ['cat.name-role-value', 'wcag2a', 'wcag412', 'section508', 'section508.22.a'],
            },
            {
                description:
                    'Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content',
                help: 'Page must have means to bypass repeated blocks',
                helpUrl: 'https://dequeuniversity.com/rules/axe/3.3/bypass?application=webdriverjs',
                id: 'bypass',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'header-present',
                                impact: 'serious',
                                message: 'Page has a header',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'landmark',
                                impact: 'serious',
                                message: 'Page has a landmark region',
                                relatedNodes: [],
                            },
                        ],
                        html: '<html lang="en" class="deque-axe-is-ready">',
                        impact: null,
                        none: [],
                        target: ['html'],
                    },
                ],
                tags: ['cat.keyboard', 'wcag2a', 'wcag241', 'section508', 'section508.22.o'],
            },
            {
                description:
                    'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
                help: 'Elements must have sufficient color contrast',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/color-contrast?application=webdriverjs',
                id: 'color-contrast',
                impact: 'serious',
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#e7ecd8',
                                    contrastRatio: 4.8,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#5a667a',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 4.8',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=About" id="ablemenu__link_1" aria-owns="ablemenu__sub_1" aria-controls="ablemenu__sub_1" aria-haspopup="true" aria-expanded="false">About</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#e7ecd8',
                                    contrastRatio: 4.8,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#5a667a',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 4.8',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Academics" id="ablemenu__link_2" aria-owns="ablemenu__sub_2" aria-controls="ablemenu__sub_2" aria-haspopup="true" aria-expanded="false">Academics</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#e7ecd8',
                                    contrastRatio: 4.8,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#5a667a',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 4.8',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Admissions" id="ablemenu__link_3" aria-owns="ablemenu__sub_3" aria-controls="ablemenu__sub_3" aria-haspopup="true" aria-expanded="false">Admissions</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_3'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#e7ecd8',
                                    contrastRatio: 4.8,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#5a667a',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 4.8',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Visitors" id="ablemenu__link_4" aria-owns="ablemenu__sub_4" aria-controls="ablemenu__sub_4" aria-haspopup="true" aria-expanded="false">Visitors</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_4'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#000000',
                                    contrastRatio: 13.07,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#cccccc',
                                    fontSize: '18.0pt (24px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.07',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div class="description">\n            AU installs universally designed maps at multiple locations on campus.\n            See all <a href="somepage.html?ref=Slide%201">campus map locations</a>.\n          </div>',
                        impact: null,
                        none: [],
                        target: ['.current > .description'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#000000',
                                    contrastRatio: 13.07,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#cccccc',
                                    fontSize: '18.0pt (24px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.07',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Slide%201">campus map locations</a>',
                        impact: null,
                        none: [],
                        target: [
                            '.current > .description > a[href="somepage\\.html\\?ref\\=Slide\\%201"]',
                        ],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffff99',
                                    contrastRatio: 12.04,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#333333',
                                    fontSize: '18.0pt (24px)',
                                    fontWeight: 'bold',
                                    missingData: 'shortTextContent',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 12.04',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button data-slide="0"><span class="clipped">Slide </span> 1<span class="clipped current-slide">(current slide)</span></button>',
                        impact: null,
                        none: [],
                        target: ['button[data-slide="\\30 "]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#003366',
                                    contrastRatio: 12.6,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#ffffff',
                                    fontSize: '18.0pt (24px)',
                                    fontWeight: 'bold',
                                    missingData: 'shortTextContent',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 12.6',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button data-slide="1"><span class="clipped">Slide </span> 2</button>',
                        impact: null,
                        none: [],
                        target: ['button[data-slide="\\31 "]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#003366',
                                    contrastRatio: 12.6,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#ffffff',
                                    fontSize: '18.0pt (24px)',
                                    fontWeight: 'bold',
                                    missingData: 'shortTextContent',
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 12.6',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button data-slide="2"><span class="clipped">Slide </span> 3</button>',
                        impact: null,
                        none: [],
                        target: ['button[data-slide="\\32 "]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#000000',
                                    fontSize: '19.2pt (25.6px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2>AU Enrollment Trends</h2>',
                        impact: null,
                        none: [],
                        target: ['.section:nth-child(5) > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="y07-08" colspan="6">2007-08</th>',
                        impact: null,
                        none: [],
                        target: ['#y07-08'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="y08-09" colspan="6">2008-09</th>',
                        impact: null,
                        none: [],
                        target: ['#y08-09'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Computer Science">CS</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-cs1 > abbr[title="Computer\\ Science"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="English">Eng</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-eng1 > abbr[title="English"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Economics">Eco</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-eco1 > abbr[title="Economics"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Physics">Phy</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-phy1 > abbr[title="Physics"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Psychology">Psy</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-psy1 > abbr[title="Psychology"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Spanish">Spa</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-spa1 > abbr[title="Spanish"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Computer Science">CS</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-cs2 > abbr[title="Computer\\ Science"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="English">Eng</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-eng2 > abbr[title="English"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Economics">Eco</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-eco2 > abbr[title="Economics"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Physics">Phy</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-phy2 > abbr[title="Physics"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Psychology">Psy</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-psy2 > abbr[title="Psychology"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<abbr title="Spanish">Spa</abbr>',
                        impact: null,
                        none: [],
                        target: ['#subj-spa2 > abbr[title="Spanish"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="row" id="total">Total</th>',
                        impact: null,
                        none: [],
                        target: ['#total'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-cs1 total">84</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-cs1\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-eng1 total">126</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-eng1\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-eco1 total">43</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-eco1\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-phy1 total">32</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-phy1\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-psy1 total">112</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-psy1\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-spa1 total">59</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-spa1\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-cs2 total">82</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-cs2\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-eng2 total">140</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-eng2\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-eco2 total">45</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-eco2\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-phy2 total">34</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-phy2\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-psy2 total">101</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-psy2\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-spa2 total">64</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-spa2\\ total"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="row" id="male">% Male</th>',
                        impact: null,
                        none: [],
                        target: ['#male'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-cs1 male">89</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-cs1\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-eng1 male">84</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-eng1\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-eco1 male">73</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-eco1\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-phy1 male">69</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-phy1\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-psy1 male">20</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-psy1\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-spa1 male">47</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-spa1\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-cs2 male">87</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-cs2\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-eng2 male">80</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-eng2\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-eco2 male">69</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-eco2\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-phy2 male">69</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-phy2\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-psy2 male">22</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-psy2\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-spa2 male">48</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-spa2\\ male"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="row" id="female">% Female</th>',
                        impact: null,
                        none: [],
                        target: ['#female'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-cs1 female">11</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-cs1\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-eng1 female">16</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-eng1\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-eco1 female">27</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-eco1\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-phy1 female">31</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-phy1\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-psy1 female">80</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-psy1\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y07-08 subj-spa1 female">53</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y07-08\\ subj-spa1\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-cs2 female">13</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-cs2\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-eng2 female">20</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-eng2\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-eco2 female">31</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-eco2\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-phy2 female">31</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-phy2\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-psy2 female">78</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-psy2\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<td headers="y08-09 subj-spa2 female">52</td>',
                        impact: null,
                        none: [],
                        target: ['td[headers="y08-09\\ subj-spa2\\ female"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#000000',
                                    fontSize: '19.2pt (25.6px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2 id="appFormHeading">Apply Now!</h2>',
                        impact: null,
                        none: [],
                        target: ['#appFormHeading'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="name">Name: (required)</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="name"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.0pt (13.3333px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="name" type="text" name="name" required="">',
                        impact: null,
                        none: [],
                        target: ['#name'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="email">Email: (required)</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="email"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.0pt (13.3333px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="email" type="email" name="email" required="">',
                        impact: null,
                        none: [],
                        target: ['#email'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="city">City:</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="city"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.0pt (13.3333px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="city" id="city">',
                        impact: null,
                        none: [],
                        target: ['#city'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="state">State/Province:</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="state"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.0pt (13.3333px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="state" id="state">',
                        impact: null,
                        none: [],
                        target: ['#state'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="zip">Zip/Postal Code:</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="zip"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.0pt (13.3333px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="zip" id="zip">',
                        impact: null,
                        none: [],
                        target: ['#zip'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="country">Country:</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="country"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.0pt (13.3333px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="country" id="country">',
                        impact: null,
                        none: [],
                        target: ['#country'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<legend>Desired major(s):</legend>',
                        impact: null,
                        none: [],
                        target: ['legend'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="cs">Computer Science</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="cs"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="eng">Engineering</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="eng"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="eco">Economics</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="eco"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="phy">Physics</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="phy"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="psy">Psychology</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="psy"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label for="spa">Spanish</label>',
                        impact: null,
                        none: [],
                        target: ['label[for="spa"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '3:1',
                                    fgColor: '#000000',
                                    fontSize: '14.4pt (19.2px)',
                                    fontWeight: 'bold',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h3>Security Question</h3>',
                        impact: null,
                        none: [],
                        target: ['h3'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#cccce0',
                                    contrastRatio: 13.28,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '12.0pt (16px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13.28',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label id="captcha_label" for="captcha_answer">2 plus two equals </label>',
                        impact: null,
                        none: [],
                        target: ['#captcha_label'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.0pt (13.3333px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="captcha_answer" name="captcha_answer" type="text" required="required">',
                        impact: null,
                        none: [],
                        target: ['#captcha_answer'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#dddddd',
                                    contrastRatio: 15.46,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.0pt (13.3333px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 15.46',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="submit" type="submit" name="submit" value="Submit">',
                        impact: null,
                        none: [],
                        target: ['#submit'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.8pt (14.4px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<footer role="contentinfo">',
                        impact: null,
                        none: [],
                        target: ['footer'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 13,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#39275b',
                                    fontSize: '10.8pt (14.4px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="http://washington.edu/accesscomputing/AU">University of Washington</a>',
                        impact: null,
                        none: [],
                        target: ['footer > a:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 13,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#39275b',
                                    fontSize: '10.8pt (14.4px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 13',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>',
                        impact: null,
                        none: [],
                        target: ['footer > a[rel="license"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    bgColor: '#ffffff',
                                    contrastRatio: 21,
                                    expectedContrastRatio: '4.5:1',
                                    fgColor: '#000000',
                                    fontSize: '10.8pt (14.4px)',
                                    fontWeight: 'normal',
                                    missingData: null,
                                },
                                id: 'color-contrast',
                                impact: 'serious',
                                message: 'Element has sufficient color contrast of 21',
                                relatedNodes: [],
                            },
                        ],
                        html: '<p>',
                        impact: null,
                        none: [],
                        target: ['footer > p'],
                    },
                ],
                tags: ['cat.color', 'wcag2aa', 'wcag143'],
            },
            {
                description: 'Ensures each HTML document contains a non-empty <title> element',
                help: 'Documents must have <title> element to aid in navigation',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/document-title?application=webdriverjs',
                id: 'document-title',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'doc-has-title',
                                impact: 'serious',
                                message: 'Document has a non-empty <title> element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<html lang="en" class="deque-axe-is-ready">',
                        impact: null,
                        none: [],
                        target: ['html'],
                    },
                ],
                tags: ['cat.text-alternatives', 'wcag2a', 'wcag242'],
            },
            {
                description: 'Ensures every id attribute value of active elements is unique',
                help: 'IDs of active elements must be unique',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/duplicate-id-active?application=webdriverjs',
                id: 'duplicate-id-active',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: 'submit',
                                id: 'duplicate-id-active',
                                impact: 'serious',
                                message:
                                    'Document has no active elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="submit" type="submit" name="submit" value="Submit">',
                        impact: null,
                        none: [],
                        target: ['#submit'],
                    },
                ],
                tags: ['cat.parsing', 'wcag2a', 'wcag411'],
            },
            {
                description:
                    'Ensures every id attribute value used in ARIA and in labels is unique',
                help: 'IDs used in ARIA and labels must be unique',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/duplicate-id-aria?application=webdriverjs',
                id: 'duplicate-id-aria',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: 'ablemenu__link_1',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=About" id="ablemenu__link_1" aria-owns="ablemenu__sub_1" aria-controls="ablemenu__sub_1" aria-haspopup="true" aria-expanded="false">About</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'ablemenu__sub_1',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul role="menu" id="ablemenu__sub_1" aria-labelledby="ablemenu__link_1">',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'ablemenu__link_2',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Academics" id="ablemenu__link_2" aria-owns="ablemenu__sub_2" aria-controls="ablemenu__sub_2" aria-haspopup="true" aria-expanded="false">Academics</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'ablemenu__sub_2',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul role="menu" id="ablemenu__sub_2" aria-labelledby="ablemenu__link_2">',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'ablemenu__link_3',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Admissions" id="ablemenu__link_3" aria-owns="ablemenu__sub_3" aria-controls="ablemenu__sub_3" aria-haspopup="true" aria-expanded="false">Admissions</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_3'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'ablemenu__sub_3',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul role="menu" id="ablemenu__sub_3" aria-labelledby="ablemenu__link_3">',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_3'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'ablemenu__link_4',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Visitors" id="ablemenu__link_4" aria-owns="ablemenu__sub_4" aria-controls="ablemenu__sub_4" aria-haspopup="true" aria-expanded="false">Visitors</a>',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__link_4'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'ablemenu__sub_4',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul role="menu" id="ablemenu__sub_4" aria-labelledby="ablemenu__link_4">',
                        impact: null,
                        none: [],
                        target: ['#ablemenu__sub_4'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'carouselHeading',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2 id="carouselHeading" class="clipped">Featured Story Slideshow</h2>',
                        impact: null,
                        none: [],
                        target: ['#carouselHeading'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'table-summary',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="table-summary" class="clipped">',
                        impact: null,
                        none: [],
                        target: ['#table-summary'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'appFormHeading',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2 id="appFormHeading">Apply Now!</h2>',
                        impact: null,
                        none: [],
                        target: ['#appFormHeading'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'name',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="name" type="text" name="name" required="">',
                        impact: null,
                        none: [],
                        target: ['#name'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'email',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="email" type="email" name="email" required="">',
                        impact: null,
                        none: [],
                        target: ['#email'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'city',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="city" id="city">',
                        impact: null,
                        none: [],
                        target: ['#city'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'state',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="state" id="state">',
                        impact: null,
                        none: [],
                        target: ['#state'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'zip',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="zip" id="zip">',
                        impact: null,
                        none: [],
                        target: ['#zip'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'country',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="country" id="country">',
                        impact: null,
                        none: [],
                        target: ['#country'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'cs',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_cs" id="cs">',
                        impact: null,
                        none: [],
                        target: ['#cs'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'eng',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_eng" id="eng">',
                        impact: null,
                        none: [],
                        target: ['#eng'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'eco',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_econ" id="eco">',
                        impact: null,
                        none: [],
                        target: ['#eco'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'phy',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_phy" id="phy">',
                        impact: null,
                        none: [],
                        target: ['#phy'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'psy',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_psy" id="psy">',
                        impact: null,
                        none: [],
                        target: ['#psy'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'spa',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_sp" id="spa">',
                        impact: null,
                        none: [],
                        target: ['#spa'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'captcha_answer',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="captcha_answer" name="captcha_answer" type="text" required="required">',
                        impact: null,
                        none: [],
                        target: ['#captcha_answer'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'modalHeading',
                                id: 'duplicate-id-aria',
                                impact: 'critical',
                                message:
                                    'Document has no elements referenced with ARIA or labels that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h1 id="modalHeading">Eighteen Accessibility Issues</h1>',
                        impact: null,
                        none: [],
                        target: ['#modalHeading'],
                    },
                ],
                tags: ['cat.parsing', 'wcag2a', 'wcag411'],
            },
            {
                description: 'Ensures every id attribute value is unique',
                help: 'id attribute value must be unique',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/duplicate-id?application=webdriverjs',
                id: 'duplicate-id',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: 'content',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="content">',
                        impact: null,
                        none: [],
                        target: ['#content'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'logo',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">',
                        impact: null,
                        none: [],
                        target: ['#logo'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'main-nav',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [],
                        target: ['#main-nav'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'nav-help',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="nav-help" role="alert">',
                        impact: null,
                        none: [],
                        target: ['#nav-help'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'menu',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<ul id="menu" data-able-menu="" role="menubar">',
                        impact: null,
                        none: [],
                        target: ['#menu'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'errorMsg',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="errorMsg" role="alert"></div>',
                        impact: null,
                        none: [],
                        target: ['#errorMsg'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'carousel',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [],
                        target: ['#carousel'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'enrollment',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<table id="enrollment" aria-describedby="table-summary">',
                        impact: null,
                        none: [],
                        target: ['#enrollment'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'y07-08',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="y07-08" colspan="6">2007-08</th>',
                        impact: null,
                        none: [],
                        target: ['#y07-08'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'y08-09',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="y08-09" colspan="6">2008-09</th>',
                        impact: null,
                        none: [],
                        target: ['#y08-09'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-cs1',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-cs1"><abbr title="Computer Science">CS</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-cs1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-eng1',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-eng1"><abbr title="English">Eng</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-eng1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-eco1',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-eco1"><abbr title="Economics">Eco</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-eco1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-phy1',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-phy1"><abbr title="Physics">Phy</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-phy1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-psy1',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-psy1"><abbr title="Psychology">Psy</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-psy1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-spa1',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-spa1"><abbr title="Spanish">Spa</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-spa1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-cs2',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-cs2"><abbr title="Computer Science">CS</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-cs2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-eng2',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-eng2"><abbr title="English">Eng</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-eng2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-eco2',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-eco2"><abbr title="Economics">Eco</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-eco2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-phy2',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-phy2"><abbr title="Physics">Phy</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-phy2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-psy2',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-psy2"><abbr title="Psychology">Psy</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-psy2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'subj-spa2',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="col" id="subj-spa2"><abbr title="Spanish">Spa</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-spa2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'total',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="row" id="total">Total</th>',
                        impact: null,
                        none: [],
                        target: ['#total'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'male',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="row" id="male">% Male</th>',
                        impact: null,
                        none: [],
                        target: ['#male'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'female',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<th scope="row" id="female">% Female</th>',
                        impact: null,
                        none: [],
                        target: ['#female'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'appForm',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [],
                        target: ['#appForm'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'feedback',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="feedback" role="alert"></div>',
                        impact: null,
                        none: [],
                        target: ['#feedback'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'majors',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<fieldset id="majors">',
                        impact: null,
                        none: [],
                        target: ['#majors'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'captcha',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="captcha"><h3>Security Question</h3><label id="captcha_label" for="captcha_answer">2 plus two equals </label><input id="captcha_answer" name="captcha_answer" type="text" required="required"></div>',
                        impact: null,
                        none: [],
                        target: ['#captcha'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'captcha_label',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<label id="captcha_label" for="captcha_answer">2 plus two equals </label>',
                        impact: null,
                        none: [],
                        target: ['#captcha_label'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'ccLogo',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="ccLogo">\n        <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"></a>\n      </div>',
                        impact: null,
                        none: [],
                        target: ['#ccLogo'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'error',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="error" role="alert"></div>',
                        impact: null,
                        none: [],
                        target: ['#error'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'modalMask',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="modalMask"></div>',
                        impact: null,
                        none: [],
                        target: ['#modalMask'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'modalContent',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="modalContent" role="dialog" aria-labelledby="modalHeading">',
                        impact: null,
                        none: [],
                        target: ['#modalContent'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'modalXButton',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button type="button" id="modalXButton" aria-label="Close dialog">x</button>',
                        impact: null,
                        none: [],
                        target: ['#modalXButton'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 'modalOkButton',
                                id: 'duplicate-id',
                                impact: 'minor',
                                message:
                                    'Document has no static elements that share the same id attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<button type="button" id="modalOkButton">OK</button>',
                        impact: null,
                        none: [],
                        target: ['#modalOkButton'],
                    },
                ],
                tags: ['cat.parsing', 'wcag2a', 'wcag411'],
            },
            {
                description: 'Ensures headings have discernible text',
                help: 'Headings must not be empty',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/empty-heading?application=webdriverjs',
                id: 'empty-heading',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>',
                        impact: null,
                        none: [],
                        target: ['header > h1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2 id="carouselHeading" class="clipped">Featured Story Slideshow</h2>',
                        impact: null,
                        none: [],
                        target: ['#carouselHeading'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2>Welcome!</h2>',
                        impact: null,
                        none: [],
                        target: ['.section:nth-child(2) > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2>Bienvenido!</h2>',
                        impact: null,
                        none: [],
                        target: ['.section[lang="es"] > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2>Can you spot the barriers?</h2>',
                        impact: null,
                        none: [],
                        target: ['.section:nth-child(4) > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2>AU Enrollment Trends</h2>',
                        impact: null,
                        none: [],
                        target: ['.section:nth-child(5) > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2 id="appFormHeading">Apply Now!</h2>',
                        impact: null,
                        none: [],
                        target: ['#appFormHeading'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h3>Security Question</h3>',
                        impact: null,
                        none: [],
                        target: ['h3'],
                    },
                ],
                tags: ['cat.name-role-value', 'best-practice'],
            },
            {
                description: 'Ensures form field does not have multiple label elements',
                help: 'Form field must not have multiple label elements',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/form-field-multiple-labels?application=webdriverjs',
                id: 'form-field-multiple-labels',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [],
                        html: '<input id="name" type="text" name="name" required="">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="name">Name: (required)</label>',
                                        target: ['label[for="name"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#name'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input id="email" type="email" name="email" required="">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="email">Email: (required)</label>',
                                        target: ['label[for="email"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#email'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="text" name="city" id="city">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="city">City:</label>',
                                        target: ['label[for="city"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#city'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="text" name="state" id="state">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="state">State/Province:</label>',
                                        target: ['label[for="state"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#state'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="text" name="zip" id="zip">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="zip">Zip/Postal Code:</label>',
                                        target: ['label[for="zip"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#zip'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="text" name="country" id="country">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="country">Country:</label>',
                                        target: ['label[for="country"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#country'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_cs" id="cs">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="cs">Computer Science</label>',
                                        target: ['label[for="cs"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#cs'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_eng" id="eng">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="eng">Engineering</label>',
                                        target: ['label[for="eng"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#eng'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_econ" id="eco">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="eco">Economics</label>',
                                        target: ['label[for="eco"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#eco'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_phy" id="phy">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="phy">Physics</label>',
                                        target: ['label[for="phy"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#phy'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_psy" id="psy">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="psy">Psychology</label>',
                                        target: ['label[for="psy"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#psy'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_sp" id="spa">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label for="spa">Spanish</label>',
                                        target: ['label[for="spa"]'],
                                    },
                                ],
                            },
                        ],
                        target: ['#spa'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input id="captcha_answer" name="captcha_answer" type="text" required="required">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'multiple-label',
                                impact: 'moderate',
                                message: 'Form field does not have multiple label elements',
                                relatedNodes: [
                                    {
                                        html: '<label id="captcha_label" for="captcha_answer">2 plus two equals </label>',
                                        target: ['#captcha_label'],
                                    },
                                ],
                            },
                        ],
                        target: ['#captcha_answer'],
                    },
                ],
                tags: ['cat.forms', 'wcag2a', 'wcag332'],
            },
            {
                description: 'Ensures the order of headings is semantically correct',
                help: 'Heading levels should only increase by one',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/heading-order?application=webdriverjs',
                id: 'heading-order',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: 1,
                                id: 'heading-order',
                                impact: 'moderate',
                                message: 'Heading order valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>',
                        impact: null,
                        none: [],
                        target: ['header > h1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 2,
                                id: 'heading-order',
                                impact: 'moderate',
                                message: 'Heading order valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2 id="carouselHeading" class="clipped">Featured Story Slideshow</h2>',
                        impact: null,
                        none: [],
                        target: ['#carouselHeading'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 2,
                                id: 'heading-order',
                                impact: 'moderate',
                                message: 'Heading order valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2>Welcome!</h2>',
                        impact: null,
                        none: [],
                        target: ['.section:nth-child(2) > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 2,
                                id: 'heading-order',
                                impact: 'moderate',
                                message: 'Heading order valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2>Bienvenido!</h2>',
                        impact: null,
                        none: [],
                        target: ['.section[lang="es"] > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 2,
                                id: 'heading-order',
                                impact: 'moderate',
                                message: 'Heading order valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2>Can you spot the barriers?</h2>',
                        impact: null,
                        none: [],
                        target: ['.section:nth-child(4) > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 2,
                                id: 'heading-order',
                                impact: 'moderate',
                                message: 'Heading order valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2>AU Enrollment Trends</h2>',
                        impact: null,
                        none: [],
                        target: ['.section:nth-child(5) > h2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 2,
                                id: 'heading-order',
                                impact: 'moderate',
                                message: 'Heading order valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h2 id="appFormHeading">Apply Now!</h2>',
                        impact: null,
                        none: [],
                        target: ['#appFormHeading'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: 3,
                                id: 'heading-order',
                                impact: 'moderate',
                                message: 'Heading order valid',
                                relatedNodes: [],
                            },
                        ],
                        html: '<h3>Security Question</h3>',
                        impact: null,
                        none: [],
                        target: ['h3'],
                    },
                ],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description: 'Ensures every HTML document has a lang attribute',
                help: '<html> element must have a lang attribute',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/html-has-lang?application=webdriverjs',
                id: 'html-has-lang',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-lang',
                                impact: 'serious',
                                message: 'The <html> element has a lang attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<html lang="en" class="deque-axe-is-ready">',
                        impact: null,
                        none: [],
                        target: ['html'],
                    },
                ],
                tags: ['cat.language', 'wcag2a', 'wcag311'],
            },
            {
                description: 'Ensures the lang attribute of the <html> element has a valid value',
                help: '<html> element must have a valid value for the lang attribute',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/html-lang-valid?application=webdriverjs',
                id: 'html-lang-valid',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [],
                        html: '<html lang="en" class="deque-axe-is-ready">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'valid-lang',
                                impact: 'serious',
                                message:
                                    'Value of lang attribute is included in the list of valid languages',
                                relatedNodes: [],
                            },
                        ],
                        target: ['html'],
                    },
                ],
                tags: ['cat.language', 'wcag2a', 'wcag311'],
            },
            {
                description:
                    'Ensures <img> elements have alternate text or a role of none or presentation',
                help: 'Images must have alternate text',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/image-alt?application=webdriverjs',
                id: 'image-alt',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-alt',
                                impact: 'critical',
                                message: 'Element has an alt attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'alt-space-value',
                                impact: 'critical',
                                message: 'Element has a valid alt attribute value',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#logo'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-alt',
                                impact: 'critical',
                                message: 'Element has an alt attribute',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'role-presentation',
                                impact: 'minor',
                                message:
                                    'Element\'s default semantics were overriden with role="presentation"',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img src="images/help.png" alt="" role="presentation">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'alt-space-value',
                                impact: 'critical',
                                message: 'Element has a valid alt attribute value',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[src$="help\\.png"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-alt',
                                impact: 'critical',
                                message: 'Element has an alt attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img src="images/slide2.jpg" alt="A large bronze tactile map with a speaker for audio output">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'alt-space-value',
                                impact: 'critical',
                                message: 'Element has a valid alt attribute value',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[src$="slide2\\.jpg"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-alt',
                                impact: 'critical',
                                message: 'Element has an alt attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img src="images/arrow-left.png" alt="Previous slide">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'alt-space-value',
                                impact: 'critical',
                                message: 'Element has a valid alt attribute value',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[src$="arrow-left\\.png"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-alt',
                                impact: 'critical',
                                message: 'Element has an alt attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img src="images/arrow-right.png" alt="Next slide">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'alt-space-value',
                                impact: 'critical',
                                message: 'Element has a valid alt attribute value',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[src$="arrow-right\\.png"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-alt',
                                impact: 'critical',
                                message: 'Element has an alt attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'alt-space-value',
                                impact: 'critical',
                                message: 'Element has a valid alt attribute value',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[alt="Creative\\ Commons\\ License"]'],
                    },
                ],
                tags: [
                    'cat.text-alternatives',
                    'wcag2a',
                    'wcag111',
                    'section508',
                    'section508.22.a',
                ],
            },
            {
                description: 'Ensure image alternative is not repeated as text',
                help: 'Alternative text of images should not be repeated as text',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/image-redundant-alt?application=webdriverjs',
                id: 'image-redundant-alt',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [],
                        html: '<img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'duplicate-img-label',
                                impact: 'minor',
                                message:
                                    'Element does not duplicate existing text in <img> alt text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#logo'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<img src="images/help.png" alt="" role="presentation">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'duplicate-img-label',
                                impact: 'minor',
                                message:
                                    'Element does not duplicate existing text in <img> alt text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[src$="help\\.png"]'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<img src="images/slide2.jpg" alt="A large bronze tactile map with a speaker for audio output">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'duplicate-img-label',
                                impact: 'minor',
                                message:
                                    'Element does not duplicate existing text in <img> alt text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[src$="slide2\\.jpg"]'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<img src="images/arrow-left.png" alt="Previous slide">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'duplicate-img-label',
                                impact: 'minor',
                                message:
                                    'Element does not duplicate existing text in <img> alt text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[src$="arrow-left\\.png"]'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<img src="images/arrow-right.png" alt="Next slide">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'duplicate-img-label',
                                impact: 'minor',
                                message:
                                    'Element does not duplicate existing text in <img> alt text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[src$="arrow-right\\.png"]'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'duplicate-img-label',
                                impact: 'minor',
                                message:
                                    'Element does not duplicate existing text in <img> alt text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['img[alt="Creative\\ Commons\\ License"]'],
                    },
                ],
                tags: ['cat.text-alternatives', 'best-practice'],
            },
            {
                description: 'Ensures input buttons have discernible text',
                help: 'Input buttons must have discernible text',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/input-button-name?application=webdriverjs',
                id: 'input-button-name',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'non-empty-value',
                                impact: 'critical',
                                message: 'Element has a non-empty value attribute',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="submit" type="submit" name="submit" value="Submit">',
                        impact: null,
                        none: [],
                        target: ['#submit'],
                    },
                ],
                tags: ['cat.name-role-value', 'wcag2a', 'wcag412', 'section508', 'section508.22.a'],
            },
            {
                description:
                    'Ensures that every form element is not solely labeled using the title or aria-describedby attributes',
                help: 'Form elements should have a visible label',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/label-title-only?application=webdriverjs',
                id: 'label-title-only',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [],
                        html: '<input id="name" type="text" name="name" required="">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#name'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input id="email" type="email" name="email" required="">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#email'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="text" name="city" id="city">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#city'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="text" name="state" id="state">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#state'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="text" name="zip" id="zip">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#zip'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="text" name="country" id="country">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#country'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_cs" id="cs">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#cs'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_eng" id="eng">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#eng'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_econ" id="eco">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#eco'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_phy" id="phy">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#phy'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_psy" id="psy">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#psy'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input type="checkbox" name="major_sp" id="spa">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#spa'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<input id="captcha_answer" name="captcha_answer" type="text" required="required">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'title-only',
                                impact: 'serious',
                                message:
                                    'Form element does not solely use title attribute for its label',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#captcha_answer'],
                    },
                ],
                tags: ['cat.forms', 'best-practice'],
            },
            {
                description: 'Ensures every form element has a label',
                help: 'Form elements must have labels',
                helpUrl: 'https://dequeuniversity.com/rules/axe/3.3/label?application=webdriverjs',
                id: 'label',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="name" type="text" name="name" required="">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#name'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="email" type="email" name="email" required="">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#email'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="city" id="city">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#city'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="state" id="state">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#state'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="zip" id="zip">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#zip'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="text" name="country" id="country">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#country'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_cs" id="cs">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#cs'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_eng" id="eng">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#eng'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_econ" id="eco">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#eco'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_phy" id="phy">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#phy'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_psy" id="psy">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#psy'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input type="checkbox" name="major_sp" id="spa">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#spa'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'explicit-label',
                                impact: 'critical',
                                message: 'Form element has an explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        html: '<input id="captcha_answer" name="captcha_answer" type="text" required="required">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'hidden-explicit-label',
                                impact: 'critical',
                                message: 'Form element has a visible explicit <label>',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#captcha_answer'],
                    },
                ],
                tags: [
                    'cat.forms',
                    'wcag2a',
                    'wcag332',
                    'wcag131',
                    'section508',
                    'section508.22.n',
                ],
            },
            {
                description: 'Ensures the banner landmark is at top level',
                help: 'Banner landmark must not be contained in another landmark',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/landmark-banner-is-top-level?application=webdriverjs',
                id: 'landmark-banner-is-top-level',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    role: 'banner',
                                },
                                id: 'landmark-is-top-level',
                                impact: 'moderate',
                                message: 'The banner landmark is at the top level.',
                                relatedNodes: [],
                            },
                        ],
                        html: '<header role="banner">\n\t    <h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>\n    </header>',
                        impact: null,
                        none: [],
                        target: ['header'],
                    },
                ],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description: 'Ensures the contentinfo landmark is at top level',
                help: 'Contentinfo landmark must not be contained in another landmark',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/landmark-contentinfo-is-top-level?application=webdriverjs',
                id: 'landmark-contentinfo-is-top-level',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    role: 'contentinfo',
                                },
                                id: 'landmark-is-top-level',
                                impact: 'moderate',
                                message: 'The contentinfo landmark is at the top level.',
                                relatedNodes: [],
                            },
                        ],
                        html: '<footer role="contentinfo">',
                        impact: null,
                        none: [],
                        target: ['footer'],
                    },
                ],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description: 'Ensures the main landmark is at top level',
                help: 'Main landmark must not be contained in another landmark',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/landmark-main-is-top-level?application=webdriverjs',
                id: 'landmark-main-is-top-level',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    role: 'main',
                                },
                                id: 'landmark-is-top-level',
                                impact: 'moderate',
                                message: 'The main landmark is at the top level.',
                                relatedNodes: [],
                            },
                        ],
                        html: '<main role="main">',
                        impact: null,
                        none: [],
                        target: ['main'],
                    },
                ],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description: 'Ensures the document has at most one banner landmark',
                help: 'Document must not have more than one banner landmark',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/landmark-no-duplicate-banner?application=webdriverjs',
                id: 'landmark-no-duplicate-banner',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'page-no-duplicate-banner',
                                impact: 'moderate',
                                message: 'Document does not have more than one banner landmark',
                                relatedNodes: [
                                    {
                                        html: '<header role="banner">\n\t    <h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>\n    </header>',
                                        target: ['header'],
                                    },
                                ],
                            },
                        ],
                        html: '<html lang="en" class="deque-axe-is-ready">',
                        impact: null,
                        none: [],
                        target: ['html'],
                    },
                ],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description: 'Ensures the document has at most one contentinfo landmark',
                help: 'Document must not have more than one contentinfo landmark',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/landmark-no-duplicate-contentinfo?application=webdriverjs',
                id: 'landmark-no-duplicate-contentinfo',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'page-no-duplicate-contentinfo',
                                impact: 'moderate',
                                message:
                                    'Document does not have more than one contentinfo landmark',
                                relatedNodes: [
                                    {
                                        html: '<footer role="contentinfo">',
                                        target: ['footer'],
                                    },
                                ],
                            },
                        ],
                        html: '<html lang="en" class="deque-axe-is-ready">',
                        impact: null,
                        none: [],
                        target: ['html'],
                    },
                ],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description:
                    'Ensures the document has only one main landmark and each iframe in the page has at most one main landmark',
                help: 'Document must have one main landmark',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/landmark-one-main?application=webdriverjs',
                id: 'landmark-one-main',
                impact: null,
                nodes: [
                    {
                        all: [
                            {
                                data: null,
                                id: 'page-has-main',
                                impact: 'moderate',
                                message: 'Document has at least one main landmark',
                                relatedNodes: [
                                    {
                                        html: '<main role="main">',
                                        target: ['main'],
                                    },
                                ],
                            },
                            {
                                data: null,
                                id: 'page-no-duplicate-main',
                                impact: 'moderate',
                                message: 'Document does not have more than one main landmark',
                                relatedNodes: [
                                    {
                                        html: '<main role="main">',
                                        target: ['main'],
                                    },
                                ],
                            },
                        ],
                        any: [],
                        html: '<html lang="en" class="deque-axe-is-ready">',
                        impact: null,
                        none: [],
                        target: ['html'],
                    },
                ],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description:
                    'Landmarks must have a unique role or role/label/title (i.e. accessible name) combination',
                help: 'Ensures landmarks are unique',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/landmark-unique?application=webdriverjs',
                id: 'landmark-unique',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    accessibleText: null,
                                    role: 'banner',
                                },
                                id: 'landmark-is-unique',
                                impact: 'moderate',
                                message:
                                    'Landmarks must have a unique role or role/label/title (i.e. accessible name) combination',
                                relatedNodes: [],
                            },
                        ],
                        html: '<header role="banner">\n\t    <h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>\n    </header>',
                        impact: null,
                        none: [],
                        target: ['header'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    accessibleText: 'main menu',
                                    role: 'navigation',
                                },
                                id: 'landmark-is-unique',
                                impact: 'moderate',
                                message:
                                    'Landmarks must have a unique role or role/label/title (i.e. accessible name) combination',
                                relatedNodes: [],
                            },
                        ],
                        html: '<nav id="main-nav" role="navigation" aria-label="Main Menu">',
                        impact: null,
                        none: [],
                        target: ['#main-nav'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    accessibleText: null,
                                    role: 'main',
                                },
                                id: 'landmark-is-unique',
                                impact: 'moderate',
                                message:
                                    'Landmarks must have a unique role or role/label/title (i.e. accessible name) combination',
                                relatedNodes: [],
                            },
                        ],
                        html: '<main role="main">',
                        impact: null,
                        none: [],
                        target: ['main'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    accessibleText: null,
                                    role: 'region',
                                },
                                id: 'landmark-is-unique',
                                impact: 'moderate',
                                message:
                                    'Landmarks must have a unique role or role/label/title (i.e. accessible name) combination',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="carousel" role="region" aria-describedby="carouselHeading">',
                        impact: null,
                        none: [],
                        target: ['#carousel'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    accessibleText: 'apply now!',
                                    role: 'form',
                                },
                                id: 'landmark-is-unique',
                                impact: 'moderate',
                                message:
                                    'Landmarks must have a unique role or role/label/title (i.e. accessible name) combination',
                                relatedNodes: [],
                            },
                        ],
                        html: '<div id="appForm" role="form" aria-labelledby="appFormHeading">',
                        impact: null,
                        none: [],
                        target: ['#appForm'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: {
                                    accessibleText: null,
                                    role: 'contentinfo',
                                },
                                id: 'landmark-is-unique',
                                impact: 'moderate',
                                message:
                                    'Landmarks must have a unique role or role/label/title (i.e. accessible name) combination',
                                relatedNodes: [],
                            },
                        ],
                        html: '<footer role="contentinfo">',
                        impact: null,
                        none: [],
                        target: ['footer'],
                    },
                ],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description: 'Ensures links have discernible text',
                help: 'Links must have discernible text',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/link-name?application=webdriverjs',
                id: 'link-name',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=About" id="ablemenu__link_1" aria-owns="ablemenu__sub_1" aria-controls="ablemenu__sub_1" aria-haspopup="true" aria-expanded="false">About</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#ablemenu__link_1'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Academics" id="ablemenu__link_2" aria-owns="ablemenu__sub_2" aria-controls="ablemenu__sub_2" aria-haspopup="true" aria-expanded="false">Academics</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#ablemenu__link_2'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Admissions" id="ablemenu__link_3" aria-owns="ablemenu__sub_3" aria-controls="ablemenu__sub_3" aria-haspopup="true" aria-expanded="false">Admissions</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#ablemenu__link_3'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Visitors" id="ablemenu__link_4" aria-owns="ablemenu__sub_4" aria-controls="ablemenu__sub_4" aria-haspopup="true" aria-expanded="false">Visitors</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#ablemenu__link_4'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="somepage.html?ref=Slide%201">campus map locations</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: [
                            '.current > .description > a[href="somepage\\.html\\?ref\\=Slide\\%201"]',
                        ],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="issues.html">List of Issues</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['a[href$="issues\\.html"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="before.html">Inaccessible version</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['a[href$="before\\.html"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="cheatsheet.html">Cheat Sheet of Accessibility Issues</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['a[href$="cheatsheet\\.html"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"></a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#ccLogo > a[rel="license"]'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a href="http://washington.edu/accesscomputing/AU">University of Washington</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['footer > a:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'has-visible-text',
                                impact: 'minor',
                                message: 'Element has text that is visible to screen readers',
                                relatedNodes: [],
                            },
                        ],
                        html: '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'focusable-no-name',
                                impact: 'serious',
                                message: 'Element is not in tab order or has accessible text',
                                relatedNodes: [],
                            },
                        ],
                        target: ['footer > a[rel="license"]'],
                    },
                ],
                tags: [
                    'cat.name-role-value',
                    'wcag2a',
                    'wcag412',
                    'wcag244',
                    'section508',
                    'section508.22.a',
                ],
            },
            {
                description: 'Ensures that lists are structured correctly',
                help: '<ul> and <ol> must only directly contain <li>, <script> or <template> elements',
                helpUrl: 'https://dequeuniversity.com/rules/axe/3.3/list?application=webdriverjs',
                id: 'list',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [],
                        html: '<ul class="lentils">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'only-listitems',
                                impact: 'serious',
                                message:
                                    'List element only has direct children that are allowed inside <li> elements',
                                relatedNodes: [],
                            },
                        ],
                        target: ['.lentils'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<ul>',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'only-listitems',
                                impact: 'serious',
                                message:
                                    'List element only has direct children that are allowed inside <li> elements',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#majors > ul'],
                    },
                ],
                tags: ['cat.structure', 'wcag2a', 'wcag131'],
            },
            {
                description: 'Ensures <li> elements are used semantically',
                help: '<li> elements must be contained in a <ul> or <ol>',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/listitem?application=webdriverjs',
                id: 'listitem',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'listitem',
                                impact: 'serious',
                                message: 'List item has a <ul>, <ol> or role="list" parent element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li class="active"><button data-slide="0"><span class="clipped">Slide </span> 1<span class="clipped current-slide">(current slide)</span></button></li>',
                        impact: null,
                        none: [],
                        target: ['.active'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'listitem',
                                impact: 'serious',
                                message: 'List item has a <ul>, <ol> or role="list" parent element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li><button data-slide="1"><span class="clipped">Slide </span> 2</button></li>',
                        impact: null,
                        none: [],
                        target: ['.lentils > li:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'listitem',
                                impact: 'serious',
                                message: 'List item has a <ul>, <ol> or role="list" parent element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li><button data-slide="2"><span class="clipped">Slide </span> 3</button></li>',
                        impact: null,
                        none: [],
                        target: ['.lentils > li:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'listitem',
                                impact: 'serious',
                                message: 'List item has a <ul>, <ol> or role="list" parent element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li>\n              <label for="cs">Computer Science</label>\n              <input type="checkbox" name="major_cs" id="cs">\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#majors > ul > li:nth-child(1)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'listitem',
                                impact: 'serious',
                                message: 'List item has a <ul>, <ol> or role="list" parent element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li>\n              <label for="eng">Engineering</label>\n              <input type="checkbox" name="major_eng" id="eng">\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#majors > ul > li:nth-child(2)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'listitem',
                                impact: 'serious',
                                message: 'List item has a <ul>, <ol> or role="list" parent element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li>\n              <label for="eco">Economics</label>\n              <input type="checkbox" name="major_econ" id="eco">\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#majors > ul > li:nth-child(3)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'listitem',
                                impact: 'serious',
                                message: 'List item has a <ul>, <ol> or role="list" parent element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li>\n              <label for="phy">Physics</label>\n              <input type="checkbox" name="major_phy" id="phy">\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#majors > ul > li:nth-child(4)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'listitem',
                                impact: 'serious',
                                message: 'List item has a <ul>, <ol> or role="list" parent element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li>\n              <label for="psy">Psychology</label>\n              <input type="checkbox" name="major_psy" id="psy">\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#majors > ul > li:nth-child(5)'],
                    },
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'listitem',
                                impact: 'serious',
                                message: 'List item has a <ul>, <ol> or role="list" parent element',
                                relatedNodes: [],
                            },
                        ],
                        html: '<li>\n              <label for="spa">Spanish</label>\n              <input type="checkbox" name="major_sp" id="spa">\n            </li>',
                        impact: null,
                        none: [],
                        target: ['#majors > ul > li:nth-child(6)'],
                    },
                ],
                tags: ['cat.structure', 'wcag2a', 'wcag131'],
            },
            {
                description:
                    'Ensure that the page, or at least one of its frames contains a level-one heading',
                help: 'Page must contain a level-one heading',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/page-has-heading-one?application=webdriverjs',
                id: 'page-has-heading-one',
                impact: null,
                nodes: [
                    {
                        all: [
                            {
                                data: null,
                                id: 'page-has-heading-one',
                                impact: 'moderate',
                                message: 'Page has at least one level-one heading',
                                relatedNodes: [
                                    {
                                        html: '<h1>\n  \t    <img id="logo" src="images/au123456789.gif" alt="Accessible University" width="441" height="90">\n      </h1>',
                                        target: ['header > h1'],
                                    },
                                    {
                                        html: '<h1 id="modalHeading">Eighteen Accessibility Issues</h1>',
                                        target: ['#modalHeading'],
                                    },
                                ],
                            },
                        ],
                        any: [],
                        html: '<html lang="en" class="deque-axe-is-ready">',
                        impact: null,
                        none: [],
                        target: ['html'],
                    },
                ],
                tags: ['cat.semantics', 'best-practice'],
            },
            {
                description: 'Ensures all page content is contained by landmarks',
                help: 'All page content must be contained by landmarks',
                helpUrl: 'https://dequeuniversity.com/rules/axe/3.3/region?application=webdriverjs',
                id: 'region',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [
                            {
                                data: null,
                                id: 'region',
                                impact: 'moderate',
                                message: 'All page content is contained by landmarks',
                                relatedNodes: [],
                            },
                        ],
                        html: '<html lang="en" class="deque-axe-is-ready">',
                        impact: null,
                        none: [],
                        target: ['html'],
                    },
                ],
                tags: ['cat.keyboard', 'best-practice'],
            },
            {
                description: 'Ensures the scope attribute is used correctly on tables',
                help: 'scope attribute should be used correctly',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/scope-attr-valid?application=webdriverjs',
                id: 'scope-attr-valid',
                impact: null,
                nodes: [
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="y07-08" colspan="6">2007-08</th>',
                        impact: null,
                        none: [],
                        target: ['#y07-08'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="y08-09" colspan="6">2008-09</th>',
                        impact: null,
                        none: [],
                        target: ['#y08-09'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-cs1"><abbr title="Computer Science">CS</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-cs1'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-eng1"><abbr title="English">Eng</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-eng1'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-eco1"><abbr title="Economics">Eco</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-eco1'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-phy1"><abbr title="Physics">Phy</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-phy1'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-psy1"><abbr title="Psychology">Psy</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-psy1'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-spa1"><abbr title="Spanish">Spa</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-spa1'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-cs2"><abbr title="Computer Science">CS</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-cs2'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-eng2"><abbr title="English">Eng</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-eng2'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-eco2"><abbr title="Economics">Eco</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-eco2'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-phy2"><abbr title="Physics">Phy</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-phy2'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-psy2"><abbr title="Psychology">Psy</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-psy2'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="col" id="subj-spa2"><abbr title="Spanish">Spa</abbr></th>',
                        impact: null,
                        none: [],
                        target: ['#subj-spa2'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="row" id="total">Total</th>',
                        impact: null,
                        none: [],
                        target: ['#total'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="row" id="male">% Male</th>',
                        impact: null,
                        none: [],
                        target: ['#male'],
                    },
                    {
                        all: [
                            {
                                data: null,
                                id: 'html5-scope',
                                impact: 'moderate',
                                message:
                                    'Scope attribute is only used on table header elements (<th>)',
                                relatedNodes: [],
                            },
                            {
                                data: null,
                                id: 'scope-value',
                                impact: 'critical',
                                message: 'Scope attribute is used correctly',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<th scope="row" id="female">% Female</th>',
                        impact: null,
                        none: [],
                        target: ['#female'],
                    },
                ],
                tags: ['cat.tables', 'best-practice'],
            },
            {
                description: 'Ensure that tables do not have the same summary and caption',
                help: 'The <caption> element should not contain the same text as the summary attribute',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/table-duplicate-name?application=webdriverjs',
                id: 'table-duplicate-name',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [],
                        html: '<table id="enrollment" aria-describedby="table-summary">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'same-caption-summary',
                                impact: 'minor',
                                message:
                                    'Content of summary attribute and <caption> are not duplicated',
                                relatedNodes: [],
                            },
                        ],
                        target: ['#enrollment'],
                    },
                ],
                tags: ['cat.tables', 'best-practice'],
            },
            {
                description:
                    'Ensure that each cell in a table using the headers refers to another cell in that table',
                help: 'All cells in a table element that use the headers attribute must only refer to other cells of that same table',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/td-headers-attr?application=webdriverjs',
                id: 'td-headers-attr',
                impact: null,
                nodes: [
                    {
                        all: [
                            {
                                data: null,
                                id: 'td-headers-attr',
                                impact: 'serious',
                                message:
                                    'The headers attribute is exclusively used to refer to other cells in the table',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<table id="enrollment" aria-describedby="table-summary">',
                        impact: null,
                        none: [],
                        target: ['#enrollment'],
                    },
                ],
                tags: ['cat.tables', 'wcag2a', 'wcag131', 'section508', 'section508.22.g'],
            },
            {
                description: 'Ensure that each table header in a data table refers to data cells',
                help: 'All th elements and elements with role=columnheader/rowheader must have data cells they describe',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/th-has-data-cells?application=webdriverjs',
                id: 'th-has-data-cells',
                impact: null,
                nodes: [
                    {
                        all: [
                            {
                                data: null,
                                id: 'th-has-data-cells',
                                impact: 'serious',
                                message: 'All table header cells refer to data cells',
                                relatedNodes: [],
                            },
                        ],
                        any: [],
                        html: '<table id="enrollment" aria-describedby="table-summary">',
                        impact: null,
                        none: [],
                        target: ['#enrollment'],
                    },
                ],
                tags: ['cat.tables', 'wcag2a', 'wcag131', 'section508', 'section508.22.g'],
            },
            {
                description: 'Ensures lang attributes have valid values',
                help: 'lang attribute must have a valid value',
                helpUrl:
                    'https://dequeuniversity.com/rules/axe/3.3/valid-lang?application=webdriverjs',
                id: 'valid-lang',
                impact: null,
                nodes: [
                    {
                        all: [],
                        any: [],
                        html: '<div class="section" lang="es">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'valid-lang',
                                impact: 'serious',
                                message:
                                    'Value of lang attribute is included in the list of valid languages',
                                relatedNodes: [],
                            },
                        ],
                        target: ['.section[lang="es"]'],
                    },
                    {
                        all: [],
                        any: [],
                        html: '<p lang="es">',
                        impact: null,
                        none: [
                            {
                                data: null,
                                id: 'valid-lang',
                                impact: 'serious',
                                message:
                                    'Value of lang attribute is included in the list of valid languages',
                                relatedNodes: [],
                            },
                        ],
                        target: ['p[lang="es"]'],
                    },
                ],
                tags: ['cat.language', 'wcag2aa', 'wcag312'],
            },
        ],
        testEngine: {
            name: 'axe-core',
            version: '3.3.2',
        },
        testEnvironment: {
            orientationAngle: 0,
            orientationType: 'landscape-primary',
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/78.0.3904.108 Safari/537.36',
            windowHeight: 600,
            windowWidth: 800,
        },
        testRunner: {
            name: 'axe',
        },
        timestamp: '2019-11-24T03:06:20.556Z',
        toolOptions: {
            reporter: 'v1',
        },
        url: 'https://markreay.github.io/AU/after.html',
        violations: [],
    },
};
