let chinaData = [];

const chinaMap = {
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
  '43': { v: 'CN-43', f: '湖南' },
  '21': { v: 'CN-21', f: '遼寧' },
  '11': { v: 'CN-11', f: '北京' },
  '44': { v: 'CN-44', f: '廣東' },
  '31': { v: 'CN-31', f: '上海' },
  '33': { v: 'CN-33', f: '浙江' },
  '23': { v: 'CN-23', f: '黑龍江' },
  '32': { v: 'CN-32', f: '江蘇' },
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
    console.log(record.provinceShortName, conform);
  }
  if (str.indexOf('死亡') >= 0) {
    const regexp = /死亡([0-9 ]*)例/;
    let result = [...str.match(regexp)];
    dead = parseInt(result[1].trim());
  }

  if (chinaMap[region]) {
    return [chinaMap[region], conform, dead];
  }
};

function drawRegionsMap() {
  var mainlandChina = [[{ v: 'CN', f: '中國內地' }, 0, 0]];
  var modifyForMacau = [[{ v: 'CN', f: '廣東' }, 0, 0]];
  var core = [
    ['Region', '確診人數', '死亡人數'],
    [{ v: 'JP', f: '日本' }, 1, 0],
    [{ v: 'KR', f: '韓國' }, 1, 0],
    [{ v: 'TH', f: '泰國' }, 4, 0],
    [{ v: 'US', f: '美國' }, 1, 0],
    [{ v: 'TW', f: '台灣' }, 1, 0],
    [{ v: 'HK', f: '香港' }, 2, 0],
    [{ v: 'MO', f: '澳門' }, 1, 0],
  ];

  chinaData.forEach(data => {
    const r = chinaConvert(data);
    if (r) {
      if (r[1] + r[2] > 0) {
        core.push(r);
        mainlandChina[0][1] += r[1];
        mainlandChina[0][2] += r[2];
        if (modifyForMacau[0][0].f === r[0].f) {
          modifyForMacau[0][1] = r[1];
          modifyForMacau[0][2] = r[2];
        }
      }
    }
  });

  var dataWorld = google.visualization.arrayToDataTable(core.concat(mainlandChina));
  var dataAsia = google.visualization.arrayToDataTable(core);
  var dataMacau = google.visualization.arrayToDataTable(core.concat(modifyForMacau));

  var options = {
    displayMode: 'regions',
    legend: 'none',
    enableRegionInteractivity: 'true',
    legend: { textStyle: { color: 'black', fontSize: 14 } },
    width: 1000,
    height: 624,
    sizeAxis: { minSize: 5, maxSize: 5 },
    colorAxis: { colors: ['red'] },
  };

  var chart = new google.visualization.GeoChart(document.getElementById('world'));
  chart.draw(dataWorld, { ...options, resolution: 'country' });
  var chart = new google.visualization.GeoChart(document.getElementById('asia'));
  chart.draw(dataAsia, { ...options, resolution: 'provinces', region: 'CN' });
  var chart = new google.visualization.GeoChart(document.getElementById('macau'));
  chart.draw(dataMacau, { ...options, resolution: 'auto', region: 'MO' });
}

var request = new XMLHttpRequest();
request.open('GET', 'https://cors-anywhere.herokuapp.com/https://3g.dxy.cn/newh5/view/pneumonia');
request.onload = function() {
  if (request.readyState === 4 && request.status === 200) {
    const regexp = /getListByCountryTypeService1 = (.*)\}catch(.*)getPV/;
    const str = request.responseText;
    console.log(str);
    let result = [...str.match(regexp)];
    let dataStr = result[1].substr(0, result[1].indexOf(']') + 1);
    console.log(dataStr);
    chinaData = JSON.parse(dataStr);
    console.log(chinaData);

    google.charts.load('current', {
      packages: ['geochart'],
    });
    google.charts.setOnLoadCallback(drawRegionsMap);
  }
};

request.send(null);
