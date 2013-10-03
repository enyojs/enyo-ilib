enyo.kind({
    name: "ilib.moon.sample.RTL",
    components: [
        {kind: "moon.Header", content: rb.getString("Header"), titleAbove: "01", titleBelow: rb.getString("Sub Header"), subTitleBelow: rb.getString("Sub-sub Header"), components: [
            {kind: "moon.IconButton", src: "lib/enyo-ilib-full/samples/assets/icon-refresh.png", classes:"moon-header-left", ontap: "refreshPanels"},
            {kind: "moon.IconButton", src: "lib/enyo-ilib-full/samples/assets/icon-left.png", ontap: "prevPanel"},
            {kind: "moon.IconButton", src: "lib/enyo-ilib-full/samples/assets/icon-right.png", ontap: "nextPanel"}
        ]}, 

        {name: "panels", kind: "moon.Panels", pattern: "activity", fit: true, classes: "enyo-fill", components: [
        
            {title: rb.getString("First Panel"), classes: "moon-9h", titleBelow: rb.getString("First Sub-title"), subTitleBelow: rb.getString("First Sub-sub title"), components: [
                {kind: "FittableRows", components:[
                    {fit: true, components:[
                        {content: "That is, if the translation for a string does not exist in the current locale, the more-generic parent locale is searched for the string. In the worst case scenario, the string is not found in the base locale's strings. In this case, the original source is returned as the translation. This allows developers to create code with new or changed strings in it and check in that code without waiting for the translations to be done first."}
                    ]},
                    {components: [
                        {kind: "moon.DatePicker", name: "datePicker", content: rb.getString("Date")},
                        {kind: "moon.TimePicker", fit: true, name: "timePicker", content: rb.getString("Time")}                            
                    ]},
                    {kind: "moon.ExpandableInput", content: rb.getString("Input with Placeholder"), noneText: rb.getString("No Input"), placeholder: rb.getString("Placeholder")},
                ]}
            ]},
            
            {title: rb.getString("Second Panel"), classes: "moon-9h", titleBelow: rb.getString("Second Sub-title"), subTitleBelow: rb.getString("Second Sub-sub title"), joinToPrev: true, components: [
                {kind: "FittableColumns", components: [
                    {style: "width: 33%", components: [
                        {kind: "moon.Divider", content: rb.getString("Column ") + 1},
                        
                        {kind: "moon.Divider", content: rb.getString("FormCheckbox Items")},
                        {kind: "moon.FormCheckbox", content: "Option 1", checked: true},
                        {kind: "moon.FormCheckbox", content: "Option 2"},
                        {tag: "br"},
                        
                        {kind: "moon.Divider", content: rb.getString("Divider") + 1},
                        {kind: "moon.Item", content: "Item 1"},
                        {kind: "moon.Item", content: "Item 2", selected: true},
                        {tag: "br"},
                        
                        {kind: "moon.TooltipDecorator", components: [
                            {name: "Small Button", kind: "moon.Button", small: true, content: rb.getString("Button + Tooltip")},
                            {kind: "moon.Tooltip", content: rb.getString("I'm a tooltip for a button.")}
                        ]}                            
                    ]},
                    {style: "width: 33%", components: [
                        {kind: "moon.Divider", content: rb.getString("Column ") + 2},
                        
                        {kind: "moon.Divider", content: rb.getString("Radio Items Group")},
                        {kind: "moon.RadioItemGroup", onActivate: "buttonActivated", components: [
                            {content: "Cat"},
                            {content: "Dog"},
                            {content: "Whale", disabled: true},
                            {content: "Monte Verde Golden Toad"}
                        ]},
                        {tag: "br"},

                        {kind: "moon.Divider", content: rb.getString("Simple Picker")},
                        {kind:"moon.SimplePicker", name:"picker2", components: [
                            {content:"Hotmail"},
                            {content:"GMail"},
                            {content:"Yahoo", active: true},
                            {content:"AOL"}
                        ]},
                        {tag: "br"},
                        
                        {kind: "moon.Divider", content: rb.getString("Integer Picker")},
                        {kind: "moon.IntegerScrollPicker", value: 2013, min: 1900, max: 2100}
                    ]},
                    {fit: true, components: [
                        {kind: "moon.Divider", content: rb.getString("Column ") + 3},
                        
                        {kind: "moon.Divider", content: rb.getString("Slider")},
                        {name: "slider1", kind: "moon.Slider", value: 25, bgProgress: 40},
                        {tag: "br"},
                        
                        {kind: "moon.Accordion", content: rb.getString("This is an accordion"), components: [
                            {content: "Item One"},
                            {content: "Item Two"}
                        ]},
                        {tag: "br"},
                        
                        {kind: "moon.Divider", content: rb.getString("TextArea")},
                        {kind: "moon.InputDecorator", components: [
                            {kind: "moon.TextArea", placeholder: rb.getString("JUST TYPE"), classes: "moon-2h"}
                        ]}
                    ]}
                ]}
            ]},
        
            {title: rb.getString("Third Panel"), classes: "moon-9h", titleBelow: rb.getString("Third Sub-title"), subTitleBelow: rb.getString("Third Sub-sub title"), components: [                
                {name: "list", kind: "moon.List", spotlight: true, orient:"v", count: 50, multiSelect: false, classes: "enyo-fit moon-list-vertical-sample", onSetupItem: "setupItem", components: [
                    {kind: "moon.Item", name: "sampleMoonItem"}
                ]}
            ]}
        ]}
    ],
            
    nextPanel: function(inSender, inEvent) {
        var newIndex = this.$.panels.getIndex() + 1;
        this.$.panels.setIndex(newIndex >= this.$.panels.getPanels().length ? 0 : newIndex);
    },
    
    prevPanel: function(inSender, inEvent) {
        var newIndex = this.$.panels.getIndex() - 1;
        this.$.panels.setIndex(newIndex < 0 ? this.$.panels.getPanels().length - 1 : newIndex);
    },
    
    refreshPanels: function(inSender, inEvent) {
        this.$.panels.setIndex(0);
    },

    setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		this.$.sampleMoonItem.setContent("Item "+ (i + 1));
	}
});
