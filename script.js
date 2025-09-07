// ===================== TRANSLATIONS =====================
const translations = {
    fr: {
      categories_list: ["Ballons", "Vaisselle", "Décorations", "Thèmes", "Nouveautés"],
      search_placeholder: "Rechercher un produit...",
      cart_text: "Votre panier",
      checkout_text: "Finaliser la commande",
      name: "Nom",
      phone: "Téléphone",
      address: "Adresse",
      order: "Commander",
      proceed: "Passer à la caisse"
    },
    en: {
      categories_list: ["Balloons", "Tableware", "Decorations", "Themes", "New"],
      search_placeholder: "Search products...",
      cart_text: "Your Cart",
      checkout_text: "Checkout",
      name: "Name",
      phone: "Phone",
      address: "Address",
      order: "Place Order",
      proceed: "Proceed to Checkout"
    },
    ar: {
      categories_list: ["بالونات", "أدوات المائدة", "الزينة", "ثيمات", "جديد"],
      search_placeholder: "ابحث عن المنتج...",
      cart_text: "سلة التسوق",
      checkout_text: "إتمام الطلب",
      name: "الاسم",
      phone: "الهاتف",
      address: "العنوان",
      order: "أرسل الطلب",
      proceed: "إلى الدفع"
    }
  };
  
  // ===================== PRODUCTS =====================
  const products = [
    {id:"p1",title:{fr:"Kit Ballons Pastel",en:"Pastel Balloon Kit",ar:"طقم بالونات باستيل"},price:24,img:"assets/pastel-balloon-kit.jpg",cat:"Ballons"},
    {id:"p2",title:{fr:"Assiettes Roses",en:"Pink Plates",ar:"أطباق وردية"},price:15,img:"assets/pink-plates.jpg",cat:"Vaisselle"},
    {id:"p3",title:{fr:"Guirlande Fête",en:"Party Garland",ar:"سلسلة زينة"},price:18,img:"assets/party-garland.jpg",cat:"Décorations"},
    {id:"p4",title:{fr:"Ballons Chiffres",en:"Number Balloons",ar:"بالونات أرقام"},price:12,img:"assets/Number-Balloons.jpg",cat:"Ballons"},
    {id:"p5",title:{fr:"Nappes Festives",en:"Party Tablecloths",ar:"مفارش حفلات"},price:20,img:"assets/prod5.jpg",cat:"Vaisselle"},
    {id:"p6",title:{fr:"Bougies Anniversaire",en:"Birthday Candles",ar:"شموع عيد ميلاد"},price:8,img:"assets/prod6.jpg",cat:"Décorations"}
  ];
  
  // ===================== STATE =====================
  let state = {
    lang: localStorage.getItem("lang") || "fr",
    category: "All",
    cart: JSON.parse(localStorage.getItem("cart") || "[]")
  };
  
  // ===================== UTILITY =====================
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(state.cart));
    updateHeaderCart();
  }
  
  function updateHeaderCart() {
    const count = state.cart.reduce((sum, p) => sum + p.qty, 0);
    const total = state.cart.reduce((sum, p) => sum + p.price * p.qty, 0);
    const c = document.getElementById("cartCount");
    const t = document.getElementById("cartTotal");
    if (c) c.textContent = count;
    if (t) t.textContent = `${total} TND`;
  }
  
  function t(key) { return translations[state.lang][key]; }
  
  // ===================== LANGUAGE SWITCH =====================
  function initLangSwitch() {
    document.querySelectorAll(".lang-switch button").forEach(btn=>{
      btn.onclick=()=>{
        state.lang = btn.dataset.lang;
        localStorage.setItem("lang", state.lang);
        location.reload();
      };
      if(btn.dataset.lang===state.lang) btn.classList.add("active");
    });
  }
  
  // ===================== CATEGORIES =====================
  function renderCategories() {
    const catRoot = document.getElementById("categoryList");
    if(!catRoot) return;
    catRoot.innerHTML = '';
  
    // "All" button
    const allBtn = document.createElement("div");
    allBtn.className = 'cat' + (state.category === "All" ? " active" : "");
    allBtn.textContent = state.lang === "ar" ? "الكل" : state.lang === "fr" ? "Tous" : "All";
    allBtn.onclick = () => { state.category="All"; renderCategories(); renderProducts(); };
    catRoot.appendChild(allBtn);
  
    // category buttons
    translations[state.lang].categories_list.forEach(cat=>{
      const div = document.createElement("div");
      div.className = "cat" + (state.category===cat ? " active" : "");
      div.textContent = cat;
      div.onclick = ()=>{ state.category=cat; renderCategories(); renderProducts(); };
      catRoot.appendChild(div);
    });
  }
  
  // ===================== PRODUCTS GRID =====================
  function renderProducts() {
    const grid = document.getElementById("productGrid");
    if(!grid) return;
    grid.innerHTML = "";
  
    const filtered = products.filter(p => state.category==="All" || p.cat===state.category);
    filtered.forEach(p=>{
      const card = document.createElement("div");
      card.className="card";
      card.innerHTML=`
        <img src="${p.img}" alt="${p.title[state.lang]}">
        <div class="title">${p.title[state.lang]}</div>
        <div class="price">${p.price} TND</div>
      `;
      const btn = document.createElement("button");
      btn.className="btn primary";
      btn.textContent = "+";
      btn.onclick = ()=>{ addToCart(p); };
      card.appendChild(btn);
      grid.appendChild(card);
    });
  }
  
  // ===================== CART FUNCTIONS =====================
  function addToCart(product) {
    const existing = state.cart.find(i=>i.id===product.id);
    if(existing) existing.qty += 1;
    else state.cart.push({...product, qty:1});
    saveCart();
  }
  
  function renderCartPage() {
    const table = document.getElementById("cartTable");
    if(!table) return;
    table.innerHTML = "<tr><th>Produit</th><th>Qté</th><th>Prix</th><th></th></tr>";
    state.cart.forEach(item=>{
      const tr = document.createElement("tr");
      tr.innerHTML=`<td>${item.title[state.lang]}</td>
                    <td>${item.qty}</td>
                    <td>${item.price*item.qty} TND</td>`;
      const td = document.createElement("td");
      const rm = document.createElement("button");
      rm.textContent="×";
      rm.onclick=()=>{ state.cart = state.cart.filter(p=>p.id!==item.id); saveCart(); renderCartPage(); };
      td.appendChild(rm); tr.appendChild(td);
      table.appendChild(tr);
    });
  
    const sum = state.cart.reduce((s,i)=>s+i.price*i.qty,0);
    const cartSum = document.getElementById("cartSum");
    if(cartSum) cartSum.textContent = sum + " TND";
  
    const proceedBtn = document.getElementById("proceedBtn");
    if(proceedBtn) proceedBtn.textContent = t("proceed");
  }
  
  // ===================== CHECKOUT =====================
  function initCheckout() {
    const form = document.getElementById("orderForm");
    if(!form) return;
  
    document.getElementById("checkoutTitle").textContent = t("checkout");
    document.getElementById("lblName").textContent = t("name");
    document.getElementById("lblPhone").textContent = t("phone");
    document.getElementById("lblAddress").textContent = t("address");
    document.getElementById("btnOrder").textContent = t("order");
  
    form.onsubmit = (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const orderLines = state.cart.map(p=>`${p.title[state.lang]} x${p.qty}`).join("%0D%0A");
      const mailtoLink = `mailto:yourshop@email.com?subject=Commande&body=${encodeURIComponent(
        "Order:%0D%0A"+orderLines+
        "%0D%0AName: "+data.name+
        "%0D%0APhone: "+data.phone+
        "%0D%0AAddress: "+data.address
      )}`;
      window.location.href = mailtoLink;
    };
  }
  
  // ===================== INIT =====================
  document.addEventListener("DOMContentLoaded", ()=>{
    // set year
    document.getElementById("year")?.append(new Date().getFullYear());
  
    initLangSwitch();
    updateHeaderCart();
    renderCategories();
    renderProducts();
    renderCartPage();
    initCheckout();
  });
  