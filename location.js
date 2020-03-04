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
  SHIP: { v: 'SHIP', f: '🚢 鑽石公主號' },
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
  SAU: { v: 'SA', f: '沙特阿拉伯' },
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
  ARE: { v: 'AE', f: '阿聯酋' },
  FIN: { v: 'FI', f: '芬蘭' },
  IND: { v: 'IN', f: '印度' },
  RUS: { v: 'RU', f: '俄羅斯' },
  SWE: { v: 'SE', f: '瑞典' },
  ESP: { v: 'ES', f: '西班牙' },
  BEL: { v: 'BE', f: '比利時' },
  NKO: { v: 'KP', f: '北韓' },
  DPRK: { v: 'KP', f: '北韓' },
  EGY: { v: 'EG', f: '埃及' },
  IRN: { v: 'IR', f: '伊朗' },
  IRQ: { v: 'IQ', f: '伊拉克' },
  ISR: { v: 'IL', f: '以色列' },
  LBN: { v: 'LB', f: '黎巴嫩' },
  LEB: { v: 'LB', f: '黎巴嫩' },
  NPL: { v: 'NP', f: '尼泊爾' },
  KWT: { v: 'KW', f: '科威特' },
  BHR: { v: 'BH', f: '巴林' },
  CHE: { v: 'CH', f: '瑞士' },
  NOR: { v: 'NO', f: '挪威' },
  NLD: { v: 'NL', f: '荷蘭' },
  SMR: { v: 'SM', f: '聖馬力諾' },
  HRV: { v: 'HR', f: '克羅地亞' },
  GRC: { v: 'GR', f: '希臘' },
  ECU: { v: 'EC', f: '厄瓜多爾' },
  OMN: { v: 'OM', f: '阿曼' },
  DZA: { v: 'DZ', f: '阿爾及利亞' },
  MEX: { v: 'MX', f: '墨西哥' },
  DNK: { v: 'DK', f: '丹麥' },
  PAK: { v: 'PK', f: '巴基斯坦' },
  AZE: { v: 'AZ', f: '阿塞拜疆' },
  CZE: { v: 'CZ', f: '捷克' },
  GEO: { v: 'GE', f: '格魯吉亞' },
  ISL: { v: 'IS', f: '冰島' },
  QAT: { v: 'QA', f: '卡塔爾' },
  ROU: { v: 'RO', f: '羅馬尼亞' },
  POR: { v: 'PT', f: '葡萄牙' },
  BRA: { v: 'BR', f: '巴西' },
  IDN: { v: 'ID', f: '印尼' },
  AFG: { v: 'AF', f: '阿富汗' },
  AND: { v: 'AD', f: '安道爾' },
  TUN: { v: 'TN', f: '突尼西亞' },
  ARM: { v: 'AM', f: '亞美尼亞' },
  BLR: { v: 'BY', f: '白俄羅斯' },
  DOM: { v: 'DO', f: '多明尼加' },
  EST: { v: 'EE', f: '愛沙尼亞' },
  IRL: { v: 'IE', f: '愛爾蘭' },
  LTU: { v: 'LT', f: '立陶宛' },
  LUX: { v: 'LU', f: '盧森堡' },
  MCO: { v: 'MC', f: '摩納哥' },
  NZL: { v: 'NZ', f: '新西蘭' },
  NGA: { v: 'NG', f: '尼日利亞' },
  MKD: { v: 'MK', f: '北馬其頓' },
  JOR: { v: 'JO', f: '約旦' },
  LVA: { v: 'LV', f: '拉脫維亞' },
  MAR: { v: 'MA', f: '摩洛哥' },
  SEN: { v: 'SN', f: '塞內加爾' },
  ARG: { v: 'AR', f: '阿根廷' },
  CHI: { v: 'CL', f: '智利' },
  POL: { v: 'UA', f: '烏克蘭' },
  UKR: { v: 'UA', f: '烏克蘭' },
  LIE: { v: 'LI', f: '列支敦士登' },
  FRO: { v: 'FO', f: '法羅群島' },
};