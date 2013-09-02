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
    var money = "../../images/6355360253_30e095425d_n.jpg";

    // These three strings encode placeholder images. You will want to set the
    // backgroundImage property in your real data to be URLs to images.
    var darkGray = "../../images/logo_read.jpg";
    var lightGray = "../../images/logos/small/30.scale-100.png";
    var mediumGray = "../../images/logoTemp.jpg";
    
    var categories = [
        { key: "Κόσμος", title: "Κόσμος", subtitle: "...", backgroundImage: world },
        { key: "Ελλάδα", title: "Ελλάδα", subtitle: "...", backgroundImage: greece },
        { key: "Αθλητισμός", title: "Αθλητισμός", subtitle: "...", backgroundImage: athletics },
        { key: "Πολιτισμός", title: "Πολιτισμός", subtitle: "...", backgroundImage: culture },
        { key: "Επιστήμη", title: "Επιστήμη", subtitle: "...", backgroundImage: tech },
        { key: "Οικονομία", title: "Οικονομία", subtitle: "...", backgroundImage: money },
        { key: "Γενικά", title: "Γενικά", subtitle: "...", backgroundImage: various }
    ];

    //create the binding list that will appear in the items.html view
    NewSum.categories = new WinJS.Binding.List();

    NewSum.groups = {};
    categories.forEach(function (item) {
        NewSum.groups[item.key] = { bindingList: {} };
        NewSum.groups[item.key].bindingList = new WinJS.Binding.List();
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
            // item.articles = ctx.Articles;
            item.subtitle = "(" + ctx.TotalToday + " " + newLabel + ")";

            ctx.Articles.forEach(function (a, i) {

                NewSum.groups[ctx.CategoryName].bindingList.push(getBindingObject(a));
            });

            NewSum.groups[ctx.CategoryName].initiated = true;
        });
    });



    NewSum.FetchOlderArticles = function (categoryName, loadingCallBack, FinishedCallback) {

        if (NewSum.groups[categoryName].initiated && NewSum.groups[categoryName].fetchedData == undefined) {
            var blist = NewSum.groups[categoryName].bindingList;
            if (blist.length > 0) {
                var oldestArticleFound = blist.getItem(blist.length - 1).data;
                var getOldestUrl = "https://api.mongolab.com/api/1/databases/newsum/collections/articles?apiKey=bD52OMB9YRbyUoRgbwIgv94zMD1BOTco&q={\"CategoryName\":\"{0}\",\"milliseconds\":{$lt:{1}}}}&s={\"milliseconds\":-1}&l=200".replace("{0}", encodeURIComponent(categoryName)).replace("{1}", oldestArticleFound.milliseconds);
                var promise = WinJS.xhr({ url: getOldestUrl });

                promise.done(function (response) {
                    var list = JSON.parse(response.responseText);
                    list.forEach(function (a, index) {
                        NewSum.groups[categoryName].bindingList.push(getBindingObject(a));
                    });
                    NewSum.groups[categoryName].fetchedData = 1;
                });
            }
        }
    };


    var getTimeElapsed = function (milliseconds) {
        var minutes = ((new Date()) - new Date(milliseconds)) / (1000.0 * 60);

        if (minutes < 5) {
            return "μόλις τώρα";
        }

        if (minutes < 60) {
            return Math.round(minutes) + " λεπτά πριν";
        }

        var hours = minutes / 60;

        if (hours < 1.5) {
            return "πριν 1 ώρα";
        }
        if (hours < 24) {
            return Math.round(hours) + " ώρες πριν";
        }

        var days = hours / 24;

        if (days < 1) {
            return "πριν 1 μέρα";
        } else {
            return Math.round(days) + " μέρες πριν";
        }

    },
        getSummaryText = function (a) {
            var content = "";
            for (var j = 0; j < a.SummarySentences.length; j++) {
                var s = a.SummarySentences[j];
                content += s.Text + "<br/>";
            }
            return content;
        },
        getArticleSources = function (a) {
            var sources = [];
            a.Sources.forEach(function (s, index) {

                var link = '<a href="' + s.SourceUrl + '" >' + s.sourceName + '</a>';
                sources.push(link);

            });
            return sources.join('&nbsp;');

        },
    getBindingObject = function (a) {
        return {
            id: a._id,
            title: a.Title,
            subtitle: getTimeElapsed(a.milliseconds),
            milliseconds: a.milliseconds,
            description: "",
            content: getSummaryText(a),
            backgroundImage: lightGray,
            articleSources: getArticleSources(a)
        };
    };



    //var list = new WinJS.Binding.List();
    //var groupedItems = list.createGrouped(
    //    function groupKeySelector(item) { return item.group.key; },
    //    function groupDataSelector(item) { return item.group; }
    //);


    //WinJS.Namespace.define("Data", {
    //    items: groupedItems,
    //    groups: groupedItems.groups,
    //    getItemReference: getItemReference,
    //    getItemsFromGroup: getItemsFromGroup,
    //    resolveGroupReference: resolveGroupReference,
    //    resolveItemReference: resolveItemReference
    //});
    //// Get a reference for an item, using the group key and Topic as a
    //// unique reference to the item that can be easily serialized.
    //function getItemReference(item) {
    //    return [item.group.key, item.title];
    //}
    //// This function returns a WinJS.Binding.List containing only the items
    //// that belong to the provided group.
    //function getItemsFromGroup(group) {
    //    return list.createFiltered(function (item) { return item.group.key === group.key; });
    //}
    //// Get the unique group corresponding to the provided group key.
    //function resolveGroupReference(key) {
    //    for (var i = 0; i < groupedItems.groups.length; i++) {
    //        if (groupedItems.groups.getAt(i).key === key) {
    //            return groupedItems.groups.getAt(i);
    //        }
    //    }
    //}
    //// Get a unique item from the provided string array, which should contain a
    //// group key and an Topic.
    //function resolveItemReference(reference) {
    //    for (var i = 0; i < groupedItems.length; i++) {
    //        var item = groupedItems.getAt(i);
    //        if (item.group.key === reference[0] && item.title === reference[1]) {
    //            return item;
    //        }
    //    }
    //}

})();

