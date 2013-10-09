
enyo.kind({
    name: "ilib.sample.ChooseTimeZone",

    published: {
        "value": "default"
    },

    components: [
        {kind: "moon.ExpandablePicker", name: "timeZones", content: rb.getString("Time Zone"), onChange: "setTimeZone", components: [
            {content: rb.getString("default"), active: true}
        ]},
        // It's a fake component but without it the ilib.TimeZone.getAvailableIds() was returning an empty array, TODO - investigate it
        {kind: "moon.TimePicker", name: "timePickerFake", content: rb.getString("Time"), showing: false}
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
