(function () {
    "use strict";

    //define the name space
    WinJS.Namespace.define("NewSum");

    //the category photos
    var greece = "../../images/Parthenon_night_view.jpg";
    var athletics = "../../images/basketball_middle.jpg";
    var culture = "../../images/Patan_Nepal-Culture_of_Nepal.jpg";
    var world = "../../images/earth.png";
    var tech = "../../images/petri-dishes_w725_h498.jpg";
    var various = "../../images/3591481091_6f63ecfd4e_q.jpg";

    // These three strings encode placeholder images. You will want to set the
    // backgroundImage property in your real data to be URLs to images.
    var darkGray = "../../images/logo_read.jpg";
    var lightGray = "../../images/logoTemp.jpg";
    var mediumGray = "../../images/logoTemp.jpg";

    var categories = [
        { key: "Κόσμος", title: "Κόσμος", subtitle: "", backgroundImage: world },
        { key: "Ελλάδα", title: "Ελλάδα", subtitle: "", backgroundImage: greece },
        { key: "Αθλητισμός", title: "Αθλητισμός", subtitle: "", backgroundImage: athletics },
        { key: "Πολιτισμός", title: "Πολιτισμός", subtitle: "", backgroundImage: culture },
        { key: "Επιστήμη", title: "Επιστήμη", subtitle: "", backgroundImage: tech },
        { key: "Γενικά", title: "Γενικά", subtitle: "", backgroundImage: various }
    ];

    //create the binding list that will appear in the items.html view
    NewSum.categories = new WinJS.Binding.List();
    NewSum.articles = null;
    categories.forEach(function (item) {
        NewSum.categories.push(item);
    });

    var mongoUrl = "https://api.mongolab.com/api/1/databases/newsum/collections/articles?apiKey=bD52OMB9YRbyUoRgbwIgv94zMD1BOTco&s={%22milliseconds%22:-1}&l=1000";
    NewSum.dataLoaded = WinJS.xhr({ url: mongoUrl });
    NewSum.dataLoaded.done(
        function (response) {
            NewSum.articles = JSON.parse(response.responseText);

            NewSum.distinctArticles = Enumerable.From(NewSum.articles).Select(function (i) {
                return i.CategoryName;
            }).Distinct().ToArray();
        },
        function (error) { console.log(error); },
        function (progress) { console.log(progress); });


    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );


    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    // Get a reference for an item, using the group key and Topic as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an Topic.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

})();

