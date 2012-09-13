

google.load('visualization', '1', {'packages':['corechart']});
google.setOnLoadCallback(loadDataAndDrawCharts);

var CONFIG = {
    project: {
        title: 'CKAN Data Catalogue',
        mailinglists: ['ckan-discuss', 'ckan-dev'],
        repo: ['okfn/ckan', 'okfn/ckanbuild', 'okfn/ckanclient', 'okfn/ckan-drupal',
            'okfn/ckan-google-docs', 'okfn/ckan-jenkins', 'okfn/ckanjs',
            'okfn/ckan-service-prototype'],
        people: ['ross', 'darwin','toby', 'markw', 'seanh',
            'shevski', 'davidraznick', 'amercader', 'johnglover',
            'aron', 'dread', 'thejimmyg']
    },
    colors: ['#7FC97F', '#BEAED4', '#FDC086', '#FFFF99', '#386CB0', '#F0027F', '#BF5B17', '#666666']
};

var DATA = {
    history: {
        mailinglists: {},
        repo: {},
        people: {}
    },
    activity: {
        repo: {}
    }
};

$(document).ready(function(){
    $('h1').text('Dashboard for ' + CONFIG.project.title);
});

function loadDataAndDrawCharts() {
    $(document).ready(function(){

        // top chart - overall activity over time
        getDataForOverallTimeline(
            CONFIG.project.mailinglists, // array of mailinglists
            CONFIG.project.repo,         // array of repos
            drawOverallTimeline2);       // drawing function callback

        // most active mail senders
        getMailinglistActivity(
            CONFIG.project.mailinglists,
            drawMailinglistSenderChart);

        // functions from here on rely on data being
        // available in DATA. This is why it takes so long
        // until the graphs actually appear.
        $.each(CONFIG.project.mailinglists, function(index, mailinglist){
            getMailinglistHistory(mailinglist, function(d){
                //console.log('mailinglist history:', mailinglist, d);
                DATA.history.mailinglists[mailinglist] = d;
                drawIfReady();
            });
        });
        $.each(CONFIG.project.repo, function(index, repo){
            getGithubRepoHistory(repo, function(d){
                //console.log('repo history:', repo, d);
                DATA.history.repo[repo] = d;
                drawIfReady();
            });
            getGithubActivity(repo, function(d){
                DATA.activity.repo[repo] = d;
                drawIfReady();
            });
        });
    });
}

/**
 * This was kind of a bad idea... do all loading first,
 * check if all loading is done and if yes draw the graphs.
 */
function drawIfReady() {
    for (var m in CONFIG.project.mailinglists) {
        if (typeof DATA.history.mailinglists[CONFIG.project.mailinglists[m]] === 'undefined') {
            return;
        }
    }
    for (var r in CONFIG.project.repo) {
        if (typeof DATA.history.repo[CONFIG.project.repo[r]] === 'undefined') {
            return;
        }
        if (typeof DATA.activity.repo[CONFIG.project.repo[r]] === 'undefined') {
            return;
        }
    }
    //console.log('Data is complete. We can start drawing.');
    // subscribers history
    drawTimeChart(CONFIG.project.mailinglists,
        DATA.history.mailinglists, 'subscribers',
        'ml-subscribers-hist-chart', 150, 'LineChart');
    // posts history
    drawTimeChart(CONFIG.project.mailinglists,
        DATA.history.mailinglists, 'posts',
        'ml-posts-hist-chart', 150, 'ColumnChart');
    // github watchers history
    drawTimeChart(CONFIG.project.repo,
        DATA.history.repo, 'watchers',
        'repo-watchers-hist-chart', 150, 'LineChart');
    // github forks history
    drawTimeChart(CONFIG.project.repo,
        DATA.history.repo, 'forks',
        'repo-forks-hist-chart', 150, 'LineChart');
    // github issues history
    drawTimeChart(CONFIG.project.repo,
        DATA.history.repo, 'open_issues',
        'repo-issues-hist-chart', 150, 'LineChart');
    // github size history
    drawTimeChart(CONFIG.project.repo,
        DATA.history.repo, 'size',
        'repo-size-hist-chart', 150, 'LineChart');

    // repository top contributors
    var tableByPerson = getGithubActivityByPersonTable(DATA.activity.repo, 10);
    drawBarChart(tableByPerson, 'repo-contributors-chart', 150);

    var tableByRepo = getGithubActivityByRepoTable(DATA.activity.repo);
    drawBarChart(tableByRepo, 'repo-action-chart', 150);
}

/**
 * Create a Google DataTable with time-series-data
 * as needed for Google Charts.
 *
 * @param Object config  Configuration object
 * @param Object data    Data object (containing activity API responses)
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

function getMultiTimeTable(config, data, fields) {
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

/**
 * A more independent version of drawing the overall activity graph
 */
function drawOverallTimeline2(data) {
    //console.log('drawOverallTimeline2()', data);
    var table = new google.visualization.DataTable();
    table.addColumn('date', 'Date');
    table.addColumn('number', 'Mail');
    table.addColumn('number', 'Github');

    // fill data table with events
    datekeyed = {};
    datestamps = []; // for later sorting
    $.each(data.mailinglists, function(listname, i) {
        //console.log(listname, i);
        $.each(i.data, function(n, item) {
            //console.log(listname, n, item);
            if (typeof datekeyed[item.timestamp] === 'undefined'){
                datestamps.push(item.timestamp);
                datekeyed[item.timestamp] = {'posts': 0, 'github': 0};
            }
            datekeyed[item.timestamp].posts += item.posts;
        });
    });
    $.each(data.repo.data, function(n, item) {
        //console.log(n, item.timestamp.split('T')[0], item);
        var timestamp = item.timestamp.split('T')[0];
        if (typeof datekeyed[timestamp] !== 'undefined'){
            datekeyed[timestamp].github += 1;
        }
    });
    //console.log(datekeyed);
    datestamps.sort();
    for (var tsi in datestamps) {
        var ts = datestamps[tsi];
        //console.log(ts);
        var row = [
            isoStringToDate(ts),
            datekeyed[ts].posts,
            datekeyed[ts].github
        ];
        //console.log(ts, row);
        table.addRow(row);
    }
    
    // create ChartWrapper object
    var width = $('#overalltimelinechart').width();
    var height = 150;
    var wrapper = new google.visualization.ChartWrapper({
        chartType: 'ColumnChart',
        //chartType: 'AreaChart',
        dataTable: table,
        options: {
            'width': width,
            'height': height,
            isStacked: true,
            legend: {position: 'none'},
            vAxis: {textPosition: 'none'},
            colors: CONFIG.colors,
            chartArea: {left: 2, top: 2, width: (width - 4), height: (height - 20)},
            tooltip: {
                textStyle: { fontSize: 11}
            },
            focusTarget: 'category',
            fontSize: 12,
            fontName: 'Helvetica Neue, Arial, sans-serif',
            bar: {groupWidth: '100%'}
        },
        containerId: 'overalltimelinechart'
    });
    wrapper.draw();
}

function drawMailinglistSenderChart(data) {
    //console.log('Mailing list activity stream:', data.data);
    var tableByPerson = getGithubActivityByPersonTable({'first': data}, 10);
    drawBarChart(tableByPerson, 'ml-senders-chart', 150);
}

function drawTimeChart(config, data, field, containerId, height, chartType) {
    // create goole dataTable from API data
    var timelineTable = getTimeTable(config, data, [field]);
    var width = $('#' + containerId).width();
    var wrapper = new google.visualization.ChartWrapper({
        chartType: chartType,
        dataTable: timelineTable,
        options: {
            'width': width,
            'height': height,
            isStacked: true,
            lineWidth: 1,
            legend: {position: 'none'},
            vAxis: {textPosition: 'none'},
            colors: CONFIG.colors,
            chartArea: {left: 2, top: 2, width: (width - 4), height: (height - 20)},
            tooltip: {
                textStyle: { fontSize: 11}
            },
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
            chartArea: {left: 70, top: 2, width: (width - 80), height: (height - 20)},
            tooltip: {
                textStyle: { fontSize: 11 }
            },
            vAxis: {
                textStyle: { fontSize: 10 }
            },
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
function getGithubActivityByPersonTable(activityResponse, limit) {
    if (limit === null) {
        limit = 20;
    }
    var table = new google.visualization.DataTable();
    table.addColumn('string', 'Contributor');
    table.addColumn('number', 'Events');
    var dataByPerson = {};
    $.each(activityResponse, function(repindex, repactivity) {
        $.each(repactivity.data, function(index, item) {
            //console.log(index, item.person.login, item._activity_type, item.type, item.repo.full_name);
            var person = item.person.login;
            if (typeof dataByPerson[person] === 'undefined') {
                dataByPerson[person] = 0;
            }
            dataByPerson[person] += 1;
        });
    });
    var sortArray = [];
    for (var n in dataByPerson) {
        sortArray.push([n, dataByPerson[n]]);
    }
    sortArray.sort(sortArrayBySecondIndexReversed);
    var count = 0;
    $.each(sortArray, function(position, row){
        //console.log(position, row);
        if (count < limit) {
            table.addRow(row);
        }
        count++;
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
    $.each(activityResponse, function(repindex, repactivity) {
        $.each(repactivity.data, function(index, item){
            //console.log(index, item.person.login, item._activity_type, item.type, item.repo.full_name);
            var key = item.repo.full_name; // TODO: change to short name when available
            if (typeof dataByRepo[key] === 'undefined') {
                dataByRepo[key] = 0;
            }
            dataByRepo[key] += 1;
        });
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
 * Load all data required for the overall project activity timeline
 * (which is multiple API requests) and finally pass it to the drawing callback
 *
 * @param   mailinglists   Array of mailing list names
 * @param   repos          Array of github repository names
 */
function getDataForOverallTimeline(mailinglists, repos, callback) {
    var complete_data = {};
    getGithubActivity(repos, function(data){
        complete_data['repo'] = data;
        complete_data['mailinglists'] = {};
        $.each(mailinglists, function(index, list){
            getMailinglistHistory(list, function(data){
                complete_data['mailinglists'][list] = data;
                // check if all mailinglists are loaded
                //console.log('Checking completeness after loading:', list, data);
                for (var l in mailinglists) {
                    var myl = mailinglists[l];
                    if (typeof complete_data['mailinglists'][myl] === 'undefined') {
                        return;
                    }
                }
                callback(complete_data);
            });
        });
    });
}

/**
 * @param   String    name    Name of the mailing list to get history for
 */
function getMailinglistHistory(name, callback) {
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/history/mailman/'+ name + '?per_page=500&grain=day&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}

/**
 * @param   String    name    Name of the github repo to get history for
 */
function getGithubRepoHistory(name, callback) {
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/history/github/'+ name + '?per_page=500&grain=day&callback=?',
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
        url: 'http://activityapi.herokuapp.com/api/1/activity/github?repo='+ name + '&per_page=1000&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}

/**
 * @param   String/Array    names    Name(s) of the mailing list(s) to get ativity for
 */
function getMailinglistActivity(names, callback) {
    var name = '';
    if (typeof names === 'string') {
        name = names;
    } else {
        name = names.join(',');
    }
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/activity/mailman?list='+ name + '&per_page=1000&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}

function getGithubRepoInfo(name, callback) {
    $.ajax({
        url: 'https://api.github.com/repos/' + name + '?callback=?',
        dataType: 'jsonp',
        success: callback
    });
}