var container = document.getElementById('activity');

var options = {
  valueNames: ['type', 'body', 'author', 'date', { name: 'url', attr: 'href' }]
};
var activityList = new List('git-info', options);

var gh = new GitHub();
var api = 'repos/agauniyal/isaac-core/';

var issueArr = [],
  commitArr = [],
  dataArr = [],
  prArr = [];

var updateList = function() {
  activityList.sort('date', { order: 'desc' });
  Ps.update(container);
};

gh.get(api + 'issues?state=all&direction=desc', function(err, res) {
  var tempArr = [];
  res.forEach(function(el) {
    tempArr.push({
      type: 'Issue',
      body: el.title,
      date: el.updated_at,
      url: el.html_url,
      author: el.user.login
    });
  });
  document.getElementById('issueCount').textContent = res.length;
  activityList.add(tempArr, updateList);
});

gh.get(api + 'pulls?state=all&direction=desc', function(err, res) {
  var tempArr = [];
  res.forEach(function(el) {
    tempArr.push({
      type: 'PR',
      body: el.title,
      date: el.updated_at,
      url: el.html_url,
      author: el.user.login
    });
  });
  document.getElementById('prCount').textContent = res.length;
  activityList.add(tempArr, updateList);
});

gh.get(api + 'commits?sha=develop', function(err, res) {
  var tempArr = [];
  res.forEach(function(el) {
    tempArr.push({
      type: 'Commit',
      body: el.commit.message,
      date: el.commit.author.date,
      url: el.html_url,
      author: el.commit.committer.name
    });
  });
  document.getElementById('commitCount').textContent = res.length;
  activityList.add(tempArr, updateList);
});

gh.get(api + 'branches', function(err, res) {
  document.getElementById('branchCount').textContent = res.length;
});

gh.get(api + 'releases', function(err, res) {
  document.getElementById('releaseCount').textContent = res.length;
});

Ps.initialize(container, {
  wheelSpeed: 1,
  wheelPropagation: true,
  suppressScrollX: true,
  minScrollbarLength: 20
});
