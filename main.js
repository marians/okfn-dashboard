

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
    $('h1').text('Dashboard for ' + CONFIG.project.title);
});

function loadDataAndDrawCharts() {
    $(document).ready(function(){
        getGithubActivity(CONFIG.project.repo, function(d){
            // TODO: move away
            var tableByPerson = getGithubActivityByPersonTable(d);
            drawBarChart(tableByPerson, 'repo-contributors-chart', 150);
            var tableByRepo = getGithubActivityByRepoTable(d);
            drawBarChart(tableByRepo, 'repo-action-chart', 150);
        });
        $.each(CONFIG.project.mailinglists, function(index, mailinglist){
            getMailinglistHistory(mailinglist, function(d){
                //console.log('mailinglist history:', mailinglist, d);
                DATA.mailinglists[mailinglist] = d;
                drawIfReady();
            });
        });
        $.each(CONFIG.project.repo, function(index, repo){
            getGithubRepoHistory(repo, function(d){
                //console.log('repo history:', repo, d);
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
    // top chart
    drawOverallTimeline();
    // subscribers history
    drawTimeChart(CONFIG.project.mailinglists,
        DATA.mailinglists, 'subscribers',
        'ml-subscribers-hist-chart', 150, 'LineChart');
    // posts history
    drawTimeChart(CONFIG.project.mailinglists,
        DATA.mailinglists, 'posts',
        'ml-posts-hist-chart', 150, 'ColumnChart');
    // github watchers history
    drawTimeChart(CONFIG.project.repo,
        DATA.repo, 'watchers',
        'repo-watchers-hist-chart', 150, 'LineChart');
    // github forks history
    drawTimeChart(CONFIG.project.repo,
        DATA.repo, 'forks',
        'repo-forks-hist-chart', 150, 'LineChart');
    // github issues history
    drawTimeChart(CONFIG.project.repo,
        DATA.repo, 'open_issues',
        'repo-issues-hist-chart', 150, 'LineChart');
    // github size history
    drawTimeChart(CONFIG.project.repo,
        DATA.repo, 'size',
        'repo-size-hist-chart', 150, 'LineChart');

    // github top contributors

}

/**
 * Create a Google DataTable with time-series-data
 * as needed for Google Charts.
 *
 * @param Object config  Configuration object
 * @param Object data    Data object
 * @param Object fields  Array with fields to be selected from data items
 */
function getTimeTable(config, data, fields) {
    //console.log('Data:', data);
    var table = new google.visualization.DataTable();
    table.addColumn('date', 'Date');
    // created required data columns (sorted by list name)
    var keys = config;
    keys.sort();
    for (var k in keys) {
        table.addColumn('number', keys[k]);
    }
    // create dicts keyed by date
    var dateDict = {};
    var dateArray = [];
    for (var d in data) {
        for (var n in data[d].data) {
            var date = data[d].data[n].timestamp;
            //console.log(d, n, date);
            if (typeof dateDict[date] === 'undefined') {
                // add this date to the object and array
                //console.log(fields, date);
                dateArray.push(date);
                dateDict[date] = {};
            }
            dateDict[date][d] = {};
            for (var f in fields) {
                // fetch the indicated fields
                //console.log(date, d, fields[f], data[d].data[n][fields[f]]);
                dateDict[date][d][fields[f]] = data[d].data[n][fields[f]];
            }
        }
    }
    // API gives us latest first. We want latest last.
    dateArray.reverse();
    //console.log('dateArray:', dateArray);
    //console.log('dateDict:', dateDict);
    // create DataTable rows
    for (var dateIndex in dateArray) {
        var dateKey = dateArray[dateIndex];
        var theDate = isoStringToDate(dateKey);
        var row = [theDate]; // date in the first column
        for (var k2 in keys) {
            var itemName = keys[k2];
            //console.log(dateIndex, dateKey, dateDict[dateKey], dateDict[dateKey][itemName]);
            var val = null;
            if (typeof dateDict[dateKey][itemName] !== 'undefined') {
                for (var f2 in fields) {
                    if (typeof dateDict[dateKey][itemName][fields[f2]] !== 'undefined') {
                        val = dateDict[dateKey][itemName][fields[f2]];
                    }
                }
            }
            row.push(val);
        }
        // add this row to the dataTable
        table.addRow(row);
    }
    return table;
}

function drawOverallTimeline() {
    // create goole dataTable from API data
    var timelineTable = getTimeTable(
        CONFIG.project.mailinglists,
        DATA.mailinglists,
        ['posts']);
    
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

function drawTimeChart(config, data, field, containerId, height, chartType) {
    // create goole dataTable from API data
    var timelineTable = getTimeTable(config, data, [field]);
    // create ChartWrapper object
    var width = $('#' + containerId).width();
    var wrapper = new google.visualization.ChartWrapper({
        chartType: chartType,
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
        containerId: containerId
    });
    wrapper.draw();
}

/**
 * Draws a horizontal bar chart for simple key-value pairs
 */
function drawBarChart(dataTable, containerId, height) {
    // create ChartWrapper object
    var width = $('#' + containerId).width();
    var wrapper = new google.visualization.ChartWrapper({
        chartType: 'BarChart',
        dataTable: dataTable,
        options: {
            'width': width,
            'height': height,
            isStacked: true,
            legend: {position: 'none'},
            colors: CONFIG.colors,
            chartArea: {left: 50, top: 2, width: (width - 55), height: (height - 20)},
            //focusTarget: 'category',
            fontSize: 12,
            fontName: 'Helvetica Neue, Arial, sans-serif',
            bar: {groupWidth: '72%'}
        },
        containerId: containerId
    });
    wrapper.draw();
}

/**
 * aggregates github activity counts by users
 * (recenty most active users) from the raw data
 * returned by the API. OUtput is a google DataTable.
 */
function getGithubActivityByPersonTable(activityResponse) {
    var table = new google.visualization.DataTable();
    table.addColumn('string', 'Contributor');
    table.addColumn('number', 'Events');
    var dataByPerson = {};
    $.each(activityResponse.data, function(index, item) {
        //console.log(index, item.person.login, item._activity_type, item.type, item.repo.full_name);
        var person = item.person.login;
        if (typeof dataByPerson[person] === 'undefined') {
            dataByPerson[person] = 0;
        }
        dataByPerson[person] += 1;
    });
    var count = 0;
    var sortArray = [];
    for (var n in dataByPerson) {
        sortArray.push([n, dataByPerson[n]]);
    }
    sortArray.sort(sortArrayBySecondIndexReversed);
    $.each(sortArray, function(position, row){
        //console.log(position, row);
        table.addRow(row);
    });
    return table;
}

/**
 * aggregates github activity counts by repository
 * from the raw data returned by the API. Output
 * is a google DataTable.
 */
function getGithubActivityByRepoTable(activityResponse) {
    var table = new google.visualization.DataTable();
    table.addColumn('string', 'Repository');
    table.addColumn('number', 'Events');
    var dataByRepo = {};
    $.each(activityResponse.data, function(index, item) {
        //console.log(index, item.person.login, item._activity_type, item.type, item.repo.full_name);
        var key = item.repo.full_name; // TODO: change to short name when available
        if (typeof dataByRepo[key] === 'undefined') {
            dataByRepo[key] = 0;
        }
        dataByRepo[key] += 1;
    });
    var count = 0;
    var sortArray = [];
    for (var n in dataByRepo) {
        sortArray.push([n, dataByRepo[n]]);
    }
    sortArray.sort(sortArrayBySecondIndexReversed);
    $.each(sortArray, function(position, row){
        table.addRow(row);
    });
    return table;
}

function sortArrayBySecondIndexReversed(a, b) {
    return b[1] - a[1];
}

function isoStringToDate(str) {
    var parts = str.split('-');
    return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10)-1,
        parseInt(parts[2], 10));
}

/**
 * @param   String    name    Name of the mailing list to get history for
 */
function getMailinglistHistory(name, callback) {
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/history/mailman/'+ name + '?per_page=500&grain=week&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}

/**
 * @param   String    name    Name of the github repo to get history for
 */
function getGithubRepoHistory(name, callback) {
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/history/github/'+ name + '?per_page=500&grain=week&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}

/**
 * @param   String/Array    names    Name(s) of the github repo(s) to get ativity for
 */
function getGithubActivity(names, callback) {
    var name = '';
    if (typeof names === 'string') {
        name = names;
    } else {
        name = names.join(',');
    }
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/activity/github?repo='+ name + '&per_page=100&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}