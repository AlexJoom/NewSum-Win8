(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;
    var tempElement; //TO DO: not sure if this is valid;

    ui.Pages.define("/pages/items/items.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Resources.processAll();

            tempElement = element;
            
            if (this._checkForInternetConnectivity()) {
                this._bindCategoriesToUi.call(this);

                WinJS.Application.addEventListener("fetchedLatestNews", function () {
                    WinJS.Utilities.addClass(document.getElementsByTagName("progress")[0], "hidden");
                });
                
                if (NewSum.categoriesBuildSuccesfully)
                    WinJS.Utilities.addClass(document.getElementsByTagName("progress")[0], "hidden");
            }
            
          
        },

        // This function updates the page layout in response to viewState changes (ex. you rotate the device)
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".itemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this._initializeLayout(listView, viewState);
                    if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                        listView.indexOfFirstVisible = firstVisible;
                    }
                }
            }
        },
        _checkForInternetConnectivity: function () {
            var internetConnectionProfile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
            if (internetConnectionProfile == null || internetConnectionProfile.getNetworkConnectivityLevel() !=
                        Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess) {

                var dialog = new Windows.UI.Popups.MessageDialog(WinJS.Resources.getString('internetConnectivityCheck_Title').value, WinJS.Resources.getString('internetConnectivityCheck_Subtitle').value);
                dialog.commands.append(new Windows.UI.Popups.UICommand(WinJS.Resources.getString('internetConnectivityCheck_Close').value, function () {
                    window.close();
                }));
                dialog.defaultCommandIndex = 0;// Set the command that will be invoked by default
                dialog.cancelCommandIndex = 0;// Set the command to be invoked when escape is pressed
                dialog.showAsync();
                WinJS.Utilities.addClass(document.getElementsByTagName("progress")[0], "hidden");
                return false;
            }
            return true;
        },
        _bindCategoriesToUi: function () {
            var listView = tempElement.querySelector(".itemslist").winControl;
            listView.itemDataSource = NewSum.categories.dataSource;
            listView.itemTemplate = tempElement.querySelector(".itemtemplate");
            listView.oniteminvoked = this._itemInvoked.bind(this);
            this._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
            listView.element.focus();
        },
        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />
            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        },
        _itemInvoked: function (args) {
            var categorySelected = NewSum.categories.getAt(args.detail.itemIndex);
            WinJS.Navigation.navigate("/pages/split/split.html", { categorySelected: categorySelected });// { groupKey: groupKey });
        }
    });
})();
