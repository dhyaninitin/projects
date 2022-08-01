(window["aioseopjsonp"]=window["aioseopjsonp"]||[]).push([["local-seo-lite-maps-Maps-vue","local-seo-lite-maps-Blur-vue"],{"006f":function(t,s,e){"use strict";e.r(s);var i=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"aioseo-maps-blur"},[e("core-blur",[e("div",{staticClass:"aioseo-settings-row"},[e("p",{staticClass:"apikey-description"},[t._v(t._s(t.strings.description))])]),e("core-settings-row",{attrs:{name:t.strings.apiKey,align:""},scopedSlots:t._u([{key:"content",fn:function(){return[e("base-input",{attrs:{size:"medium"}})]},proxy:!0}])}),e("core-display-info",{attrs:{options:t.displayInfo}})],1)],1)},o=[],a={data:function(){return{strings:{description:this.$t.__("Integrating with Google Maps will allow your users to find exactly where your business is located. Our interactive maps let them see your Google Reviews and get directions directly from your site. Create multiple maps for use with multiple locations.",this.$td),apiKey:this.$t.__("API Key",this.$td)},displayInfo:{block:{copy:"",desc:this.$t.sprintf(this.$t.__('To add this block, edit a page or post and search for the "%1$s Local - Map" block.',this.$td),"AIOSEO")},shortcode:{copy:"[aioseo_local_map]",desc:this.$t.sprintf(this.$t.__("Use the following shortcode to display the location map. %1$s",this.$td),this.$links.getDocLink(this.$constants.GLOBAL_STRINGS.learnMore,"localSeoShortcodeMap",!0))},widget:{copy:"",desc:this.$t.sprintf(this.$t.__('To add this widget, visit the %1$swidgets page%2$s and look for the "%3$s Local - Map" widget.',this.$td),'<a href="'.concat(this.$aioseo.urls.admin.widgets,'" target="_blank">'),"</a>","AIOSEO")},php:{copy:"<?php if( function_exists( 'aioseo_local_map' ) ) aioseo_local_map(); ?>",desc:this.$t.sprintf(this.$t.__("Use the following PHP code anywhere in your theme to display the location map. %1$s",this.$td),this.$links.getDocLink(this.$constants.GLOBAL_STRINGS.learnMore,"localSeoFunctionMap",!0))}}}}},n=a,l=e("2877"),r=Object(l["a"])(n,i,o,!1,null,null,null);s["default"]=r.exports},"9d7b":function(t,s,e){"use strict";e("f5cd")},ae4a:function(t,s,e){"use strict";e.r(s);var i=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"aioseo-local-maps"},[e("core-card",{attrs:{slug:"localBusinessMapsApiKey"},scopedSlots:t._u([{key:"header",fn:function(){return[t._v(" "+t._s(t.strings.googleMapsApiKey)+" "),e("core-pro-badge")]},proxy:!0}])},[e("blur")],1),e("cta",{attrs:{"cta-link":t.$links.getPricingUrl("local-seo","local-seo-upsell","maps"),"button-text":t.strings.ctaButtonText,"learn-more-link":t.$links.getUpsellUrl("local-seo",null,"home"),"feature-list":t.features},scopedSlots:t._u([{key:"header-text",fn:function(){return[t._v(" "+t._s(t.strings.ctaHeader)+" ")]},proxy:!0},{key:"description",fn:function(){return[t._v(" "+t._s(t.strings.ctaDescription)+" ")]},proxy:!0}])})],1)},o=[],a=e("006f"),n={components:{Blur:a["default"]},data:function(){return{features:[this.$t.__("Google Places Support",this.$td),this.$t.__("Google Reviews",this.$td),this.$t.__("Driving Directions",this.$td),this.$t.__("Multiple Locations",this.$td)],strings:{googleMapsApiKey:this.$t.__("Google Maps API Key",this.$td),ctaButtonText:this.$t.__("Upgrade to Pro and Unlock Local SEO",this.$td),ctaHeader:this.$t.sprintf(this.$t.__("Local SEO Maps are only available for licensed %1$s %2$s users.",this.$td),"AIOSEO","Pro"),ctaDescription:this.$t.__("Show your location to your visitors using an interactive Google Map. Create multiple maps for use with multiple locations.",this.$td)}}}},l=n,r=(e("9d7b"),e("2877")),c=Object(r["a"])(l,i,o,!1,null,null,null);s["default"]=c.exports},f5cd:function(t,s,e){}}]);