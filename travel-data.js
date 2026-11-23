const travelPlaces = [
  { id: "cn", zh: "中国内地", en: "Mainland China", lon: 104, lat: 35 },
  { id: "hk", zh: "中国香港", en: "Hong Kong SAR", lon: 114.17, lat: 22.32 },
  { id: "jp", zh: "日本", en: "Japan", lon: 138, lat: 37 },
  { id: "es", zh: "西班牙", en: "Spain", lon: -3.7, lat: 40.4 },
  { id: "de", zh: "德国", en: "Germany", lon: 10.4, lat: 51 },
  { id: "mo", zh: "中国澳门", en: "Macao SAR", lon: 113.55, lat: 22.17 },
  { id: "fr", zh: "法国", en: "France", lon: 2.2, lat: 47 },
  { id: "mc", zh: "摩纳哥", en: "Monaco", lon: 7.42, lat: 43.73 },
  { id: "lu", zh: "卢森堡", en: "Luxembourg", lon: 6.13, lat: 49.61 },
  { id: "it", zh: "意大利", en: "Italy", lon: 12.5, lat: 42.9 },
  { id: "nl", zh: "荷兰", en: "Netherlands", lon: 5.2, lat: 52.3 },
  { id: "be", zh: "比利时", en: "Belgium", lon: 4.7, lat: 50.7 },
  { id: "gr", zh: "希腊", en: "Greece", lon: 22, lat: 39.3 },
  { id: "eg", zh: "埃及", en: "Egypt", lon: 30, lat: 27 },
  { id: "pl", zh: "波兰", en: "Poland", lon: 19.4, lat: 52 },
  { id: "lv", zh: "拉脱维亚", en: "Latvia", lon: 25, lat: 57 },
  { id: "fi", zh: "芬兰", en: "Finland", lon: 26, lat: 63 },
  { id: "se", zh: "瑞典", en: "Sweden", lon: 15.2, lat: 62 },
  { id: "no", zh: "挪威", en: "Norway", lon: 9, lat: 61 },
  { id: "dk", zh: "丹麦", en: "Denmark", lon: 9.9, lat: 56 },
  { id: "ch", zh: "瑞士", en: "Switzerland", lon: 8.2, lat: 46.8 },
  { id: "vn", zh: "越南", en: "Vietnam", lon: 107, lat: 16 },
  { id: "la", zh: "老挝", en: "Laos", lon: 102.6, lat: 19 },
  { id: "ph", zh: "菲律宾", en: "Philippines", lon: 122, lat: 13 }
];

const travelCopy = {
  zh: {
    title: "沿途风景", instruction: "点选地图上的旗帜，或从下方挑一个目的地，翻看我的沿途手记。",
    map: "到访地点世界地图", count: "个到访地点", list: "到访地点",
    regions: ["世界", "欧洲", "东亚与东南亚", "北非"],
    zoomIn: "放大地图", zoomOut: "缩小地图", group: "放大查看这些地点",
    emptyTitle: "选一个目的地", emptyText: "点击旗帜或地点名称，打开这里的旅行卡片。",
    notes: "旅行札记", pending: "这里的游记和随笔还在整理中。"
  },
  en: {
    title: "Travel Notes", instruction: "Pick a flag on the map or choose a destination below to explore my travel notes.",
    map: "World map of visited destinations", count: "destinations visited", list: "Destinations",
    regions: ["World", "Europe", "East & Southeast Asia", "North Africa"],
    zoomIn: "Zoom in", zoomOut: "Zoom out", group: "Zoom in to see these destinations",
    emptyTitle: "Choose a destination", emptyText: "Select a flag or place name to open its travel card.",
    notes: "Travel journal", pending: "I’m still getting my notes for this destination ready."
  }
};
