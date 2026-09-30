/* ==========================================================================
   Save Life — demo data
   --------------------------------------------------------------------------
   This site has no backend. Everything below is FICTIONAL SAMPLE DATA used to
   demonstrate the interface.

   To connect a real backend later, delete the arrays and replace `readX()`
   with fetch() calls. No other file needs to change — the render functions in
   app.js consume these shapes only.
   ========================================================================== */

const BLOOD_GROUPS = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

const CITIES = [
  "الإسكندرية",
  "القاهرة",
  "طنطا",
  "بورسعيد",
  "المنصورة",
  "السويس",
  "أسيوط",
];

// Months since the donor's last donation. Drives the "eligible" status.
const DONORS = [
  { id: 1, name: "مها أحمد", city: "الإسكندرية", area: "سيدي بشر", group: "A+", phone: "01023456781", lastDonationMonths: 5 },
  { id: 2, name: "دينا أحمد", city: "الإسكندرية", area: "الابراهيمية", group: "O-", phone: "01122334455", lastDonationMonths: 2 },
  { id: 3, name: "محمد الشناوي", city: "القاهرة", area: "الدقي", group: "B+", phone: "01234567890", lastDonationMonths: 7 },
  { id: 4, name: "نورهان عادل", city: "طنطا", area: "الحي الأول", group: "O+", phone: "01099887766", lastDonationMonths: 1 },
  { id: 5, name: "يوسف محمود", city: "بورسعيد", area: "العجمي", group: "A-", phone: "01155667788", lastDonationMonths: 4 },
  { id: 6, name: "سارة إبراهيم", city: "المنصورة", area: "مزلق", group: "AB+", phone: "01266778899", lastDonationMonths: 3 },
  { id: 7, name: "كريم زكي", city: "السويس", area: "فيصل", group: "B-", phone: "01011223344", lastDonationMonths: 9 },
  { id: 8, name: "هدى فتحي", city: "أسيوط", area: "الحي السابع", group: "O-", phone: "01177889900", lastDonationMonths: 2 },
  { id: 9, name: "أحمد ماهر", city: "الإسكندرية", area: "المنتزه", group: "A+", phone: "01288990011", lastDonationMonths: 6 },
  { id: 10, name: "رنا صلاح", city: "القاهرة", area: "مدينة نصر", group: "O+", phone: "01044556677", lastDonationMonths: 1 },
  { id: 11, name: "عمر طارق", city: "طنطا", area: "الحي الثاني", group: "B+", phone: "01199001122", lastDonationMonths: 8 },
  { id: 12, name: "مريم عادل", city: "بورسعيد", area: "العامرية", group: "AB-", phone: "01233445566", lastDonationMonths: 3 },
  { id: 13, name: "زياد حسام", city: "السويس", area: "السويس الجديدة", group: "A-", phone: "01055667788", lastDonationMonths: 10 },
  { id: 14, name: "لمى ياسر", city: "المنصورة", area: "ميدان المحطة", group: "O-", phone: "01166778899", lastDonationMonths: 4 },
  { id: 15, name: "طارق سرحان", city: "أسيوط", area: "الحي المركزي", group: "B-", phone: "01277889900", lastDonationMonths: 5 },
  { id: 16, name: "شيماء نبيل", city: "الإسكندرية", area: "سموحة", group: "A+", phone: "01088990011", lastDonationMonths: 2 },
  { id: 17, name: "خالد عبد الله", city: "القاهرة", area: "المعادي", group: "O+", phone: "01122334466", lastDonationMonths: 12 },
  { id: 18, name: "منى سمير", city: "طنطا", area: "الحي الخامس", group: "AB+", phone: "01244556677", lastDonationMonths: 3 },
  { id: 19, name: "إسلام رجب", city: "بورسعيد", area: "الكورنيش", group: "B+", phone: "01066778899", lastDonationMonths: 6 },
  { id: 20, name: "آية رأفت", city: "السويس", area: "حي العرب", group: "A-", phone: "01188990022", lastDonationMonths: 4 },
  { id: 21, name: "حسن مجدي", city: "المنصورة", area: "نور الإسلام", group: "O-", phone: "01299001133", lastDonationMonths: 11 },
  { id: 22, name: "باسم صلاح الدين", city: "أسيوط", area: "الوليدية", group: "B-", phone: "01033445566", lastDonationMonths: 2 },
  { id: 23, name: "غادة نبيل", city: "الإسكندرية", area: "العجمي", group: "A+", phone: "01155660077", lastDonationMonths: 5 },
  { id: 24, name: "فاطمة الزهراء", city: "القاهرة", area: "حلوان", group: "O+", phone: "01266770088", lastDonationMonths: 7 },
];

// Urgency drives both the visual weight and the sort order.
const REQUESTS = [
  {
    id: 1,
    patient: "منى أحمد",
    city: "الإسكندرية",
    hospital: "مستشفى المبررة",
    group: "B+",
    units: 2,
    urgency: "urgent",
    status: "open",
    daysAgo: 0,
    note: "تحتاج إلى التبرع قبل عملية جراحية اليوم.",
  },
  {
    id: 2,
    patient: "عبدالله سيد",
    city: "أسيوط",
    hospital: "مستشفى أموري",
    group: "O-",
    units: 3,
    urgency: "urgent",
    status: "open",
    daysAgo: 0,
    note: "حادثة تحتاج إلى تبرع عاجل.",
  },
  {
    id: 3,
    patient: "أم يحيى",
    city: "المنصورة",
    hospital: "مستشفى الأطفال",
    group: "A-",
    units: 1,
    urgency: "high",
    status: "open",
    daysAgo: 1,
    note: "علاج مستمر ويحتاج إلى دعم معتاد.",
  },
  {
    id: 4,
    patient: "سعيد منصور",
    city: "القاهرة",
    hospital: "مستشفى الشفاء",
    group: "AB+",
    units: 2,
    urgency: "normal",
    status: "open",
    daysAgo: 2,
    note: "موعد جراحي مجدول الأسبوع القادم.",
  },
  {
    id: 5,
    patient: "نجلاء فتحي",
    city: "طنطا",
    hospital: "مستشفى المنصورة",
    group: "O+",
    units: 4,
    urgency: "high",
    status: "open",
    daysAgo: 1,
    note: "نزيف داخلي بعد حادث.",
  },
  {
    id: 6,
    patient: "كريم عادل",
    city: "السويس",
    hospital: "مستشفى السويس",
    group: "B-",
    units: 1,
    urgency: "normal",
    status: "open",
    daysAgo: 3,
    note: "مراجعة دورية بعد عملية.",
  },
  {
    id: 7,
    patient: "هدى مصطفى",
    city: "بورسعيد",
    hospital: "مستشفى العامرية",
    group: "A+",
    units: 2,
    urgency: "normal",
    status: "open",
    daysAgo: 4,
    note: "علاج سرطان الدم ويحتاج إلى متابعة.",
  },
  {
    id: 8,
    patient: "محمود عبد الحميد",
    city: "الإسكندرية",
    hospital: "مستشفى رأس التين",
    group: "O-",
    units: 2,
    urgency: "urgent",
    status: "fulfilled",
    daysAgo: 1,
    note: "تم التغطية بالكامل. شكرا للمتبرعين.",
  },
  {
    id: 9,
    patient: "آية سمير",
    city: "القاهرة",
    hospital: "مستشفى الأطفال",
    group: "B+",
    units: 1,
    urgency: "normal",
    status: "open",
    daysAgo: 5,
    note: "مرض مناعي يحتاج إلى متابعة.",
  },
  {
    id: 10,
    patient: "رضا البارودي",
    city: "أسيوط",
    hospital: "مستشفى أسيوط الجامعي.",
    group: "AB-",
    units: 3,
    urgency: "high",
    status: "open",
    daysAgo: 1,
    note: "عملية قلب مفتوح.",
  },
];

const CAMPS = [
  {
    id: 1,
    bank: "مستشفى المبررة",
    city: "الإسكندرية",
    venue: "كلية العلوم",
    date: "2026-10-18",
    from: "10:00",
    to: "14:00",
    capacity: 60,
    filled: 41,
  },
  {
    id: 2,
    bank: "مستشفى الشفاء",
    city: "القاهرة",
    venue: "نادي الرياضية",
    date: "2026-10-24",
    from: "09:00",
    to: "13:00",
    capacity: 80,
    filled: 52,
  },
  {
    id: 3,
    bank: "مستشفى أموري",
    city: "أسيوط",
    venue: "ساحة كاتدرائية",
    date: "2026-11-02",
    from: "11:00",
    to: "16:00",
    capacity: 50,
    filled: 18,
  },
];

const BLOOD_BANKS = [
  { id: 1, name: "مركز بنك الدم — سيدي بشر", city: "الإسكندرية", phone: "03 5901234" },
  { id: 2, name: "مركز بنك الدم — العجمي", city: "الإسكندرية", phone: "03 5823456" },
  { id: 3, name: "مركز بنك الدم — المعادي", city: "القاهرة", phone: "02 27561234" },
  { id: 4, name: "مركز بنك الدم — طنطا", city: "طنطا", phone: "040 3321234" },
];

// Shown in the homepage statistics band.
const STATS = [
  { key: "donations", label: "عملية تبرع مكتملة", icon: "fa-heartbeat", value: 2578 },
  { key: "donors", label: "متبرع مسجل", icon: "fa-users", value: 3500 },
  { key: "banks", label: "بنك دم متعاون", icon: "fa-building", value: 42 },
  { key: "requests", label: "طلب تم تغطيته", icon: "fa-hand-holding-heart", value: 2100 },
];

const REQUEST_STATUS = {
  urgent: { label: "عاجل", badge: "badge--danger", icon: "fa-exclamation-circle" },
  high: { label: "أولوية مرتفعة", badge: "badge--warning", icon: "fa-clock" },
  normal: { label: "عادي", badge: "badge--neutral", icon: "fa-circle" },
};

const REQUEST_STATE = {
  open: { label: "مطلوب", badge: "badge--info" },
  fulfilled: { label: "تم التغطية", badge: "badge--success" },
};

// Blood donation interval is 90 days in most guidelines; 3 months is used here.
const DONATION_INTERVAL_MONTHS = 3;

/* --------------------------------------------------------------------------
   Read helpers — the only accessors the UI is allowed to use.
   -------------------------------------------------------------------------- */
const readDonors = () => DONORS.slice();

const readRequests = () =>
  REQUESTS.slice().sort((a, b) => {
    const rank = { urgent: 0, high: 1, normal: 2 };
    const byUrgency = rank[a.urgency] - rank[b.urgency];
    if (byUrgency !== 0) return byUrgency;
    return a.daysAgo - b.daysAgo;
  });

const readCamps = () => CAMPS.slice().sort((a, b) => a.date.localeCompare(b.date));

const readBanks = () => BLOOD_BANKS.slice();

const readStats = () => STATS.slice();

/* --------------------------------------------------------------------------
   Pure helpers
   -------------------------------------------------------------------------- */

/** A donor may donate again once the interval has elapsed. */
const isEligible = (donor) =>
  donor.lastDonationMonths >= DONATION_INTERVAL_MONTHS;

const eligibilityLabel = (donor) =>
  isEligible(donor) ? "متاح للتبرع" : "غير متاح مؤقتا";

/** Group the "O-"/"AB+" style key into a colour family. */
const groupFamily = (group) => {
  const letter = group.charAt(0).toUpperCase();
  if (letter === "O") return "o";
  if (letter === "A") return "a";
  if (letter === "B") return "b";
  return "ab";
};

/** "منذ 5 أشهر" — relative date, Arabic, plural-aware. */
function monthsAgoLabel(months) {
  if (months === 1) return "منذ شهر";
  if (months === 2) return "منذ شهرين";
  if (months <= 10) return `منذ ${months} أشهر`;
  return "منذ أكثر من عام";
}

function daysAgoLabel(days) {
  if (days === 0) return "اليوم";
  if (days === 1) return "أمس";
  if (days === 2) return "منذ يومين";
  if (days <= 10) return `منذ ${days} أيام`;
  return `منذ ${days} يومًا`;
}

/** "2026-10-18" → "18 أكتوبر 2026" */
const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${AR_MONTHS[month - 1]} ${year}`;
}

/** Escape text before it reaches innerHTML. All list data is untrusted. */
function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch]
  );
}