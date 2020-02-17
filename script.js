function jsonp(url, callback) {
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

const locationMap = {
  湖北: { v: 'CN-42', f: '湖北' },
  河北: { v: 'CN-13', f: '河北' },
  云南: { v: 'CN-53', f: '雲南' },
  福建: { v: 'CN-35', f: '福建' },
  四川: { v: 'CN-51', f: '四川' },
  山东: { v: 'CN-37', f: '山東' },
  广西: { v: 'CN-45', f: '廣西' },
  贵州: { v: 'CN-52', f: '貴州' },
  安徽: { v: 'CN-34', f: '安徽' },
  海南: { v: 'CN-46', f: '海南' },
  宁夏: { v: 'CN-64', f: '寧夏' },
  吉林: { v: 'CN-22', f: '吉林' },
  江西: { v: 'CN-36', f: '江西' },
  天津: { v: 'CN-12', f: '天津' },
  河南: { v: 'CN-41', f: '河南' },
  重庆: { v: 'CN-50', f: '重慶' },
  山西: { v: 'CN-14', f: '山西' },
  陕西: { v: 'CN-61', f: '陝西' },
  湖南: { v: 'CN-43', f: '湖南' },
  辽宁: { v: 'CN-21', f: '遼寧' },
  北京: { v: 'CN-11', f: '北京' },
  广东: { v: 'CN-44', f: '廣東' },
  上海: { v: 'CN-31', f: '上海' },
  浙江: { v: 'CN-33', f: '浙江' },
  黑龙江: { v: 'CN-23', f: '黑龍江' },
  江苏: { v: 'CN-32', f: '江蘇' },
  内蒙古: { v: 'CN-15', f: '內蒙古' },
  西藏: { v: 'CN-54', f: '西藏' },
  甘肃: { v: 'CN-62', f: '甘肅' },
  青海: { v: 'CN-63', f: '青海' },
  新疆: { v: 'CN-65', f: '新疆' },
  SHIP: { v: 'SHIP', f: '🚢 國際郵輪' },
  MAC: { v: 'MO', f: '澳門' },
  HKG: { v: 'HK', f: '香港' },
  ROC: { v: 'TW', f: '台灣' },
  TWN: { v: 'TW', f: '台灣' },
  TW: { v: 'TW', f: '台灣' },
  JPN: { v: 'JP', f: '日本' },
  KOR: { v: 'KR', f: '韓國' },
  THA: { v: 'TH', f: '泰國' },
  USA: { v: 'US', f: '美國' },
  SGP: { v: 'SG', f: '新加坡' },
  VNM: { v: 'VN', f: '越南' },
  KSA: { v: 'SA', f: '沙特阿拉伯' },
  NEP: { v: 'NP', f: '尼泊爾' },
  FRA: { v: 'FR', f: '法國' },
  AUS: { v: 'AU', f: '澳洲' },
  GBR: { v: 'GB', f: '英國' },
  UK: { v: 'GB', f: '英國' },
  CAN: { v: 'CA', f: '加拿大' },
  ITA: { v: 'IT', f: '意大利' },
  MAS: { v: 'MY', f: '馬來西亞' },
  MYS: { v: 'MY', f: '馬來西亞' },
  PHL: { v: 'PH', f: '菲律賓' },
  KHM: { v: 'KH', f: '柬埔寨' },
  AUT: { v: 'AT', f: '奧地利' },
  GER: { v: 'DE', f: '德國' },
  LKA: { v: 'LK', f: '斯里蘭卡' },
  UAE: { v: 'AE', f: '阿聯酋' },
  FIN: { v: 'FI', f: '芬蘭' },
  IND: { v: 'IN', f: '印度' },
  RUS: { v: 'RU', f: '俄羅斯' },
  SWE: { v: 'SE', f: '瑞典' },
  ESP: { v: 'ES', f: '西班牙' },
  BEL: { v: 'BE', f: '比利時' },
  NKO: { v: 'KP', f: '北韓' },
  DPRK: { v: 'KP', f: '北韓' },
  EGY: { v: 'EG', f: '埃及' },
};

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

jsonp('https://zh.wikipedia.org/w/api.php?action=parse&page=Template:2019%E5%86%A0%E7%8B%80%E7%97%85%E6%AF%92%E7%97%85%E7%97%85%E4%BE%8B%E6%95%B8&contentmodel=wikitext&prop=wikitext&format=json', function(data) {
  const regexp = /{{([A-Z]+)}}.*[ \n]*\|[ ]*align=right[ ]*\|([0-9,\(\) ]+)[ \n]*\|[ ]*align=right[ ]*\|([0-9,\(\) ]+)[ \n]*\|[ ]*align=right[ ]*\|([0-9,\(\) ]+)[ \n]*\|/;
  let str = data.parse.wikitext['*'].replace('<sup>*</sup>', '');

  const regexpForShip = /(File:Cruise ship side view).*[ \n]*\|[ ]*align=right[ ]*\|([0-9,\(\) ]+)[ \n]*\|[ ]*align=right[ ]*\|([0-9,\(\) ]+)[ \n]*\|[ ]*align=right[ ]*\|([0-9,\(\) ]+)[ \n]*\|/;
  let result = str.match(regexpForShip);
  // console.log(result);
  let record = {
    id: 'SHIP',
    confirm: parseCount(result[2]),
    dead: parseCount(result[3]),
  };
  // console.log(record);
  worldData.push(record);

  // console.log(str);
  while (true) {
    let result = str.match(regexp);
    // console.log(result);
    if (!result) {
      break;
    }
    let record = {
      id: result[1].trim(),
      confirm: parseCount(result[2]),
      dead: parseCount(result[3]),
    };
    // console.log(record);
    worldData.push(record);
    let idx = result.index + result[0].length;
    str = str.substr(idx);
  }
  worldData = worldData.sort((a, b) => (b.confirm === a.confirm ? a.id.localeCompare(b.id) : b.confirm - a.confirm));
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
