// ===================== TRANSLATIONS =====================
const translations = {
    fr: {
      categories_list: [
        "Mon premier anniversaire",
        "Packs décoration complète",
        "Thèmes ",
        "Accessoires"
      ],
      search_placeholder: "Rechercher un produit...",
      cart_text: "Votre panier",
      checkout_text: "Finaliser la commande",
      name: "Nom",
      phone: "Téléphone",
      address: "Adresse",
      email: "Email", 
      order: "Commander",
      proceed: "Passer à la caisse",
      
      add_to_cart: "Ajouter au panier"
    },
    en: {
      categories_list: [
        "My First Birthday",
        "Full Decoration Packs",
        "Themes",
        "Accessories",
      ],
      search_placeholder: "Search products...",
      cart_text: "Your Cart",
      checkout_text: "Checkout",
      name: "Name",
      phone: "Phone",
      address: "Address",
      email: "Email",
      order: "Place Order",
      proceed: "Proceed to Checkout",
      add_to_cart: "Add to Cart"
    },
    ar: {
      categories_list: [
        "عيد ميلادي الأول",
        "باقات ديكور كاملة",
        "باقات حسب الثيم)",
        "إكسسوارات"
      ],
      search_placeholder: "ابحث عن المنتج...",
      cart_text: "سلة التسوق",
      checkout_text: "إتمام الطلب",
      name: "الاسم",
      phone: "الهاتف",
      address: "العنوان",
      email: "البريد الإلكتروني", 
      order: "أضف إلى السلة",
      proceed: "إلى الدفع",
      add_to_cart: "أضف إلى السلة"
    },
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
    const c = document.getElementById("cartCount");
    if (c) c.textContent = count;
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
    grid.innerHTML = "";

    const filteredByCat = state.category === "All"
      ? products
      : products.filter(p => p.cat === state.category);

    const term = (state.search || "").toLowerCase();
    const filtered = filteredByCat.filter(p =>
      p.title[state.lang].toLowerCase().includes(term)
    );

    filtered.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";

      const img = document.createElement("img");
      img.src = p.img;
      img.alt = p.title[state.lang];
      card.appendChild(img);

      const title = document.createElement("h4");
      title.textContent = p.title[state.lang];
      card.appendChild(title);

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = `${p.price} TND`;
      card.appendChild(price);

      const addBtn = document.createElement("button");
      addBtn.textContent = t("add_to_cart");
      addBtn.className = "btn primary";
      addBtn.onclick = () => addToCart(p);
      card.appendChild(addBtn);

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

function renderSuggestedProducts() {
    const grid = document.getElementById("suggestedGrid");
    if (!grid) return;

    const suggestions = products.slice(0, 4);

    grid.innerHTML = "";

    suggestions.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = p.img;
        img.alt = p.title[state.lang];
        card.appendChild(img);

        const title = document.createElement("h4");
        title.textContent = p.title[state.lang];
        card.appendChild(title);

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = `${p.price} TND`;
        card.appendChild(price);

        const addBtn = document.createElement("button");
        addBtn.textContent = t("add_to_cart");
        addBtn.className = "btn primary";
        addBtn.onclick = () => addToCart(p);
        card.appendChild(addBtn);

        grid.appendChild(card);
    });
}

function renderCartPage() {
    const table = document.getElementById("cartTable");
    if(!table) return;

    table.innerHTML = "<tr><th>Produit</th><th>Qté</th><th>Prix</th><th>Action</th></tr>";

    if(state.cart.length === 0){
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="4" style="text-align:center;">${state.lang === "fr" ? "Panier vide" : state.lang === "en" ? "Cart is empty" : "السلة فارغة"}</td>`;
        table.appendChild(tr);
    }

    state.cart.forEach(item=>{
        const tr = document.createElement("tr");

        // Product cell with image and title
        const tdProduct = document.createElement("td");
        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.title[state.lang];
        img.style.width = "60px";
        img.style.height = "60px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "6px";
        img.style.marginRight = "0.5rem";

        const spanTitle = document.createElement("span");
        spanTitle.textContent = item.title[state.lang];

        tdProduct.appendChild(img);
        tdProduct.appendChild(spanTitle);
        tr.appendChild(tdProduct);

        // Quantity cell with + and - buttons
        const tdQty = document.createElement("td");
        const minusBtn = document.createElement("button");
        minusBtn.textContent = "−";
        minusBtn.style.marginRight = "0.3rem";
        minusBtn.onclick = () => {
            if(item.qty > 1) item.qty -= 1;
            else state.cart = state.cart.filter(p => p.id !== item.id);
            saveCart();
            renderCartPage();
        };
        const qtySpan = document.createElement("span");
        qtySpan.textContent = item.qty;
        qtySpan.style.margin = "0 0.3rem";
        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.onclick = () => {
            item.qty += 1;
            saveCart();
            renderCartPage();
        };
        tdQty.appendChild(minusBtn);
        tdQty.appendChild(qtySpan);
        tdQty.appendChild(plusBtn);
        tr.appendChild(tdQty);

        // Price cell
        const tdPrice = document.createElement("td");
        tdPrice.textContent = (item.price * item.qty) + " TND";
        tr.appendChild(tdPrice);

        // Remove cell
        const tdAction = document.createElement("td");
        const rm = document.createElement("button");
        rm.textContent = "×";
        rm.onclick = () => { 
            state.cart = state.cart.filter(p => p.id !== item.id); 
            saveCart(); 
            renderCartPage(); 
        };
        tdAction.appendChild(rm);
        tr.appendChild(tdAction);

        table.appendChild(tr);
    });

    // Update total
    const sum = state.cart.reduce((s,i)=>s+i.price*i.qty,0);
    const cartSum = document.getElementById("cartSum");
    if(cartSum) cartSum.textContent = sum + " TND";

    const proceedBtn = document.getElementById("proceedBtn");
    if(proceedBtn) proceedBtn.textContent = t("proceed");

    // render suggested products
    renderSuggestedProducts();
}

// ===================== CHECKOUT =====================
function initCheckout() {
    const form = document.getElementById("orderForm");
    if(!form) return;

    document.getElementById("checkoutTitle").textContent = t("checkout");
    document.getElementById("lblName").textContent = t("name");
    document.getElementById("lblPhone").textContent = t("phone");
    document.getElementById("lblAddress").textContent = t("address");
    document.getElementById("lblEmail").textContent = t("email");
    document.getElementById("btnOrder").textContent = t("order");

    form.onsubmit = (e)=>{
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        const orderLines = state.cart.map(p=>`${p.title[state.lang]} x${p.qty}`).join("%0D%0A");
        
        // Add CC to send a copy to the user
        const mailtoLink = `mailto:yourshop@email.com?cc=${encodeURIComponent(data.email)}&subject=Commande&body=${encodeURIComponent(
            "Order:%0D%0A"+orderLines+
            "%0D%0AName: "+data.name+
            "%0D%0APhone: "+data.phone+
            "%0D%0AAddress: "+data.address+
            "%0D%0AEmail: "+data.email
        )}`;

        window.location.href = mailtoLink;
    };
}



// ===================== INIT =====================
document.addEventListener("DOMContentLoaded", () => {
    // Set footer year if present
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    // Initialize language switch
    initLangSwitch();

    // Update cart count in header (if present)
    updateHeaderCart();

    // Index page only
    if (document.getElementById("productGrid")) {
        renderCategories();   // <-- render categories
        renderProducts();

        const s = document.getElementById("searchInput");
        if (s) {
            s.placeholder = t("search_placeholder");
            s.addEventListener("input", e => {
                state.search = e.target.value;
                renderProducts();
            });
        }
    }

    // Cart page only
    if (document.getElementById("cartTable")) {
        renderCategories();   // <-- render categories
        renderCartPage();
    }

    // Checkout page only
    if (document.getElementById("orderForm")) {
        renderCategories();   // <-- render categories
        initCheckout();
    }
});
