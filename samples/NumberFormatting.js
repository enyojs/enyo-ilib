enyo.kind({
    name: "ilib.sample.NumberFormatting",
    kind: "FittableRows",
    classes: "moon enyo-unselectable enyo-fit",
    
    components: [
        {kind: "moon.Scroller", fit: true, components: [
            {kind: "FittableColumns", components: [
                /* Header with selecting locale */
                {kind: "ilib.sample.ChooseLocale", name: "localeSelector", fit: true},
                {kind: "moon.Button", small: true, content: rb.getString("Apply"), ontap: "calcFormat"}
            ]}
            
        ]},
        
        {kind: "moon.Divider"},
        {kind: "FittableColumns", components: [
            {content: rb.getString("Format result") +":"},
            {content: " ", style: "width: 20px"},
            {name: "rtlResult", fit: true, content: "-"}
        ]}
    ],
        
    calcFormat: function(inSender, inEvent) {
    }
});
