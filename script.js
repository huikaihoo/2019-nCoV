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

const removeBracket = str => {
  // return parseInt(str.replace(/\(.*\)/, '').trim());
  return parseInt(
    str
      .replace('(', '')
      .replace(')', '')
      .replace('*', '')
      .trim()
  );
};

let chinaData = [];
let worldData = [];

const locationMap = {
  '42': { v: 'CN-42', f: '湖北' },
  '13': { v: 'CN-13', f: '河北' },
  '53': { v: 'CN-53', f: '雲南' },
  '35': { v: 'CN-35', f: '福建' },
  '51': { v: 'CN-51', f: '四川' },
  '37': { v: 'CN-37', f: '山東' },
  '45': { v: 'CN-45', f: '廣西' },
  '52': { v: 'CN-52', f: '貴州' },
  '34': { v: 'CN-34', f: '安徽' },
  '46': { v: 'CN-46', f: '海南' },
  '64': { v: 'CN-64', f: '寧夏' },
  '22': { v: 'CN-22', f: '吉林' },
  '36': { v: 'CN-36', f: '江西' },
  '12': { v: 'CN-12', f: '天津' },
  '41': { v: 'CN-41', f: '河南' },
  '50': { v: 'CN-50', f: '重慶' },
  '14': { v: 'CN-14', f: '山西' },
  '61': { v: 'CN-61', f: '陝西' },
  '43': { v: 'CN-43', f: '湖南' },
  '21': { v: 'CN-21', f: '遼寧' },
  '11': { v: 'CN-11', f: '北京' },
  '44': { v: 'CN-44', f: '廣東' },
  '31': { v: 'CN-31', f: '上海' },
  '33': { v: 'CN-33', f: '浙江' },
  '23': { v: 'CN-23', f: '黑龍江' },
  '32': { v: 'CN-32', f: '江蘇' },
  '15': { v: 'CN-15', f: '內蒙古' },
  '54': { v: 'CN-54', f: '西藏' },
  '62': { v: 'CN-62', f: '甘肅' },
  '63': { v: 'CN-63', f: '青海' },
  '65': { v: 'CN-65', f: '新疆' },
  MAC: { v: 'MO', f: '澳門' },
  HKG: { v: 'HK', f: '香港' },
  TWN: { v: 'TW', f: '台灣' },
  JPN: { v: 'JP', f: '日本' },
  KOR: { v: 'KR', f: '韓國' },
  THA: { v: 'TH', f: '泰國' },
  USA: { v: 'US', f: '美國' },
  SGP: { v: 'SG', f: '新加坡' },
  VNM: { v: 'VN', f: '越南' },
};

const chinaConvert = record => {
  const region = record.provinceId;
  const str = record.tags;

  let conform = 0,
    dead = 0;

  if (str.indexOf('确诊') >= 0) {
    const regexp = /确诊([0-9 ]*)例/;
    let result = [...str.match(regexp)];
    conform = parseInt(result[1].trim());
  }
  if (str.indexOf('死亡') >= 0) {
    const regexp = /死亡([0-9 ]*)例/;
    let result = [...str.match(regexp)];
    dead = parseInt(result[1].trim());
  }

  console.log(record.provinceShortName, conform, locationMap[region] ? locationMap[region].v : null);

  if (locationMap[region]) {
    return [locationMap[region], conform, dead];
  }
};

const worldConvert = record => {
  const region = record.id;
  const { conform, dead } = record;

  console.log(record.id, conform, locationMap[region] ? locationMap[region].v : null);

  if (locationMap[region]) {
    return [locationMap[region], conform, dead];
  }
};

function drawRegionsMap() {
  const mainlandChina = [[{ v: 'CN', f: '中國內地' }, 0, 0]];
  const modifyForHKMO = [[{ v: 'CN', f: '廣東' }, 0, 0]];
  const core = [['Region', '確診人數', '死亡人數']];

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
    colorAxis: { maxValue: mainlandChina[0][1], colors: ['red'] },
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
}

const request = new XMLHttpRequest();

request.open('GET', 'https://cors-anywhere.herokuapp.com/https://3g.dxy.cn/newh5/view/pneumonia');
request.onload = function() {
  if (request.readyState === 4 && request.status === 200) {
    const regexp = /getListByCountryTypeService1 = (.*)\}catch(.*)(getPV|getListByCountryTypeService2)/;
    const str = request.responseText;
    // console.log(str);
    let result = str.match(regexp);
    let dataStr = result[1].substr(0, result[1].indexOf(']') + 1);
    // console.log(dataStr);
    chinaData = JSON.parse(dataStr);
    console.log('china', chinaData);
    showMap();
  }
};
request.send(null);

jsonp(
  'https://zh.wikipedia.org/w/api.php?action=parse&page=2019%EF%BC%8D2020%E5%B9%B4%E6%96%B0%E5%9E%8B%E5%86%A0%E7%8B%80%E7%97%85%E6%AF%92%E8%82%BA%E7%82%8E%E4%BA%8B%E4%BB%B6&contentmodel=wikitext&prop=wikitext&format=json',
  function(data) {
    const regexp = /\|[ ]*{{([A-Z]+)}}[ ]*\|([0-9\(\) ]+)\|([0-9\(\) ]+)\|([0-9\(\) ]+)\|/;
    let str = data.parse.wikitext['*'].replace('<sup>*</sup>', '');
    // console.log(str);
    while (true) {
      let result = str.match(regexp);
      if (!result) {
        break;
      }
      let record = {
        id: result[1].trim(),
        conform: removeBracket(result[2]),
        dead: removeBracket(result[3]),
      };
      // console.log(record);
      worldData.push(record);
      let idx = result.index + result[0].length;
      str = str.substr(idx);
    }
    console.log('world', worldData);
    showMap();
  }
);

const showMap = () => {
  if (chinaData.length > 0 && worldData.length > 0) {
    google.charts.load('current', {
      packages: ['geochart'],
    });
    google.charts.setOnLoadCallback(drawRegionsMap);
  }
};
