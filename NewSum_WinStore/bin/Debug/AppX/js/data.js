(function () {
    "use strict";

    //define the name space
    WinJS.Namespace.define("NewSum");
    NewSum.Constants = {};
    NewSum.Constants.Languages = {
        GR: "el-gr",
        EN: "en-us"
    };
    //create the binding list that will appear in the items.html view
    NewSum.categories = new WinJS.Binding.List();
    NewSum.groups = {};


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
    var lightGray = "../../images/logos/small/30.scale-100.png";


    var categories = [
        { key: "Κόσμος", title: "Κόσμος", subtitle: "...", backgroundImage: world },
        { key: "Ελλάδα", title: "Ελλάδα", subtitle: "...", backgroundImage: greece },
        { key: "Αθλητισμός", title: "Αθλητισμός", subtitle: "...", backgroundImage: athletics },
        { key: "Πολιτισμός", title: "Πολιτισμός", subtitle: "...", backgroundImage: culture },
        { key: "Επιστήμη", title: "Επιστήμη", subtitle: "...", backgroundImage: tech },
        { key: "Οικονομία", title: "Οικονομία", subtitle: "...", backgroundImage: money },
        { key: "Γενικά", title: "Γενικά", subtitle: "...", backgroundImage: various }
    ];



    categories.forEach(function (item) {
        NewSum.groups[item.key] = { bindingList: {} };
        NewSum.groups[item.key].bindingList = new WinJS.Binding.List();
        NewSum.categories.push(WinJS.Binding.as(item));
    });

    NewSum.GetLanguage = function () {
        var lang = Windows.Storage.ApplicationData.current.localSettings.values["language"];

        if (!lang) {
            var languages = Windows.Globalization.ApplicationLanguages.languages;
            if (languages[0] == "el")
                lang = NewSum.Constants.Languages.GR;
            else
                lang = NewSum.Constants.Languages.EN;

            NewSum.SetLanguage(lang);
        }
        return lang;
    };
    NewSum.SetLanguage = function (value) {
        var s = Windows.Storage.ApplicationData.current.localSettings;
        s.values["language"] = value;
        //raise event;
    };
    NewSum.GetCollectionNameForLatestNews = function () {
        return NewSum.GetLanguage() == NewSum.Constants.Languages.GR ? "latestnews" : "latestnews_en_us";
    };
    NewSum.GetCollectionNameForOlderArticles = function () {
        return NewSum.GetLanguage() == NewSum.Constants.Languages.GR ? "articles" : "articles_en_us";
    };


    WinJS.xhr({
        url: "https://api.mongolab.com/api/1/databases/newsum/collections/" + NewSum.GetCollectionNameForLatestNews() + "?apiKey=bD52OMB9YRbyUoRgbwIgv94zMD1BOTco"
    }).done(function (response) {
        var latest = JSON.parse(response.responseText);


        NewSum.categories.forEach(function (item, index) {
            var ctx = Enumerable.From(latest).First(function (i) {
                return i.CategoryName == item.key;
            });
            var newLabel = ctx.TotalToday == 1 ? WinJS.Resources.getString('new_single').value : WinJS.Resources.getString('new_plural').value;
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
                var getOldestUrl = "https://api.mongolab.com/api/1/databases/newsum/collections/" + NewSum.GetCollectionNameForOlderArticles() + "?apiKey=bD52OMB9YRbyUoRgbwIgv94zMD1BOTco&q={\"CategoryName\":\"{0}\",\"milliseconds\":{$lt:{1}}}}&s={\"milliseconds\":-1}&l=200".replace("{0}", encodeURIComponent(categoryName)).replace("{1}", oldestArticleFound.milliseconds);
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
            return WinJS.Resources.getString('time_justnow').value;
        }

        if (minutes < 60) {
            return Math.round(minutes) + WinJS.Resources.getString('time_minutesago').value;
        }

        var hours = minutes / 60;

        if (hours < 1.5) {
            return WinJS.Resources.getString('time_onehourago').value;
        }
        if (hours < 24) {
            return Math.round(hours) + WinJS.Resources.getString('time_hoursago').value;
        }

        var days = hours / 24;

        if (days < 1) {
            return WinJS.Resources.getString('time_onedayago').value;
        } else {
            return Math.round(days) + WinJS.Resources.getString('time_daysago').value;
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
        getSourcesBackGroundClass = function (count) {

            switch (count) {
                case 1:
                    return "1";
                case 2:
                    return "2";
                case 3:
                    return "3";
                default:
                    return "fire";
            }
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
                sourcesCount: a.Sources.length,
                sourcesBackGroundColor: getSourcesBackGroundClass(a.Sources.length),
                backgroundImage: lightGray,
                articleSources: getArticleSources(a)
            };
        };
})();

