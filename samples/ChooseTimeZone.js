
enyo.kind({
    name: "ilib.sample.ChooseTimeZone",

    published: {
        "value": "default"
    },

    components: [
        {content: rb.getString("Time Zone"), classes: "ilib-onyx-sample-divider"},
        {kind: "onyx.PickerDecorator", components: [
            {},
            {name: "timeZones", kind: "onyx.Picker", onChange: "setTimeZone", components: [
                {content: rb.getString("default"), active: true}
            ]}
        ]},
        {kind: "onyx.TimePicker", name: "timePickerFake", content: rb.getString("Time"), showing: false}
    ],

    create: function() {
        this.inherited(arguments);
        this.initTimeZones();
    },
    
    initTimeZones: function() {
        var timeZones = ilib.TimeZone.getAvailableIds();
        for (var i = 0; i < timeZones.length; ++i)
            this.$.timeZones.createComponent({content: timeZones[i]});
    },

    setTimeZone: function(inSender, inEvent) {
        this.setValue(inEvent.selected.content);
        this.bubble("onSelectedTimeZone", {content: inEvent.selected.content});
    }
});
