// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>If a custom widget has a visible label or instructions, they must be programmatically determinable.</p>

        <h2>Why it matters</h2>
        <p>
            People with good vision can identify a widget's label and instructions by visually scanning the page and interpreting visual
            characteristics such as proximity. To provide an equivalent experience for people who use assistive technologies, a widget's
            label and instructions must be programmatically related to it.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Link.VoiceControlVideo>This short video on voice control</Link.VoiceControlVideo> shows how programmatically related labels
            help people who use voice control.
        </p>
        <p>
            <Link.FormLabelsVideo>This short video on form labels</Link.FormLabelsVideo> shows how programmatically related labels help
            people who use screen readers.
        </p>

        <h2>How to fix</h2>
        <p>Make sure all of the widget's visible label and instructions are included in its accessible name or accessible description.</p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>This combo box is followed by instructions that are not programmatically related to it.</p>}
            failExample={`<label for="size-input" id="size-label" class="combobox-label">Shirt size </label>
            <div role="combobox" aria-expanded="false" aria-owns="size-listbox" aria-haspopup="listbox" id="size-combobox">
            <input type="text" aria-autocomplete="list" aria-controls="size-listbox" id="size-input">
            </div>
            [<div>Shirt sizes are unisex and can be worn by both men and women. Women typically choose smaller sizes, such as xxs-m, while
            men choose s-xxl.</div>]`}
            passText={
                <p>
                    The combo box's instructions are programmatically related to it using <Markup.Code>aria-describedby</Markup.Code>.
                </p>
            }
            passExample={`<label for="size-input" id="size-label" class="combobox-label">Shirt size </label>
            <div role="combobox" aria-expanded="false" aria-owns="size-listbox" aria-haspopup="listbox" id="size-combobox"{' '}
            [aria-describedby="size-description"]>
            <input type="text" aria-autocomplete="list" aria-controls="size-listbox" id="size-input">
            </div>
            <div [id="size-description"]>Shirt sizes are unisex and can be worn by both men and women.
            Women typically choose smaller sizes, such as xxs-m, while men choose s-xxl.</div>`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html">
                Understanding 2.5.3 Label in Name
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G208">
                Ensure the "accessible name" includes the visible text
            </Markup.HyperLink>
        </Markup.Links>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA14">
                Using aria-label to provide an invisible label where a visible label cannot be used
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA16">
                Using aria-labelledby to provide a name for user interface controls
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F96">
                Failure due to "accessible name" not containing the visible label text
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA1">
                Using the aria-describedby property to provide a descriptive label for user interface controls
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
