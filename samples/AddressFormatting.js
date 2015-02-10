enyo.kind({
    name: "ilib.sample.AddressFormatting",
    kind: "FittableRows",
    classes: "onyx ilib-onyx-sample enyo-fit",
    
    components: [
        {kind: "Scroller", fit: false, components: [
            {kind: "FittableColumns", components: [
                /* Header with selecting locale */
                {kind: "ilib.sample.ChooseLocale", name: "localeSelector"},
                {style: "width: 20px"},
                {kind: "onyx.Button", content: rb.getString("Apply"), ontap: "calcFormat", style: "vertical-align: bottom;", classes: "onyx-affirmative"}
            ]}
        ]},  
        {tag: "br"},
        {kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
            {kind: "onyx.GroupboxHeader", content: rb.getString("Street Address")},
            {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                {kind: "onyx.Input",style:"width:100%", name: "stAddress",placeholder: rb.getString("Enter Street")}
            ]}
        ]},
        {tag: "br"},
        {kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
            {kind: "onyx.GroupboxHeader", content: rb.getString("City/Locality")},
            {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                {kind: "onyx.Input",style:"width:100%", name: "city", placeholder: rb.getString("Enter city")}
            ]}
        ]},
        {tag: "br"},
        {kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
            {kind: "onyx.GroupboxHeader", content: rb.getString("postal code/Zip")},
            {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                {kind: "onyx.Input",style:"width:100%", name: "postalCode", placeholder: rb.getString("Enter postalcode")}
            ]}
        ]},
        {tag: "br"},
        {kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
            {kind: "onyx.GroupboxHeader", content: rb.getString("State/Province")},
            {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                {kind: "onyx.Input",style:"width:100%", name: "state", placeholder: rb.getString("Enter state")}
            ]}
        ]},
        {tag: "br"},
        {kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
            {kind: "onyx.GroupboxHeader", content: rb.getString("Country")},
            {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                {kind: "onyx.Input",style:"width:100%", name: "country", placeholder: rb.getString("Enter Country")}
            ]}
        ]},
        {tag: "br"},
        {kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
            {kind: "onyx.GroupboxHeader", content: rb.getString("Format result:")},
            {name: "rtlResult", fit: true, allowHtml:true,content: "-", style: "padding: 10px"}
        ]}
    ],
        
    calcFormat: function (inSender, inEvent) {
        // Processing parameters
        var options = {
            locale: this.$.localeSelector.getValue()
        };
       
        var address =  new ilib.Address({
            streetAddress:this.$.stAddress.getValue(),
            locality: this.$.city.getValue(),
            postalCode: this.$.postalCode.getValue(),
            region: this.$.state.getValue(),
            country:this.$.country.getValue()
        });

        var formatter = new ilib.AddressFmt(options);
        var postFmtData = formatter.format(address);
        this.$.rtlResult.setContent(postFmtData);
    }
});
