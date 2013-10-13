// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/about/about.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Resources.processAll();
            var z = Windows.ApplicationModel.Package.current.id.version;
            var elemen = document.getElementById("version");
            var versionNumber="v"+z.major + "." + z.minor + "."+ z.build + "." + z.revision;
            elemen.innerHTML = versionNumber;
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });
})();
