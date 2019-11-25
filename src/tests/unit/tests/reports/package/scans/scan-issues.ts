export const scanIssues = {
  inapplicable: [
    {
      description: "Ensures every accesskey attribute value is unique",
      help: "accesskey attribute value must be unique",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/accesskeys?application=webdriverjs",
      id: "accesskeys",
      impact: null,
      nodes: [],
      tags: ["best-practice", "cat.keyboard"]
    },
    {
      description: "Ensures <area> elements of image maps have alternate text",
      help: "Active <area> elements must have alternate text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/area-alt?application=webdriverjs",
      id: "area-alt",
      impact: null,
      nodes: [],
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag111",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description: "Ensures ARIA attributes are allowed for an element's role",
      help: "Elements must only use allowed ARIA attributes",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-allowed-attr?application=webdriverjs",
      id: "aria-allowed-attr",
      impact: null,
      nodes: [],
      tags: ["cat.aria", "wcag2a", "wcag412"]
    },
    {
      description:
        "Ensures role attribute has an appropriate value for the element",
      help: "ARIA role must be appropriate for the element",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-allowed-role?application=webdriverjs",
      id: "aria-allowed-role",
      impact: null,
      nodes: [],
      tags: ["cat.aria", "best-practice"]
    },
    {
      description:
        "Ensures unsupported DPUB roles are only used on elements with implicit fallback roles",
      help:
        "Unsupported DPUB ARIA roles should be used on elements with implicit fallback roles",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-dpub-role-fallback?application=webdriverjs",
      id: "aria-dpub-role-fallback",
      impact: null,
      nodes: [],
      tags: ["cat.aria", "wcag2a", "wcag131"]
    },
    {
      description:
        "Ensures aria-hidden elements do not contain focusable elements",
      help: "ARIA hidden element must not contain focusable elements",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-hidden-focus?application=webdriverjs",
      id: "aria-hidden-focus",
      impact: null,
      nodes: [],
      tags: ["cat.name-role-value", "wcag2a", "wcag412", "wcag131"]
    },
    {
      description: "Ensures every ARIA input field has an accessible name",
      help: "ARIA input fields have an accessible name",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-input-field-name?application=webdriverjs",
      id: "aria-input-field-name",
      impact: null,
      nodes: [],
      tags: ["wcag2a", "wcag412"]
    },
    {
      description:
        "Ensures elements with ARIA roles have all required ARIA attributes",
      help: "Required ARIA attributes must be provided",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-required-attr?application=webdriverjs",
      id: "aria-required-attr",
      impact: null,
      nodes: [],
      tags: ["cat.aria", "wcag2a", "wcag412"]
    },
    {
      description:
        "Ensures elements with an ARIA role that require child roles contain them",
      help: "Certain ARIA roles must contain particular children",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-required-children?application=webdriverjs",
      id: "aria-required-children",
      impact: null,
      nodes: [],
      tags: ["cat.aria", "wcag2a", "wcag131"]
    },
    {
      description:
        "Ensures elements with an ARIA role that require parent roles are contained by them",
      help: "Certain ARIA roles must be contained by particular parents",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-required-parent?application=webdriverjs",
      id: "aria-required-parent",
      impact: null,
      nodes: [],
      tags: ["cat.aria", "wcag2a", "wcag131"]
    },
    {
      description:
        "Ensures all elements with a role attribute use a valid value",
      help: "ARIA roles used must conform to valid values",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-roles?application=webdriverjs",
      id: "aria-roles",
      impact: null,
      nodes: [],
      tags: ["cat.aria", "wcag2a", "wcag412"]
    },
    {
      description: "Ensures every ARIA toggle field has an accessible name",
      help: "ARIA toggle fields have an accessible name",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-toggle-field-name?application=webdriverjs",
      id: "aria-toggle-field-name",
      impact: null,
      nodes: [],
      tags: ["wcag2a", "wcag412"]
    },
    {
      description: "Ensures all ARIA attributes have valid values",
      help: "ARIA attributes must conform to valid values",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-valid-attr-value?application=webdriverjs",
      id: "aria-valid-attr-value",
      impact: null,
      nodes: [],
      tags: ["cat.aria", "wcag2a", "wcag412"]
    },
    {
      description:
        "Ensures attributes that begin with aria- are valid ARIA attributes",
      help: "ARIA attributes must conform to valid names",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-valid-attr?application=webdriverjs",
      id: "aria-valid-attr",
      impact: null,
      nodes: [],
      tags: ["cat.aria", "wcag2a", "wcag412"]
    },
    {
      description:
        "Ensure the autocomplete attribute is correct and suitable for the form field",
      help: "autocomplete attribute must be used correctly",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/autocomplete-valid?application=webdriverjs",
      id: "autocomplete-valid",
      impact: null,
      nodes: [],
      tags: ["cat.forms", "wcag21aa", "wcag135"]
    },
    {
      description: "Ensures <blink> elements are not used",
      help: "<blink> elements are deprecated and must not be used",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/blink?application=webdriverjs",
      id: "blink",
      impact: null,
      nodes: [],
      tags: [
        "cat.time-and-media",
        "wcag2a",
        "wcag222",
        "section508",
        "section508.22.j"
      ]
    },
    {
      description: "Ensures buttons have discernible text",
      help: "Buttons must have discernible text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/button-name?application=webdriverjs",
      id: "button-name",
      impact: null,
      nodes: [],
      tags: [
        "cat.name-role-value",
        "wcag2a",
        "wcag412",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description: "Ensures <dl> elements are structured correctly",
      help:
        "<dl> elements must only directly contain properly-ordered <dt> and <dd> groups, <script> or <template> elements",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/definition-list?application=webdriverjs",
      id: "definition-list",
      impact: null,
      nodes: [],
      tags: ["cat.structure", "wcag2a", "wcag131"]
    },
    {
      description: "Ensures <dt> and <dd> elements are contained by a <dl>",
      help: "<dt> and <dd> elements must be contained by a <dl>",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/dlitem?application=webdriverjs",
      id: "dlitem",
      impact: null,
      nodes: [],
      tags: ["cat.structure", "wcag2a", "wcag131"]
    },
    {
      description:
        "Ensures every id attribute value used in ARIA and in labels is unique",
      help: "IDs used in ARIA and labels must be unique",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/duplicate-id-aria?application=webdriverjs",
      id: "duplicate-id-aria",
      impact: null,
      nodes: [],
      tags: ["cat.parsing", "wcag2a", "wcag411"]
    },
    {
      description: "Ensures headings have discernible text",
      help: "Headings must not be empty",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/empty-heading?application=webdriverjs",
      id: "empty-heading",
      impact: null,
      nodes: [],
      tags: ["cat.name-role-value", "best-practice"]
    },
    {
      description:
        "Ensures <iframe> and <frame> elements contain the axe-core script",
      help: "Frames must be tested with axe-core",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/frame-tested?application=webdriverjs",
      id: "frame-tested",
      impact: null,
      nodes: [],
      tags: ["cat.structure", "review-item", "best-practice"]
    },
    {
      description:
        "Ensures <iframe> and <frame> elements contain a unique title attribute",
      help: "Frames must have a unique title attribute",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/frame-title-unique?application=webdriverjs",
      id: "frame-title-unique",
      impact: null,
      nodes: [],
      tags: ["cat.text-alternatives", "best-practice"]
    },
    {
      description:
        "Ensures <iframe> and <frame> elements contain a non-empty title attribute",
      help: "Frames must have title attribute",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/frame-title?application=webdriverjs",
      id: "frame-title",
      impact: null,
      nodes: [],
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag241",
        "wcag412",
        "section508",
        "section508.22.i"
      ]
    },
    {
      description: "Ensures the order of headings is semantically correct",
      help: "Heading levels should only increase by one",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/heading-order?application=webdriverjs",
      id: "heading-order",
      impact: null,
      nodes: [],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description:
        "Ensures the lang attribute of the <html> element has a valid value",
      help: "<html> element must have a valid value for the lang attribute",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/html-lang-valid?application=webdriverjs",
      id: "html-lang-valid",
      impact: null,
      nodes: [],
      tags: ["cat.language", "wcag2a", "wcag311"]
    },
    {
      description:
        "Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page",
      help:
        "HTML elements with lang and xml:lang must have the same base language",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/html-xml-lang-mismatch?application=webdriverjs",
      id: "html-xml-lang-mismatch",
      impact: null,
      nodes: [],
      tags: ["cat.language", "wcag2a", "wcag311"]
    },
    {
      description: 'Ensures <input type="image"> elements have alternate text',
      help: "Image buttons must have alternate text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/input-image-alt?application=webdriverjs",
      id: "input-image-alt",
      impact: null,
      nodes: [],
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag111",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description: "Ensures the banner landmark is at top level",
      help: "Banner landmark must not be contained in another landmark",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/landmark-banner-is-top-level?application=webdriverjs",
      id: "landmark-banner-is-top-level",
      impact: null,
      nodes: [],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description:
        "Ensures the complementary landmark or aside is at top level",
      help: "Aside must not be contained in another landmark",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/landmark-complementary-is-top-level?application=webdriverjs",
      id: "landmark-complementary-is-top-level",
      impact: null,
      nodes: [],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description: "Ensures the contentinfo landmark is at top level",
      help: "Contentinfo landmark must not be contained in another landmark",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/landmark-contentinfo-is-top-level?application=webdriverjs",
      id: "landmark-contentinfo-is-top-level",
      impact: null,
      nodes: [],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description: "Ensures the main landmark is at top level",
      help: "Main landmark must not be contained in another landmark",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/landmark-main-is-top-level?application=webdriverjs",
      id: "landmark-main-is-top-level",
      impact: null,
      nodes: [],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description:
        "Landmarks must have a unique role or role/label/title (i.e. accessible name) combination",
      help: "Ensures landmarks are unique",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/landmark-unique?application=webdriverjs",
      id: "landmark-unique",
      impact: null,
      nodes: [],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description:
        "Ensures presentational <table> elements do not use <th>, <caption> elements or the summary attribute",
      help: "Layout tables must not use data table elements",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/layout-table?application=webdriverjs",
      id: "layout-table",
      impact: null,
      nodes: [],
      tags: ["cat.semantics", "wcag2a", "wcag131"]
    },
    {
      description: "Ensures <marquee> elements are not used",
      help: "<marquee> elements are deprecated and must not be used",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/marquee?application=webdriverjs",
      id: "marquee",
      impact: null,
      nodes: [],
      tags: ["cat.parsing", "wcag2a", "wcag222"]
    },
    {
      description: 'Ensures <meta http-equiv="refresh"> is not used',
      help: "Timed refresh must not exist",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/meta-refresh?application=webdriverjs",
      id: "meta-refresh",
      impact: null,
      nodes: [],
      tags: ["cat.time", "wcag2a", "wcag2aaa", "wcag221", "wcag224", "wcag325"]
    },
    {
      description:
        'Ensures <meta name="viewport"> can scale a significant amount',
      help: "Users should be able to zoom and scale the text up to 500%",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/meta-viewport-large?application=webdriverjs",
      id: "meta-viewport-large",
      impact: null,
      nodes: [],
      tags: ["cat.sensory-and-visual-cues", "best-practice"]
    },
    {
      description:
        'Ensures <meta name="viewport"> does not disable text scaling and zooming',
      help: "Zooming and scaling must not be disabled",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/meta-viewport?application=webdriverjs",
      id: "meta-viewport",
      impact: null,
      nodes: [],
      tags: ["cat.sensory-and-visual-cues", "wcag2aa", "wcag144"]
    },
    {
      description: "Ensures <object> elements have alternate text",
      help: "<object> elements must have alternate text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/object-alt?application=webdriverjs",
      id: "object-alt",
      impact: null,
      nodes: [],
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag111",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description:
        'Ensures related <input type="radio"> elements have a group and that the group designation is consistent',
      help:
        "Radio inputs with the same name attribute value must be part of a group",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/radiogroup?application=webdriverjs",
      id: "radiogroup",
      impact: null,
      nodes: [],
      tags: ["cat.forms", "best-practice"]
    },
    {
      description: "Ensures [role='img'] elements have alternate text",
      help: "[role='img'] elements have an alternative text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/role-img-alt?application=webdriverjs",
      id: "role-img-alt",
      impact: null,
      nodes: [],
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag111",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description: "Ensures the scope attribute is used correctly on tables",
      help: "scope attribute should be used correctly",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/scope-attr-valid?application=webdriverjs",
      id: "scope-attr-valid",
      impact: null,
      nodes: [],
      tags: ["cat.tables", "best-practice"]
    },
    {
      description:
        "Elements that have scrollable content should be accessible by keyboard",
      help: "Ensure that scrollable region has keyboard access",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/scrollable-region-focusable?application=webdriverjs",
      id: "scrollable-region-focusable",
      impact: null,
      nodes: [],
      tags: ["wcag2a", "wcag211"]
    },
    {
      description: "Ensures that server-side image maps are not used",
      help: "Server-side image maps must not be used",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/server-side-image-map?application=webdriverjs",
      id: "server-side-image-map",
      impact: null,
      nodes: [],
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag211",
        "section508",
        "section508.22.f"
      ]
    },
    {
      description: "Ensure all skip links have a focusable target",
      help: "The skip-link target should exist and be focusable",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/skip-link?application=webdriverjs",
      id: "skip-link",
      impact: null,
      nodes: [],
      tags: ["cat.keyboard", "best-practice"]
    },
    {
      description: "Ensures tabindex attribute values are not greater than 0",
      help: "Elements should not have tabindex greater than zero",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/tabindex?application=webdriverjs",
      id: "tabindex",
      impact: null,
      nodes: [],
      tags: ["cat.keyboard", "best-practice"]
    },
    {
      description: "Ensures lang attributes have valid values",
      help: "lang attribute must have a valid value",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/valid-lang?application=webdriverjs",
      id: "valid-lang",
      impact: null,
      nodes: [],
      tags: ["cat.language", "wcag2aa", "wcag312"]
    },
    {
      description: "Ensures <video> elements have captions",
      help: "<video> elements must have captions",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/video-caption?application=webdriverjs",
      id: "video-caption",
      impact: null,
      nodes: [],
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag122",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description: "Ensures <video> elements have audio descriptions",
      help: "<video> elements must have an audio description track",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/video-description?application=webdriverjs",
      id: "video-description",
      impact: null,
      nodes: [],
      tags: [
        "cat.text-alternatives",
        "wcag2aa",
        "wcag125",
        "section508",
        "section508.22.b"
      ]
    }
  ],
  incomplete: [],
  passes: [
    {
      description:
        "Ensures aria-hidden='true' is not present on the document body.",
      help: "aria-hidden='true' must not be present on the document body",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/aria-hidden-body?application=webdriverjs",
      id: "aria-hidden-body",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-hidden-body",
              impact: "critical",
              message: "No aria-hidden attribute is present on document body",
              relatedNodes: []
            }
          ],
          html: "<body>",
          impact: null,
          none: [],
          target: ["body"]
        }
      ],
      tags: ["cat.aria", "wcag2a", "wcag412"]
    },
    {
      description:
        "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets",
      help: "Inline text spacing must be adjustable with custom stylesheets",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/avoid-inline-spacing?application=webdriverjs",
      id: "avoid-inline-spacing",
      impact: null,
      nodes: [
        {
          all: [
            {
              data: null,
              id: "avoid-inline-spacing",
              impact: "serious",
              message:
                "No inline styles with '!important' that affect text spacing has been specified",
              relatedNodes: []
            }
          ],
          any: [],
          html: '<td style="width:6em">&nbsp;</td>',
          impact: null,
          none: [],
          target: ["tr:nth-child(1) > td:nth-child(1)"]
        },
        {
          all: [
            {
              data: null,
              id: "avoid-inline-spacing",
              impact: "serious",
              message:
                "No inline styles with '!important' that affect text spacing has been specified",
              relatedNodes: []
            }
          ],
          any: [],
          html: '<td colspan="6" style="text-align:center"><b>2007-08</b></td>',
          impact: null,
          none: [],
          target: ['td[colspan="\\36 "]:nth-child(2)']
        },
        {
          all: [
            {
              data: null,
              id: "avoid-inline-spacing",
              impact: "serious",
              message:
                "No inline styles with '!important' that affect text spacing has been specified",
              relatedNodes: []
            }
          ],
          any: [],
          html: '<td colspan="6" style="text-align:center"><b>2008-09</b></td>',
          impact: null,
          none: [],
          target: ['td[colspan="\\36 "]:nth-child(3)']
        }
      ],
      tags: ["wcag21aa", "wcag1412"]
    },
    {
      description:
        'Ensures related <input type="checkbox"> elements have a group and that the group designation is consistent',
      help:
        "Checkbox inputs with the same name attribute value must be part of a group",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/checkboxgroup?application=webdriverjs",
      id: "checkboxgroup",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: {
                name: "major_cs",
                type: "checkbox"
              },
              id: "group-labelledby",
              impact: "critical",
              message:
                'Elements with the name "major_cs" have both a shared label, and a unique label, referenced through aria-labelledby',
              relatedNodes: []
            },
            {
              data: {
                name: "major_cs",
                type: "checkbox"
              },
              id: "fieldset",
              impact: "critical",
              message: "Element is contained in a fieldset",
              relatedNodes: []
            }
          ],
          html: '<input type="checkbox" name="major_cs">',
          impact: null,
          none: [],
          target: ['input[name="major_cs"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                name: "major_eng",
                type: "checkbox"
              },
              id: "group-labelledby",
              impact: "critical",
              message:
                'Elements with the name "major_eng" have both a shared label, and a unique label, referenced through aria-labelledby',
              relatedNodes: []
            },
            {
              data: {
                name: "major_eng",
                type: "checkbox"
              },
              id: "fieldset",
              impact: "critical",
              message: "Element is contained in a fieldset",
              relatedNodes: []
            }
          ],
          html: '<input type="checkbox" name="major_eng">',
          impact: null,
          none: [],
          target: ['input[name="major_eng"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                name: "major_econ",
                type: "checkbox"
              },
              id: "group-labelledby",
              impact: "critical",
              message:
                'Elements with the name "major_econ" have both a shared label, and a unique label, referenced through aria-labelledby',
              relatedNodes: []
            },
            {
              data: {
                name: "major_econ",
                type: "checkbox"
              },
              id: "fieldset",
              impact: "critical",
              message: "Element is contained in a fieldset",
              relatedNodes: []
            }
          ],
          html: '<input type="checkbox" name="major_econ">',
          impact: null,
          none: [],
          target: ['input[name="major_econ"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                name: "major_phy",
                type: "checkbox"
              },
              id: "group-labelledby",
              impact: "critical",
              message:
                'Elements with the name "major_phy" have both a shared label, and a unique label, referenced through aria-labelledby',
              relatedNodes: []
            },
            {
              data: {
                name: "major_phy",
                type: "checkbox"
              },
              id: "fieldset",
              impact: "critical",
              message: "Element is contained in a fieldset",
              relatedNodes: []
            }
          ],
          html: '<input type="checkbox" name="major_phy">',
          impact: null,
          none: [],
          target: ['input[name="major_phy"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                name: "major_psy",
                type: "checkbox"
              },
              id: "group-labelledby",
              impact: "critical",
              message:
                'Elements with the name "major_psy" have both a shared label, and a unique label, referenced through aria-labelledby',
              relatedNodes: []
            },
            {
              data: {
                name: "major_psy",
                type: "checkbox"
              },
              id: "fieldset",
              impact: "critical",
              message: "Element is contained in a fieldset",
              relatedNodes: []
            }
          ],
          html: '<input type="checkbox" name="major_psy">',
          impact: null,
          none: [],
          target: ['input[name="major_psy"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                name: "major_sp",
                type: "checkbox"
              },
              id: "group-labelledby",
              impact: "critical",
              message:
                'Elements with the name "major_sp" have both a shared label, and a unique label, referenced through aria-labelledby',
              relatedNodes: []
            },
            {
              data: {
                name: "major_sp",
                type: "checkbox"
              },
              id: "fieldset",
              impact: "critical",
              message: "Element is contained in a fieldset",
              relatedNodes: []
            }
          ],
          html: '<input type="checkbox" name="major_sp">',
          impact: null,
          none: [],
          target: ['input[name="major_sp"]']
        }
      ],
      tags: ["cat.forms", "best-practice"]
    },
    {
      description:
        "Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds",
      help: "Elements must have sufficient color contrast",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/color-contrast?application=webdriverjs",
      id: "color-contrast",
      impact: "serious",
      nodes: [
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#000000",
                contrastRatio: 13.07,
                expectedContrastRatio: "3:1",
                fgColor: "#cccccc",
                fontSize: "18.0pt (24px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.07",
              relatedNodes: []
            }
          ],
          html:
            '<div class="description">\n                AU installs universally designed maps at multiple locations on campus.\n              </div>',
          impact: null,
          none: [],
          target: [
            'a[href="somepage\\.html\\?ref\\=Slide\\%202"] > .description'
          ]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "3:1",
                fgColor: "#000000",
                fontSize: "19.2pt (25.6px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<div class="heading">Welcome!</div>',
          impact: null,
          none: [],
          target: [".heading:nth-child(2)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<p>",
          impact: null,
          none: [],
          target: ["p:nth-child(3)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "3:1",
                fgColor: "#000000",
                fontSize: "19.2pt (25.6px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<div class="heading">Bienvenido!</div>',
          impact: null,
          none: [],
          target: [".heading:nth-child(5)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<p>",
          impact: null,
          none: [],
          target: ["p:nth-child(6)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "3:1",
                fgColor: "#000000",
                fontSize: "19.2pt (25.6px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<div class="heading">Can you spot the barriers?</div>',
          impact: null,
          none: [],
          target: [".heading:nth-child(8)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<p>",
          impact: null,
          none: [],
          target: ["p:nth-child(9)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 7.45,
                expectedContrastRatio: "4.5:1",
                fgColor: "#555555",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 7.45",
              relatedNodes: []
            }
          ],
          html: '<a href="issues.html">click here</a>',
          impact: null,
          none: [],
          target: ['a[href$="issues\\.html"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 7.45,
                expectedContrastRatio: "4.5:1",
                fgColor: "#555555",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 7.45",
              relatedNodes: []
            }
          ],
          html: '<a href="after.html">click here</a>',
          impact: null,
          none: [],
          target: ['a[href$="after\\.html"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 7.45,
                expectedContrastRatio: "4.5:1",
                fgColor: "#555555",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 7.45",
              relatedNodes: []
            }
          ],
          html: '<a href="cheatsheet.html">click here</a>',
          impact: null,
          none: [],
          target: ['a[href$="cheatsheet\\.html"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "3:1",
                fgColor: "#000000",
                fontSize: "19.2pt (25.6px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<div class="heading">AU Enrollment Trends</div>',
          impact: null,
          none: [],
          target: [".heading:nth-child(11)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>2007-08</b>",
          impact: null,
          none: [],
          target: ['td[colspan="\\36 "]:nth-child(2) > b']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>2008-09</b>",
          impact: null,
          none: [],
          target: ['td[colspan="\\36 "]:nth-child(3) > b']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>CS</b>",
          impact: null,
          none: [],
          target: ["tr:nth-child(2) > td:nth-child(2) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Eng</b>",
          impact: null,
          none: [],
          target: ["tr:nth-child(2) > td:nth-child(3) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Eco</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(4) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Phy</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(5) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Psy</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(6) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Spa</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(7) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>CS</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(8) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Eng</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(9) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Eco</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(10) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Phy</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(11) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Psy</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(12) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Spa</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(13) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<b>Total</b>",
          impact: null,
          none: [],
          target: ["td:nth-child(1) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>84</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(2)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>126</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(3)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>43</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(4)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>32</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(5)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>112</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(6)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>59</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(7)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>82</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(8)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>140</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(9)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>45</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(10)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>34</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(11)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>101</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(12)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>64</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(3) > td:nth-child(13)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>% Male</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(1)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>89</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(2)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>84</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(3)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>73</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(4)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>69</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(5)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>20</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(6)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>47</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(7)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>87</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(8)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>80</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(9)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>69</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(10)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>69</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(11)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>22</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(12)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>48</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(4) > td:nth-child(13)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>% Female</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(1)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>11</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(2)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>16</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(3)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>27</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(4)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>31</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(5)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>80</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(6)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>53</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(7)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>13</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(8)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>20</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(9)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>31</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(10)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>31</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(11)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>78</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(12)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<td>52</td>",
          impact: null,
          none: [],
          target: ["tr:nth-child(5) > td:nth-child(13)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "3:1",
                fgColor: "#000000",
                fontSize: "19.2pt (25.6px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html: '<div class="heading">Apply Now!</div>',
          impact: null,
          none: [],
          target: ["#appForm > .heading"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 8.22,
                expectedContrastRatio: "4.5:1",
                fgColor: "#39275b",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 8.22",
              relatedNodes: []
            }
          ],
          html:
            '<p class="required reqExample">(required fields are in blue)</p>',
          impact: null,
          none: [],
          target: [".reqExample"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 8.22,
                expectedContrastRatio: "4.5:1",
                fgColor: "#39275b",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 8.22",
              relatedNodes: []
            }
          ],
          html:
            '<div class="required">\n          Name:\n          <input type="text" name="name">\n        </div>',
          impact: null,
          none: [],
          target: ["form > .required:nth-child(2)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.0pt (13.3333px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<input type="text" name="name">',
          impact: null,
          none: [],
          target: ['input[name="name"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 8.22,
                expectedContrastRatio: "4.5:1",
                fgColor: "#39275b",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 8.22",
              relatedNodes: []
            }
          ],
          html:
            '<div class="required">\n          Email:\n          <input type="text" name="email">\n        </div>',
          impact: null,
          none: [],
          target: [".required:nth-child(3)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.0pt (13.3333px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<input type="text" name="email">',
          impact: null,
          none: [],
          target: ['input[name="email"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div>\n          City:\n          <input type="text" name="city">\n        </div>',
          impact: null,
          none: [],
          target: ["form > div:nth-child(4)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.0pt (13.3333px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<input type="text" name="city">',
          impact: null,
          none: [],
          target: ['input[name="city"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div>\n          State/Province:\n          <input type="text" name="state">\n        </div>',
          impact: null,
          none: [],
          target: ["form > div:nth-child(5)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.0pt (13.3333px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<input type="text" name="state">',
          impact: null,
          none: [],
          target: ['input[name="state"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div>\n          Zip/Postal Code:\n          <input type="text" name="zip">\n        </div>',
          impact: null,
          none: [],
          target: ["form > div:nth-child(6)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.0pt (13.3333px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<input type="text" name="zip">',
          impact: null,
          none: [],
          target: ['input[name="zip"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div>\n          Country:\n          <input type="text" name="country">\n        </div>',
          impact: null,
          none: [],
          target: ["div:nth-child(7)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.0pt (13.3333px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<input type="text" name="country">',
          impact: null,
          none: [],
          target: ['input[name="country"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html: "<b>Desired major(s):</b>",
          impact: null,
          none: [],
          target: ["div:nth-child(8) > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div class="major">Computer Science <input type="checkbox" name="major_cs"></div>',
          impact: null,
          none: [],
          target: [".major:nth-child(1)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div class="major">Engineering <input type="checkbox" name="major_eng"></div>',
          impact: null,
          none: [],
          target: [".major:nth-child(2)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div class="major">Economics <input type="checkbox" name="major_econ"></div>',
          impact: null,
          none: [],
          target: [".major:nth-child(3)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div class="major">Physics <input type="checkbox" name="major_phy"></div>',
          impact: null,
          none: [],
          target: [".major:nth-child(4)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div class="major">Psychology <input type="checkbox" name="major_psy"></div>',
          impact: null,
          none: [],
          target: [".major:nth-child(5)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            '<div class="major">Spanish <input type="checkbox" name="major_sp"></div>',
          impact: null,
          none: [],
          target: [".major:nth-child(6)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "bold",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html: "<b>Security Test</b>",
          impact: null,
          none: [],
          target: ["#captcha > b"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#cccce0",
                contrastRatio: 13.28,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13.28",
              relatedNodes: []
            }
          ],
          html:
            "<p>Please enter the two words you see below, separated by a space</p>",
          impact: null,
          none: [],
          target: ["#captcha > p"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.0pt (13.3333px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<input type="text" name="captcha">',
          impact: null,
          none: [],
          target: ['input[name="captcha"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#dddddd",
                contrastRatio: 15.46,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.0pt (13.3333px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 15.46",
              relatedNodes: []
            }
          ],
          html:
            '<input id="submit" type="submit" name="submit" value="Submit">',
          impact: null,
          none: [],
          target: ["#submit"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.8pt (14.4px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: '<div id="footer">',
          impact: null,
          none: [],
          target: ["#footer"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 13,
                expectedContrastRatio: "4.5:1",
                fgColor: "#39275b",
                fontSize: "10.8pt (14.4px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13",
              relatedNodes: []
            }
          ],
          html:
            '<a href="http://washington.edu/accesscomputing/AU">University of Washington</a>',
          impact: null,
          none: [],
          target: ["#footer > a:nth-child(2)"]
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 13,
                expectedContrastRatio: "4.5:1",
                fgColor: "#39275b",
                fontSize: "10.8pt (14.4px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 13",
              relatedNodes: []
            }
          ],
          html:
            '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>',
          impact: null,
          none: [],
          target: ['#footer > a[rel="license"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#ffffff",
                contrastRatio: 21,
                expectedContrastRatio: "4.5:1",
                fgColor: "#000000",
                fontSize: "10.8pt (14.4px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message: "Element has sufficient color contrast of 21",
              relatedNodes: []
            }
          ],
          html: "<p>",
          impact: null,
          none: [],
          target: ["#footer > p"]
        }
      ],
      tags: ["cat.color", "wcag2aa", "wcag143"]
    },
    {
      description:
        "Ensures each HTML document contains a non-empty <title> element",
      help: "Documents must have <title> element to aid in navigation",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/document-title?application=webdriverjs",
      id: "document-title",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "doc-has-title",
              impact: "serious",
              message: "Document has a non-empty <title> element",
              relatedNodes: []
            }
          ],
          html: '<html class="deque-axe-is-ready">',
          impact: null,
          none: [],
          target: ["html"]
        }
      ],
      tags: ["cat.text-alternatives", "wcag2a", "wcag242"]
    },
    {
      description:
        "Ensures every id attribute value of active elements is unique",
      help: "IDs of active elements must be unique",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/duplicate-id-active?application=webdriverjs",
      id: "duplicate-id-active",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: "submit",
              id: "duplicate-id-active",
              impact: "serious",
              message:
                "Document has no active elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html:
            '<input id="submit" type="submit" name="submit" value="Submit">',
          impact: null,
          none: [],
          target: ["#submit"]
        }
      ],
      tags: ["cat.parsing", "wcag2a", "wcag411"]
    },
    {
      description: "Ensures every id attribute value is unique",
      help: "id attribute value must be unique",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/duplicate-id?application=webdriverjs",
      id: "duplicate-id",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: "content",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<div id="content">',
          impact: null,
          none: [],
          target: ["#content"]
        },
        {
          all: [],
          any: [
            {
              data: "banner",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html:
            '<div id="banner">\n      <img id="logo" src="images/au123456789.gif" alt="logo-441x90" width="441" height="90">\n    </div>',
          impact: null,
          none: [],
          target: ["#banner"]
        },
        {
          all: [],
          any: [
            {
              data: "logo",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html:
            '<img id="logo" src="images/au123456789.gif" alt="logo-441x90" width="441" height="90">',
          impact: null,
          none: [],
          target: ["#logo"]
        },
        {
          all: [],
          any: [
            {
              data: "menu",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<ul id="menu">',
          impact: null,
          none: [],
          target: ["#menu"]
        },
        {
          all: [],
          any: [
            {
              data: "main",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<div id="main">',
          impact: null,
          none: [],
          target: ["#main"]
        },
        {
          all: [],
          any: [
            {
              data: "carousel",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<div id="carousel">',
          impact: null,
          none: [],
          target: ["#carousel"]
        },
        {
          all: [],
          any: [
            {
              data: "enrollment",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<table id="enrollment">',
          impact: null,
          none: [],
          target: ["#enrollment"]
        },
        {
          all: [],
          any: [
            {
              data: "appForm",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<div id="appForm">',
          impact: null,
          none: [],
          target: ["#appForm"]
        },
        {
          all: [],
          any: [
            {
              data: "error",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<div id="error"></div>',
          impact: null,
          none: [],
          target: ["#error"]
        },
        {
          all: [],
          any: [
            {
              data: "majors",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<div id="majors">',
          impact: null,
          none: [],
          target: ["#majors"]
        },
        {
          all: [],
          any: [
            {
              data: "captcha",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html:
            '<div id="captcha">\n          <b>Security Test</b>\n          <p>Please enter the two words you see below, separated by a space</p>\n          <input type="text" name="captcha">\n          <img src="images/captcha.png">\n        </div>',
          impact: null,
          none: [],
          target: ["#captcha"]
        },
        {
          all: [],
          any: [
            {
              data: "footer",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<div id="footer">',
          impact: null,
          none: [],
          target: ["#footer"]
        },
        {
          all: [],
          any: [
            {
              data: "ccLogo",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html:
            '<div id="ccLogo">\n        <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"></a>\n      </div>',
          impact: null,
          none: [],
          target: ["#ccLogo"]
        },
        {
          all: [],
          any: [
            {
              data: "modalMask",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<div id="modalMask"></div>',
          impact: null,
          none: [],
          target: ["#modalMask"]
        },
        {
          all: [],
          any: [
            {
              data: "modalContent",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<div id="modalContent">',
          impact: null,
          none: [],
          target: ["#modalContent"]
        },
        {
          all: [],
          any: [
            {
              data: "modalXButton",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<button type="button" id="modalXButton">x</button>',
          impact: null,
          none: [],
          target: ["#modalXButton"]
        },
        {
          all: [],
          any: [
            {
              data: "modalOkButton",
              id: "duplicate-id",
              impact: "minor",
              message:
                "Document has no static elements that share the same id attribute",
              relatedNodes: []
            }
          ],
          html: '<button type="button" id="modalOkButton">OK</button>',
          impact: null,
          none: [],
          target: ["#modalOkButton"]
        }
      ],
      tags: ["cat.parsing", "wcag2a", "wcag411"]
    },
    {
      description: "Ensures form field does not have multiple label elements",
      help: "Form field must not have multiple label elements",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/form-field-multiple-labels?application=webdriverjs",
      id: "form-field-multiple-labels",
      impact: null,
      nodes: [
        {
          all: [],
          any: [],
          html: '<input type="text" name="name">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="name"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="email">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="email"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="city">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="city"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="state">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="state"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="zip">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="zip"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="country">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="country"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_cs">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_cs"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_eng">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_eng"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_econ">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_econ"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_phy">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_phy"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_psy">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_psy"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_sp">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_sp"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="captcha">',
          impact: null,
          none: [
            {
              data: null,
              id: "multiple-label",
              impact: "moderate",
              message: "Form field does not have multiple label elements",
              relatedNodes: []
            }
          ],
          target: ['input[name="captcha"]']
        }
      ],
      tags: ["cat.forms", "wcag2a", "wcag332"]
    },
    {
      description:
        "Ensures <img> elements have alternate text or a role of none or presentation",
      help: "Images must have alternate text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/image-alt?application=webdriverjs",
      id: "image-alt",
      impact: "critical",
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-alt",
              impact: "critical",
              message: "Element has an alt attribute",
              relatedNodes: []
            }
          ],
          html:
            '<img id="logo" src="images/au123456789.gif" alt="logo-441x90" width="441" height="90">',
          impact: null,
          none: [
            {
              data: null,
              id: "alt-space-value",
              impact: "critical",
              message: "Element has a valid alt attribute value",
              relatedNodes: []
            }
          ],
          target: ["#logo"]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-alt",
              impact: "critical",
              message: "Element has an alt attribute",
              relatedNodes: []
            }
          ],
          html:
            '<img class="hr" src="images/line_gradient.gif" alt="horizontal line graphic">',
          impact: null,
          none: [
            {
              data: null,
              id: "alt-space-value",
              impact: "critical",
              message: "Element has a valid alt attribute value",
              relatedNodes: []
            }
          ],
          target: [
            '.hr[src$="line_gradient\\.gif"][alt="horizontal\\ line\\ graphic"]:nth-child(4)'
          ]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-alt",
              impact: "critical",
              message: "Element has an alt attribute",
              relatedNodes: []
            }
          ],
          html:
            '<img class="hr" src="images/line_gradient.gif" alt="horizontal line graphic">',
          impact: null,
          none: [
            {
              data: null,
              id: "alt-space-value",
              impact: "critical",
              message: "Element has a valid alt attribute value",
              relatedNodes: []
            }
          ],
          target: [
            '.hr[src$="line_gradient\\.gif"][alt="horizontal\\ line\\ graphic"]:nth-child(7)'
          ]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-alt",
              impact: "critical",
              message: "Element has an alt attribute",
              relatedNodes: []
            }
          ],
          html:
            '<img class="hr" src="images/line_gradient.gif" alt="horizontal line graphic">',
          impact: null,
          none: [
            {
              data: null,
              id: "alt-space-value",
              impact: "critical",
              message: "Element has a valid alt attribute value",
              relatedNodes: []
            }
          ],
          target: [
            '.hr[src$="line_gradient\\.gif"][alt="horizontal\\ line\\ graphic"]:nth-child(10)'
          ]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-alt",
              impact: "critical",
              message: "Element has an alt attribute",
              relatedNodes: []
            }
          ],
          html:
            '<img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png">',
          impact: null,
          none: [
            {
              data: null,
              id: "alt-space-value",
              impact: "critical",
              message: "Element has a valid alt attribute value",
              relatedNodes: []
            }
          ],
          target: ['img[alt="Creative\\ Commons\\ License"]']
        }
      ],
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag111",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description: "Ensure image alternative is not repeated as text",
      help: "Alternative text of images should not be repeated as text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/image-redundant-alt?application=webdriverjs",
      id: "image-redundant-alt",
      impact: null,
      nodes: [
        {
          all: [],
          any: [],
          html:
            '<img id="logo" src="images/au123456789.gif" alt="logo-441x90" width="441" height="90">',
          impact: null,
          none: [
            {
              data: null,
              id: "duplicate-img-label",
              impact: "minor",
              message:
                "Element does not duplicate existing text in <img> alt text",
              relatedNodes: []
            }
          ],
          target: ["#logo"]
        },
        {
          all: [],
          any: [],
          html: '<img src="images/slide2.jpg">',
          impact: null,
          none: [
            {
              data: null,
              id: "duplicate-img-label",
              impact: "minor",
              message:
                "Element does not duplicate existing text in <img> alt text",
              relatedNodes: []
            }
          ],
          target: ['img[src$="slide2\\.jpg"]']
        },
        {
          all: [],
          any: [],
          html: '<img src="images/arrow-left.png">',
          impact: null,
          none: [
            {
              data: null,
              id: "duplicate-img-label",
              impact: "minor",
              message:
                "Element does not duplicate existing text in <img> alt text",
              relatedNodes: []
            }
          ],
          target: ['img[src$="arrow-left\\.png"]']
        },
        {
          all: [],
          any: [],
          html: '<img src="images/arrow-right.png">',
          impact: null,
          none: [
            {
              data: null,
              id: "duplicate-img-label",
              impact: "minor",
              message:
                "Element does not duplicate existing text in <img> alt text",
              relatedNodes: []
            }
          ],
          target: ['img[src$="arrow-right\\.png"]']
        },
        {
          all: [],
          any: [],
          html:
            '<img class="hr" src="images/line_gradient.gif" alt="horizontal line graphic">',
          impact: null,
          none: [
            {
              data: null,
              id: "duplicate-img-label",
              impact: "minor",
              message:
                "Element does not duplicate existing text in <img> alt text",
              relatedNodes: []
            }
          ],
          target: [
            '.hr[src$="line_gradient\\.gif"][alt="horizontal\\ line\\ graphic"]:nth-child(4)'
          ]
        },
        {
          all: [],
          any: [],
          html:
            '<img class="hr" src="images/line_gradient.gif" alt="horizontal line graphic">',
          impact: null,
          none: [
            {
              data: null,
              id: "duplicate-img-label",
              impact: "minor",
              message:
                "Element does not duplicate existing text in <img> alt text",
              relatedNodes: []
            }
          ],
          target: [
            '.hr[src$="line_gradient\\.gif"][alt="horizontal\\ line\\ graphic"]:nth-child(7)'
          ]
        },
        {
          all: [],
          any: [],
          html:
            '<img class="hr" src="images/line_gradient.gif" alt="horizontal line graphic">',
          impact: null,
          none: [
            {
              data: null,
              id: "duplicate-img-label",
              impact: "minor",
              message:
                "Element does not duplicate existing text in <img> alt text",
              relatedNodes: []
            }
          ],
          target: [
            '.hr[src$="line_gradient\\.gif"][alt="horizontal\\ line\\ graphic"]:nth-child(10)'
          ]
        },
        {
          all: [],
          any: [],
          html: '<img src="images/captcha.png">',
          impact: null,
          none: [
            {
              data: null,
              id: "duplicate-img-label",
              impact: "minor",
              message:
                "Element does not duplicate existing text in <img> alt text",
              relatedNodes: []
            }
          ],
          target: ['img[src$="captcha\\.png"]']
        },
        {
          all: [],
          any: [],
          html:
            '<img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png">',
          impact: null,
          none: [
            {
              data: null,
              id: "duplicate-img-label",
              impact: "minor",
              message:
                "Element does not duplicate existing text in <img> alt text",
              relatedNodes: []
            }
          ],
          target: ['img[alt="Creative\\ Commons\\ License"]']
        }
      ],
      tags: ["cat.text-alternatives", "best-practice"]
    },
    {
      description: "Ensures input buttons have discernible text",
      help: "Input buttons must have discernible text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/input-button-name?application=webdriverjs",
      id: "input-button-name",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "non-empty-value",
              impact: "critical",
              message: "Element has a non-empty value attribute",
              relatedNodes: []
            }
          ],
          html:
            '<input id="submit" type="submit" name="submit" value="Submit">',
          impact: null,
          none: [],
          target: ["#submit"]
        }
      ],
      tags: [
        "cat.name-role-value",
        "wcag2a",
        "wcag412",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description:
        "Ensures that every form element is not solely labeled using the title or aria-describedby attributes",
      help: "Form elements should have a visible label",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/label-title-only?application=webdriverjs",
      id: "label-title-only",
      impact: null,
      nodes: [
        {
          all: [],
          any: [],
          html: '<input type="text" name="name">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="name"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="email">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="email"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="city">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="city"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="state">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="state"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="zip">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="zip"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="country">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="country"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_cs">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_cs"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_eng">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_eng"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_econ">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_econ"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_phy">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_phy"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_psy">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_psy"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="checkbox" name="major_sp">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="major_sp"]']
        },
        {
          all: [],
          any: [],
          html: '<input type="text" name="captcha">',
          impact: null,
          none: [
            {
              data: null,
              id: "title-only",
              impact: "serious",
              message:
                "Form element does not solely use title attribute for its label",
              relatedNodes: []
            }
          ],
          target: ['input[name="captcha"]']
        }
      ],
      tags: ["cat.forms", "best-practice"]
    },
    {
      description: "Ensures the document has at most one banner landmark",
      help: "Document must not have more than one banner landmark",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/landmark-no-duplicate-banner?application=webdriverjs",
      id: "landmark-no-duplicate-banner",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "page-no-duplicate-banner",
              impact: "moderate",
              message: "Document does not have more than one banner landmark",
              relatedNodes: []
            }
          ],
          html: '<html class="deque-axe-is-ready">',
          impact: null,
          none: [],
          target: ["html"]
        }
      ],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description: "Ensures the document has at most one contentinfo landmark",
      help: "Document must not have more than one contentinfo landmark",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/landmark-no-duplicate-contentinfo?application=webdriverjs",
      id: "landmark-no-duplicate-contentinfo",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "page-no-duplicate-contentinfo",
              impact: "moderate",
              message:
                "Document does not have more than one contentinfo landmark",
              relatedNodes: []
            }
          ],
          html: '<html class="deque-axe-is-ready">',
          impact: null,
          none: [],
          target: ["html"]
        }
      ],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description: "Ensures links have discernible text",
      help: "Links must have discernible text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/link-name?application=webdriverjs",
      id: "link-name",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html: '<a href="#">About</a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['li:nth-child(1) > a[href="\\#"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html: '<a href="#">Academics</a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['li:nth-child(2) > a[href="\\#"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html: '<a href="#">Admissions</a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['li:nth-child(3) > a[href="\\#"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html: '<a href="#">Visitors</a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['li:nth-child(4) > a[href="\\#"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html:
            '<a href="somepage.html?ref=Slide%202">\n              <img src="images/slide2.jpg">\n              <div class="description">\n                AU installs universally designed maps at multiple locations on campus.\n              </div>\n            </a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['a[href="somepage\\.html\\?ref\\=Slide\\%202"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html: '<a href="issues.html">click here</a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['a[href$="issues\\.html"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html: '<a href="after.html">click here</a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['a[href$="after\\.html"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html: '<a href="cheatsheet.html">click here</a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['a[href$="cheatsheet\\.html"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html:
            '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"></a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['#ccLogo > a[rel="license"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html:
            '<a href="http://washington.edu/accesscomputing/AU">University of Washington</a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ["#footer > a:nth-child(2)"]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-visible-text",
              impact: "minor",
              message: "Element has text that is visible to screen readers",
              relatedNodes: []
            }
          ],
          html:
            '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>',
          impact: null,
          none: [
            {
              data: null,
              id: "focusable-no-name",
              impact: "serious",
              message: "Element is not in tab order or has accessible text",
              relatedNodes: []
            }
          ],
          target: ['#footer > a[rel="license"]']
        }
      ],
      tags: [
        "cat.name-role-value",
        "wcag2a",
        "wcag412",
        "wcag244",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description: "Ensures that lists are structured correctly",
      help:
        "<ul> and <ol> must only directly contain <li>, <script> or <template> elements",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/list?application=webdriverjs",
      id: "list",
      impact: null,
      nodes: [
        {
          all: [],
          any: [],
          html: '<ul id="menu">',
          impact: null,
          none: [
            {
              data: null,
              id: "only-listitems",
              impact: "serious",
              message:
                "List element only has direct children that are allowed inside <li> elements",
              relatedNodes: []
            }
          ],
          target: ["#menu"]
        },
        {
          all: [],
          any: [],
          html:
            '<ul class="lentils"><li data-slide="0" class="active"></li><li data-slide="1"></li><li data-slide="2"></li></ul>',
          impact: null,
          none: [
            {
              data: null,
              id: "only-listitems",
              impact: "serious",
              message:
                "List element only has direct children that are allowed inside <li> elements",
              relatedNodes: []
            }
          ],
          target: [".lentils"]
        }
      ],
      tags: ["cat.structure", "wcag2a", "wcag131"]
    },
    {
      description: "Ensures <li> elements are used semantically",
      help: "<li> elements must be contained in a <ul> or <ol>",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/listitem?application=webdriverjs",
      id: "listitem",
      impact: null,
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "listitem",
              impact: "serious",
              message:
                'List item has a <ul>, <ol> or role="list" parent element',
              relatedNodes: []
            }
          ],
          html: "<li>",
          impact: null,
          none: [],
          target: ["#menu > li:nth-child(1)"]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "listitem",
              impact: "serious",
              message:
                'List item has a <ul>, <ol> or role="list" parent element',
              relatedNodes: []
            }
          ],
          html: "<li>",
          impact: null,
          none: [],
          target: ["#menu > li:nth-child(2)"]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "listitem",
              impact: "serious",
              message:
                'List item has a <ul>, <ol> or role="list" parent element',
              relatedNodes: []
            }
          ],
          html: "<li>",
          impact: null,
          none: [],
          target: ["#menu > li:nth-child(3)"]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "listitem",
              impact: "serious",
              message:
                'List item has a <ul>, <ol> or role="list" parent element',
              relatedNodes: []
            }
          ],
          html:
            '<li><a href="#">Visitors</a>\n        <ul>\n          <li><a href="somepage.html?ref=Events">Events</a></li>\n          <li><a href="somepage.html?ref=Campus_Map">Campus Map</a></li>\n          <li><a href="somepage.html?ref=Parking">Parking</a></li>\n        </ul>\n      </li>',
          impact: null,
          none: [],
          target: ["#menu > li:nth-child(4)"]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "listitem",
              impact: "serious",
              message:
                'List item has a <ul>, <ol> or role="list" parent element',
              relatedNodes: []
            }
          ],
          html: '<li data-slide="0" class="active"></li>',
          impact: null,
          none: [],
          target: [".active"]
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "listitem",
              impact: "serious",
              message:
                'List item has a <ul>, <ol> or role="list" parent element',
              relatedNodes: []
            }
          ],
          html: '<li data-slide="1"></li>',
          impact: null,
          none: [],
          target: ['li[data-slide="\\31 "]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "listitem",
              impact: "serious",
              message:
                'List item has a <ul>, <ol> or role="list" parent element',
              relatedNodes: []
            }
          ],
          html: '<li data-slide="2"></li>',
          impact: null,
          none: [],
          target: ['li[data-slide="\\32 "]']
        }
      ],
      tags: ["cat.structure", "wcag2a", "wcag131"]
    },
    {
      description:
        "Ensure that tables do not have the same summary and caption",
      help:
        "The <caption> element should not contain the same text as the summary attribute",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/table-duplicate-name?application=webdriverjs",
      id: "table-duplicate-name",
      impact: null,
      nodes: [
        {
          all: [],
          any: [],
          html: '<table id="enrollment">',
          impact: null,
          none: [
            {
              data: null,
              id: "same-caption-summary",
              impact: "minor",
              message:
                "Content of summary attribute and <caption> are not duplicated",
              relatedNodes: []
            }
          ],
          target: ["#enrollment"]
        }
      ],
      tags: ["cat.tables", "best-practice"]
    },
    {
      description:
        "Ensure that each cell in a table using the headers refers to another cell in that table",
      help:
        "All cells in a table element that use the headers attribute must only refer to other cells of that same table",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/td-headers-attr?application=webdriverjs",
      id: "td-headers-attr",
      impact: null,
      nodes: [
        {
          all: [
            {
              data: null,
              id: "td-headers-attr",
              impact: "serious",
              message:
                "The headers attribute is exclusively used to refer to other cells in the table",
              relatedNodes: []
            }
          ],
          any: [],
          html: '<table id="enrollment">',
          impact: null,
          none: [],
          target: ["#enrollment"]
        }
      ],
      tags: ["cat.tables", "wcag2a", "wcag131", "section508", "section508.22.g"]
    },
    {
      description:
        "Ensure that each table header in a data table refers to data cells",
      help:
        "All th elements and elements with role=columnheader/rowheader must have data cells they describe",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/th-has-data-cells?application=webdriverjs",
      id: "th-has-data-cells",
      impact: null,
      nodes: [
        {
          all: [
            {
              data: null,
              id: "th-has-data-cells",
              impact: "serious",
              message: "All table header cells refer to data cells",
              relatedNodes: []
            }
          ],
          any: [],
          html: '<table id="enrollment">',
          impact: null,
          none: [],
          target: ["#enrollment"]
        }
      ],
      tags: ["cat.tables", "wcag2a", "wcag131", "section508", "section508.22.g"]
    }
  ],
  testEngine: {
    name: "axe-core",
    version: "3.3.2"
  },
  testEnvironment: {
    orientationAngle: 0,
    orientationType: "landscape-primary",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/78.0.3904.108 Safari/537.36",
    windowHeight: 600,
    windowWidth: 800
  },
  testRunner: {
    name: "axe"
  },
  timestamp: "2019-11-24T03:05:57.465Z",
  toolOptions: {
    reporter: "v1"
  },
  url: "https://markreay.github.io/AU/before.html",
  violations: [
    {
      description:
        "Ensures each page has at least one mechanism for a user to bypass navigation and jump straight to the content",
      help: "Page must have means to bypass repeated blocks",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/bypass?application=webdriverjs",
      id: "bypass",
      impact: "serious",
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "internal-link-present",
              impact: "serious",
              message: "No valid skip link found",
              relatedNodes: []
            },
            {
              data: null,
              id: "header-present",
              impact: "serious",
              message: "Page does not have a header",
              relatedNodes: []
            },
            {
              data: null,
              id: "landmark",
              impact: "serious",
              message: "Page does not have a landmark region",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  No valid skip link found\n  Page does not have a header\n  Page does not have a landmark region",
          html: '<html class="deque-axe-is-ready">',
          impact: "serious",
          none: [],
          target: ["html"]
        }
      ],
      tags: [
        "cat.keyboard",
        "wcag2a",
        "wcag241",
        "section508",
        "section508.22.o"
      ]
    },
    {
      description:
        "Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds",
      help: "Elements must have sufficient color contrast",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/color-contrast?application=webdriverjs",
      id: "color-contrast",
      impact: "serious",
      nodes: [
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#e7ecd8",
                contrastRatio: 2.52,
                expectedContrastRatio: "4.5:1",
                fgColor: "#8a94a8",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message:
                "Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
              relatedNodes: [
                {
                  html: "<li>",
                  target: ["#menu > li:nth-child(1)"]
                }
              ]
            }
          ],
          failureSummary:
            "Fix any of the following:\n  Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
          html: '<a href="#">About</a>',
          impact: "serious",
          none: [],
          target: ['li:nth-child(1) > a[href="\\#"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#e7ecd8",
                contrastRatio: 2.52,
                expectedContrastRatio: "4.5:1",
                fgColor: "#8a94a8",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message:
                "Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
              relatedNodes: [
                {
                  html: "<li>",
                  target: ["#menu > li:nth-child(2)"]
                }
              ]
            }
          ],
          failureSummary:
            "Fix any of the following:\n  Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
          html: '<a href="#">Academics</a>',
          impact: "serious",
          none: [],
          target: ['li:nth-child(2) > a[href="\\#"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#e7ecd8",
                contrastRatio: 2.52,
                expectedContrastRatio: "4.5:1",
                fgColor: "#8a94a8",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message:
                "Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
              relatedNodes: [
                {
                  html: "<li>",
                  target: ["#menu > li:nth-child(3)"]
                }
              ]
            }
          ],
          failureSummary:
            "Fix any of the following:\n  Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
          html: '<a href="#">Admissions</a>',
          impact: "serious",
          none: [],
          target: ['li:nth-child(3) > a[href="\\#"]']
        },
        {
          all: [],
          any: [
            {
              data: {
                bgColor: "#e7ecd8",
                contrastRatio: 2.52,
                expectedContrastRatio: "4.5:1",
                fgColor: "#8a94a8",
                fontSize: "12.0pt (16px)",
                fontWeight: "normal",
                missingData: null
              },
              id: "color-contrast",
              impact: "serious",
              message:
                "Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
              relatedNodes: [
                {
                  html:
                    '<li><a href="#">Visitors</a>\n        <ul>\n          <li><a href="somepage.html?ref=Events">Events</a></li>\n          <li><a href="somepage.html?ref=Campus_Map">Campus Map</a></li>\n          <li><a href="somepage.html?ref=Parking">Parking</a></li>\n        </ul>\n      </li>',
                  target: ["#menu > li:nth-child(4)"]
                }
              ]
            }
          ],
          failureSummary:
            "Fix any of the following:\n  Element has insufficient color contrast of 2.52 (foreground color: #8a94a8, background color: #e7ecd8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
          html: '<a href="#">Visitors</a>',
          impact: "serious",
          none: [],
          target: ['li:nth-child(4) > a[href="\\#"]']
        }
      ],
      tags: ["cat.color", "wcag2aa", "wcag143"]
    },
    {
      description: "Ensures every HTML document has a lang attribute",
      help: "<html> element must have a lang attribute",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/html-has-lang?application=webdriverjs",
      id: "html-has-lang",
      impact: "serious",
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-lang",
              impact: "serious",
              message: "The <html> element does not have a lang attribute",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  The <html> element does not have a lang attribute",
          html: '<html class="deque-axe-is-ready">',
          impact: "serious",
          none: [],
          target: ["html"]
        }
      ],
      tags: ["cat.language", "wcag2a", "wcag311"]
    },
    {
      description:
        "Ensures <img> elements have alternate text or a role of none or presentation",
      help: "Images must have alternate text",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/image-alt?application=webdriverjs",
      id: "image-alt",
      impact: "critical",
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-alt",
              impact: "critical",
              message: "Element does not have an alt attribute",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "role-presentation",
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="presentation"',
              relatedNodes: []
            },
            {
              data: null,
              id: "role-none",
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="none"',
              relatedNodes: []
            }
          ],
          failureSummary:
            'Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute or the title attribute is empty\n  Element\'s default semantics were not overridden with role="presentation"\n  Element\'s default semantics were not overridden with role="none"',
          html: '<img src="images/slide2.jpg">',
          impact: "critical",
          none: [],
          target: ['img[src$="slide2\\.jpg"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-alt",
              impact: "critical",
              message: "Element does not have an alt attribute",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "role-presentation",
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="presentation"',
              relatedNodes: []
            },
            {
              data: null,
              id: "role-none",
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="none"',
              relatedNodes: []
            }
          ],
          failureSummary:
            'Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute or the title attribute is empty\n  Element\'s default semantics were not overridden with role="presentation"\n  Element\'s default semantics were not overridden with role="none"',
          html: '<img src="images/arrow-left.png">',
          impact: "critical",
          none: [],
          target: ['img[src$="arrow-left\\.png"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-alt",
              impact: "critical",
              message: "Element does not have an alt attribute",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "role-presentation",
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="presentation"',
              relatedNodes: []
            },
            {
              data: null,
              id: "role-none",
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="none"',
              relatedNodes: []
            }
          ],
          failureSummary:
            'Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute or the title attribute is empty\n  Element\'s default semantics were not overridden with role="presentation"\n  Element\'s default semantics were not overridden with role="none"',
          html: '<img src="images/arrow-right.png">',
          impact: "critical",
          none: [],
          target: ['img[src$="arrow-right\\.png"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "has-alt",
              impact: "critical",
              message: "Element does not have an alt attribute",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "role-presentation",
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="presentation"',
              relatedNodes: []
            },
            {
              data: null,
              id: "role-none",
              impact: "minor",
              message:
                'Element\'s default semantics were not overridden with role="none"',
              relatedNodes: []
            }
          ],
          failureSummary:
            'Fix any of the following:\n  Element does not have an alt attribute\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Element has no title attribute or the title attribute is empty\n  Element\'s default semantics were not overridden with role="presentation"\n  Element\'s default semantics were not overridden with role="none"',
          html: '<img src="images/captcha.png">',
          impact: "critical",
          none: [],
          target: ['img[src$="captcha\\.png"]']
        }
      ],
      tags: [
        "cat.text-alternatives",
        "wcag2a",
        "wcag111",
        "section508",
        "section508.22.a"
      ]
    },
    {
      description: "Ensures every form element has a label",
      help: "Form elements must have labels",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/label?application=webdriverjs",
      id: "label",
      impact: "critical",
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="text" name="name">',
          impact: "critical",
          none: [],
          target: ['input[name="name"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="text" name="email">',
          impact: "critical",
          none: [],
          target: ['input[name="email"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="text" name="city">',
          impact: "critical",
          none: [],
          target: ['input[name="city"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="text" name="state">',
          impact: "critical",
          none: [],
          target: ['input[name="state"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="text" name="zip">',
          impact: "critical",
          none: [],
          target: ['input[name="zip"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="text" name="country">',
          impact: "critical",
          none: [],
          target: ['input[name="country"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="checkbox" name="major_cs">',
          impact: "critical",
          none: [],
          target: ['input[name="major_cs"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="checkbox" name="major_eng">',
          impact: "critical",
          none: [],
          target: ['input[name="major_eng"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="checkbox" name="major_econ">',
          impact: "critical",
          none: [],
          target: ['input[name="major_econ"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="checkbox" name="major_phy">',
          impact: "critical",
          none: [],
          target: ['input[name="major_phy"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="checkbox" name="major_psy">',
          impact: "critical",
          none: [],
          target: ['input[name="major_psy"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="checkbox" name="major_sp">',
          impact: "critical",
          none: [],
          target: ['input[name="major_sp"]']
        },
        {
          all: [],
          any: [
            {
              data: null,
              id: "aria-label",
              impact: "serious",
              message: "aria-label attribute does not exist or is empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "aria-labelledby",
              impact: "serious",
              message:
                "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
              relatedNodes: []
            },
            {
              data: null,
              id: "implicit-label",
              impact: "critical",
              message:
                "Form element does not have an implicit (wrapped) <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "explicit-label",
              impact: "critical",
              message: "Form element does not have an explicit <label>",
              relatedNodes: []
            },
            {
              data: null,
              id: "non-empty-title",
              impact: "serious",
              message:
                "Element has no title attribute or the title attribute is empty",
              relatedNodes: []
            }
          ],
          failureSummary:
            "Fix any of the following:\n  aria-label attribute does not exist or is empty\n  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty\n  Form element does not have an implicit (wrapped) <label>\n  Form element does not have an explicit <label>\n  Element has no title attribute or the title attribute is empty",
          html: '<input type="text" name="captcha">',
          impact: "critical",
          none: [],
          target: ['input[name="captcha"]']
        }
      ],
      tags: [
        "cat.forms",
        "wcag2a",
        "wcag332",
        "wcag131",
        "section508",
        "section508.22.n"
      ]
    },
    {
      description:
        "Ensures the document has only one main landmark and each iframe in the page has at most one main landmark",
      help: "Document must have one main landmark",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/landmark-one-main?application=webdriverjs",
      id: "landmark-one-main",
      impact: "moderate",
      nodes: [
        {
          all: [
            {
              data: null,
              id: "page-has-main",
              impact: "moderate",
              message: "Document does not have a main landmark",
              relatedNodes: []
            }
          ],
          any: [],
          failureSummary:
            "Fix all of the following:\n  Document does not have a main landmark",
          html: '<html class="deque-axe-is-ready">',
          impact: "moderate",
          none: [],
          target: ["html"]
        }
      ],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description:
        "Ensure that the page, or at least one of its frames contains a level-one heading",
      help: "Page must contain a level-one heading",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/page-has-heading-one?application=webdriverjs",
      id: "page-has-heading-one",
      impact: "moderate",
      nodes: [
        {
          all: [
            {
              data: null,
              id: "page-has-heading-one",
              impact: "moderate",
              message: "Page must have a level-one heading",
              relatedNodes: []
            }
          ],
          any: [],
          failureSummary:
            "Fix all of the following:\n  Page must have a level-one heading",
          html: '<html class="deque-axe-is-ready">',
          impact: "moderate",
          none: [],
          target: ["html"]
        }
      ],
      tags: ["cat.semantics", "best-practice"]
    },
    {
      description: "Ensures all page content is contained by landmarks",
      help: "All page content must be contained by landmarks",
      helpUrl:
        "https://dequeuniversity.com/rules/axe/3.3/region?application=webdriverjs",
      id: "region",
      impact: "moderate",
      nodes: [
        {
          all: [],
          any: [
            {
              data: null,
              id: "region",
              impact: "moderate",
              message: "Some page content is not contained by landmarks",
              relatedNodes: [
                {
                  html:
                    '<img id="logo" src="images/au123456789.gif" alt="logo-441x90" width="441" height="90">',
                  target: ["#logo"]
                },
                {
                  html: '<a href="#">About</a>',
                  target: ['li:nth-child(1) > a[href="\\#"]']
                },
                {
                  html: '<a href="#">Academics</a>',
                  target: ['li:nth-child(2) > a[href="\\#"]']
                },
                {
                  html: '<a href="#">Admissions</a>',
                  target: ['li:nth-child(3) > a[href="\\#"]']
                },
                {
                  html: '<a href="#">Visitors</a>',
                  target: ['li:nth-child(4) > a[href="\\#"]']
                },
                {
                  html: '<img src="images/slide2.jpg">',
                  target: ['img[src$="slide2\\.jpg"]']
                },
                {
                  html:
                    '<div class="description">\n                AU installs universally designed maps at multiple locations on campus.\n              </div>',
                  target: [
                    'a[href="somepage\\.html\\?ref\\=Slide\\%202"] > .description'
                  ]
                },
                {
                  html: '<img src="images/arrow-left.png">',
                  target: ['img[src$="arrow-left\\.png"]']
                },
                {
                  html: '<img src="images/arrow-right.png">',
                  target: ['img[src$="arrow-right\\.png"]']
                },
                {
                  html: '<div class="heading">Welcome!</div>',
                  target: [".heading:nth-child(2)"]
                },
                {
                  html: "<p>",
                  target: ["p:nth-child(3)"]
                },
                {
                  html:
                    '<img class="hr" src="images/line_gradient.gif" alt="horizontal line graphic">',
                  target: [
                    '.hr[src$="line_gradient\\.gif"][alt="horizontal\\ line\\ graphic"]:nth-child(4)'
                  ]
                },
                {
                  html: '<div class="heading">Bienvenido!</div>',
                  target: [".heading:nth-child(5)"]
                },
                {
                  html: "<p>",
                  target: ["p:nth-child(6)"]
                },
                {
                  html:
                    '<img class="hr" src="images/line_gradient.gif" alt="horizontal line graphic">',
                  target: [
                    '.hr[src$="line_gradient\\.gif"][alt="horizontal\\ line\\ graphic"]:nth-child(7)'
                  ]
                },
                {
                  html: '<div class="heading">Can you spot the barriers?</div>',
                  target: [".heading:nth-child(8)"]
                },
                {
                  html: "<p>",
                  target: ["p:nth-child(9)"]
                },
                {
                  html:
                    '<img class="hr" src="images/line_gradient.gif" alt="horizontal line graphic">',
                  target: [
                    '.hr[src$="line_gradient\\.gif"][alt="horizontal\\ line\\ graphic"]:nth-child(10)'
                  ]
                },
                {
                  html: '<div class="heading">AU Enrollment Trends</div>',
                  target: [".heading:nth-child(11)"]
                },
                {
                  html: "<b>2007-08</b>",
                  target: ['td[colspan="\\36 "]:nth-child(2) > b']
                },
                {
                  html: "<b>2008-09</b>",
                  target: ['td[colspan="\\36 "]:nth-child(3) > b']
                },
                {
                  html: "<b>CS</b>",
                  target: ["tr:nth-child(2) > td:nth-child(2) > b"]
                },
                {
                  html: "<b>Eng</b>",
                  target: ["tr:nth-child(2) > td:nth-child(3) > b"]
                },
                {
                  html: "<b>Eco</b>",
                  target: ["td:nth-child(4) > b"]
                },
                {
                  html: "<b>Phy</b>",
                  target: ["td:nth-child(5) > b"]
                },
                {
                  html: "<b>Psy</b>",
                  target: ["td:nth-child(6) > b"]
                },
                {
                  html: "<b>Spa</b>",
                  target: ["td:nth-child(7) > b"]
                },
                {
                  html: "<b>CS</b>",
                  target: ["td:nth-child(8) > b"]
                },
                {
                  html: "<b>Eng</b>",
                  target: ["td:nth-child(9) > b"]
                },
                {
                  html: "<b>Eco</b>",
                  target: ["td:nth-child(10) > b"]
                },
                {
                  html: "<b>Phy</b>",
                  target: ["td:nth-child(11) > b"]
                },
                {
                  html: "<b>Psy</b>",
                  target: ["td:nth-child(12) > b"]
                },
                {
                  html: "<b>Spa</b>",
                  target: ["td:nth-child(13) > b"]
                },
                {
                  html: "<b>Total</b>",
                  target: ["td:nth-child(1) > b"]
                },
                {
                  html: "<td>84</td>",
                  target: ["tr:nth-child(3) > td:nth-child(2)"]
                },
                {
                  html: "<td>126</td>",
                  target: ["tr:nth-child(3) > td:nth-child(3)"]
                },
                {
                  html: "<td>43</td>",
                  target: ["tr:nth-child(3) > td:nth-child(4)"]
                },
                {
                  html: "<td>32</td>",
                  target: ["tr:nth-child(3) > td:nth-child(5)"]
                },
                {
                  html: "<td>112</td>",
                  target: ["tr:nth-child(3) > td:nth-child(6)"]
                },
                {
                  html: "<td>59</td>",
                  target: ["tr:nth-child(3) > td:nth-child(7)"]
                },
                {
                  html: "<td>82</td>",
                  target: ["tr:nth-child(3) > td:nth-child(8)"]
                },
                {
                  html: "<td>140</td>",
                  target: ["tr:nth-child(3) > td:nth-child(9)"]
                },
                {
                  html: "<td>45</td>",
                  target: ["tr:nth-child(3) > td:nth-child(10)"]
                },
                {
                  html: "<td>34</td>",
                  target: ["tr:nth-child(3) > td:nth-child(11)"]
                },
                {
                  html: "<td>101</td>",
                  target: ["tr:nth-child(3) > td:nth-child(12)"]
                },
                {
                  html: "<td>64</td>",
                  target: ["tr:nth-child(3) > td:nth-child(13)"]
                },
                {
                  html: "<td>% Male</td>",
                  target: ["tr:nth-child(4) > td:nth-child(1)"]
                },
                {
                  html: "<td>89</td>",
                  target: ["tr:nth-child(4) > td:nth-child(2)"]
                },
                {
                  html: "<td>84</td>",
                  target: ["tr:nth-child(4) > td:nth-child(3)"]
                },
                {
                  html: "<td>73</td>",
                  target: ["tr:nth-child(4) > td:nth-child(4)"]
                },
                {
                  html: "<td>69</td>",
                  target: ["tr:nth-child(4) > td:nth-child(5)"]
                },
                {
                  html: "<td>20</td>",
                  target: ["tr:nth-child(4) > td:nth-child(6)"]
                },
                {
                  html: "<td>47</td>",
                  target: ["tr:nth-child(4) > td:nth-child(7)"]
                },
                {
                  html: "<td>87</td>",
                  target: ["tr:nth-child(4) > td:nth-child(8)"]
                },
                {
                  html: "<td>80</td>",
                  target: ["tr:nth-child(4) > td:nth-child(9)"]
                },
                {
                  html: "<td>69</td>",
                  target: ["tr:nth-child(4) > td:nth-child(10)"]
                },
                {
                  html: "<td>69</td>",
                  target: ["tr:nth-child(4) > td:nth-child(11)"]
                },
                {
                  html: "<td>22</td>",
                  target: ["tr:nth-child(4) > td:nth-child(12)"]
                },
                {
                  html: "<td>48</td>",
                  target: ["tr:nth-child(4) > td:nth-child(13)"]
                },
                {
                  html: "<td>% Female</td>",
                  target: ["tr:nth-child(5) > td:nth-child(1)"]
                },
                {
                  html: "<td>11</td>",
                  target: ["tr:nth-child(5) > td:nth-child(2)"]
                },
                {
                  html: "<td>16</td>",
                  target: ["tr:nth-child(5) > td:nth-child(3)"]
                },
                {
                  html: "<td>27</td>",
                  target: ["tr:nth-child(5) > td:nth-child(4)"]
                },
                {
                  html: "<td>31</td>",
                  target: ["tr:nth-child(5) > td:nth-child(5)"]
                },
                {
                  html: "<td>80</td>",
                  target: ["tr:nth-child(5) > td:nth-child(6)"]
                },
                {
                  html: "<td>53</td>",
                  target: ["tr:nth-child(5) > td:nth-child(7)"]
                },
                {
                  html: "<td>13</td>",
                  target: ["tr:nth-child(5) > td:nth-child(8)"]
                },
                {
                  html: "<td>20</td>",
                  target: ["tr:nth-child(5) > td:nth-child(9)"]
                },
                {
                  html: "<td>31</td>",
                  target: ["tr:nth-child(5) > td:nth-child(10)"]
                },
                {
                  html: "<td>31</td>",
                  target: ["tr:nth-child(5) > td:nth-child(11)"]
                },
                {
                  html: "<td>78</td>",
                  target: ["tr:nth-child(5) > td:nth-child(12)"]
                },
                {
                  html: "<td>52</td>",
                  target: ["tr:nth-child(5) > td:nth-child(13)"]
                },
                {
                  html: '<div class="heading">Apply Now!</div>',
                  target: ["#appForm > .heading"]
                },
                {
                  html:
                    '<p class="required reqExample">(required fields are in blue)</p>',
                  target: [".reqExample"]
                },
                {
                  html:
                    '<div class="required">\n          Name:\n          <input type="text" name="name">\n        </div>',
                  target: ["form > .required:nth-child(2)"]
                },
                {
                  html:
                    '<div class="required">\n          Email:\n          <input type="text" name="email">\n        </div>',
                  target: [".required:nth-child(3)"]
                },
                {
                  html:
                    '<div>\n          City:\n          <input type="text" name="city">\n        </div>',
                  target: ["form > div:nth-child(4)"]
                },
                {
                  html:
                    '<div>\n          State/Province:\n          <input type="text" name="state">\n        </div>',
                  target: ["form > div:nth-child(5)"]
                },
                {
                  html:
                    '<div>\n          Zip/Postal Code:\n          <input type="text" name="zip">\n        </div>',
                  target: ["form > div:nth-child(6)"]
                },
                {
                  html:
                    '<div>\n          Country:\n          <input type="text" name="country">\n        </div>',
                  target: ["div:nth-child(7)"]
                },
                {
                  html: "<b>Desired major(s):</b>",
                  target: ["div:nth-child(8) > b"]
                },
                {
                  html:
                    '<div class="major">Computer Science <input type="checkbox" name="major_cs"></div>',
                  target: [".major:nth-child(1)"]
                },
                {
                  html:
                    '<div class="major">Engineering <input type="checkbox" name="major_eng"></div>',
                  target: [".major:nth-child(2)"]
                },
                {
                  html:
                    '<div class="major">Economics <input type="checkbox" name="major_econ"></div>',
                  target: [".major:nth-child(3)"]
                },
                {
                  html:
                    '<div class="major">Physics <input type="checkbox" name="major_phy"></div>',
                  target: [".major:nth-child(4)"]
                },
                {
                  html:
                    '<div class="major">Psychology <input type="checkbox" name="major_psy"></div>',
                  target: [".major:nth-child(5)"]
                },
                {
                  html:
                    '<div class="major">Spanish <input type="checkbox" name="major_sp"></div>',
                  target: [".major:nth-child(6)"]
                },
                {
                  html: "<b>Security Test</b>",
                  target: ["#captcha > b"]
                },
                {
                  html:
                    "<p>Please enter the two words you see below, separated by a space</p>",
                  target: ["#captcha > p"]
                },
                {
                  html: '<input type="text" name="captcha">',
                  target: ['input[name="captcha"]']
                },
                {
                  html: '<img src="images/captcha.png">',
                  target: ['img[src$="captcha\\.png"]']
                },
                {
                  html:
                    '<input id="submit" type="submit" name="submit" value="Submit">',
                  target: ["#submit"]
                },
                {
                  html: '<div id="footer">',
                  target: ["#footer"]
                }
              ]
            }
          ],
          failureSummary:
            "Fix any of the following:\n  Some page content is not contained by landmarks",
          html: '<html class="deque-axe-is-ready">',
          impact: "moderate",
          none: [],
          target: ["html"]
        }
      ],
      tags: ["cat.keyboard", "best-practice"]
    }
  ]
};
