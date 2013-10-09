enyo.kind({
    name: "ilib.sample.LocaleInfo",
    kind: "FittableRows",
    classes: "moon enyo-unselectable enyo-fit",
    
    components: [
        {kind: "moon.Scroller", fit: true, components: [
            /* Header with selecting locale */
            {kind: "ilib.sample.ChooseLocale", onSelectedLocale: "setLocale"},
            {tag: "br"},
            
            {kind: "moon.Divider", content: rb.getString("Current Locale")},
            {name: "currentLocateData"}
        ]}
    ],

    create: function() {
        this.inherited(arguments);
        /* Fill in info on current locale */
        this.printItemLocale(ilib.getLocale());
    },
    
    setLocale: function(inSender, inEvent) {
        /* Fill in info on selected locale */
        this.printItemLocale(inEvent.content);
        this.$.currentLocateData.render();
    },

    printItemLocale: function(locale) {
        this.$.currentLocateData.destroyComponents();
        this.$.currentLocateData.createComponent({content: "getLocale : "+ locale, style: "font-size: 16px"});
        var localeInfo = new ilib.LocaleInfo(locale);
        var str = JSON.stringify(localeInfo, null, ' ').replace(/"([^"]+)"/g, '$1').replace(/,$/mg, '');
        this.$.currentLocateData.createComponent({tag: "pre", fit: true, content: str, style: "font-size: 16px"});
    }
});
