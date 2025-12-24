// === КОНФИГУРАЦИЯ ===
const CONFIG = {
  appName: 'Золотые Звёзды Северян',
  version: '3.0.0',
  buildDate: '2024-12-21',
  
  // Настройки карты (MapLibre)
  map: {
    styles: {
      light: 'https://demotiles.maplibre.org/style.json',
      dark: 'https://demotiles.maplibre.org/style.json',
      streets: 'https://demotiles.maplibre.org/style.json',
      satellite: 'https://demotiles.maplibre.org/style.json'
    },
    defaultStyle: 'dark',
    defaultCenter: [63.5, 55.0], // [longitude, latitude]
    defaultZoom: 4,
    minZoom: 2,
    maxZoom: 18,
    pitch: 45,
    bearing: 0
  },
  
  // Настройки приложения
  settings: {
    theme: 'dark',
    offlineMode: false,
    animations: true,
    sound: true,
    notifications: true,
    autoSave: true,
    language: 'ru',
    units: 'metric',
    audioGuide: false
  },
  
  // Константы
  constants: {
    heroCount: 10,
    totalAwards: 30,
    totalLocations: 20,
    currentYear: 2024,
    warYears: [1941, 1945]
  }
};

// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let currentHero = null;
let activeSectionId = 'info';
let currentView = 'grid';
let filteredHeroes = [];

// === DOM ЭЛЕМЕНТЫ ===
const elements = {
  // Прелоадер
  preloader: document.getElementById('preloader'),
  loadingText: document.getElementById('loading-text'),
  progressFill: document.getElementById('progress-fill'),
  
  // Навигация
  sidebar: document.getElementById('sidebar'),
  sidebarClose: document.getElementById('sidebar-close'),
  menuToggle: document.getElementById('menu-toggle'),
  sidebarLinks: document.querySelectorAll('.sidebar-link'),
  
  // Поиск
  searchInput: document.getElementById('search-input'),
  searchBox: document.getElementById('search-box'),
  clearSearch: document.getElementById('clear-search'),
  
  // Тема и режимы
  themeToggle: document.getElementById('theme-toggle'),
  offlineToggle: document.getElementById('offline-toggle'),
  connectionStatus: document.getElementById('connection-status'),
  
  // Карта
  heroMap: document.getElementById('hero-map'),
  mapStyleToggle: document.getElementById('map-style-toggle'),
  map3dToggle: document.getElementById('map-3d-toggle'),
  mapReset: document.getElementById('map-reset'),
  mapZoomIn: document.getElementById('map-zoom-in'),
  mapZoomOut: document.getElementById('map-zoom-out'),
  
  // Герои
  heroesGrid: document.getElementById('heroes-list'),
  viewButtons: document.querySelectorAll('.view-btn'),
  noResults: document.getElementById('no-results'),
  
  // Детали героя
  heroDetailPanel: document.getElementById('hero-detail'),
  heroDetailOverlay: document.getElementById('hero-detail-overlay'),
  closeDetail: document.getElementById('close-detail'),
  detailHeroName: document.getElementById('detail-hero-name'),
  detailContent: document.getElementById('detail-content'),
  
  // Уведомления
  notificationCenter: document.getElementById('notification-container'),
  
  // Прочие
  fullscreenToggle: document.getElementById('fullscreen-toggle'),
  
  // Аудиогид
  audioPlay: document.getElementById('audio-play'),
  audioPause: document.getElementById('audio-pause'),
  audioStop: document.getElementById('audio-stop'),
  audioSpeed: document.getElementById('audio-speed'),
  audioToggle: document.getElementById('audio-toggle'),
  audioVoice: document.getElementById('audio-voice'),
  audioProgress: document.getElementById('audio-progress')
};

// === ДАННЫЕ ГЕРОЕВ (10 ГЕРОЕВ ИЗ КНИГИ Р.А. ОВСЯНКИНА) ===
const heroes = [
  {
    id: 1,
    fio: "Шабалин Александр Осипович",
    years: "1914–1982",
    birthplace: "Юдмозеро, Архангельская область",
    birthCoords: [61.5, 40.5],
    education: "7 классов, военно-морское училище",
    profession: "Командир торпедного катера",
    rank: "Капитан 1-го ранга",
    party: "Член ВКП(б)",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1944", level: "высшая" },
      { name: "Вторая Золотая Звезда Героя Советского Союза", date: "1945", level: "высшая" },
      { name: "Орден Ленина", date: "1944", level: "высокая" },
      { name: "Орден Красного Знамени", date: "1943", level: "высокая" }
    ],
    deeds: "Командир торпедного катера ТКА-12. Провёл более 100 боевых операций, потопил 5 кораблей противника. Участвовал в высадке десанта в порту Лиинахамари, где под сильным огнём обеспечивал прикрытие десанта.",
    additionalInfo: {
      regiment: "1-й дивизион торпедных катеров Северного флота",
      battles: ["Оборона Заполярья", "Петсамо-Киркенесская операция"],
      missions: 100,
      victories: 5,
      weapons: "Торпедный катер",
      status: "Выжил, после войны служил на флоте",
      burial: "Москва, Кунцевское кладбище"
    },
    img: "assets/Shabalin.jpeg" ,
    deedCoords: [69.7, 31.4],
    region: "Архангельская область",
    tags: ["navy", "survived", "double_hero"]
  },
  {
    id: 2,
    fio: "Агафонов Семён Михайлович",
    years: "1917–1977",
    birthplace: "д. Козьмино, Архангельская область",
    birthCoords: [61.3, 40.8],
    education: "Начальная школа",
    profession: "Разведчик",
    rank: "Старший сержант",
    party: "Член ВКП(б)",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1944", level: "высшая" },
      { name: "Орден Ленина", date: "1944", level: "высокая" },
      { name: "Орден Красной Звезды", date: "1943", level: "высокая" }
    ],
    deeds: "Разведчик 6-й роты 67-го гвардейского стрелкового полка. В ходе Витебской операции первым ворвался в траншею противника, уничтожил 7 немецких солдат и захватил пулемёт. В дальнейшем удерживал позицию до подхода основных сил.",
    additionalInfo: {
      regiment: "67-й гвардейский стрелковый полк",
      battles: ["Витебская операция", "Белорусская операция"],
      missions: 45,
      victories: 7,
      weapons: "ППШ, гранаты",
      status: "Выжил, после войны работал в лесной промышленности",
      burial: "Архангельская область"
    },
    img: "assets/agafonof.jpg",
    deedCoords: [55.2, 30.2],
    region: "Архангельская область",
    tags: ["scout", "survived"]
  },
  {
    id: 3,
    fio: "Акулов Пётр Григорьевич",
    years: "1911–1967",
    birthplace: "д. Тимошино, Архангельская область",
    birthCoords: [61.6, 41.0],
    education: "Среднее",
    profession: "Командир стрелкового взвода",
    rank: "Лейтенант",
    party: "Член ВКП(б)",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1944", level: "высшая" },
      { name: "Орден Ленина", date: "1944", level: "высокая" },
      { name: "Орден Красной Звезды", date: "1943", level: "высокая" }
    ],
    deeds: "Командир стрелкового взвода 109-го гвардейского стрелкового полка. В боях за Днепр со своим взводом первым форсировал реку, захватил плацдарм и удерживал его до подхода основных сил. В рукопашной схватке уничтожил 5 немецких солдат.",
    additionalInfo: {
      regiment: "109-й гвардейский стрелковый полк",
      battles: ["Форсирование Днепра", "Корсунь-Шевченковская операция"],
      missions: 28,
      victories: 5,
      weapons: "ППШ, пистолет ТТ",
      status: "Выжил, после войны работал председателем колхоза",
      burial: "Архангельская область"
    },
    img: "assets/akulov.jpg",
    deedCoords: [48.5, 35.0],
    region: "Архангельская область",
    tags: ["infantry", "survived"]
  },
  {
    id: 4,
    fio: "Баландин Михаил Фокич",
    years: "1908–1970",
    birthplace: "д. Зачачье, Архангельская область",
    birthCoords: [62.1, 40.3],
    education: "Начальная школа",
    profession: "Командир орудия",
    rank: "Старший сержант",
    party: "Член ВКП(б)",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1945", level: "высшая" },
      { name: "Орден Ленина", date: "1945", level: "высокая" },
      { name: "Орден Красной Звезды", date: "1944", level: "высокая" }
    ],
    deeds: "Командир орудия 1281-го стрелкового полка. В боях за Берлин его расчёт уничтожил 3 дзота, 2 пулемётные точки и до 30 солдат противника. При отражении контратаки лично подбил немецкий танк.",
    additionalInfo: {
      regiment: "1281-й стрелковый полк",
      battles: ["Висло-Одерская операция", "Берлинская операция"],
      missions: 42,
      victories: 1,
      weapons: "76-мм орудие",
      status: "Выжил, после войны работал в совхозе",
      burial: "Архангельская область"
    },
    img: "assets/balandin.jpg",
    deedCoords: [52.5, 13.4],
    region: "Архангельская область",
    tags: ["artillery", "survived"]
  },
  {
    id: 5,
    fio: "Бегоулев Борис Петрович",
    years: "1921–1944",
    birthplace: "Архангельск",
    birthCoords: [64.54, 40.54],
    education: "10 классов",
    profession: "Лётчик-истребитель",
    rank: "Старший лейтенант",
    party: "Член ВЛКСМ",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1944", level: "высшая" },
      { name: "Орден Ленина", date: "1944", level: "высокая" },
      { name: "Орден Красного Знамени", date: "1943", level: "высокая" }
    ],
    deeds: "Командир эскадрильи 19-го истребительного авиаполка. Совершил 285 боевых вылетов, провёл 45 воздушных боёв, сбил лично 12 самолётов противника. Погиб в воздушном бою над Восточной Пруссией.",
    additionalInfo: {
      regiment: "19-й истребительный авиаполк",
      battles: ["Курская битва", "Белорусская операция"],
      missions: 285,
      victories: 12,
      aircraft: "Як-9",
      status: "Погиб в воздушном бою",
      burial: "Восточная Пруссия"
    },
    img: "assets/begoulev.jpg",
    deedCoords: [54.7, 20.5],
    region: "Архангельская область",
    tags: ["pilot", "posthumous"]
  },
  {
    id: 6,
    fio: "Беляков Николай Александрович",
    years: "1911–1944",
    birthplace: "д. Новосёлово, Архангельская область",
    birthCoords: [61.8, 40.9],
    education: "Начальная школа",
    profession: "Командир взвода разведки",
    rank: "Старшина",
    party: "Член ВКП(б)",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1944", level: "высшая" },
      { name: "Орден Ленина", date: "1944", level: "высокая" },
      { name: "Орден Красной Звезды", date: "1943", level: "высокая" }
    ],
    deeds: "Командир взвода разведки 290-го стрелкового полку. В ходе Львовско-Сандомирской операции со своим взводом проник в тыл противника, уничтожил штаб немецкой части и захватил ценные документы. Погиб при выходе из окружения.",
    additionalInfo: {
      regiment: "290-й стрелковый полк",
      battles: ["Львовско-Сандомирская операция"],
      missions: 32,
      victories: 0,
      weapons: "ППШ, нож",
      status: "Погиб в бою",
      burial: "Львовская область"
    },
    img: "assets/belyakov.jpg",
    deedCoords: [49.8, 24.0],
    region: "Архангельская область",
    tags: ["scout", "posthumous"]
  },
  {
    id: 7,
    fio: "Бова Ефим Ермолаевич",
    years: "1911–1943",
    birthplace: "д. Пермогорье, Архангельская область",
    birthCoords: [62.2, 39.8],
    education: "5 классов",
    profession: "Сапёр",
    rank: "Ефрейтор",
    party: "Беспартийный",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1944", level: "высшая" },
      { name: "Орден Ленина", date: "1944", level: "высокая" }
    ],
    deeds: "Сапёр 20-й отдельной инженерно-сапёрной бригады. При форсировании Днепра под огнём противника сделал 18 рейсов на лодке, переправив 120 бойцов с вооружением. При последнем рейсе был смертельно ранен, но довёл лодку до берега.",
    additionalInfo: {
      regiment: "20-я отдельная инженерно-сапёрная бригада",
      battles: ["Форсирование Днепра"],
      missions: 18,
      transported: 120,
      weapons: "Сапёрная лопатка",
      status: "Погиб при исполнении долга",
      burial: "Днепропетровская область"
    },
    img: "assets/bova.jpg",
    deedCoords: [48.5, 35.0],
    region: "Архангельская область",
    tags: ["sapper", "posthumous"]
  },
  {
    id: 8,
    fio: "Бочаров Сергей Иванович",
    years: "1916–1944",
    birthplace: "Архангельск",
    birthCoords: [64.54, 40.54],
    education: "Среднее",
    profession: "Командир танка",
    rank: "Старший лейтенант",
    party: "Член ВЛКСМ",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1945", level: "высшая" },
      { name: "Орден Ленина", date: "1945", level: "высокая" },
      { name: "Орден Красной Звезды", date: "1944", level: "высокая" }
    ],
    deeds: "Командир танка Т-34 21-й гвардейской танковой бригады. В боях за Варшаву его экипаж уничтожил 3 немецких танка, 2 орудия и до 50 солдат противника. Погиб при подрыве танка на мине.",
    additionalInfo: {
      regiment: "21-я гвардейская танковая бригада",
      battles: ["Висло-Одерская операция", "Освобождение Варшавы"],
      missions: 25,
      victories: 3,
      weapons: "Танк Т-34",
      status: "Погиб в бою",
      burial: "Варшава"
    },
    img: "assets/bocharov.jpg",
    deedCoords: [52.2, 21.0],
    region: "Архангельская область",
    tags: ["tank", "posthumous"]
  },
  {
    id: 9,
    fio: "Буров Герман Петрович",
    years: "1916–1979",
    birthplace: "д. Заполье, Архангельская область",
    birthCoords: [61.7, 40.6],
    education: "7 классов",
    profession: "Командир отделения",
    rank: "Старший сержант",
    party: "Член ВКП(б)",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1944", level: "высшая" },
      { name: "Орден Ленина", date: "1944", level: "высокая" },
      { name: "Орден Красной Звезды", date: "1943", level: "высокая" }
    ],
    deeds: "Командир отделения 212-го гвардейского стрелкового полка. В боях за Кёнигсберг со своим отделением первым ворвался в укреплённый дом, уничтожил гарнизон из 15 немецких солдат. Был тяжело ранен, но продолжал командовать отделением.",
    additionalInfo: {
      regiment: "212-й гвардейский стрелковый полк",
      battles: ["Восточно-Прусская операция", "Штурм Кёнигсберга"],
      missions: 38,
      victories: 15,
      weapons: "ППШ, гранаты",
      status: "Выжил, инвалид войны",
      burial: "Архангельская область"
    },
    img: "assets/burov.jpg",
    deedCoords: [54.7, 20.5],
    region: "Архангельская область",
    tags: ["infantry", "survived"]
  },
  {
    id: 10,
    fio: "Вежливцев Иван Дмитриевич",
    years: "1916–1945",
    birthplace: "д. Погост, Архангельская область",
    birthCoords: [61.9, 40.2],
    education: "Начальная школа",
    profession: "Наводчик орудия",
    rank: "Старший сержант",
    party: "Беспартийный",
    awards: [
      { name: "Золотая Звезда Героя Советского Союза", date: "1945", level: "высшая" },
      { name: "Орден Ленина", date: "1945", level: "высокая" },
      { name: "Орден Красной Звезды", date: "1944", level: "высокая" }
    ],
    deeds: "Наводчик орудия 134-го артиллерийского полка. В боях на подступах к Берлину его расчёт уничтожил 4 танка, 2 бронетранспортёра и 3 орудия противника. Погиб от прямого попадания снаряда в орудие.",
    additionalInfo: {
      regiment: "134-й артиллерийский полк",
      battles: ["Берлинская операция"],
      missions: 36,
      victories: 4,
      weapons: "122-мм гаубица",
      status: "Погиб в бою",
      burial: "Берлин"
    },
    img: "assets/vejlivchev.jpg",
    deedCoords: [52.5, 13.4],
    region: "Архангельская область",
    tags: ["artillery", "posthumous"]
  }
];

// === ДАННЫЕ ДЛЯ ВСЕХ ВКЛАДОК ===

// Данные наград
const awardsData = [
  {
    id: 1,
    name: "Медаль «Золотая Звезда»",
    fullName: "Медаль «Золотая Звезда» Героя Советского Союза",
    type: "highest",
    description: "Высшая степень отличия СССР, вручалась за совершение подвига или выдающихся заслуг во время боевых действий",
    established: "1939-08-01",
    totalAwarded: 12772,
    image: "assets/zvezda_sssr.png",
    requirements: "За личные или коллективные заслуги перед государством, связанные с совершением геройского подвига",
    heroIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: 2,
    name: "Орден Ленина",
    fullName: "Орден Ленина",
    type: "order",
    description: "Высшая награда СССР за особо выдающиеся заслуги в революционном движении, трудовой деятельности",
    established: "1930-04-06",
    totalAwarded: 431418,
    image: "assets/lenin.png",
    requirements: "За исключительные достижения и заслуги",
    heroIds: [2, 4, 7]
  },
  {
    id: 3,
    name: "Орден Красного Знамени",
    fullName: "Орден Красного Знамени",
    type: "order",
    description: "Орден за боевые заслуги, первый советский орден",
    established: "1924-08-01",
    totalAwarded: 581300,
    image: "assets/krasnoe_znamya.png",
    requirements: "За особую храбрость, самоотверженность и мужество",
    heroIds: [1, 4]
  },
  {
    id: 4,
    name: "Орден Красной Звезды",
    fullName: "Орден Красной Звезды",
    type: "order",
    description: "Военный орден за большие заслуги в деле обороны СССР",
    established: "1930-04-06",
    totalAwarded: 3876740,
    image: "assets/krasnoya_zvezda.png",
    requirements: "За личное мужество и отвагу в боях",
    heroIds: [2, 7, 9]
  },
  {
    id: 5,
    name: "Орден Славы",
    fullName: "Орден Славы I, II, III степени",
    type: "order",
    description: "Орден для награждения рядового и сержантского состава за личные подвиги",
    established: "1943-11-08",
    totalAwarded: 2670000,
    image: "assets/slava.png",
    requirements: "За личный подвиг на поле боя",
    heroIds: [5, 10]
  },
  {
    id: 6,
    name: "Медаль «За отвагу»",
    fullName: "Медаль «За отвагу»",
    type: "medal",
    description: "Медаль за личное мужество и отвагу, проявленные при защите Отечества",
    established: "1938-10-17",
    totalAwarded: 4220000,
    image: "assets/otvaga.png",
    requirements: "За личное мужество и отвагу в боях",
    heroIds: [6]
  },
  {
    id: 7,
    name: "Орден Отечественной войны",
    fullName: "Орден Отечественной войны I и II степени",
    type: "order",
    description: "Орден для награждения военнослужащих и партизан за подвиги в Великой Отечественной войне",
    established: "1942-05-20",
    totalAwarded: 9000000,
    image: "assets/voyna.png",
    requirements: "За подвиги в боях за Родину",
    heroIds: [3]
  },
  {
    id: 8,
    name: "Орден Ушакова",
    fullName: "Орден Ушакова",
    type: "order",
    description: "Флотоводческий орден для награждения офицеров Военно-Морского Флота",
    established: "1944-03-03",
    totalAwarded: 47,
    image: "assets/ushakov.png",
    requirements: "За выдающиеся заслуги в организации и проведении морских операций",
    heroIds: [8]
  }
];

// Данные памятников
const monumentsData = [
  {
    id: 1,
    name: "Мемориал Героям-северянам",
    type: "memorial",
    location: "Архангельск, Россия",
    coordinates: [64.5401, 40.5433],
    description: "Мемориальный комплекс, посвящённый всем героям-северянам Великой Отечественной войны",
    year: 1975,
    image: "assets/severyane.png",
    heroes: [1, 6]
  },
  {
    id: 2,
    name: "Мемориал защитникам советского заполярья",
    type: "memorial",
    location: "Мурманск, Россия",
    coordinates: [68.9585, 33.0827],
    description: "Мемориальный комплекс, посвящённый обороне Заполярья и героям-мурманчанам",
    year: 1985,
    image: "assets/zapolyare.png",
    heroes: [2, 8]
  },
  {
    id: 3,
    name: "Памятник вологодским героям",
    type: "monument",
    location: "Вологда, Россия",
    coordinates: [59.2205, 39.8915],
    description: "Памятник героям-вологжанам, павшим в Великой Отечественной войне",
    year: 1970,
    image: "assets/vologda.png",
    heroes: [3, 7]
  },
  {
    id: 4,
    name: "Мемориал карельским защитникам",
    type: "memorial",
    location: "Петрозаводск, Карелия",
    coordinates: [61.7850, 34.3468],
    description: "Мемориал в честь героев-карелов, защищавших свою землю",
    year: 1980,
    image: "assets/karel.png",
    heroes: [4, 9]
  },
  {
    id: 5,
    name: "Памятник героям Коми",
    type: "monument",
    location: "Сыктывкар, Коми",
    coordinates: [61.6680, 50.8350],
    description: "Памятник уроженцам Коми, удостоенным звания Героя Советского Союза",
    year: 1965,
    image: "assets/komi.png",
    heroes: [5, 10]
  }
];

// Данные событий
const eventsData = [
  {
    id: 1,
    date: "1941-06-22",
    title: "Начало Великой Отечественной войны",
    description: "Германия напала на СССР, началась Великая Отечественная война",
    type: "war",
    importance: "highest"
  },
  {
    id: 2,
    date: "1941-09-30",
    title: "Битва за Москву",
    description: "Первое крупное поражение немецких войск",
    type: "battle",
    importance: "high"
  },
  {
    id: 3,
    date: "1942-07-17",
    title: "Сталинградская битва",
    description: "Коренной перелом в ходе войны",
    type: "battle",
    importance: "highest"
  },
  {
    id: 4,
    date: "1943-07-05",
    title: "Курская битва",
    description: "Крупнейшее танковое сражение в истории",
    type: "battle",
    importance: "high"
  },
  {
    id: 5,
    date: "1944-06-06",
    title: "Открытие Второго фронта",
    description: "Высадка союзников в Нормандии",
    type: "operation",
    importance: "medium"
  },
  {
    id: 6,
    date: "1945-01-12",
    title: "Висло-Одерская операция",
    description: "Освобождение Польши",
    type: "operation",
    importance: "high"
  },
  {
    id: 7,
    date: "1945-04-16",
    title: "Берлинская операция",
    description: "Штурм Берлина, завершение войны в Европе",
    type: "operation",
    importance: "highest"
  },
  {
    id: 8,
    date: "1945-05-09",
    title: "День Победы",
    description: "Капитуляция Германии, окончание Великой Отечественной войны",
    type: "victory",
    importance: "highest"
  }
];

// Данные для теста
const quizData = {
  easy: [
    {
      id: 1,
      question: "Сколько героев-северян представлено в проекте?",
      options: ["5", "8", "10", "12"],
      correct: 2,
      explanation: "В проекте представлено 10 героев-северян из разных регионов Севера России."
    },
    {
      id: 2,
      question: "Какой была высшая награда СССР?",
      options: ["Орден Ленина", "Орден Красного Знамени", "Медаль «Золотая Звезда»", "Орден Победы"],
      correct: 2,
      explanation: "Медаль «Золотая Звезда» была знаком отличия к званию Героя Советского Союза — высшей степени отличия."
    },
    {
      id: 3,
      question: "В каком году началась Великая Отечественная война?",
      options: ["1939", "1940", "1941", "1942"],
      correct: 2,
      explanation: "Великая Отечественная война началась 22 июня 1941 года."
    },
    {
      id: 4,
      question: "Кто из героев был дважды Героем Советского Союза?",
      options: ["Шабалин А.О.", "Агафонов С.М.", "Акулов П.Г.", "Баландин М.Ф."],
      correct: 0,
      explanation: "Шабалин Александр Осипович был дважды удостоен звания Героя Советского Союза."
    },
    {
      id: 5,
      question: "Какой регион представляют герои-северяне?",
      options: ["Архангельская область", "Московская область", "Краснодарский край", "Свердловская область"],
      correct: 0,
      explanation: "Все герои-северяне, представленные в проекте, были уроженцами Архангельской области."
    }
  ],
  medium: [
    {
      id: 1,
      question: "Кто из героев был лётчиком-истребителем?",
      options: ["Шабалин А.О.", "Бегоулев Б.П.", "Акулов П.Г.", "Баландин М.Ф."],
      correct: 1,
      explanation: "Бегоулев Борис Петрович был лётчиком-истребителем и совершил 285 боевых вылетов."
    },
    {
      id: 2,
      question: "Кто из героев был сапёром?",
      options: ["Бова Е.Е.", "Агафонов С.М.", "Вежливцев И.Д.", "Бочаров С.И."],
      correct: 0,
      explanation: "Бова Ефим Ермолаевич был сапёром и совершил 18 рейсов через Днепр под огнём противника."
    },
    {
      id: 3,
      question: "Кто из героев был подводником?",
      options: ["Шабалин А.О.", "Беляков Н.А.", "Буров Г.П.", "Вежливцев И.Д."],
      correct: 0,
      explanation: "Шабалин Александр Осипович командовал торпедным катером и потопил 5 кораблей противника."
    },
    {
      id: 4,
      question: "За какой подвиг получил Героя Александр Шабалин?",
      options: ["За оборону Москвы", "За высадку десанта в Лиинахамари", "За Сталинград", "За разминирование"],
      correct: 1,
      explanation: "Александр Шабалин обеспечивал прикрытие десанта в порту Лиинахамари под сильным огнём противника."
    },
    {
      id: 5,
      question: "Какой орден был первым советским орденом?",
      options: ["Орден Ленина", "Орден Красной Звезды", "Орден Красного Знамени", "Орден Отечественной войны"],
      correct: 2,
      explanation: "Орден Красного Знамени был учреждён в 1918 году и стал первым советским орденом."
    },
    {
      id: 6,
      question: "Кто из героев погиб в Берлинской операции?",
      options: ["Вежливцев И.Д.", "Агафонов С.М.", "Бова Е.Е.", "Беляков Н.А."],
      correct: 0,
      explanation: "Вежливцев Иван Дмитриевич погиб в боях на подступах к Берлину."
    },
    {
      id: 7,
      question: "Сколько самолётов сбил Борис Бегоулев?",
      options: ["8", "12", "15", "18"],
      correct: 1,
      explanation: "Борис Бегоулев сбил 12 вражеских самолётов."
    },
    {
      id: 8,
      question: "Кто из героев был танкистом?",
      options: ["Бочаров С.И.", "Баландин М.Ф.", "Акулов П.Г.", "Буров Г.П."],
      correct: 0,
      explanation: "Бочаров Сергей Иванович был командиром танка Т-34."
    },
    {
      id: 9,
      question: "Сколько раненых переправил через Днепр Ефим Бова?",
      options: ["80", "100", "120", "150"],
      correct: 2,
      explanation: "Ефим Бова переправил 120 бойцов с вооружением через Днепр."
    },
    {
      id: 10,
      question: "Кто из героев был разведчиком?",
      options: ["Агафонов С.М.", "Беляков Н.А.", "Оба варианта верны", "Ни один из вариантов"],
      correct: 2,
      explanation: "И Агафонов Семён, и Беляков Николай были разведчиками."
    }
  ],
  hard: [
    {
      id: 1,
      question: "Сколько кораблей потопил Александр Шабалин?",
      options: ["3", "5", "7", "9"],
      correct: 1,
      explanation: "Александр Шабалин потопил 5 вражеских кораблей."
    },
    {
      id: 2,
      question: "Сколько рейсов сделал Ефим Бова через Днепр?",
      options: ["12", "15", "18", "21"],
      correct: 2,
      explanation: "Ефим Бова сделал 18 рейсов через Днепр под огнём противника."
    },
    {
      id: 3,
      question: "Сколько танков уничтожил Иван Вежливцев в Берлине?",
      options: ["2", "4", "6", "8"],
      correct: 1,
      explanation: "Иван Вежливцев уничтожил 4 танка противника в боях за Берлин."
    },
    {
      id: 4,
      question: "Сколько немецких солдат уничтожил Герман Буров в Кёнигсберге?",
      options: ["10", "15", "20", "25"],
      correct: 1,
      explanation: "Герман Буров уничтожил гарнизон из 15 немецких солдат в укреплённом доме."
    },
    {
      id: 5,
      question: "Сколько боевых вылетов совершил Борис Бегоулев?",
      options: ["200", "250", "285", "300"],
      correct: 2,
      explanation: "Борис Бегоулев совершил 285 боевых вылетов."
    },
    {
      id: 6,
      question: "В каком году погиб Николай Беляков?",
      options: ["1943", "1944", "1945", "1946"],
      correct: 1,
      explanation: "Николай Беляков погиб в 1944 году."
    },
    {
      id: 7,
      question: "Сколько дзотов уничтожил Михаил Баландин в Берлине?",
      options: ["1", "2", "3", "4"],
      correct: 2,
      explanation: "Михаил Баландин уничтожил 3 дзота в боях за Берлин."
    },
    {
      id: 8,
      question: "Сколько немецких солдат уничтожил Семён Агафонов в Витебской операции?",
      options: ["5", "7", "9", "11"],
      correct: 1,
      explanation: "Семён Агафонов уничтожил 7 немецких солдат в Витебской операции."
    },
    {
      id: 9,
      question: "Сколько танков уничтожил Сергей Бочаров в Варшаве?",
      options: ["2", "3", "4", "5"],
      correct: 1,
      explanation: "Сергей Бочаров уничтожил 3 немецких танка в боях за Варшаву."
    },
    {
      id: 10,
      question: "Сколько немецких солдат уничтожил Пётр Акулов при форсировании Днепра?",
      options: ["3", "5", "7", "9"],
      correct: 1,
      explanation: "Пётр Акулов уничтожил 5 немецких солдат в рукопашной схватке при форсировании Днепра."
    },
    {
      id: 11,
      question: "В каком году учреждена медаль «Золотая Звезда»?",
      options: ["1934", "1939", "1941", "1943"],
      correct: 1,
      explanation: "Медаль «Золотая Звезда» была учреждена 1 августа 1939 года."
    },
    {
      id: 12,
      question: "Сколько всего было награждений Орденом Ленина?",
      options: ["более 100 тысяч", "более 200 тысяч", "более 300 тысяч", "более 400 тысяч"],
      correct: 3,
      explanation: "Орденом Ленина было произведено более 431 тысячи награждений."
    },
    {
      id: 13,
      question: "Какой орден был учреждён первым в годы Великой Отечественной войны?",
      options: ["Орден Отечественной войны", "Орден Славы", "Орден Ушакова", "Орден Нахимова"],
      correct: 0,
      explanation: "Орден Отечественной войны был учреждён 20 мая 1942 года первым из военных орденов."
    },
    {
      id: 14,
      question: "Сколько степеней имеет Орден Славы?",
      options: ["1", "2", "3", "4"],
      correct: 2,
      explanation: "Орден Славы имеет три степени: I, II и III."
    },
    {
      id: 15,
      question: "Какой орден называют «солдатским»?",
      options: ["Орден Красной Звезды", "Орден Славы", "Орден Отечественной войны", "Орден Красного Знамени"],
      correct: 1,
      explanation: "Орден Славы называют «солдатским» орденом, так как им награждали только рядовой и сержантский состав."
    }
  ]
};

// === УТИЛИТЫ ===
class Utils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static formatDate(date, format = 'ru-RU') {
    return new Date(date).toLocaleDateString(format);
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  static toRad(degrees) {
    return degrees * Math.PI / 180;
  }

  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static localStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// === УВЕДОМЛЕНИЯ ===
class NotificationSystem {
  constructor() {
    this.queue = [];
    this.isShowing = false;
  }

  show(type, title, message, duration = 5000) {
    const id = Utils.generateUUID();
    const notification = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: Date.now()
    };

    this.queue.push(notification);
    this.processQueue();

    return id;
  }

  processQueue() {
    if (this.isShowing || this.queue.length === 0) return;

    this.isShowing = true;
    const notification = this.queue.shift();
    this.renderNotification(notification);
  }

  renderNotification(notification) {
    const container = elements.notificationCenter;
    if (!container) return;

    const template = `
      <div class="notification ${notification.type}" id="notification-${notification.id}">
        <i class="fas fa-${
          notification.type === 'success' ? 'check-circle' :
          notification.type === 'error' ? 'exclamation-circle' :
          notification.type === 'warning' ? 'exclamation-triangle' : 'info-circle'
        }"></i>
        <div class="notification-content">
          <div class="notification-title">${notification.title}</div>
          <div class="notification-message">${notification.message}</div>
        </div>
        <button class="notification-close" data-id="${notification.id}">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    container.insertAdjacentHTML('afterbegin', template);
    
    const notificationEl = document.getElementById(`notification-${notification.id}`);
    if (!notificationEl) return;
    
    // Анимация появления
    requestAnimationFrame(() => {
      notificationEl.style.transform = 'translateX(0)';
    });

    // Закрытие по кнопке
    notificationEl.querySelector('.notification-close').addEventListener('click', (e) => {
      this.closeNotification(notification.id);
    });

    // Автоматическое закрытие
    if (notification.duration > 0) {
      setTimeout(() => {
        this.closeNotification(notification.id);
      }, notification.duration);
    }

    // Ограничение количества уведомлений
    const notifications = container.querySelectorAll('.notification');
    if (notifications.length > 5) {
      notifications[notifications.length - 1].remove();
    }
  }

  closeNotification(id) {
    const notificationEl = document.getElementById(`notification-${id}`);
    if (!notificationEl) return;

    notificationEl.style.transform = 'translateX(100%)';
    setTimeout(() => {
      notificationEl.remove();
      this.isShowing = false;
      this.processQueue();
    }, 300);
  }
}

// === МЕНЕДЖЕР КАРТЫ (MapLibre) ===
class MapManager {
  constructor() {
    this.map = null;
    this.markers = [];
    this.currentStyle = CONFIG.map.defaultStyle;
    this.is3D = false;
  }

  init() {
    if (!elements.heroMap) {
      console.error('Элемент карты не найден');
      return;
    }

    try {
      // Инициализация MapLibre
      this.map = new maplibregl.Map({
        container: 'hero-map',
        style: CONFIG.map.styles[this.currentStyle],
        center: CONFIG.map.defaultCenter,
        zoom: CONFIG.map.defaultZoom,
        pitch: this.is3D ? CONFIG.map.pitch : 0,
        bearing: CONFIG.map.bearing,
        minZoom: CONFIG.map.minZoom,
        maxZoom: CONFIG.map.maxZoom,
        attributionControl: false
      });

      // Добавляем элементы управления
      this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
      this.map.addControl(new maplibregl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      }), 'bottom-left');

      // Настройка стиля для тёмной темы
      this.map.on('load', () => {
        if (this.currentStyle === 'dark') {
          this.applyDarkTheme();
        }
        
        this.loadHeroesData();
        this.setupEventListeners();
        
        // Обновляем статистику
        this.updateStats();
      });

      // Обработка ошибок карты
      this.map.on('error', (e) => {
        console.error('Ошибка карты:', e);
      });

    } catch (error) {
      console.error('Ошибка инициализации карты:', error);
    }
  }

  applyDarkTheme() {
    try {
      if (this.map && this.map.isStyleLoaded()) {
        this.map.setPaintProperty('water', 'fill-color', '#1a1f2e');
        this.map.setPaintProperty('land', 'fill-color', '#121826');
      }
    } catch (e) {
      // Игнорируем ошибки если стиль еще не загружен
    }
  }

  loadHeroesData() {
    if (!this.map) return;

    heroes.forEach(hero => {
      // Маркер места рождения
      const birthMarker = this.createMarker(
        [hero.birthCoords[1], hero.birthCoords[0]],
        'birth',
        hero.fio,
        `<div class="map-popup"><strong>${hero.fio}</strong><br>Место рождения: ${hero.birthplace}</div>`
      );
      
      // Маркер места подвига
      const deedMarker = this.createMarker(
        [hero.deedCoords[1], hero.deedCoords[0]],
        'deed',
        hero.fio,
        `<div class="map-popup"><strong>${hero.fio}</strong><br>${hero.deeds.substring(0, 100)}...</div>`
      );
      
      if (birthMarker) this.markers.push(birthMarker);
      if (deedMarker) this.markers.push(deedMarker);
    });
  }

  createMarker(coords, type, title, popupContent) {
    if (!this.map) return null;

    const el = document.createElement('div');
    el.className = `map-marker ${type}`;
    el.innerHTML = `<i class="fas fa-${type === 'birth' ? 'home' : 'crosshairs'}"></i>`;
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.borderRadius = '50%';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.cursor = 'pointer';
    el.style.fontSize = '16px';
    el.style.color = 'white';
    el.style.background = type === 'birth' ? 'var(--gold)' : 'var(--danger)';
    el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';

    try {
      const marker = new maplibregl.Marker(el)
        .setLngLat(coords)
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(this.map);

      el.addEventListener('click', () => {
        const hero = heroes.find(h => 
          (h.birthCoords[1] === coords[0] && h.birthCoords[0] === coords[1]) ||
          (h.deedCoords[1] === coords[0] && h.deedCoords[0] === coords[1])
        );
        if (hero && window.app) {
          window.app.showHeroDetail(hero.id);
        }
      });

      return marker;
    } catch (error) {
      console.error('Ошибка создания маркера:', error);
      return null;
    }
  }

  toggle3D() {
    if (!this.map) return;
    
    this.is3D = !this.is3D;
    this.map.setPitch(this.is3D ? CONFIG.map.pitch : 0);
    
    // Анимация перехода
    this.map.easeTo({
      pitch: this.is3D ? CONFIG.map.pitch : 0,
      duration: 1000
    });
  }

  changeStyle(styleName) {
    if (!this.map || !CONFIG.map.styles[styleName]) return;
    
    this.currentStyle = styleName;
    
    try {
      this.map.setStyle(CONFIG.map.styles[styleName]);
      
      // После смены стиля перезагружаем маркеры
      this.map.once('styledata', () => {
        this.markers.forEach(marker => {
          if (marker && marker.remove) marker.remove();
        });
        this.markers = [];
        
        // Применяем настройки для тёмной темы
        if (styleName === 'dark') {
          this.applyDarkTheme();
        }
        
        this.loadHeroesData();
      });
    } catch (error) {
      console.error('Ошибка смены стиля карты:', error);
    }
  }

  updateStats() {
    // Обновляем количество маркеров на карте
    const mapPins = document.getElementById('map-pins');
    if (mapPins) {
      mapPins.textContent = this.markers.length;
    }
  }

  setupEventListeners() {
    // Изменение стиля карты
    if (elements.mapStyleToggle) {
      elements.mapStyleToggle.addEventListener('click', () => {
        const styles = Object.keys(CONFIG.map.styles);
        const currentIndex = styles.indexOf(this.currentStyle);
        const nextIndex = (currentIndex + 1) % styles.length;
        this.changeStyle(styles[nextIndex]);
      });
    }

    // Переключение 3D
    if (elements.map3dToggle) {
      elements.map3dToggle.addEventListener('click', () => this.toggle3D());
    }

    // Управление картой
    if (elements.mapReset) {
      elements.mapReset.addEventListener('click', () => {
        if (this.map) {
          this.map.flyTo({
            center: CONFIG.map.defaultCenter,
            zoom: CONFIG.map.defaultZoom,
            pitch: 0,
            bearing: 0,
            duration: 1000
          });
        }
      });
    }

    if (elements.mapZoomIn && this.map) {
      elements.mapZoomIn.addEventListener('click', () => this.map.zoomIn());
    }

    if (elements.mapZoomOut && this.map) {
      elements.mapZoomOut.addEventListener('click', () => this.map.zoomOut());
    }
  }
}

// === КЛАСС ДЛЯ РАБОТЫ С НАГРАДАМИ ===
class AwardsManager {
  constructor() {
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.renderAwards();
    this.setupEventListeners();
  }

  renderAwards(filter = 'all') {
    const container = document.getElementById('awards-grid');
    if (!container) return;

    const filteredAwards = filter === 'all' 
      ? awardsData 
      : awardsData.filter(award => award.type === filter);

    container.innerHTML = filteredAwards.map(award => `
      <div class="award-card" data-id="${award.id}">
        <div class="award-image">
          <img src="${award.image}" alt="${award.name}" loading="lazy">
          <div class="award-type ${award.type}">${this.getTypeLabel(award.type)}</div>
        </div>
        <div class="award-info">
          <h3 class="award-name">${award.name}</h3>
          <p class="award-description">${award.description}</p>
          <div class="award-details">
            <div class="award-detail">
              <i class="fas fa-calendar-alt"></i>
              <span>Учреждена: ${new Date(award.established).getFullYear()}</span>
            </div>
            <div class="award-detail">
              <i class="fas fa-award"></i>
              <span>Награждений: ${award.totalAwarded.toLocaleString()}</span>
            </div>
            <div class="award-detail">
              <i class="fas fa-users"></i>
              <span>Наши герои: ${award.heroIds.length}</span>
            </div>
          </div>
          ${award.heroIds.length > 0 ? `
            <div class="award-heroes">
              <div class="heroes-label">Получили:</div>
              <div class="heroes-list">
                ${award.heroIds.map(heroId => {
                  const hero = heroes.find(h => h.id === heroId);
                  return hero ? `<span class="hero-tag">${hero.fio.split(' ')[0]}</span>` : '';
                }).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  getTypeLabel(type) {
    const labels = {
      highest: 'Высшая',
      order: 'Орден',
      medal: 'Медаль'
    };
    return labels[type] || type;
  }

  setupEventListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderAwards(this.currentFilter);
      });
    });
  }
}

// === КЛАСС ДЛЯ РАБОТЫ С ПАМЯТНИКАМИ ===
class MonumentsManager {
  constructor() {
    this.map = null;
    this.markers = [];
    this.init();
  }

  init() {
    this.renderMonumentsList();
    this.initMap();
  }

  renderMonumentsList() {
    const container = document.getElementById('monuments-list');
    if (!container) return;

    container.innerHTML = monumentsData.map(monument => `
      <div class="monument-card" data-id="${monument.id}">
        <div class="monument-image">
          <img src="${monument.image}" alt="${monument.name}" loading="lazy">
          <div class="monument-type ${monument.type}">
            <i class="fas fa-${this.getTypeIcon(monument.type)}"></i>
          </div>
        </div>
        <div class="monument-info">
          <h3 class="monument-name">${monument.name}</h3>
          <div class="monument-location">
            <i class="fas fa-map-marker-alt"></i>
            <span>${monument.location}</span>
          </div>
          <p class="monument-description">${monument.description}</p>
          <div class="monument-details">
            <span class="monument-year">${monument.year} год</span>
            <span class="monument-heroes">Связано героев: ${monument.heroes.length}</span>
          </div>
          ${monument.heroes.length > 0 ? `
            <button class="view-heroes-btn" data-id="${monument.id}">
              <i class="fas fa-user-friends"></i>
              Посмотреть героев
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');

    // Добавляем обработчики для кнопок
    document.querySelectorAll('.view-heroes-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const monumentId = parseInt(btn.dataset.id);
        this.showMonumentHeroes(monumentId);
      });
    });
  }

  getTypeIcon(type) {
    const icons = {
      monument: 'monument',
      museum: 'university',
      memorial: 'cross'
    };
    return icons[type] || 'landmark';
  }

  initMap() {
    const mapContainer = document.getElementById('monuments-map');
    if (!mapContainer) return;

    try {
      this.map = new maplibregl.Map({
        container: 'monuments-map',
        style: 'https://demotiles.maplibre.org/style.json',
        center: [61.668, 50.835],
        zoom: 5,
        attributionControl: false
      });

      this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

      this.map.on('load', () => {
        this.addMonumentsToMap();
      });
    } catch (error) {
      console.error('Ошибка инициализации карты памятников:', error);
    }
  }

  addMonumentsToMap() {
    if (!this.map) return;

    // Очищаем старые маркеры
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    monumentsData.forEach(monument => {
      const el = document.createElement('div');
      el.className = `map-marker ${monument.type}`;
      el.innerHTML = `<i class="fas fa-${this.getTypeIcon(monument.type)}"></i>`;
      el.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        color: white;
        background: ${this.getMarkerColor(monument.type)};
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      `;

      const marker = new maplibregl.Marker(el)
        .setLngLat([monument.coordinates[1], monument.coordinates[0]])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`
          <div class="map-popup">
            <h3>${monument.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${monument.location}</p>
            <p>${monument.description}</p>
            <p><small>Год открытия: ${monument.year}</small></p>
          </div>
        `))
        .addTo(this.map);

      this.markers.push(marker);
    });
  }

  getMarkerColor(type) {
    const colors = {
      monument: 'var(--gold)',
      museum: 'var(--accent)',
      memorial: 'var(--danger)'
    };
    return colors[type] || 'var(--light)';
  }

  showMonumentHeroes(monumentId) {
    const monument = monumentsData.find(m => m.id === monumentId);
    if (!monument) return;

    const heroNames = monument.heroes.map(heroId => {
      const hero = heroes.find(h => h.id === heroId);
      return hero ? hero.fio : '';
    }).filter(name => name);

    window.app.notifications.show(
      'info',
      monument.name,
      `Связанные герои: ${heroNames.join(', ')}`,
      5000
    );
  }
}

// === КЛАСС ДЛЯ РАБОТЫ СОБЫТИЯМИ ===
class EventsManager {
  constructor() {
    this.init();
  }

  init() {
    this.renderTimeline();
  }

  renderTimeline() {
    const container = document.getElementById('timeline');
    if (!container) return;

    // Сортируем события по дате
    const sortedEvents = [...eventsData].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    container.innerHTML = sortedEvents.map(event => `
      <div class="timeline-item ${event.importance}">
        <div class="timeline-date">
          <div class="timeline-day">${new Date(event.date).getDate()}</div>
          <div class="timeline-month">${this.getMonthName(new Date(event.date).getMonth())}</div>
          <div class="timeline-year">${new Date(event.date).getFullYear()}</div>
        </div>
        <div class="timeline-content">
          <div class="timeline-marker ${event.type}">
            <i class="fas fa-${this.getEventIcon(event.type)}"></i>
          </div>
          <div class="timeline-info">
            <h3 class="timeline-title">${event.title}</h3>
            <p class="timeline-description">${event.description}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  getMonthName(monthIndex) {
    const months = [
      'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
      'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
    ];
    return months[monthIndex];
  }

  getEventIcon(type) {
    const icons = {
      war: 'crosshairs',
      battle: 'fist-raised',
      operation: 'chess-board',
      victory: 'trophy'
    };
    return icons[type] || 'calendar-alt';
  }
}

// === КЛАСС ДЛЯ РАБОТЫ С ТЕСТОМ ===
class QuizManager {
  constructor() {
    this.currentDifficulty = 'medium';
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeLeft = 600; // 10 минут в секундах
    this.timerInterval = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateStats();
  }

  setupEventListeners() {
    // Кнопка начала теста
    const startBtn = document.getElementById('quiz-start');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startQuiz());
    }

    // Кнопки навигации
    const prevBtn = document.getElementById('quiz-prev');
    const nextBtn = document.getElementById('quiz-next');
    const submitBtn = document.getElementById('quiz-submit');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevQuestion());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
    if (submitBtn) submitBtn.addEventListener('click', () => this.submitQuiz());

    // Кнопки результатов
    const restartBtn = document.getElementById('quiz-restart');
    const reviewBtn = document.getElementById('quiz-review');

    if (restartBtn) restartBtn.addEventListener('click', () => this.restartQuiz());
    if (reviewBtn) reviewBtn.addEventListener('click', () => this.reviewAnswers());
  }

  updateStats() {
    const difficulty = document.getElementById('quiz-difficulty');
    const time = document.getElementById('quiz-time');
    const count = document.getElementById('quiz-count');

    if (difficulty) {
      difficulty.textContent = this.getDifficultyLabel(this.currentDifficulty);
    }

    if (time) {
      const minutes = Math.floor(this.timeLeft / 60);
      time.textContent = `${minutes} мин`;
    }

    if (count) {
      const questionCount = this.getQuestionCountForDifficulty(this.currentDifficulty);
      count.textContent = questionCount;
    }
  }

  getDifficultyLabel(difficulty) {
    const labels = {
      easy: 'Лёгкий',
      medium: 'Средний',
      hard: 'Сложный'
    };
    return labels[difficulty] || difficulty;
  }

  getQuestionCountForDifficulty(difficulty) {
    const counts = {
      easy: 5,
      medium: 10,
      hard: 15
    };
    return counts[difficulty] || 10;
  }

  getTimeForDifficulty(difficulty) {
    const times = {
      easy: 300,   // 5 минут
      medium: 600, // 10 минут
      hard: 900    // 15 минут
    };
    return times[difficulty] || 600;
  }

  startQuiz() {
    // Получаем выбранную сложность
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');
    if (selectedDifficulty) {
      this.currentDifficulty = selectedDifficulty.value;
    }

    // Загружаем вопросы (все вопросы для выбранной сложности)
    this.questions = [...quizData[this.currentDifficulty]];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.timeLeft = this.getTimeForDifficulty(this.currentDifficulty);

    // Обновляем интерфейс
    document.getElementById('quiz-welcome').style.display = 'none';
    document.getElementById('quiz-question').style.display = 'block';
    
    // Обновляем количество вопросов
    document.getElementById('quiz-count').textContent = this.questions.length;
    document.getElementById('total-questions').textContent = this.questions.length;
    
    // Запускаем таймер
    this.startTimer();
    
    // Показываем первый вопрос
    this.showQuestion();
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.updateTimerDisplay();
    
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.submitQuiz();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const timerElement = document.getElementById('quiz-timer');
    if (timerElement) {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  showQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.submitQuiz();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    const questionElement = document.getElementById('question-text');
    const optionsElement = document.getElementById('question-options');

    if (questionElement) {
      questionElement.textContent = question.question;
    }

    if (optionsElement) {
      optionsElement.innerHTML = question.options.map((option, index) => `
        <div class="quiz-option" data-index="${index}">
          <input type="radio" 
                 id="option-${index}" 
                 name="answer" 
                 value="${index}"
                 ${this.userAnswers[this.currentQuestionIndex] === index ? 'checked' : ''}>
          <label for="option-${index}">
            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
            <span class="option-text">${option}</span>
          </label>
        </div>
      `).join('');

      // Добавляем обработчики для вариантов ответов
      optionsElement.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', (e) => {
          if (!e.target.matches('input')) {
            const index = parseInt(option.dataset.index);
            this.userAnswers[this.currentQuestionIndex] = index;
            this.updateOptionSelection();
          }
        });
      });

      // Обработчики для радио-кнопок
      optionsElement.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', (e) => {
          this.userAnswers[this.currentQuestionIndex] = parseInt(e.target.value);
        });
      });
    }

    // Обновляем номер вопроса
    document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = this.questions.length;

    // Обновляем состояние кнопок
    this.updateNavigationButtons();
    this.updateOptionSelection();
  }

  updateOptionSelection() {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, index) => {
      if (this.userAnswers[this.currentQuestionIndex] === index) {
        option.classList.add('selected');
        option.querySelector('input').checked = true;
      } else {
        option.classList.remove('selected');
      }
    });
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('quiz-prev');
    const nextBtn = document.getElementById('quiz-next');
    const submitBtn = document.getElementById('quiz-submit');

    if (prevBtn) {
      prevBtn.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
    }

    if (nextBtn && submitBtn) {
      if (this.currentQuestionIndex === this.questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
      } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
      }
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.showQuestion();
    }
  }

  submitQuiz() {
    clearInterval(this.timerInterval);
    
    // Проверяем ответы и считаем результат
    this.score = 0;
    this.questions.forEach((question, index) => {
      if (this.userAnswers[index] === question.correct) {
        this.score++;
      }
    });

    // Показываем результаты
    this.showResults();
  }

  showResults() {
    document.getElementById('quiz-question').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';

    const scorePercent = Math.round((this.score / this.questions.length) * 100);
    
    document.getElementById('quiz-score').textContent = scorePercent;
    document.getElementById('correct-answers').textContent = this.score;
    document.getElementById('total-answers').textContent = this.questions.length;
    
    // Рассчитываем оставшееся время
    const totalTime = this.getTimeForDifficulty(this.currentDifficulty);
    const usedTime = totalTime - this.timeLeft;
    const minutes = Math.floor(usedTime / 60);
    const seconds = usedTime % 60;
    document.getElementById('final-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Показываем сообщение в зависимости от результата
    const messageElement = document.getElementById('results-message');
    let message = '';
    let icon = '';

    if (scorePercent >= 90) {
      message = 'Отличный результат! Вы прекрасно знаете историю героев-северян!';
      icon = '🏆';
    } else if (scorePercent >= 70) {
      message = 'Хороший результат! Вы хорошо знакомы с историей наших героев.';
      icon = '⭐';
    } else if (scorePercent >= 50) {
      message = 'Неплохой результат! Есть что повторить.';
      icon = '📚';
    } else {
      message = 'Попробуйте ещё раз! Изучите материалы и возвращайтесь к тесту.';
      icon = '🔍';
    }

    messageElement.innerHTML = `${icon} ${message}`;
  }

  restartQuiz() {
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-welcome').style.display = 'block';
    
    // Сбрасываем состояние
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
    this.timeLeft = this.getTimeForDifficulty(this.currentDifficulty);
    
    // Обновляем статистику
    this.updateStats();
  }

  reviewAnswers() {
    let reviewMessage = '<div class="review-answers"><h4>Правильные ответы:</h4>';
    
    this.questions.forEach((question, index) => {
      const userAnswer = this.userAnswers[index];
      const isCorrect = userAnswer === question.correct;
      
      reviewMessage += `
        <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
          <p><strong>Вопрос ${index + 1}:</strong> ${question.question}</p>
          <p>Ваш ответ: ${question.options[userAnswer] || 'Нет ответа'}</p>
          <p>Правильный ответ: ${question.options[question.correct]}</p>
          <p><em>${question.explanation}</em></p>
        </div>
      `;
    });
    
    reviewMessage += '</div>';
    
    window.app.notifications.show(
      'info',
      'Обзор ответов',
      reviewMessage,
      10000
    );
  }
}

// === ГЛАВНЫЙ КЛАСС ПРИЛОЖЕНИЯ ===
class GoldenStarsApp {
  constructor() {
    this.notifications = new NotificationSystem();
    this.mapManager = new MapManager();
    this.awardsManager = null;
    this.monumentsManager = null;
    this.eventsManager = null;
    this.quizManager = null;
    this.searchData = [];
    
    this.init();
  }

  async init() {
    // Инициализация приложения
    await this.initializeApp();
    this.setupEventListeners();
    this.loadData();
  }

  async initializeApp() {
    // Загружаем сохранённую тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
      CONFIG.settings.theme = savedTheme;
      
      // Обновляем иконку темы
      if (elements.themeToggle) {
        elements.themeToggle.innerHTML = savedTheme === 'dark' 
          ? '<i class="fas fa-moon"></i>'
          : '<i class="fas fa-sun"></i>';
      }
    }
    
    // Загружаем настройки аудиогида
    const audioGuideEnabled = localStorage.getItem('audioGuideAutoPlay') === 'true';
    CONFIG.settings.audioGuide = audioGuideEnabled;
    
    if (audioGuideEnabled && elements.audioToggle) {
      elements.audioToggle.classList.add('active');
    }

    // Имитация загрузки ресурсов
    const totalAssets = 12;
    let loaded = 0;
    
    const loadAsset = () => {
      loaded++;
      if (elements.progressFill) {
        elements.progressFill.style.width = `${(loaded / totalAssets) * 100}%`;
      }
      
      if (elements.loadingText) {
        if (loaded === 1) elements.loadingText.textContent = 'Загрузка карты...';
        if (loaded === 5) elements.loadingText.textContent = 'Загрузка данных героев...';
        if (loaded === 8) elements.loadingText.textContent = 'Загрузка дополнительных данных...';
        if (loaded === 10) elements.loadingText.textContent = 'Инициализация интерфейса...';
        if (loaded === 12) elements.loadingText.textContent = 'Завершение инициализации...';
      }
    };

    for (let i = 0; i < totalAssets; i++) {
      await new Promise(resolve => setTimeout(() => {
        loadAsset();
        resolve();
      }, 150));
    }

    // Скрываем прелоадер
    setTimeout(() => {
      if (elements.preloader) {
        elements.preloader.style.opacity = '0';
        setTimeout(() => {
          if (elements.preloader) {
            elements.preloader.style.display = 'none';
          }
          this.notifications.show('success', 'Готово!', 'Приложение успешно загружено');
        }, 500);
      }
    }, 500);
  }

  setupEventListeners() {
    // Навигация
    if (elements.menuToggle) {
      elements.menuToggle.addEventListener('click', () => {
        if (elements.sidebar) {
          elements.sidebar.classList.add('active');
        }
      });
    }

    if (elements.sidebarClose) {
      elements.sidebarClose.addEventListener('click', () => {
        if (elements.sidebar) {
          elements.sidebar.classList.remove('active');
        }
      });
    }

    elements.sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        this.switchSection(section);
        if (elements.sidebar) {
          elements.sidebar.classList.remove('active');
        }
      });
    });

    // Поиск
    if (elements.searchInput) {
      const debouncedSearch = Utils.debounce(() => this.performSearch(), 300);
      elements.searchInput.addEventListener('input', debouncedSearch);
      
      elements.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }

    if (elements.clearSearch) {
      elements.clearSearch.addEventListener('click', () => {
        if (elements.searchInput) {
          elements.searchInput.value = '';
          this.performSearch();
        }
      });
    }

    // Вид отображения
    elements.viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.changeView(btn.dataset.view);
      });
    });

    // Детали героя
    if (elements.closeDetail) {
      elements.closeDetail.addEventListener('click', () => this.closeHeroModal());
    }

    if (elements.heroDetailOverlay) {
      elements.heroDetailOverlay.addEventListener('click', () => this.closeHeroModal());
    }

    // Полноэкранный режим
    if (elements.fullscreenToggle) {
      elements.fullscreenToggle.addEventListener('click', () => this.toggleFullscreen());
    }

    // Изменение темы
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Оффлайн режим
    if (elements.offlineToggle) {
      elements.offlineToggle.addEventListener('click', () => this.toggleOfflineMode());
    }

    // Аудиогид
    if (elements.audioPlay) {
      elements.audioPlay.addEventListener('click', () => {
        if (window.audioGuide) {
          window.audioGuide.describeCurrentSection();
        }
      });
    }

    if (elements.audioToggle) {
      elements.audioToggle.addEventListener('click', () => {
        if (window.audioGuide) {
          window.audioGuide.toggleAutoPlay();
        }
      });
    }

    // Глобальные события
    document.addEventListener('keydown', (e) => {
      // Ctrl+K для поиска
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (elements.searchInput) {
          elements.searchInput.focus();
        }
      }
      
      // Escape для закрытия модального окна
      if (e.key === 'Escape') {
        this.closeHeroModal();
        if (elements.sidebar) {
          elements.sidebar.classList.remove('active');
        }
      }
    });

    // Мониторинг сети
    window.addEventListener('online', () => this.updateConnectionStatus());
    window.addEventListener('offline', () => this.updateConnectionStatus());
    
    // Инициализация статуса сети
    this.updateConnectionStatus();
  }

  loadData() {
    // Создаем поисковый индекс
    this.createSearchIndex();
    
    // Рендерим героев
    this.renderHeroes();
    
    // Обновляем статистику
    this.updateStatistics();
    
    // Инициализируем карту
    this.mapManager.init();
  }

  createSearchIndex() {
    this.searchData = heroes.map(hero => ({
      id: hero.id,
      fio: hero.fio.toLowerCase(),
      birthplace: hero.birthplace.toLowerCase(),
      profession: hero.profession.toLowerCase(),
      deeds: hero.deeds.toLowerCase(),
      awards: hero.awards.map(a => a.name.toLowerCase()).join(' '),
      region: hero.region.toLowerCase(),
      tags: hero.tags.join(' ')
    }));
  }

  performSearch() {
    if (!elements.searchInput) return;
    
    const query = elements.searchInput.value.trim().toLowerCase();
    
    if (query === '') {
      this.renderHeroes();
      return;
    }
    
    // Простой поиск по всем полям
    const results = this.searchData.filter(hero => 
      hero.fio.includes(query) ||
      hero.birthplace.includes(query) ||
      hero.profession.includes(query) ||
      hero.deeds.includes(query) ||
      hero.awards.includes(query) ||
      hero.region.includes(query) ||
      hero.tags.includes(query)
    );
    
    if (results.length > 0) {
      const heroIds = results.map(r => r.id);
      const filtered = heroes.filter(h => heroIds.includes(h.id));
      this.renderHeroes(filtered);
    } else {
      this.renderHeroes([]);
    }
  }

  renderHeroes(heroesToRender = heroes) {
    if (!elements.heroesGrid) return;
    
    filteredHeroes = [...heroesToRender];
    
    if (filteredHeroes.length === 0) {
      if (elements.noResults) {
        elements.noResults.style.display = 'block';
      }
      elements.heroesGrid.innerHTML = '';
      return;
    }
    
    if (elements.noResults) {
      elements.noResults.style.display = 'none';
    }
    
    const grid = elements.heroesGrid;
    grid.innerHTML = '';
    
    filteredHeroes.forEach(hero => {
      const card = this.createHeroCard(hero);
      grid.appendChild(card);
    });
    
    // Отправляем событие о завершении рендеринга
    document.dispatchEvent(new CustomEvent('heroesRendered'));
  }

  createHeroCard(hero) {
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.dataset.id = hero.id;
    
    // Получаем основную награду
    const mainAward = hero.awards.find(a => a.level === 'высшая') || hero.awards[0];
    
    card.innerHTML = `
      <div class="hero-img-container">
        <img src="${hero.img}" alt="${hero.fio}" class="hero-img" loading="lazy">
        <div class="hero-badge">${mainAward.name.split(' ')[0]}</div>
      </div>
      <div class="hero-info">
        <h3 class="hero-name">${hero.fio}</h3>
        <div class="hero-meta">
          <i class="fas fa-calendar"></i>
          <span class="hero-years">${hero.years}</span>
        </div>
        <div class="hero-meta">
          <i class="fas fa-map-marker-alt"></i>
          <span class="hero-location">${hero.birthplace}</span>
        </div>
        <p class="hero-profession">${hero.profession}</p>
        <div class="hero-awards">
          ${hero.awards.slice(0, 2).map(award => `
            <span class="award-badge">
              <i class="fas fa-star"></i>
              ${award.name.split(' ')[0]}
            </span>
          `).join('')}
          ${hero.awards.length > 2 ? `
            <span class="award-badge">
              +${hero.awards.length - 2}
            </span>
          ` : ''}
        </div>
      </div>
    `;
    
    card.addEventListener('click', () => this.showHeroDetail(hero.id));
    
    return card;
  }

  showHeroDetail(heroId) {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return;
    
    currentHero = hero;
    
    // Обновляем заголовок в детальном просмотре
    if (elements.detailHeroName) {
      elements.detailHeroName.textContent = hero.fio;
    }
    
    // Обновляем контент
    if (elements.detailContent) {
      elements.detailContent.innerHTML = this.createHeroDetailContent(hero);
    }
    
    // Показываем панель деталей
    if (elements.heroDetailPanel && elements.heroDetailOverlay) {
      elements.heroDetailPanel.classList.add('active');
      elements.heroDetailOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    // Центрируем карту на герое
    if (this.mapManager.map) {
      this.mapManager.map.flyTo({
        center: [hero.deedCoords[1], hero.deedCoords[0]],
        zoom: 6,
        duration: 1000
      });
    }
    
    // Отправляем событие об открытии деталей героя
    document.dispatchEvent(new CustomEvent('heroDetailOpened', {
      detail: { hero }
    }));
  }

  createHeroDetailContent(hero) {
    // Рассчитываем расстояние между местом рождения и подвигом
    const distance = Utils.calculateDistance(
      hero.birthCoords[0], hero.birthCoords[1],
      hero.deedCoords[0], hero.deedCoords[1]
    );
    
    return `
      <div class="hero-detail-grid">
        <div class="detail-column">
          <div class="detail-section">
            <h3><i class="fas fa-user-graduate"></i> Биография</h3>
            <div class="detail-item">
              <span class="detail-label">Полное имя</span>
              <span class="detail-value">${hero.fio}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Годы жизни</span>
              <span class="detail-value">${hero.years}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Место рождения</span>
              <span class="detail-value">${hero.birthplace}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Образование</span>
              <span class="detail-value">${hero.education}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Партийность</span>
              <span class="detail-value">${hero.party}</span>
            </div>
          </div>
          
          <div class="detail-section">
            <h3><i class="fas fa-crosshairs"></i> Боевой путь</h3>
            <div class="detail-item">
              <span class="detail-label">Воинское звание</span>
              <span class="detail-value">${hero.rank}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Часть/подразделение</span>
              <span class="detail-value">${hero.additionalInfo.regiment}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Участие в сражениях</span>
              <span class="detail-value">${hero.additionalInfo.battles.join(', ')}</span>
            </div>
            ${hero.additionalInfo.missions ? `
              <div class="detail-item">
                <span class="detail-label">Количество вылетов/заданий</span>
                <span class="detail-value">${hero.additionalInfo.missions}</span>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="detail-column">
          <div class="detail-section">
            <h3><i class="fas fa-award"></i> Награды</h3>
            <div class="awards-list">
              ${hero.awards.map(award => `
                <div class="award-detail ${award.level}">
                  <div class="award-icon">
                    <i class="fas fa-star"></i>
                  </div>
                  <div class="award-info">
                    <div class="award-name">${award.name}</div>
                    <div class="award-date">${award.date} год</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="detail-section">
            <h3><i class="fas fa-map-marked-alt"></i> География подвига</h3>
            <div class="geography-info">
              <div class="geo-item">
                <div class="geo-marker birth"></div>
                <div class="geo-text">
                  <div class="geo-title">Место рождения</div>
                  <div class="geo-location">${hero.birthplace}</div>
                </div>
              </div>
              <div class="geo-item">
                <div class="geo-marker deed"></div>
                <div class="geo-text">
                  <div class="geo-title">Место подвига</div>
                  <div class="geo-description">${hero.deeds.substring(0, 80)}...</div>
                </div>
              </div>
              <div class="geo-distance">
                <i class="fas fa-ruler-combined"></i>
                <span>Расстояние: ${distance} км</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="detail-section full-width">
        <h3><i class="fas fa-history"></i> Подробности подвига</h3>
        <div class="deed-description">
          ${hero.deeds}
        </div>
        ${hero.additionalInfo.burial && hero.additionalInfo.burial !== 'Неизвестно' ? `
          <div class="burial-info">
            <i class="fas fa-cross"></i>
            <span>Место захоронения: ${hero.additionalInfo.burial}</span>
          </div>
        ` : ''}
        <div class="burial-info">
          <i class="fas fa-user-shield"></i>
          <span>Статус: ${hero.additionalInfo.status}</span>
        </div>
      </div>
    `;
  }

  closeHeroModal() {
    if (elements.heroDetailPanel && elements.heroDetailOverlay) {
      elements.heroDetailPanel.classList.remove('active');
      elements.heroDetailOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  changeView(view) {
    if (!elements.heroesGrid) return;
    
    elements.heroesGrid.dataset.view = view;
    
    switch (view) {
      case 'list':
        elements.heroesGrid.style.gridTemplateColumns = '1fr';
        break;
      default:
        elements.heroesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    }
  }

  updateStatistics() {
    // Обновляем статистику в футере
    const totalHeroes = document.getElementById('total-heroes');
    const totalLocations = document.getElementById('total-locations');
    const totalAwardsElem = document.getElementById('total-awards');
    
    const totalAwards = heroes.reduce((sum, hero) => sum + hero.awards.length, 0);
    
    if (totalHeroes) totalHeroes.textContent = CONFIG.constants.heroCount;
    if (totalLocations) totalLocations.textContent = CONFIG.constants.totalLocations;
    if (totalAwardsElem) totalAwardsElem.textContent = CONFIG.constants.totalAwards;
    
    // Обновляем статистику в поиске
    const heroCount = document.getElementById('hero-count');
    const locationCount = document.getElementById('location-count');
    
    if (heroCount) heroCount.textContent = CONFIG.constants.heroCount;
    if (locationCount) locationCount.textContent = CONFIG.constants.totalLocations;
  }

  switchSection(sectionId) {
    // Обновляем активные ссылки
    elements.sidebarLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === sectionId) {
        link.classList.add('active');
      }
    });
    
    // Переключаем секции
    document.querySelectorAll('.content-section').forEach(section => {
      section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
      activeSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Инициализируем менеджеры для конкретных секций
      this.initSectionManager(sectionId);
    }
    
    activeSectionId = sectionId;
  }

  initSectionManager(sectionId) {
    switch(sectionId) {
      case 'awards':
        if (!this.awardsManager) {
          this.awardsManager = new AwardsManager();
        }
        break;
      case 'monuments':
        if (!this.monumentsManager) {
          this.monumentsManager = new MonumentsManager();
        }
        break;
      case 'events':
        if (!this.eventsManager) {
          this.eventsManager = new EventsManager();
        }
        break;
      case 'quiz':
        if (!this.quizManager) {
          this.quizManager = new QuizManager();
        }
        break;
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    CONFIG.settings.theme = newTheme;
    
    // Обновляем иконку
    if (elements.themeToggle) {
      elements.themeToggle.innerHTML = newTheme === 'dark' 
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
    }
    
    // Сохраняем в localStorage
    if (Utils.localStorageAvailable()) {
      localStorage.setItem('theme', newTheme);
    }
    
    // Обновляем карту
    if (this.mapManager) {
      this.mapManager.changeStyle(newTheme === 'dark' ? 'dark' : 'light');
    }
    
    this.notifications.show('info', 'Тема изменена', 
      `Активирована ${newTheme === 'dark' ? 'тёмная' : 'светлая'} тема`);
  }

  toggleOfflineMode() {
    CONFIG.settings.offlineMode = !CONFIG.settings.offlineMode;
    if (elements.offlineToggle) {
      elements.offlineToggle.classList.toggle('active', CONFIG.settings.offlineMode);
    }
    
    if (CONFIG.settings.offlineMode) {
      this.notifications.show('warning', 'Оффлайн режим', 'Используются локальные данные');
    } else {
      this.notifications.show('success', 'Онлайн режим', 'Данные загружаются с сервера');
    }
    
    // Сохраняем настройки
    if (Utils.localStorageAvailable()) {
      localStorage.setItem('offlineMode', CONFIG.settings.offlineMode);
    }
  }

  updateConnectionStatus() {
    const connectionStatus = elements.connectionStatus;
    if (!connectionStatus) return;
    
    if (navigator.onLine) {
      connectionStatus.innerHTML = `
        <i class="fas fa-circle" style="color: var(--success);"></i>
        <span>Онлайн</span>
      `;
      connectionStatus.className = 'connection-status';
    } else {
      connectionStatus.innerHTML = `
        <i class="fas fa-circle" style="color: var(--danger);"></i>
        <span>Оффлайн</span>
      `;
      connectionStatus.className = 'connection-status offline';
      
      if (!CONFIG.settings.offlineMode) {
        this.notifications.show('error', 'Нет соединения', 'Работа в оффлайн режиме');
      }
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        this.notifications.show('error', 'Ошибка', 'Не удалось перейти в полноэкранный режим');
      });
      if (elements.fullscreenToggle) {
        elements.fullscreenToggle.innerHTML = '<i class="fas fa-compress"></i>';
      }
    } else {
      document.exitFullscreen();
      if (elements.fullscreenToggle) {
        elements.fullscreenToggle.innerHTML = '<i class="fas fa-expand"></i>';
      }
    }
  }
}

// === ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ===
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Инициализация приложения
    window.app = new GoldenStarsApp();
    
    // Убедимся, что аудиогид инициализирован
    setTimeout(() => {
      if (window.audioGuide) {
        // Обновляем состояние кнопок
        window.audioGuide.updateSpeedButton();
        window.audioGuide.updatePauseButton();
        window.audioGuide.updateToggleUI();
      }
    }, 2000);
    
    // Глобальные функции для доступа из HTML
    window.showHeroDetail = (id) => {
      if (window.app) window.app.showHeroDetail(id);
    };
    
    window.closeHeroDetail = () => {
      if (window.app) window.app.closeHeroModal();
    };
    
    window.switchSection = (section) => {
      if (window.app) window.app.switchSection(section);
    };
    
    console.log('Приложение успешно инициализировано');
  } catch (error) {
    console.error('Ошибка инициализации приложения:', error);
    
    // Показываем ошибку пользователю
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.innerHTML = `
        <div class="loader">
          <div style="color: #f72585; font-size: 3rem; margin-bottom: 1rem;">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p style="color: white; font-size: 1.2rem;">Ошибка загрузки приложения</p>
          <p style="color: var(--light-secondary); margin-top: 1rem;">${error.message}</p>
          <button onclick="location.reload()" style="
            margin-top: 2rem;
            padding: 0.75rem 2rem;
            background: var(--gold);
            color: var(--dark);
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            font-weight: bold;
          ">
            Перезагрузить
          </button>
        </div>
      `;
    }
  }
});