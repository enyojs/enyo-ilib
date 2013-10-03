enyo.kind({
    name: "ilib.sample.RTL",
    kind: "FittableRows",
	classes: "moon enyo-unselectable enyo-fit",
    
    components: [
        {kind: "moon.Scroller", fit: true, components: [
            /* Header with selecting locale */
            {kind: "ilib.sample.ChooseLocale", onSelectedLocale: "setLocale"},
            {tag: "br"},
               
            {kind: "moon.Divider", content: "Moon components"},
            {kind: "Group", highlander: false, components: [
				{kind: "moon.Accordion", content: "Buttons", components: [ {kind: "ilib.moon.sample.ButtonSample"} ]},
				{kind: "moon.Accordion", content: "Dividers", components: [ {kind: "ilib.moon.sample.DividerSample"} ]},
				{kind: "moon.Accordion", content: "Form Checkboxes", components: [ {kind: "ilib.moon.sample.FormCheckboxSample"} ]},
				{kind: "moon.Accordion", content: "Headers", components: [ {kind: "ilib.moon.sample.HeaderSample"} ]},
				{kind: "moon.Accordion", content: "Inputs", components: [ {kind: "ilib.moon.sample.InputSample"} ]},
				{kind: "moon.Accordion", content: "Expandable Inputs", components: [ {kind: "ilib.moon.sample.ExpandableInputSample"} ]},
				{kind: "moon.Accordion", content: "Items", components: [ {kind: "ilib.moon.sample.ItemSample"} ]},
				{kind: "moon.Accordion", content: "Expandable Pickers", components: [ {kind: "ilib.moon.sample.ExpandablePickerSample"} ]}
            ]},
            {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, {tag: "br"}, 
	    {tag: "br"}
        ]},
        
        {name: "rtlStatus", kind: "moon.ToggleItem", content: "RTL", checked: false, disabled: true}
    ],
    
    create: function() {
        this.inherited(arguments);
        this.$.rtlStatus.checked = new ilib.ScriptInfo(new ilib.LocaleInfo().getScript()).getScriptDirection() === "rtl";
    },
           
    setLocale: function(inSender, inEvent) {
        ilib.setLocale(inEvent.content);
        this.$.rtlStatus.checked = new ilib.ScriptInfo(new ilib.LocaleInfo().getScript()).getScriptDirection() === "rtl";
        this.$.rtlStatus.render();
        enyo.updateI18NClasses();
    }
});
