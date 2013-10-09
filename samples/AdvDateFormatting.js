enyo.kind({
    name: "ilib.sample.AdvDateFormatting",
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
                            
            {kind: "FittableRows", fit: true, components: [
                {kind: "FittableColumns", name: "datetimeParameters", components: [
                    {kind: "moon.ExpandablePicker", name: "calendarType", content: rb.getString("Input Calendar"), onChange: "changedParameters"},
                    {style: "width: 30px"},
                    {kind: "FittableColumns", name: "regularDate", components: [
                        {kind: "moon.ExpandableInput", name: "year", content: rb.getString("Year"), fieldType: "password", type: "number", noneText: rb.getString("Not defined"), onChange: "changedParameters", classes: "moon-3h"},
                        {kind: "moon.ExpandablePicker", name: "month", content: rb.getString("Month"), onChange: "changedParameters"},
                        {kind: "moon.ExpandablePicker", name: "day", content: rb.getString("Day")},
                    ]},
                    {kind: "moon.ExpandableInput", name: "julianDay", content: rb.getString("Julian Day"), type: "number", noneText: rb.getString("Not defined"), classes: "moon-3h"},
                    {style: "width: 30px"},
                    {kind: "moon.TimePicker", name: "timePicker", content: rb.getString("Time")},
                    {kind: "moon.ExpandableInput", name: "millisecond", content: rb.getString("Millisecond"), type: "number", noneText: rb.getString("Not defined"), value: "0", classes: "moon-3h"},
                    
                    {fit: true}
                ]},
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
    
    create: function() {
        this.inherited(arguments);
        this.initCalendars();
        this.updateParameters();
    },
    
    initCalendars: function() {
        var calendarList = ilib.Cal.getCalendars();
        if (calendarList.indexOf('julianday') < 0)
            calendarList.push('julianday');
        calendarList.sort();
        for (var i = 0; i < calendarList.length; ++i)
            this.$.calendarType.createComponent({content: calendarList[i], active: (calendarList[i] === 'gregorian')});
        var gregorianCalIndex = calendarList.indexOf('gregorian');
        if (gregorianCalIndex >= 0)
            this.$.calendarType.setSelectedIndex(gregorianCalIndex);
    },
    
    changedParameters: function(inSender, inEvent) {
        this.updateParameters(true);
    },
    
    updateParameters: function(init) {
        if (this.updateParametersProcessing)
            return;
        this.updateParametersProcessing = true;
        // Show/Hide julianday / year-month-day 
        this.$.regularDate.setShowing(this.$.calendarType.selected.content !== 'julianday');
        this.$.julianDay.setShowing(this.$.calendarType.selected.content === 'julianday');
        // Recalc calendar/sysres 
        var calendar = this.$.calendarType.selected.content || 'gregorian';
        var cal = ilib.Cal.newInstance({
            locale: this.$.localeSelector.getValue(),
            type: (calendar === "julianday") ? "gregorian" : calendar
        });
        var sysres = new ilib.ResBundle({
            name: "sysres",
            locale: this.$.localeSelector.getValue()
        });
        // Init Year
        if (this.$.year.getValue() == '')
            this.$.year.setValue(new Date().getFullYear());
        // Init/Refill Month
        var numMonths = cal.getNumMonths(parseInt(this.$.year.getValue(), 10) || 0);
        var prevSelectedIndex = this.$.month.getSelectedIndex();
        this.$.month.setSelectedIndex(-1);
        this.$.month.destroyClientControls();
        for (var i = 1; i <= numMonths; ++i) {
            var monthName = sysres.getString(undefined, "MMMM"+ i +"-"+ calendar) || sysres.getString(undefined, "MMMM"+ i);
            this.$.month.createComponent({content: i +' '+ monthName, value: i});
        }
        this.$.month.setSelectedIndex(prevSelectedIndex >= 0 && prevSelectedIndex < numMonths ? prevSelectedIndex : 0);
        this.$.month.selected.setChecked(true);
        // Init/Refill Day
        var numDays = cal.getMonLength(this.$.month.getSelected().value, (parseInt(this.$.year.getValue(), 10) || 0));
        var prevSelectedIndex = this.$.day.getSelectedIndex();
        this.$.day.setSelectedIndex(-1);
        this.$.day.destroyClientControls();
        for (var i = 1; i <= numDays; ++i)
            this.$.day.createComponent({content: i, value: i});
        this.$.day.setSelectedIndex(prevSelectedIndex >= 0 && prevSelectedIndex < numDays ? prevSelectedIndex : 0);
        this.$.day.selected.setChecked(true);
        this.$.datetimeParameters.render();
        this.updateParametersProcessing = false;
    },
    updateParametersProcessing: false,
           
    calcFormat: function(inSender, inEvent) {
        var options = {};
        var calendar = this.$.calendarType.selected.content || 'gregorian';
        options['locale'] = this.$.localeSelector.getValue();
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
            type: (calendar === "julianday") ? "gregorian" : calendar
        });
        var date;
        if (calendar === 'julianday')
            date = cal.newDateInstance({julianday: this.$.julianDay.getValue()});
        else {
            var time = this.$.timePicker.getValue();
            date = cal.newDateInstance({
                year: this.$.year.getValue(),
                month: this.$.month.selected.value,
                day: this.$.day.selected.value,
                hour: time.getHours(),
                minute: time.getMinutes(),
                second: time.getSeconds(),
                millisecond: this.$.millisecond.getValue()
            });
        };
        //
        if (calendar !== 'gregorian' && calendar !== 'julianday')
            options.calendar = calendar;
        var fmt = new ilib.DateFmt(options);
        var postFmtData = fmt.format(date);
        // Output results
        this.$.rtlResult.setContent(postFmtData + ', '+ rb.getString('julian day: ') + date.getJulianDay() +', '+ rb.getString('unix time: ') + date.getTime());
    }
});
