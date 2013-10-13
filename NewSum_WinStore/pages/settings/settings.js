// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/settings/settings.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Resources.processAll();
            document.getElementById("close-settings").addEventListener("click", closeSettings.bind(this));
            document.querySelector("input[value='" +  NewSum.GetLanguage() + "']").checked = true;
         
            var elements = document.querySelectorAll("input[name='language']");
            for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener("change", updateLanguage);
            }
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in viewState.
        }
    });

    function closeSettings() {
        var flyout = document.getElementById("settings").winControl;
        flyout.hide();
    };

    function updateLanguage(e) {
        NewSum.SetLanguage(e.currentTarget.value);
    };


})();
