enyo.kind({
    name: "ilib.sample.AddressParsing",
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
            {kind: "onyx.GroupboxHeader", content: rb.getString("Address")},
            {kind: "onyx.InputDecorator", alwaysLooksFocused: true, components: [
                {kind: "onyx.Input",style:"width:100%", name: "address", placeholder: rb.getString("Enter Address")}
            ]}
        ]},
        {tag: "br"},
        {kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
            {kind: "onyx.GroupboxHeader", content: rb.getString("Format result:")},
            {name: "rtlResult", fit: true, allowHtml:true,content: "-", style: "padding: 10px"}
        ]}
    ],
        
    calcFormat: function (inSender, inEvent) {
        // Formatting
        var parsedAddress = new ilib.Address(this.$.address.getValue());

        var output = "";

        if (parsedAddress) {
            if (parsedAddress.streetAddress) {
                output += "streetAddress:" + parsedAddress.streetAddress + "<br>";
            }
            if (parsedAddress.locality) {
                output += "locality:" + parsedAddress.locality + "<br>";
            }
            if (parsedAddress.region) {
                output += "region:" + parsedAddress.region + "<br>";
            }
            if (parsedAddress.postalCode) {
                output += "Postal code:" + parsedAddress.postalCode + "<br>";
            }
            if (parsedAddress.country) {
                output += "country:" + parsedAddress.country + "<br>";
            }
            if (parsedAddress.countryCode) {
                output += "countryCode:" + parsedAddress.countryCode + "<br>";
            }
        }

        this.$.rtlResult.setContent(output);
    }
});
