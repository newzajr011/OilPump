// ข้อมูลตัวอย่างปั๊มน้ำมันในอำเภอ
const fuelStations = [
  {
    id: 1,
    name: "PTT สาขาถนนมิตรภาพ",
    brand: "PTT",
    address: "123 ถ.มิตรภาพ ต.ในเมือง",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: true, e20: true, e85: true },
    lastUpdated: "2026-03-19 08:00"
  },
  {
    id: 2,
    name: "Shell สาขาสี่แยกตลาด",
    brand: "Shell",
    address: "456 ถ.สุขุมวิท ต.ตลาด",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: true, e20: true, e85: false },
    lastUpdated: "2026-03-19 07:30"
  },
  {
    id: 3,
    name: "Bangchak สาขาหนองบัว",
    brand: "Bangchak",
    address: "789 ถ.เทศบาล ต.หนองบัว",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: false, e20: true, e85: false },
    lastUpdated: "2026-03-19 09:15"
  },
  {
    id: 4,
    name: "Caltex สาขาบ้านใหม่",
    brand: "Caltex",
    address: "321 ถ.พหลโยธิน ต.บ้านใหม่",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: true, e20: false, e85: false },
    lastUpdated: "2026-03-19 06:45"
  },
  {
    id: 5,
    name: "Susco สาขาคลองหลวง",
    brand: "Susco",
    address: "654 ถ.รังสิต-นครนายก ต.คลองหลวง",
    status: "closed",
    fuels: { diesel: false, benzine91: false, benzine95: false, e20: false, e85: false },
    lastUpdated: "2026-03-18 18:00"
  },
  {
    id: 6,
    name: "PT สาขาหนองจอก",
    brand: "PT",
    address: "111 ถ.สุวินทวงศ์ ต.หนองจอก",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: false, e20: false, e85: false },
    lastUpdated: "2026-03-19 10:00"
  },
  {
    id: 7,
    name: "PTT สาขาตลาดเก่า",
    brand: "PTT",
    address: "222 ถ.ราชดำเนิน ต.ตลาดเก่า",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: true, e20: true, e85: true },
    lastUpdated: "2026-03-19 08:30"
  },
  {
    id: 8,
    name: "Shell สาขาบางปะอิน",
    brand: "Shell",
    address: "333 ถ.พหลโยธิน ต.บางปะอิน",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: true, e20: true, e85: false },
    lastUpdated: "2026-03-19 09:00"
  },
  {
    id: 9,
    name: "Bangchak สาขาวังน้อย",
    brand: "Bangchak",
    address: "444 ถ.สายเอเชีย ต.วังน้อย",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: true, e20: true, e85: true },
    lastUpdated: "2026-03-19 07:00"
  },
  {
    id: 10,
    name: "Caltex สาขาท่าเรือ",
    brand: "Caltex",
    address: "555 ถ.สายเอเชีย ต.ท่าเรือ",
    status: "closed",
    fuels: { diesel: true, benzine91: true, benzine95: false, e20: false, e85: false },
    lastUpdated: "2026-03-18 16:30"
  },
  {
    id: 11,
    name: "PT สาขาบ้านโพธิ์",
    brand: "PT",
    address: "666 ถ.เทพารักษ์ ต.บ้านโพธิ์",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: true, e20: false, e85: false },
    lastUpdated: "2026-03-19 08:15"
  },
  {
    id: 12,
    name: "Susco สาขาลำลูกกา",
    brand: "Susco",
    address: "777 ถ.ลำลูกกา ต.ลำลูกกา",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: false, e20: true, e85: false },
    lastUpdated: "2026-03-19 09:45"
  },
  {
    id: 13,
    name: "PTT สาขาคลองสาม",
    brand: "PTT",
    address: "888 ถ.รังสิต-นครนายก ต.คลองสาม",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: true, e20: true, e85: false },
    lastUpdated: "2026-03-19 07:45"
  },
  {
    id: 14,
    name: "Bangchak สาขาธัญบุรี",
    brand: "Bangchak",
    address: "999 ถ.รังสิต-ธัญบุรี ต.ประชาธิปัตย์",
    status: "open",
    fuels: { diesel: true, benzine91: false, benzine95: true, e20: true, e85: true },
    lastUpdated: "2026-03-19 10:30"
  },
  {
    id: 15,
    name: "Shell สาขาสามโคก",
    brand: "Shell",
    address: "101 ถ.ปทุมธานี-สามโคก ต.สามโคก",
    status: "open",
    fuels: { diesel: true, benzine91: true, benzine95: true, e20: false, e85: false },
    lastUpdated: "2026-03-19 06:30"
  }
];

// ชื่อแสดงผลของน้ำมันแต่ละชนิด
const fuelLabels = {
  diesel: "ดีเซล",
  benzine91: "เบนซิน 91",
  benzine95: "เบนซิน 95",
  e20: "แก๊สโซฮอล์ E20",
  e85: "แก๊สโซฮอล์ E85"
};

// สีประจำแบรนด์
const brandColors = {
  PTT: { bg: "#1e3a5f", accent: "#00b4d8" },
  Shell: { bg: "#5c1a1a", accent: "#e63946" },
  Bangchak: { bg: "#1a4d1a", accent: "#2dc653" },
  Caltex: { bg: "#4a3000", accent: "#e09f3e" },
  Susco: { bg: "#3d1854", accent: "#9b5de5" },
  PT: { bg: "#0d3b66", accent: "#3a86ff" }
};
