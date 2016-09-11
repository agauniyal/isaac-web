(function() {
  var prArr = [];
  var commitArr = [];
  var dataArr = [];
  var issueArr = [];

  var listOptions = {
    valueNames: ['type', 'body', 'author', 'date', { name: 'url', attr: 'href' }]
  };
  var activityList = new List('git-info', listOptions);

  var gh = new GitHub();
  var api = 'repos/agauniyal/isaac-core/';

  var updateList = function() {
    activityList.sort('date', { order: 'desc' });
    Ps.update(document.getElementById('activity'));
  };

  var fetchCommits = function(p) {
    gh.get(api + 'commits?sha=develop&page=' + p + '&per_page=30', function(err, res) {

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

      document.getElementById('commitCount').textContent = parseInt(
        document.getElementById('commitCount').textContent
      ) + res.length;

      activityList.add(tempArr, updateList);
      if (res.length === 30) { setTimeout(0, fetchCommits(p + 1)); }
    });
  };

  var fetchIssues = function(p) {

    gh.get(api + 'issues?state=all&page=' + p + '&per_page=30', function(err, res) {

      var tempArr = [];
      res.forEach(function(el) {
        tempArr.push({
          type: 'issue',
          body: el.title,
          date: el.updated_at,
          url: el.html_url,
          author: el.user.login
        });
      });

      document.getElementById('issueCount').textContent = parseInt(
        document.getElementById('issueCount').textContent
      ) + res.length;

      activityList.add(tempArr, updateList);
      if (res.length === 30) { setTimeout(0, fetchIssues(p + 1)); }
    });
  };

  var fetchPRs = function(p) {

    gh.get(api + 'pulls?state=all&page=' + p + '&per_page=30', function(err, res) {

      var tempArr = [];
      res.forEach(function(el) {
        tempArr.push({
          type: 'pr',
          body: el.title,
          date: el.updated_at,
          url: el.html_url,
          author: el.user.login
        });
      });

      document.getElementById('prCount').textContent = parseInt(
        document.getElementById('prCount').textContent
      ) + res.length;

      activityList.add(tempArr, updateList);
      if (res.length === 30) { setTimeout(0, fetchIssPR(p + 1)); }
    });
  };

  var fetchBranches = function(p) {
    gh.get(api + 'branches?page=' + p + '&per_page=30', function(err, res) {

      document.getElementById('branchCount').textContent = parseInt(
        document.getElementById('branchCount').textContent
      ) + res.length;

      if (res.length === 30) { setTimeout(0, fetchBranches(page + 1)); }
    });
  };

  var fetchReleases = function(p) {
    gh.get(api + 'releases?page=' + p + '&per_page=30', function(err, res) {

      document.getElementById('releaseCount').textContent = parseInt(
        document.getElementById('releaseCount').textContent
      ) + res.length;

      if (res.length === 30) { setTimeout(0, fetchReleases(page + 1)); }
    });
  };

  Ps.initialize(document.getElementById('activity'), {
    wheelSpeed: 1,
    wheelPropagation: true,
    suppressScrollX: true,
    minScrollbarLength: 20
  });

  fetchPRs(1);
  fetchIssues(1);
  fetchBranches(1);
  fetchReleases(1);
  fetchCommits(1);

})();
