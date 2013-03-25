(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.
    generateSampleData().forEach(function (item) {
        list.push(item);
    });

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

    // Returns an array of sample data that can be added to the application's
    // data list. 
    function generateSampleData() {
        var itemContent = "<p>Περισσότερη ευελιξία ως προς το τέλος φορολόγησης των καταθέσεων στην Κύπρο ζήτησαν, σύμφωνα με πληροφορίες, οι περισσότεροι υπουργοί Οικονομικών της ευρωζώνης στην τηλεδιάσκεψη του Eurogroup." +
            "Συγκεκριμένα, όπως αναφέρουν ασφαλείς πηγές, ζήτησαν τη διαφύλαξη των καταθέσεων έως 100.000 ευρώ, και αντίστοιχα την αναπροσαρμογή του σχετικού συντελεστή επί του τέλους στις καταθέσεις υπεράνω του ποσού αυτού, προκειμένου να συγκεντρωθεί το πόσο που έχει αρχικώς αποφασιστεί κατά την τελευταία συνεδρίασή του συμβουλίου υπουργών Οικονομικών στις Βρυξέλλες."+
            "Η εξέλιξη αυτή έρχεται ως συνέχεια του τσουνάμι των αντιδράσεων στην απόφαση για κούρεμα των καταθέσεων στην Κύπρο.</p>";
        var itemDescription = "Περισσότερη ευελιξία ως προς το τέλος φορολόγησης των καταθέσεων στην Κύπρο ζήτησαν, σύμφωνα με πληροφορίες, οι περισσότεροι υπουργοί...";
        var groupDescription = "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante";

        // These three strings encode placeholder images. You will want to set the
        // backgroundImage property in your real data to be URLs to images.
        var darkGray = "../../images/logo_read.jpg"; //"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
        var lightGray = "../../images/logoTemp.jpg";// "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
        var mediumGray = "../../images/logoTemp.jpg"; //"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC";

        var greece = "../../images/Parthenon_night_view.jpg";
        var athletics = "../../images/basketball_middle.jpg";
        var culture = "../../images/Patan_Nepal-Culture_of_Nepal.jpg";
        var world = "../../images/earth.png";
        var tech = "../../images/petri-dishes_w725_h498.jpg";
        var various = "../../images/3591481091_6f63ecfd4e_q.jpg";

        // Each of these sample groups must have a unique key to be displayed separately.
        var sampleGroups = [
            { key: "group1", title: "Κόσμος", subtitle: "15 νέα ", backgroundImage: world, description: groupDescription },
            { key: "group2", title: "Ελλάδα", subtitle: "2 νέα ", backgroundImage: greece, description: groupDescription },
            { key: "group3", title: "Αθλητισμός", subtitle: "20 νέα ", backgroundImage: athletics, description: groupDescription },
            { key: "group4", title: "Πολιτισμός", subtitle: "0 νέα ", backgroundImage: culture, description: groupDescription },
            { key: "group5", title: "Επιστήμη", subtitle: "30 νέα", backgroundImage: tech, description: groupDescription },
            { key: "group6", title: "Γενικά", subtitle: "3 νέα ", backgroundImage: various, description: groupDescription }
        ];

        // Each of these sample items should have a reference to a particular
        // group.
        var sampleItems = [
            { group: sampleGroups[0], title: "Eurogroup: Περισσότερη ευελιξία ως προς το κούρεμα", subtitle: "πριν 10 λεπτά", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[0], title: "Η γελοιογραφία που σαρώνει στην Κύπρο", subtitle: "πριν 20 λεπτά", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[0], title: "Νέα έκδοση WhatsApp Messenger για Android", subtitle: "πριν 2 ώρες", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[0], title: "Topic: 4", subtitle: "πριν 1 μέρα", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[0], title: "Topic: 5", subtitle: "πριν 2 μέρες", description: itemDescription, content: itemContent, backgroundImage: mediumGray },

            { group: sampleGroups[1], title: "Topic: 1", subtitle: "πριν 10 λεπτά", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[1], title: "Topic: 2", subtitle: "πριν 2 ώρες", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[1], title: "Topic: 3", subtitle: "πριν 2 μέρες", description: itemDescription, content: itemContent, backgroundImage: lightGray },

            { group: sampleGroups[2], title: "Topic: 1", subtitle: "πριν 10 λεπτά", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[2], title: "Topic: 2", subtitle: "πριν 20 λεπτά", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[2], title: "Topic: 3", subtitle: "πριν 2 ώρες", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[2], title: "Topic: 4", subtitle: "πριν 2 ώρες", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[2], title: "Topic: 5", subtitle: "πριν 3 ώρες", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[2], title: "Topic: 6", subtitle: "πριν 4 ώρες", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[2], title: "Topic: 7", subtitle: "πριν 4 ώρες", description: itemDescription, content: itemContent, backgroundImage: mediumGray },

            { group: sampleGroups[3], title: "Topic: 1", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[3], title: "Topic: 2", subtitle: "Item Subtitle: 2", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[3], title: "Topic: 3", subtitle: "Item Subtitle: 3", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[3], title: "Topic: 4", subtitle: "Item Subtitle: 4", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[3], title: "Topic: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[3], title: "Topic: 6", subtitle: "Item Subtitle: 6", description: itemDescription, content: itemContent, backgroundImage: lightGray },

            { group: sampleGroups[4], title: "Topic: 1", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[4], title: "Topic: 2", subtitle: "Item Subtitle: 2", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[4], title: "Topic: 3", subtitle: "Item Subtitle: 3", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[4], title: "Topic: 4", subtitle: "Item Subtitle: 4", description: itemDescription, content: itemContent, backgroundImage: mediumGray },

            { group: sampleGroups[5], title: "Topic: 1", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[5], title: "Topic: 2", subtitle: "Item Subtitle: 2", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[5], title: "Topic: 3", subtitle: "Item Subtitle: 3", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[5], title: "Topic: 4", subtitle: "Item Subtitle: 4", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[5], title: "Topic: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[5], title: "Topic: 6", subtitle: "Item Subtitle: 6", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[5], title: "Topic: 7", subtitle: "Item Subtitle: 7", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[5], title: "Topic: 8", subtitle: "Item Subtitle: 8", description: itemDescription, content: itemContent, backgroundImage: lightGray }
        ];

        return sampleItems;
    }
})();
