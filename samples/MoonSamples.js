enyo.kind({
    name: "ilib.moon.sample.ButtonSample",
    components: [
        {classes: "moon-button-sample-wrapper", components: [
            {kind: "moon.Divider", content: "Buttons", classes: "moon-10h"},

            {name: "B Button", kind: "moon.Button", content: "B"},
            {name: "Button", kind: "moon.Button", content: "Button"},
            {name: "Long Button", kind: "moon.Button", content: "Looooooooooooooooong Button"},
            {tag: "br"},
            {tag: "br"},

            {name: "Small B Button", kind: "moon.Button", small: true, content: "B"},
            {name: "Small Button", kind: "moon.Button", small: true, content: "Button"},
            {name: "Small Long Button", kind: "moon.Button", small: true, content: "Looooooooooooooooong Button"}
        ]},
    ]
});

enyo.kind({
    name: "ilib.moon.sample.DividerSample",
    classes: "moon enyo-unselectable",
    components: [
        {classes:"moon-4h", components: [
            {kind: "moon.Divider", content: "Divider 1"},
            {kind: "moon.Item", content: "Item 1"},
            {kind: "moon.Item", content: "Item 2"},
            {kind: "moon.Item", content: "Item 3"},
            {kind: "moon.Item", content: "Item 4"},
            {kind: "moon.Divider", content: "Divider 2"},
            {kind: "moon.Item", content: "Item 1"},
            {kind: "moon.Item", content: "Item 2"},
            {kind: "moon.Divider", content: "Very Long Divider with truncation"},
            {kind: "moon.Item", content: "Item 1"},
            {kind: "moon.Item", content: "Item 2"}
        ]}
    ]
});

enyo.kind({
    name: "ilib.moon.sample.FormCheckboxSample",
    classes: "moon enyo-unselectable",
    components: [
        {classes:"moon-hspacing", controlClasses:"moon-6h", components: [
            {components: [
                {kind: "moon.Divider", content: "FormCheckbox Items (Default)"},
                {kind: "moon.FormCheckbox", content: "Option 1", checked: true},
                {kind: "moon.FormCheckbox", content: "Option 2"},
                {kind: "moon.FormCheckbox", disabled: true, content: "Disabled"},
                {kind: "moon.FormCheckbox", content: "Option 4", checked: true},
                {kind: "moon.FormCheckbox", content: "This is a verrry long option 5"}
            ]}
        ]}
    ]
});

enyo.kind({
    name: "ilib.moon.sample.HeaderSample",
    classes: "moon enyo-unselectable moon-header-sample",
    components: [
        {kind: "moon.Divider", content: "Header"},
        {kind: "moon.Header", content: "Header", titleAbove: "02", titleBelow: "Sub Header", subTitleBelow:"Sub-sub Header", classes:"moon-10h"}
    ]
});

enyo.kind({
    name: "ilib.moon.sample.InputSample",
    classes: "moon enyo-unselectable moon-input-sample",
    components: [
        {kind: "moon.Divider", content: "Inputs"},

        {kind: "moon.InputDecorator", spotlight: true, components: [
            {kind: "moon.Input", placeholder: "JUST TYPE"}
        ]},
        {kind: "moon.InputDecorator", components: [
            {kind: "moon.Input", placeholder: "Search term"},
            {kind: "Image", src: "assets/search-input-search.png"}
        ]},
        {kind: "moon.InputDecorator", components: [
            {kind: "moon.Input", type:"password", placeholder: "Enter password"}
        ]},

        {kind: "moon.Divider", content: "TextAreas"},
        {kind: "moon.InputDecorator", components: [
            {kind: "moon.TextArea", placeholder: "Enter text here"}
        ]},
        {kind: "moon.InputDecorator", components: [
            {kind: "moon.TextArea", placeholder: "JUST TYPE"}
        ]},

        {kind: "moon.Divider", content: "RichTexts"},
        {kind: "moon.InputDecorator", components: [
            {kind: "moon.RichText", oninput:"inputChanged"}
        ]},
        {kind: "moon.InputDecorator", components: [
            {kind: "moon.RichText", style: "width: 240px;", oninput:"inputChanged"},
            {kind: "Image", src: "assets/search-input-search.png"}
        ]}
    ]
});

enyo.kind({
    name: "ilib.moon.sample.ExpandableInputSample",
    classes: "moon enyo-unselectable",
    components: [
        {classes:"moon-10h", components: [
            {kind: "moon.ExpandableInput", content: "Input", noneText: "No Input"},
            {kind: "moon.ExpandableInput", content: "Input with Placeholder", noneText: "No Input", placeholder: "Placeholder"},
            {kind: "moon.ExpandableInput", content: "Input with Value", noneText: "No Input", placeholder: "Placeholder", value: "Text"},
            {kind: "moon.ExpandableInput", content: "Input with loooooooooooooooong text truncation", noneText: "No Input with loooooooooooooooooong text truncation"}
        ]}
    ]
});

enyo.kind({
    name: "ilib.moon.sample.ItemSample",
    classes: "moon enyo-unselectable",
    components: [
        {classes:"moon-6h", components: [

            {kind: "moon.Divider", content: "Item Sample"},
            {
                components: [
                    {kind: "moon.Item", content: "Item 1"},
                    {kind: "moon.Item", content: "Item 2"},
                    {kind: "moon.Item", content: "Item 3"},
                    {kind: "moon.Item", content: "Item with very long text that should truncate"}
            ]},

            {kind: "moon.Divider", content: "Selectable Items"},
            {
                components: [
                    {kind: "moon.SelectableItem", content: "Option 1", selected: true, onActivate: "itemChanged"},
                    {kind: "moon.SelectableItem", content: "Option 2", onActivate: "itemChanged"},
                    {kind: "moon.SelectableItem", disabled: true, content: "Disabled", onActivate: "itemChanged"},
                    {kind: "moon.SelectableItem", content: "Option 4", selected: true, onActivate: "itemChanged"},
                    {kind: "moon.SelectableItem", content: "Option 5", onActivate: "itemChanged"}
            ]},

            {kind: "moon.Divider", content:"Radio Items"},
            {
                components: [
                {kind: "moon.RadioItemGroup", onActivate: "buttonActivated", components: [
                    {content: "Cat"},
                    {content: "Dog"},
                    {content: "Whale", disabled: true},
                    {content: "Monte Verde Golden Toad"}
                ]}
            ]},

            {kind: "moon.Divider", content: "Checkbox Items"},
            {
                components: [

                    {kind: "moon.CheckboxItem", content: "Option 1", checked: true, onchange: "itemChanged"},
                    {kind: "moon.CheckboxItem", content: "Option 2", onchange: "itemChanged"},
                    {kind: "moon.CheckboxItem", disabled: true, content: "Disabled", onchange: "itemChanged"},
                    {kind: "moon.CheckboxItem", content: "Option 4", checked: true, onchange: "itemChanged"},
                    {kind: "moon.CheckboxItem", content: "This is a verrrrrrrrrrrry long option 5", onchange: "itemChanged"}
            ]},

            {kind: "moon.Divider", content: "Right-Handed Checkbox Items"},
            {
                components: [
                    {kind: "moon.CheckboxItem", content: "Option 1", checked: true, checkboxOnRight: true, onchange: "itemChanged"},
                    {kind: "moon.CheckboxItem", content: "Option 2", checkboxOnRight: true, onchange: "itemChanged"},
                    {kind: "moon.CheckboxItem", disabled: true, content: "Disabled", checkboxOnRight: true, onchange: "itemChanged"},
                    {kind: "moon.CheckboxItem", content: "Option 4", checked: true, checkboxOnRight: true, onchange: "itemChanged"},
                    {kind: "moon.CheckboxItem", content: "This is a verrrrrrrrrrry long option 5", checkboxOnRight: true, onchange: "itemChanged"}
            ]},

            {kind: "moon.Divider", content: "Toggle Items"},
            {
                components: [
                    {kind: "moon.ToggleItem", content: "Option 1", checked: true, onchange: "itemChanged"},
                    {kind: "moon.ToggleItem", content: "Option 2", onchange: "itemChanged"},
                    {kind: "moon.ToggleItem", disabled: true, content: "Disabled", onchange: "itemChanged"},
                    {kind: "moon.ToggleItem", content: "Option 4", checked: true, onchange: "itemChanged"},
                    {kind: "moon.ToggleItem", content: "This is a verrry long option 5", onchange: "itemChanged"}
            ]}

        ]}
    ]
});

enyo.kind({
    name: "ilib.moon.sample.ExpandablePickerSample",
    classes: "moon enyo-unselectable",
    components: [
        //{kind: "moon.Scroller", horizontal: "hidden", classes: "enyo-fill", components: [
            {classes: "moon-6h", components: [
                {kind: "moon.Divider", content: "Not In Group", style: "color: #999;"},
                {kind: "moon.ExpandablePicker", noneText: "Nothing selected", content: "Expandable Picker", components: [
                    {content: "English"},
                    {content: "Spanish"},
                    {content: "French"},
                    {content: "German"},
                    {content: "Italian"},
                    {content: "Japanese"}
                ]},
                {kind: "moon.ExpandablePicker", content: "Pre-selected Picker", components: [
                    {content: "On", active: true},
                    {content: "Off"}
                ]},
                {kind: "moon.ExpandablePicker", content: "Non-auto-collapsing", autoCollapseOnSelect: false, components: [
                    {content: "Item 1"},
                    {content: "Item 2", active: true},
                    {content: "Item 3"}
                ]},
                {kind: "moon.ExpandablePicker", noneText: "Nothing selected with loooooooooooooooooooooooooong text truncation", content: "Expandable Picker with looooooooooooooooooooooooooong text truncation", components: [
                    {content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 1"},
                    {content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 2"},
                    {content: "Looooooooooooooooooooooooooooooooooooooooooooong Item 3"}
                ]},
                {kind: "moon.ExpandablePicker", disabled:true, content:"Disabled Picker", components: [
                    {content: "Item 1"},
                    {content: "Item 2", active: true},
                    {content: "Item 3"}
                ]},
                {kind: "moon.ExpandablePicker", content: "Pre-expanded picker", open: true, components: [
                    {content: "Item 1"},
                    {content: "Item 2", active: true},
                    {content: "Item 3"}
                ]},
                {tag: "br"},
                {kind: "moon.Divider", content: "In Group", style: "color: #999;"},
                {kind: "enyo.Group", highlander: true, components: [
                    {kind: "moon.ExpandablePicker", content: "Pre-selected Picker", active: true, components: [
                        {content: "On", active: true},
                        {content: "Off"}
                    ]},
                    {kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", autoCollapse: true, content: "Integer Picker",
                    classes: "moon-expandable-picker-wrapper", value: 2, min: 1, max: 15, unit: "sec"},

                    {kind: "moon.ExpandableIntegerPicker", noneText: "Not Selected", disabled:true, autoCollapse: true, content: "Disabled Integer Picker",
                    classes: "moon-expandable-picker-wrapper", value: 2, min: 1, max: 15, unit: "sec"}
                ]}
            ]}
        //]}
    ]
});
