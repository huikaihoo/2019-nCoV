﻿function jsonp(url, callback) {
  const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  window[callbackName] = function(data) {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  const script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
  document.body.appendChild(script);
}

const parseCount = str => {
  return parseInt(
    str
      .replace('(', '')
      .replace(')', '')
      .replace('*', '')
      .replace(',', '')
      .trim()
  );
};

let chinaData = [];
let worldData = [];

const chinaEmoji = countryFlagEmoji.get('CN').emoji;
const mainlandChina = [[{ v: 'CN', f: '中國內地' }, 0, 0]];
const modifyForHKMO = [[{ v: 'CN', f: '廣東' }, 0, 0]];
const core = [['Region', '確診人數', '死亡人數']];

const chinaConvert = record => {
  const region = record.provinceShortName;

  let str = '',
    confirm = 0,
    dead = 0;

  if (record.confirmedCount) {
    confirm = record.confirmedCount;
  } else if (record.tags && record.tags.indexOf('确诊') >= 0) {
    str = record.tags;
  } else if (record.comment && record.comment.indexOf('确诊') >= 0) {
    str = record.comment;
  } else {
    str = '';
  }
  if (str) {
    const regexp = /确诊([0-9 ]*)例/;
    let result = [...str.match(regexp)];
    confirm = parseInt(result[1].trim());
  }

  if (record.deadCount) {
    dead = record.deadCount;
  } else if (record.comment && record.comment.indexOf('死亡') >= 0) {
    str = record.comment;
  } else if (record.tags && record.tags.indexOf('死亡') >= 0) {
    str = record.tags;
  } else {
    str = '';
  }
  if (str) {
    const regexp = /死亡([0-9 ]*)例/;
    let result = [...str.match(regexp)];
    dead = parseInt(result[1].trim());
  }

  console.log(record.provinceShortName, confirm, locationMap[region] ? locationMap[region].v : null);

  if (locationMap[region]) {
    return [locationMap[region], confirm, dead];
  }
};

const worldConvert = record => {
  const region = record.id;
  const { confirm, dead } = record;

  console.log(record.id, confirm, locationMap[region] ? locationMap[region].v : null);

  if (locationMap[region]) {
    return [locationMap[region], confirm, dead];
  }
};

const addRow = (table, record) => {
  const row = table.insertRow();
  for (let data of record) {
    const cell = row.insertCell();
    if (data.f) {
      if (data.f === '香港') {
        cell.innerHTML = '<a href="https://wars.vote4.hk" target="_blank">香港</a> ';
      } else {
        cell.innerHTML = data.f;
      }
      if (countryFlagEmoji.get(data.v)) {
        cell.innerHTML = countryFlagEmoji.get(data.v).emoji + ' ' + cell.innerHTML;
      }
    } else {
      cell.innerHTML = data;
    }
    if (!data.f) {
      cell.className = 'right';
    }
  }
};

function processData() {
  window.worldData = worldData;
  worldData.forEach(data => {
    const r = worldConvert(data);
    if (r) {
      core.push(r);
    }
  });

  chinaData.forEach(data => {
    const r = chinaConvert(data);
    if (r && r[1] + r[2] > 0) {
      core.push(r);
      mainlandChina[0][1] += r[1];
      mainlandChina[0][2] += r[2];
      if (modifyForHKMO[0][0].f === r[0].f) {
        modifyForHKMO[0][1] = r[1];
        modifyForHKMO[0][2] = r[2];
      }
    }
  });

  drawTable();
  drawRegionsMap();
  document.getElementById('update').innerText = '更新時間: ' + moment().format('YYYY-MM-DD HH:mm:ss');
}

const drawTable = () => {
  const tbody = document.getElementById('tbody');
  let confirm = 0,
    dead = 0;

  for (let record of mainlandChina) {
    addRow(tbody, record);
    confirm += record[1];
    dead += record[2];
  }

  for (let record of core) {
    const regexp = /^[A-Za-z]+$/;
    if (record[0].v && record[0].v.match(regexp)) {
      addRow(tbody, record);
      confirm += record[1];
      dead += record[2];
    }
  }

  document.getElementById('confirm').innerHTML = confirm;
  document.getElementById('dead').innerHTML = dead;

  $('#table').DataTable({
    language: {
      search: '搜尋:',
    },
    info: false,
    scrollY: '50vh',
    scrollCollapse: true,
    paging: false,
    order: [
      [1, 'desc'],
      [2, 'desc'],
    ],
  });
  return confirm;
};

const drawRegionsMap = () => {
  core.forEach((record, i) => {
    let emoji = record[0].v ? countryFlagEmoji.get(record[0].v.substring(0, 2)).emoji : null;
    if (emoji) {
      core[i][0].f = emoji + record[0].f;
    }
  });
  mainlandChina[0][0].f = chinaEmoji + mainlandChina[0][0].f;
  modifyForHKMO[0][0].f = chinaEmoji + modifyForHKMO[0][0].f;

  const dataWorld = google.visualization.arrayToDataTable(core.concat(mainlandChina));
  const dataChina = google.visualization.arrayToDataTable(core);
  const dataHKMO = google.visualization.arrayToDataTable(core.concat(modifyForHKMO));

  const options = {
    displayMode: 'regions',
    legend: 'none',
    enableRegionInteractivity: 'true',
    legend: { textStyle: { color: 'black', fontSize: 14 } },
    width: 1000,
    height: 624,
    sizeAxis: { minSize: 5, maxSize: 5 },
    colorAxis: { colors: ['red'] },
  };

  let chart;
  chart = new google.visualization.GeoChart(document.getElementById('world'));
  chart.draw(dataWorld, { ...options, resolution: 'country' });
  chart = new google.visualization.GeoChart(document.getElementById('china'));
  chart.draw(dataChina, { ...options, resolution: 'provinces', region: 'CN' });

  chart = new google.visualization.GeoChart(document.getElementById('hk'));
  chart.draw(dataHKMO, { ...options, resolution: 'auto', region: 'HK' });
  chart = new google.visualization.GeoChart(document.getElementById('mo'));
  chart.draw(dataHKMO, { ...options, resolution: 'auto', region: 'MO' });
  chart = new google.visualization.GeoChart(document.getElementById('sg'));
  chart.draw(dataWorld, { ...options, resolution: 'auto', region: 'SG' });
};

let retry = 0;
let request = new XMLHttpRequest();
request.open('GET', 'https://cors-anywhere.herokuapp.com/https://ncov.dxy.cn/ncovh5/view/pneumonia');
request.onload = function() {
  let result;
  if (request.readyState === 4 && request.status === 200) {
    const regexp = /getAreaStat = (.*)\}catch(.*)get/;
    const str = request.responseText;
    // console.log(str);
    result = str.match(regexp);
  }

  if (result) {
    let dataStr = result[1].substr(0, result[1].indexOf(']}catch(e)') + 1);
    // console.log(dataStr);
    chinaData = JSON.parse(dataStr);
    console.log('china', chinaData);
    showMap();
  } else {
    console.log('retry', retry++);
    setTimeout(() => {
      request.open('GET', 'https://cors-anywhere.herokuapp.com/https://ncov.dxy.cn/ncovh5/view/pneumonia');
      request.send(null);
    }, 1000);
  }
};
request.send(null);

const findRecord = (str, regexp, id = null) => {
  const result = str.match(regexp);
  // console.log(result);
  if (!result) {
    return null;
  }

  let record = {
    id: id ? id : result[1].trim(),
    confirm: parseCount(result[2]),
    dead: parseCount(result[3]),
  };
  // console.log(record);
  worldData.push(record);

  return result.index + result[0].length;
};

jsonp('https://zh.wikipedia.org/w/api.php?action=parse&page=Template:2019%E5%86%A0%E7%8B%80%E7%97%85%E6%AF%92%E7%97%85%E7%97%85%E4%BE%8B%E6%95%B8&contentmodel=wikitext&prop=wikitext&format=json', function(data) {
  let str = data.parse.wikitext['*'].replace(/style="color:gray;"\|/g, '');

  let regexp = /(File:Cruise ship side view).*[ \n]*\|([0-9,\(\) ]+)[ \n]*\|([0-9,\(\) ]+)[ \n]*\|([0-9,\(\) ]+)[ \n]*\|/;
  findRecord(str, regexp, 'SHIP');

  regexp = /(File:Flag of Nepal).*[ \n]*\|([0-9,\(\) ]+)[ \n]*\|([0-9,\(\) ]+)[ \n]*\|([0-9,\(\) ]+)[ \n]*\|/;
  findRecord(str, regexp, 'NPL');

  regexp = /{{([A-Z]+)}}.*[ \n]*\|([0-9,\(\) ]+)[ \n]*\|([0-9,0-9\(\) ]+)[ \n]*\|([0-9,\(\) ]+)[ \n]*\|/;
  let idx = -1;
  while (idx !== null) {
    if (idx > 0) {
      str = str.substr(idx);
    }
    idx = findRecord(str, regexp);
  }

  // worldData = worldData.sort((a, b) => (b.confirm === a.confirm ? a.id.localeCompare(b.id) : b.confirm - a.confirm));
  console.log('world', worldData);
  showMap();
});

const showMap = () => {
  if (chinaData.length > 0 && worldData.length > 0) {
    google.charts.load('current', {
      packages: ['geochart'],
    });
    google.charts.setOnLoadCallback(processData);
  }
};
