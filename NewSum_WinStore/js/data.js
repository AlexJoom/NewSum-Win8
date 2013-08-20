(function () {
    "use strict";

    //define the name space
    WinJS.Namespace.define("NewSum");

    NewSum.millisecondsToDateTime = function (milliseconds) {
        milliseconds.subtitle = "tst";
    };
    
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
        { key: "Κόσμος", title: "Κόσμος", subtitle: "...", articles:[], backgroundImage: world },
        { key: "Ελλάδα", title: "Ελλάδα", subtitle: "...", articles: [], backgroundImage: greece },
        { key: "Αθλητισμός", title: "Αθλητισμός", subtitle: "...", articles: [], backgroundImage: athletics },
        { key: "Πολιτισμός", title: "Πολιτισμός", subtitle: "...", articles: [], backgroundImage: culture },
        { key: "Επιστήμη", title: "Επιστήμη", subtitle: "...", articles: [], backgroundImage: tech },
        { key: "Γενικά", title: "Γενικά", subtitle: "...", articles: [], backgroundImage: various }
    ];

    //create the binding list that will appear in the items.html view
    NewSum.categories = new WinJS.Binding.List();
    categories.forEach(function (item) {
        NewSum.categories.push(WinJS.Binding.as(item));
    });
    

    var latestNews = "https://api.mongolab.com/api/1/databases/newsum/collections/latestnews?apiKey=bD52OMB9YRbyUoRgbwIgv94zMD1BOTco";
    WinJS.xhr({ url: latestNews }).done(function (response) {
        var latest = JSON.parse(response.responseText);

        NewSum.categories.forEach(function (item, index) {
            var ctx = Enumerable.From(latest).First(function (i) {
                return i.CategoryName == item.key;
            });
            var newLabel = ctx.TotalToday == 1 ? "νέο" : "νέα";
            item.articles = ctx.Articles;
            item.subtitle = "(" + ctx.TotalToday + " " + newLabel + ")";
        });
    });


    //NewSum.articles = new WinJS.Binding.List();
    //var mongoUrl = "https://api.mongolab.com/api/1/databases/newsum/collections/articles?apiKey=bD52OMB9YRbyUoRgbwIgv94zMD1BOTco&s={%22milliseconds%22:-1}&l=500";
    //WinJS.xhr({ url: mongoUrl }).done(
    //    function (response) {
    //        var articles = JSON.parse(response.responseText);

    //        articles.forEach(function(item, index) {
    //            NewSum.articles.push(item);
    //        });            
    //    },
    //    function (error) { console.log(error); },
    //    function (progress) { console.log(progress); });


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

