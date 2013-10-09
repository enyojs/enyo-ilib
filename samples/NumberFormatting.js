enyo.kind({
    name: "ilib.sample.NumberFormatting",
    kind: "FittableRows",
    classes: "moon enyo-unselectable enyo-fit",
    
    components: [
        {kind: "moon.Scroller", fit: true, components: [
            {kind: "FittableColumns", components: [
                /* Header with selecting locale */
                {kind: "ilib.sample.ChooseLocale", name: "localeSelector", onSelectedLocale: "setLocale", fit: true},
                {kind: "moon.Button", small: true, content: rb.getString("Apply"), ontap: "calcFormat"}
            ]},
            {tag: "br"},
            
            {kind: "moon.Divider", content: rb.getString("Type")},
            {kind: "moon.RadioItemGroup", name: "type", onActivate: "buttonActivated", components: [
                {content: "number", selected: true},
                {content: "percentage"},
                {content: "currency"}
            ]},


            {kind: "FittableColumns", components: [
                {kind: "moon.ExpandableInput", name: "maxFractionDigits", content: rb.getString("Max Frac Digits"), noneText: rb.getString("Not defined"), style: "width: 50%"},
                {kind: "moon.ExpandableInput", name: "minFractionDigits", content: rb.getString("Min Frac Digits"), noneText: rb.getString("Not defined"), fit: true},
            ]},
            
            
            {kind: "moon.Divider", content: rb.getString("Rounding Mode")},
            {kind: "moon.RadioItemGroup", name: "roundingMode", components: [
                {content: "up"},
                {content: "down"},
                {content: "ceiling"},
                {content: "floor"},
                {content: "half up", selected: true},
                {content: "half down"},
                {content: "half even"},
                {content: "half odd"} 
            ]},
            
            {name: "numberParams", components: [
                {kind: "moon.ExpandablePicker", name: "styleOfNumber", content: rb.getString("Style"), components: [
                    {content: "standard", active: true},
                    {content: "scientific"}
                ]}
            ]},
            
            {name: "currencyParams", components: [
                {kind: "moon.ExpandablePicker", name: "styleOfCurrency", content: rb.getString("Style"), components: [
                    {content: "common", active: true},
                    {content: "iso"}
                ]},
                
                {kind: "ilib.sample.ChooseCurrency", name: "currency"}
            ]},
                        
            {tag: "br"}
        ]},

        {kind: "moon.Divider", content: rb.getString("Number")},
        {kind: "moon.InputDecorator", spotlight: true, components: [
            {kind: "moon.Input", name: "number"},
        ]},
        {kind: "moon.Divider", content: rb.getString("Format result:")},
        {name: "rtlResult", fit: true, content: "-"}
    ],
    
    setLocale: function(inSender, inEvent) {
        this.$.currency.selectCurrency(this.$.localeSelector.getValue());
    },
    
    buttonActivated: function(inSender, inEvent) {
        this.updateParameters();
    },

    updateParameters: function() {
        this.$.numberParams.setShowing(this.$.type.getActive().content === 'number');
        this.$.currencyParams.setShowing(this.$.type.getActive().content === 'currency');
    },

    calcFormat: function(inSender, inEvent) {
        // Processing parameters
        var options = {
            locale: this.$.localeSelector.getValue(),
            type: this.$.type.getActive().content,
            roundingMode: this.$.roundingMode.getActive().content
        };
        if ((parseInt(this.$.maxFractionDigits, 10) || 0) !== 0)
            options.maxFractionDigits = parseInt(this.$.maxFractionDigits, 10);
        if ((parseInt(this.$.minFractionDigits, 10) || 0) !== 0)
            options.minFractionDigits = parseInt(this.$.minFractionDigits, 10);
        if (options.type === 'number')
            options.style = this.$.styleOfNumber.getSelected().content;
        if (options.type === 'currency') {
            options.style = this.$.styleOfCurrency.getSelected().content;
            options.currency = this.$.currency.getValue();
        }
        // Formatting
        var num = new ilib.Number(this.$.number.getValue());
        var fmt = new ilib.NumFmt(options);
        var postFmtData = fmt.format(num); 
        // Output results
        this.$.rtlResult.setContent(postFmtData);
    }
});
