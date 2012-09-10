

google.load('visualization', '1', {'packages':['corechart']});
google.setOnLoadCallback(loadDataAndDrawCharts);

var CONFIG = {
    project: {
        title: 'CKAN Data Catalogue',
        mailinglists: ['ckan-discuss', 'ckan-dev'],
        repo: ['ckan', 'ckanbuild', 'ckanclient', 'ckan-drupal',
            'ckan-google-docs', 'ckan-jenkins', 'ckanjs',
            'ckan-service-prototype'],
        people: ['ross', 'darwin','toby', 'markw', 'seanh',
            'shevski', 'davidraznick', 'amercader', 'johnglover',
            'aron', 'dread', 'thejimmyg']
    },
    colors: ['#7FC97F', '#BEAED4', '#FDC086', '#FFFF99', '#386CB0', '#F0027F', '#BF5B17', '#666666']
};

var DATA = {
    mailinglists: {},
    repo: {},
    people: {}
};

$(document).ready(function(){
    $('h1').text(CONFIG.project.title);
});

function loadDataAndDrawCharts() {
    $(document).ready(function(){
        $.each(CONFIG.project.mailinglists, function(index, mailinglist){
            getMailinglistHistory(mailinglist, function(d){
                console.log('mailinglist history:', mailinglist, d);
                DATA.mailinglists[mailinglist] = d;
                drawIfReady();
            });
        });
        $.each(CONFIG.project.repo, function(index, repo){
            getGithubRepoHistory(repo, function(d){
                console.log('repo history:', repo, d);
                DATA.repo[repo] = d;
                drawIfReady();
            });
        });
    });
}

/**
 * If no more loading is necessary, this
 * function starts the drawing process.
 *
 * The check looks for data objects in DATA. If
 * they aren't complete, it returns null.
 */
function drawIfReady() {
    for (var m in CONFIG.project.mailinglists) {
        if (typeof DATA.mailinglists[CONFIG.project.mailinglists[m]] === 'undefined') {
            return;
        }
    }
    for (var r in CONFIG.project.repo) {
        if (typeof DATA.repo[CONFIG.project.repo[r]] === 'undefined') {
            return;
        }
    }
    console.log('Data is complete. We can start drawing.');
    drawOverallTimeline();
}

function drawOverallTimeline() {
    // create goole dataTable from API data
    var timelineTable = new google.visualization.DataTable();
    timelineTable.addColumn('date', 'Date');
    // created required data columns (sorted by list name)
    var listKeys = CONFIG.project.mailinglists;
    console.log(listKeys);
    listKeys.sort();
    for (var ml in listKeys) {
        timelineTable.addColumn('number', 'Posts in ' + listKeys[ml]);
    }
    // create dicts keyed by date
    var dateDict = {};
    var dateArray = [];
    for (ml in DATA.mailinglists) {
        for (var n in DATA.mailinglists[ml].data) {
            var date = DATA.mailinglists[ml].data[n].timestamp;
            if (typeof dateDict[date] === 'undefined') {
                // add this date to the object and array
                dateArray.push(date);
                dateDict[date] = {};
            }
            dateDict[date][ml] = {
                'posts': DATA.mailinglists[ml].data[n].posts,
                'subscribers': DATA.mailinglists[ml].data[n].subscribers
            };
        }
    }
    // create DataTable rows
    dateArray.reverse();
    for (var dateIndex in dateArray) {
        var dateKey = dateArray[dateIndex];
        var theDate = isoStringToDate(dateKey);
        var row = [theDate]; // date in the first column
        for (var ml2 in listKeys) {
            var listName = listKeys[ml2];
            //console.log(dateIndex, dateKey, dateDict[dateKey], dateDict[dateKey][listName]);
            var val;
            if (typeof dateDict[dateKey][listName] !== 'undefined' &&
                typeof dateDict[dateKey][listName]['posts'] !== 'undefined') {
                val = dateDict[dateKey][listName].posts;
            }
            row.push(val);
        }
        // add this row to the dataTable
        timelineTable.addRow(row);
    }
    // create ChartWrapper object
    var width = $('#overalltimelinechart').width();
    var height = 150;
    var wrapper = new google.visualization.ChartWrapper({
        chartType: 'ColumnChart',
        //chartType: 'AreaChart',
        dataTable: timelineTable,
        options: {
            'width': width,
            'height': height,
            isStacked: true,
            legend: {position: 'none'},
            vAxis: {textPosition: 'none'},
            colors: CONFIG.colors,
            chartArea: {left: 2, top: 2, width: (width - 4), height: (height - 20)},
            focusTarget: 'category',
            fontSize: 12,
            fontName: 'Helvetica Neue, Arial, sans-serif',
            bar: {groupWidth: '72%'}
        },
        containerId: 'overalltimelinechart'
    });
    wrapper.draw();
}

function isoStringToDate(str) {
    var parts = str.split('-');
    return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10)-1,
        parseInt(parts[2], 10));
}

function getMailinglistHistory(name, callback) {
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/history/mailman/'+ name + '?per_page=500&grain=week&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}

function getGithubRepoHistory(name, callback) {
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/history/github/'+ name + '?per_page=500&grain=week&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}