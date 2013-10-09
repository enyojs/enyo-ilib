enyo.kind({
    name: "ilib.sample.DateFormatting",
    kind: "FittableRows",
    classes: "moon enyo-unselectable enyo-fit",
    
    components: [
        {kind: "moon.Scroller", fit: true, components: [
            {kind: "FittableColumns", components: [
                /* Header with selecting locale */
                {kind: "ilib.sample.ChooseLocale", name: "localeSelector", style: "width: 55%"},
                {kind: "ilib.sample.ChooseTimeZone", name: "timeZonesSelector", style: "width: 35%"},
                {kind: "moon.Button", small: true, content: rb.getString("Apply"), ontap: "calcFormat", fit: true}
            ]},
            
            {kind: "FittableColumns", components: [
                {kind: "FittableRows", components: [
                    {kind: "FittableColumns", components: [
                        {kind: "moon.DatePicker", name: "datePicker", content: rb.getString("Date"), onChange: "changedDate", style: "width: 50%"},
                        {kind: "moon.TimePicker", fit: true, name: "timePicker", content: rb.getString("Time")}
                    ]},
                    {kind: "moon.CalendarPicker", fit: true, name: "calendar"}
                ]},
                
                {kind: "FittableRows", fit: true, components: [
                    {tag: "br"},
                    {tag: "br"},
                    {kind: "moon.Divider", content: rb.getString("Optional parameters")},
                    {tag: "br"},
                    
                    {kind: "moon.Divider", content: rb.getString("Length")},
                    {kind: "moon.RadioItemGroup", name: "length", onActivate: "buttonActivated", components: [
                        {content: "short"},
                        {content: "medium"},
                        {content: "long", selected: true},
                        {content: "full"},
                    ]},
                   {kind: "moon.Divider", content: rb.getString("Type")},
                   {kind: "moon.RadioItemGroup", name: "type", onActivate: "buttonActivated", components: [
                        {content: "date"},
                        {content: "time"},
                        {content: "datetime", selected: true}
                    ]},
                    {kind: "moon.Divider", content: rb.getString("Date")},
                    {kind: "moon.RadioItemGroup", name: "date", onActivate: "buttonActivated", components: [
                        {content: "dmwy"},
                        {content: "dmy", selected: true},
                        {content: "dmw"},
                        {content: "dm"},
                        {content: "my"},
                        {content: "dw"},
                        {content: "d"},
                        {content: "m"},
                        {content: "n"},
                        {content: "y"}
                    ]},
                    {kind: "moon.Divider", content: rb.getString("Time")},
                    {kind: "moon.RadioItemGroup", name: "time", onActivate: "buttonActivated", components: [
                        {content: "ahmsz"},
                        {content: "ahms"},
                        {content: "hmsz"},
                        {content: "hms"},
                        {content: "ahmz"},
                        {content: "ahm"},
                        {content: "hmz", selected: true},
                        {content: "ah"},
                        {content: "hm"},
                        {content: "ms"},
                        {content: "h"},
                        {content: "m"},
                        {content: "s"}
                    ]},
                    {kind: "moon.Divider", content: rb.getString("Clock")},
                    {kind: "moon.RadioItemGroup", name: "clock", onActivate: "buttonActivated", components: [
                        {content: "12"},
                        {content: "24"},
                        {content: "locale", selected: true}
                    ]},
                    {kind: "moon.Divider", content: rb.getString("Native Digits")},
                    {kind: "moon.RadioItemGroup", name: "useNative", onActivate: "buttonActivated", components: [
                        {content: "false", selected: true},
                        {content: "true"}
                    ]}
                ]}
            ]}               
        ]},
        
        {kind: "moon.Divider"},
        {kind: "FittableColumns", components: [
            {content: rb.getString("Format result:")},
            {content: " ", style: "width: 20px"},
            {name: "rtlResult", fit: true, content: "-"}
        ]}
    ],
    
    changedDate: function(inSender, inEvent) {
        if (inEvent.value)
            this.$.calendar.setValue(inEvent.value);
    },
    
    calcFormat: function(inSender, inEvent) {
        var options = {};
        options['locale'] = this.$.localeSelector.getValue();
        options['calendar'] = 'gregorian';
        options['length'] = this.$.length.getActive().content;
        options['length'] = this.$.length.getActive().content;
        options['type'] = this.$.type.getActive().content;
        options['date'] = this.$.date.getActive().content;
        options['time'] = this.$.time.getActive().content;
        if (this.$.clock.getActive().content !== 'default')
            options['clock'] = this.$.clock.getActive().content;
        options['useNative'] = this.$.useNative.getActive().content === 'true';
        if (this.$.timeZonesSelector.getValue() !== 'default')
            options['timezone'] = this.$.timeZonesSelector.getValue();
        // processing    
        var cal = ilib.Cal.newInstance({
            locale: options['locale'],
            type: options['calendar']
        });
        var dateCalendar = this.$.calendar.getValue();
        var time = this.$.timePicker.getValue();
        var date = cal.newDateInstance({
            year: dateCalendar.getFullYear(),
            month: dateCalendar.getMonth() + 1,
            day: dateCalendar.getDate(),
            hour: time.getHours(),
            minute: time.getMinutes(),
            second: time.getSeconds(),
            millisecond: 0
        });
        var fmt = new ilib.DateFmt(options);
        var postFmtData = fmt.format(date);
        // Output results
        this.$.rtlResult.setContent(postFmtData + ', '+ rb.getString('julian day: ') + date.getJulianDay() +', '+ rb.getString('unix time: ') + date.getTime());
    }
});
