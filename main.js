

google.load('visualization', '1', {'packages':['corechart']});
google.setOnLoadCallback(loadDataAndDrawCharts);

var projects = [{
        "name":"ckan",
        "title":"CKAN",
        "description":"CKAN is an open-source data hub. CKAN makes it easy to publish, share and find data. It provides a powerful and extensible system for cataloging and storing datasets, with an intuitive web front-end and API.",
        "link":[
            "http://ckan.org",
            "http://wiki.okfn.org/Projects/CKAN"
        ],
        "people":["ross","toby","darwin","markw","seanh","shevski","davidraznick","amercader","johnglover","aron","dread","thejimmyg"],
        "mailman":["ckan-dev","ckan-discuss","ckan-changes","ckan-news"],
        "github":["okfn/ckan","okfn/ckanclient","okfn/dataprotocols","okfn/buildkit","okfn/webstore","okfn/dpm"],
        "mailman_url":"http://activityapi.herokuapp.com/api/1/history/mailman"
    },
    {
        "name":"datahub",
        "title":"The Data Hub",
        "people":[],
        "mailman":["datahub-announce","datahub-news"],
        "github":["okfn/datahub"]
    },
    {
        "name":"ckanext",
        "title":"CKAN Extensions",
        "people":["ross","toby","darwin","markw","seanh","shevski","davidraznick","amercader","johnglover","aron","dread","thejimmyg"],
        "mailman":[],
        "github":["okfn/ckanext-webstorer","okfn/ckanext-iati","okfn/ckanext-archiver","okfn/ckanext-wordpresser","okfn/ckanext-example","okfn/ckanext-qa","okfn/ckanext-datacatalogs","okfn/ckanext-apps"]
    },
    {
        "name":"datacatalogs",
        "title":"Data Catalogs",
        "link":["datacatalogs.org"],
        "people":[],
        "mailman":["data-catalogs"],
        "github":["okfn/ckanext-datacatalogs"]
    },
    {
        "name":"openspending",
        "title":"OpenSpending",
        "link":["http://openspending.org","http://blog.openspending.org/","http://twitter.com/openspending","http://wiki.openspending.org/Main_Page"],
        "people":["pudo","lucychambers","grgr","vitorbaptista"],
        "mailman":["openspending","openspending-dev"],
        "github":["okfn/dpkg-israel-state-budget","okfn/openspending.plugins.datatables","okfn/openspending.plugins.treemap","openspending/openspending","openspending/openspendingjs","openspending/dotorg","openspending/openspending-etl"]
    },
    {
        "name":"schoolofdata",
        "title":"School Of Data",
        "link":["http://schoolofdata.org","http://handbook.schoolofdata.org","http://opendatahandbook.org","http://wiki.okfn.org/Projects/Open_Data_Handbook"],
        "people":["mihi","jenlowe"],
        "mailman":["School-of-data","Scoda-dev","open-data-handbook"],
        "github":["okfn/datawrangling","okfn/schoolofdata","okfn/opendatahandbook"]
    },
    {
        "name":"opendatacommons",
        "title":"Open Data Commons",
        "description":"Open Data Commons provides legal solutions for open data, including the Public Domain Dedication and License (PDDL) and the Open Database License (ODbL).",
        "link":["http://www.opendatacommons.org/","http://wiki.okfn.org/Open_Data_Commons"],
        "people":[],
        "mailman":["odc-coord","odc-discuss"],
        "github":[]
    },
    {
        "name":"lod2",
        "title":"LOD (Linked Open Data)",
        "description":"LOD2 is an EU-funded project involving a consortium of groups across Europe working to develop linked open data availability and to enable the creation of knowledge from interlinked data.",
        "link":["http://lod2.eu/"],
        "people":[],
        "mailman":["lod2"],
        "github":[]
    },
    {
        "name":"wdmmg",
        "title":"Where Does My Money Go?",
        "description":"Find out where UK public finance goes with this open-source, embeddable web application. Explore the data using maps, timelines, and best of breed visualisation technologies.",
        "link":["http://wheredoesmymoneygo.org/blog/"],
        "people":[],
        "mailman":["wdmmg-announce"],
        "github":["openspending/cameroon.openspending.org","openspending/wheredoesmymoneygo.org"]
    },
    {
        "name":"publicdomain",
        "title":"Public Domain Works",
        "description":"The Public Domain Works DB is an open registry of artistic works that are in the public domain. It is currently focused on books and sound recordings.",
        "link":["http://publicdomainworks.net","http://wiki.okfn.org/Public_Domain_Calculators","http://publicdomainreview.org"],
        "people":[],
        "mailman":["pd-discuss","publicdomainreview"],
        "github":["okfn/pdcalc","okfn/pdw2"]
    },
    {
        "name":"opendefinition",
        "title":"The Open Definition",
        "description":"The Open (Knowledge) Definition (OD) sets out principles to define the 'open' in open knowledge. The term knowledge is used broadly and it includes all forms of data, content such as music, films or books as well any other types of information.",
        "link":["http://www.opendefinition.org/"],
        "people":[],
        "mailman":["od-coord","od-discuss"],
        "github":["okfn/licenses","okfn/opendefinition"]
    },
    {
        "name":"recline",
        "title":"Recline",
        "link":["http://reclinejs.org"],
        "people":["rgrp"],
        "mailman":[],
        "github":["okfn/recline","okfn/timeliner"]
    },
    {
        "name":"annotator",
        "title":"Annotator",
        "description":"Annotate any web page simply by incorporating two lines of javascript into your site or running our bookmarklet.",
        "link":["http://annotateit.org"],
        "people":[],
        "mailman":["annotator-dev"],
        "github":["okfn/annotator","okfn/annotateit","okfn/annotator-store","okfn/annotator-wordpress","okfn/texts.annotateit.org"]
    },
    {
        "name":"dashboard",
        "title":"Dashboard",
        "link":["http://okfnlabs.org/dashboard","http://activityapi.herokuapp.com"],
        "people":["zephod"],
        "mailman":[],
        "github":["okfn/activityapi","okfn/dashboard"]
    },
    {
        "name":"yourtopia",
        "title":"YourTopia",
        "link":["http://yourtopia.net","http://italia.yourtopia.net/"],
        "people":["zephod"],
        "mailman":["yourtopia"],
        "github":["okfn/yourtopia"]
    },
    {
        "name":"labs-projects",
        "title":"Experimental Projects",
        "people":["zephod","rgrp","vndimitrova"],
        "mailman":["okfn-labs","open-history"],
        "github":["okfn/bubbletree","okfn/hypernotes","okfn/okfn.github.com","okfn/sprints.okfnlabs.org","okfn/facetview"]
    },
    {
        "name":"openbiblio",
        "title":"Working Group: OpenBiblio",
        "description":"Open Bibliography is a JISC funded project to advocate open access to bibliographic data and to demonstrate ways that such open datasets could be utilised.",
        "link":["openbiblio.net"],
        "people":["markmacgillivray","petermr","tomoinn"],
        "mailman":["open-bibliography","bibliographica-users","bibliographica-folktales"],
        "github":[]
    },
    {
        "name":"bibserver",
        "title":"BibServer & BibJSON",
        "link":["bibsoup.net"],
        "people":["markmacgillivray","petermr","tomoinn"],
        "mailman":["Bibjson-dev","openbiblio-dev"],
        "github":["okfn/bibserver"]
    }];

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
        mailinglists: {ok:false},
        github: {ok:false},
        people: {}
    },
    activity: {
        github: {ok:false}
    }
};


// Setting up History.js
(function(window,undefined){
    var History = window.History;
    if ( !History.enabled ) {
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        return false;
    }
    // Bind to StateChange Event
    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state
        History.log(State.data, State.title, State.url);
        loadProject(State.data.project);
    });

})(window);



$(document).ready(function(){
    // Doing stuff we can do without Google Chart Tools here
    $.each(projects, function(index, project){
        $('#projectselect').append('<option value="'+ project.name +'">'+ project.title +'</option>');
    });
    $('#projectselect').change(function(e){
        e.preventDefault();
        var p = $('#projectselect').val();
        History.pushState({project: p}, "Project: " + p, "?project=" + p);
    });

    // use the project ID given in the URL (if available)
    var startState = History.getState();
    if (typeof startState.data.project !== 'undefined') {
        loadProject(startState.data.project);
    }

});

function loadProject(projectName) {

    $('h1').text('Loading...');

    // set the Project selector (if not done)
    if ($('#projectselect').val() != projectName) {
        $('#projectselect option').removeAttr('selected');
        $('#projectselect option[value="'+projectName+'"]').attr('selected', 'selected');
    }
    var project;
    for (var n in projects) {
        if (projects[n].name == projectName) {
            project = projects[n];
        }
    }
    CONFIG.project.mailinglists = project.mailman;
    CONFIG.project.repo = project.github;
    CONFIG.project.title = project.title;

    // reset DATA
    DATA = {
        history: {
            mailinglists: {ok:false},
            github: {ok:false},
            people: {}
        },
        activity: {
          github: {ok:false}
        }
    };

    loadDataAndDrawCharts();
}

function loadDataAndDrawCharts() {
    // Stuff we need Google Chart Tools for
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
          getMailinglistHistory(CONFIG.project.mailinglists, function(d){
              //console.log('mailinglist history:', mailinglist, d);
              DATA.history.mailinglists = d;
              drawIfReady();
          });
          getGithubRepoHistory(CONFIG.project.repo, function(d){
              //console.log('repo history:', repo, d);
              DATA.history.github = d;
              drawIfReady();
          });
          getGithubActivity(CONFIG.project.repo, function(d){
              DATA.activity.github = d;
              drawIfReady();
          });
    });
}

/**
 * This was kind of a bad idea... do all loading first,
 * check if all loading is done and if yes draw the graphs.
 */
function drawIfReady() {
    if (!DATA.history.mailinglists.ok) {
      return;
    }
    if (!DATA.history.github.ok) {
      return;
    }
    if (!DATA.activity.github.ok) {
      return;
    }
    $('h1').text('Dashboard for ' + CONFIG.project.title);
    //console.log('Data is complete. We can start drawing.');
    // subscribers history
    drawTimeChart(CONFIG.project.mailinglists,
        DATA.history.mailinglists.data, 'subscribers',
        'ml-subscribers-hist-chart', 150, 'LineChart');
    // posts history
    drawTimeChart(CONFIG.project.mailinglists,
        DATA.history.mailinglists.data, 'posts',
        'ml-posts-hist-chart', 150, 'ColumnChart');
    // github watchers history
    drawTimeChart(CONFIG.project.repo,
        DATA.history.github.data, 'watchers',
        'repo-watchers-hist-chart', 150, 'LineChart');
    // github forks history
    drawTimeChart(CONFIG.project.repo,
        DATA.history.github.data, 'forks',
        'repo-forks-hist-chart', 150, 'LineChart');
    // github issues history
    drawTimeChart(CONFIG.project.repo,
        DATA.history.github.data, 'issues',
        'repo-issues-hist-chart', 150, 'LineChart');
    // github size history
    drawTimeChart(CONFIG.project.repo,
        DATA.history.github.data, 'size',
        'repo-size-hist-chart', 150, 'LineChart');

    // repository top contributors
    var tableByPerson = getGithubActivityByPersonTable(DATA.activity.github, 10);
    drawBarChart(tableByPerson, 'repo-contributors-chart', 150);
    var tableByRepo = getGithubActivityByRepoTable(DATA.activity.github);
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
    $.each(data, function(k,v) {
          $.each(v.data, function(i,sample) {
            var date = sample.timestamp.split('T')[0];
            //console.log(d, n, date);
            if (typeof dateDict[date] === 'undefined') {
                // add this date to the object and array
                //console.log(fields, date);
                dateArray.push(date);
                dateDict[date] = {};
            }
            dateDict[date][k] = {};
            for (var f in fields) {
                // fetch the indicated fields
                //console.log(date, d, fields[f], data[d].data[n][fields[f]]);
                dateDict[date][k][fields[f]] = sample[fields[f]];
            }
        });
    });
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
    var datekeyed = {};
    var datestamps = []; // for later sorting
    $.each(data.mailinglists.data, function(listname, i) {
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
    //console.log(data.repo.data);
    $.each(data.repo.data, function(n, item) {
        //console.log(n, item.timestamp.split('T')[0], item);
        if (typeof datekeyed[item.timestamp] === 'undefined'){
            datestamps.push(item.timestamp);
            datekeyed[item.timestamp] = {'posts': 0, 'github': 0};
        }
        datekeyed[item.timestamp].github += 1;
    });
    //console.log(datekeyed);
    datestamps.sort();
    for (var tsi in datestamps) {
        var ts = datestamps[tsi];
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
    var tableByPerson = getGithubActivityByPersonTable(data, 10);
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
    $.each(activityResponse.data, function(i, item) {
          //console.log(index, item.person.login, item._activity_type, item.type, item.repo.full_name);
          var person = item.person.login;
          if (typeof dataByPerson[person] === 'undefined') {
              dataByPerson[person] = 0;
          }
          dataByPerson[person] += 1;
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
    $.each(activityResponse.data, function(repindex, item) {
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
        if (mailinglists.length > 0) {
              getMailinglistHistory(mailinglists, function(data){
                  complete_data['mailinglists'] = data;
                  callback(complete_data);
              });
        } else {
            callback(complete_data);
        }
    });
}

/**
 * @param   String    name    Name of the mailing list to get history for
 */
function getMailinglistHistory(names, callback) {
    var url = 'http://activityapi.herokuapp.com/api/1/history/mailman?per_page=500&grain=day&list=';
    var comma = false;
    $.each(names,function(i,name) {
      if (comma) url+=',';
      comma = true;
      url+=name;
    });
    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: callback
    });
}

/**
 * @param   String    name    Name of the github repo to get history for
 */
function getGithubRepoHistory(names, callback) {
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/history/github?repo='+ names.join(',') + '&per_page=500&grain=day&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}

/**
 * @param   String/Array    names    Name(s) of the github repo(s) to get ativity for
 */
function getGithubActivity(names, callback) {
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/activity/github?repo='+ names.join(',') + '&per_page=1000&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}

/**
 * @param   String/Array    names    Name(s) of the mailing list(s) to get ativity for
 */
function getMailinglistActivity(names, callback) {
    $.ajax({
        url: 'http://activityapi.herokuapp.com/api/1/activity/mailman?list='+ names.join(',') + '&per_page=1000&callback=?',
        dataType: 'jsonp',
        success: callback
    });
}

