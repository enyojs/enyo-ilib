enyo.kind({
    name: "ilib.sample.NameParsing",
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
            {kind: "onyx.GroupboxHeader", content: rb.getString("Name")},
            {kind: "onyx.InputDecorator", alwaysLooksFocused: true, fit:true, components: [
                {kind: "onyx.Input", style:"width:100%", name: "name", placeholder: rb.getString("Enter Name")}
            ]}
        ]},
        {tag: "br"},
        {kind: "onyx.Groupbox", classes:"onyx-sample-result-box", components: [
            {kind: "onyx.GroupboxHeader", content: rb.getString("Parsed result:")},
            {name: "rtlResult", fit: true, content: "-", allowHtml:true, style: "padding: 10px"}
        ]}
    ],
   
    calcFormat: function(inSender, inEvent) {
        // Processing parameters
        var options = {
            locale: this.$.localeSelector.getValue()
        };
      
        // Parsing
        var nameStr = this.$.name.getValue();       
        var name = new ilib.Name(nameStr, options);
        var output = "";
        if (name.prefix) {
            output += "Prefix: " + name.prefix + "<br>";
        }
        if (name.givenName) {
            output += "Given name: " + name.givenName + "<br>";
        }
        if (name.middleName) {
            output += "Middle name: " + name.middleName + "<br>";
        }
        if (name.familyName) {
            output += "Family name: " + name.familyName + "<br>";
        }
        if (name.suffix) {
            output += "Suffix: " + name.suffix + "<br>";
        } 
        output += '<br/>';
        this.$.rtlResult.setContent(output);
    }
});
