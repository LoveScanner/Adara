// ===== הגדרות – לעדכן לפני עלייה לאוויר =====
const WHATSAPP_NUMBER = "972500000000"; // מספר הוואטסאפ של העסק (בפורמט בינלאומי, בלי +)

// ===== קטלוג לדוגמה =====
// כל הנתונים כאן הם placeholders – יוחלפו בנתונים האמיתיים מהעסק.
const PRODUCTS = [
  {
    id: "velvet-classic", name: "סרט קטיפה קלאסי", cat: "velvet", price: 59,
    desc: "קטיפה רכה עם פס סיליקון פנימי. הבחירה הפופולרית לשימוש יומיומי.",
    colors: [["שמנת", "#efe2d3"], ["חום", "#7a5642"], ["שחור", "#2b2523"]],
    tag: "הכי נמכר",
    details: ["קטיפה איכותית", "פס סיליקון נגד החלקה", "סגירת סקוץ' מתכווננת", "רוחב: 6 ס\"מ"],
  },
  {
    id: "silicone-pro", name: "סרט סיליקון PRO", cat: "silicone", price: 69,
    desc: "אחיזה מקסימלית לפאות ארוכות וכבדות. בד נושם עם סיליקון כפול.",
    colors: [["בז'", "#d9b99b"], ["חום כהה", "#4e3729"]],
    details: ["סיליקון משני הצדדים", "מתאים לפאות ארוכות", "בד נושם", "רוחב: 7 ס\"מ"],
  },
  {
    id: "lace-summer", name: "סרט תחרה קיצי", cat: "lace", price: 65,
    desc: "תחרה עדינה ונושמת במיוחד – מושלם לימים החמים ולפאות לייס.",
    colors: [["לבן", "#f7f3ee"], ["ניוד", "#e1c3ad"], ["שחור", "#2b2523"]],
    tag: "חדש",
    details: ["תחרה נושמת", "קל במיוחד", "גומי רך מאחור", "רוחב: 5 ס\"מ"],
  },
  {
    id: "velvet-thin", name: "סרט קטיפה דק", cat: "velvet", price: 49,
    desc: "גרסה דקה ודיסקרטית – כמעט לא מורגשת מתחת לפאה.",
    colors: [["שמנת", "#efe2d3"], ["חום", "#7a5642"], ["אפור", "#9a918c"]],
    details: ["רוחב: 3.5 ס\"מ", "פס סיליקון פנימי", "סגירת סקוץ'"],
  },
  {
    id: "bundle-3", name: "מארז 3 סרטים", cat: "bundle", price: 149, oldPrice: 177,
    desc: "שלושה סרטי קטיפה בצבעים לבחירה – אחד לכל יום, ואחד לכביסה.",
    colors: [["מעורב", "#c9a68f"]],
    tag: "חיסכון",
    details: ["3 סרטים קלאסיים", "צבעים לבחירה (לציין בהערה)", "אריזת מתנה"],
  },
  {
    id: "bundle-gift", name: "מארז מתנה לכלה", cat: "bundle", price: 189,
    desc: "סרט קטיפה + סרט תחרה + שקית סאטן ומרכך פאות. מתנה מושלמת.",
    colors: [["שמנת", "#efe2d3"]],
    details: ["2 סרטים", "שקית סאטן לאחסון", "כרטיס ברכה אישי"],
  },
];

// ===== עזר =====
const $ = (s, el = document) => el.querySelector(s);
const ils = (n) => `${n} ₪`;

// איור SVG של סרט (placeholder עד שיהיו תמונות אמיתיות)
function bandSVG(color) {
  return `<svg viewBox="0 0 200 120" aria-hidden="true">
    <path d="M10 70 Q100 -10 190 70 L190 90 Q100 10 10 90 Z" fill="${color}" stroke="rgba(0,0,0,.12)"/>
    <path d="M22 78 Q100 8 178 78" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-dasharray="4 4"/>
  </svg>`;
}
function tint(hex) {
  return `linear-gradient(135deg, ${hex}33, ${hex}14)`;
}

// ===== מוצרים =====
const selectedColor = {};

function renderProducts(filter = "all") {
  const list = PRODUCTS.filter((p) => filter === "all" || p.cat === filter);
  $("#products").innerHTML = list.map((p) => {
    const ci = selectedColor[p.id] ?? 0;
    const hex = p.colors[ci][1];
    return `
    <article class="product">
      <div class="product__img" data-open="${p.id}" style="background:${tint(hex)}">
        ${p.tag ? `<span class="product__tag">${p.tag}</span>` : ""}
        ${bandSVG(hex)}
      </div>
      <div class="product__body">
        <h3>${p.name}</h3>
        <p class="product__desc">${p.desc}</p>
        <div class="swatches">
          ${p.colors.map(([n, c], i) => `<button class="swatch ${i === ci ? "is-active" : ""}" style="background:${c}" title="${n}" data-swatch="${p.id}" data-i="${i}"></button>`).join("")}
        </div>
        <div class="product__foot">
          <span class="price">${ils(p.price)}${p.oldPrice ? `<s>${ils(p.oldPrice)}</s>` : ""}</span>
          <button class="btn btn--primary add-btn" data-add="${p.id}">הוספה לסל</button>
        </div>
      </div>
    </article>`;
  }).join("");
}

let currentFilter = "all";
$("#filters").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === b));
  currentFilter = b.dataset.filter;
  renderProducts(currentFilter);
});

$("#products").addEventListener("click", (e) => {
  const sw = e.target.closest("[data-swatch]");
  if (sw) { selectedColor[sw.dataset.swatch] = +sw.dataset.i; renderProducts(currentFilter); return; }
  const add = e.target.closest("[data-add]");
  if (add) { addToCart(add.dataset.add, selectedColor[add.dataset.add] ?? 0); return; }
  const open = e.target.closest("[data-open]");
  if (open) openModal(open.dataset.open);
});

// ===== חלון מוצר =====
function openModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const ci = selectedColor[id] ?? 0;
  const hex = p.colors[ci][1];
  $("#modalBody").innerHTML = `
    <div class="modal__img" style="background:${tint(hex)}">${bandSVG(hex)}</div>
    <div class="modal__info">
      <h2>${p.name}</h2>
      <p class="price">${ils(p.price)}${p.oldPrice ? `<s>${ils(p.oldPrice)}</s>` : ""}</p>
      <p>${p.desc}</p>
      <ul>${p.details.map((d) => `<li>${d}</li>`).join("")}</ul>
      <p class="muted small">צבע נבחר: ${p.colors[ci][0]}</p>
      <button class="btn btn--primary btn--block" id="modalAdd">הוספה לסל</button>
    </div>`;
  $("#modalAdd").onclick = () => { addToCart(id, ci); closeModal(); };
  $("#modal").classList.add("is-open");
}
function closeModal() { $("#modal").classList.remove("is-open"); }
$("#modalClose").onclick = closeModal;
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });

// ===== סל קניות =====
let cart = [];
try { cart = JSON.parse(localStorage.getItem("adara-cart")) || []; } catch { cart = []; }
const save = () => { try { localStorage.setItem("adara-cart", JSON.stringify(cart)); } catch {} };

function addToCart(id, ci) {
  const key = `${id}:${ci}`;
  const line = cart.find((l) => l.key === key);
  if (line) line.qty++; else cart.push({ key, id, ci, qty: 1 });
  save(); renderCart(); showToast();
}

function renderCart() {
  const count = cart.reduce((s, l) => s + l.qty, 0);
  $("#cartCount").textContent = count;
  if (!cart.length) {
    $("#cartItems").innerHTML = `<p class="cart__empty">הסל ריק כרגע</p>`;
    $("#cartTotal").textContent = ils(0);
    return;
  }
  let total = 0;
  $("#cartItems").innerHTML = cart.map((l) => {
    const p = PRODUCTS.find((x) => x.id === l.id);
    const [cname, hex] = p.colors[l.ci];
    total += p.price * l.qty;
    return `
    <div class="cart-item">
      <div class="cart-item__img" style="background:${tint(hex)}">${bandSVG(hex)}</div>
      <div>
        <h4>${p.name}</h4>
        <small>צבע: ${cname}</small>
        <div class="qty">
          <button data-dec="${l.key}">−</button><span>${l.qty}</span><button data-inc="${l.key}">+</button>
        </div>
      </div>
      <strong>${ils(p.price * l.qty)}</strong>
    </div>`;
  }).join("");
  $("#cartTotal").textContent = ils(total);
}

$("#cartItems").addEventListener("click", (e) => {
  const inc = e.target.dataset.inc, dec = e.target.dataset.dec;
  if (!inc && !dec) return;
  const line = cart.find((l) => l.key === (inc || dec));
  line.qty += inc ? 1 : -1;
  if (line.qty <= 0) cart = cart.filter((l) => l !== line);
  save(); renderCart();
});

const openCart = () => { $("#cart").classList.add("is-open"); $("#overlay").classList.add("is-open"); };
const closeCart = () => { $("#cart").classList.remove("is-open"); $("#overlay").classList.remove("is-open"); };
$("#cartOpen").onclick = openCart;
$("#cartClose").onclick = closeCart;
$("#overlay").onclick = closeCart;

// בסקיצה – ההזמנה נשלחת בוואטסאפ
$("#checkout").onclick = () => {
  if (!cart.length) return;
  let total = 0;
  const lines = cart.map((l) => {
    const p = PRODUCTS.find((x) => x.id === l.id);
    total += p.price * l.qty;
    return `• ${p.name} (${p.colors[l.ci][0]}) × ${l.qty} = ${ils(p.price * l.qty)}`;
  });
  const msg = `שלום! אני רוצה להזמין:\n${lines.join("\n")}\nסה"כ: ${ils(total)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
};

// ===== שונות =====
function showToast() {
  const t = $("#toast");
  t.classList.add("is-show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => t.classList.remove("is-show"), 1600);
}

const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("שלום, אשמח לקבל ייעוץ לגבי סרט לפאה")}`;
$("#waFloat").href = waLink;
$("#waContact").href = waLink;

$("#menuBtn").onclick = () => $("#nav").classList.toggle("is-open");
document.querySelectorAll("#nav a").forEach((a) => a.addEventListener("click", () => $("#nav").classList.remove("is-open")));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeCart(); } });

renderProducts();
renderCart();
