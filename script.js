// انتظار تحميل محتوى الصفحة بالكامل لضمان عمل السكربت بشكل صحيح
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       بيانات المنتجات (Product Data)
       تم ترتيب المنتجات حسب الفئات، وتم تجهيز الروابط لتشير إلى مجلد الصور المحلي (images/)
       الرجاء وضع الصور بأسماء متطابقة في مجلد images (مثلاً: strawberry-1.jpg)
       ========================================== */
    const productsData = [
        // قسم الفراولة
        { id: 1, name: "كريمة الفراولة الطازجة", price: 7000, category: "strawberry", img: "images/strawberry-1.jpg" },
        { id: 2, name: "كعكة بهجة الفراولة", price: 8000, category: "strawberry", img: "images/strawberry-2.jpg" },
        { id: 9, name: "مافن الفراولة", price: 10000, category: "strawberry", img: "images/strawberry-3.jpg" },
        
        // قسم الفانيليا
        { id: 4, name: "كعكة الفانيليا الكلاسيكية", price: 4000, category: "vanilla", img: "images/vanilla-1.jpg" },
        { id: 8, name: "كعكة الفانيليا بالكراميل", price: 10000, category: "vanilla", img: "images/vanilla-2.jpg" },
        { id: 8, name: "كعكة الفانيليا بالكراميل", price: 5000, category: "vanilla", img: "images/vanilla-3.jpg" },

        // قسم الشوكولاتة
        { id: 3, name: "كعكة الشوكولاتة الفاخرة", price: 4000, category: "chocolate", img: "images/chocolate-1.jpg" },
        { id: 7, name: "كعكة الشوكولاتة البيضاء", price: 10000, category: "chocolate", img: "images/chocolate-2.jpg" },
        { id: 12, name: "كعكة الغابة السوداء", price: 5000, category: "chocolate", img: "images/chocolate-3.jpg" },
        
        // قسم الفواكه المجففة
        { id: 5, name: "تارت الفواكه المجففة", price: 5000, category: "dried-fruit", img: "images/dried-fruit-1.jpg" },
        { id: 10, name: "كيكة التمر والجوز", price: 10000, category: "dried-fruit", img: "images/dried-fruit-2.jpg" },
        { id: 10, name: "كيكة التمر والجوز", price: 4000, category: "dried-fruit", img: "images/dried-fruit-3.jpg" },

        
        // قسم أخرى (متنوعة)
        { id: 6, name: "تشيز كيك التوت", price: 5000, category: "others", img: "images/others-1.jpg" },
        { id: 11, name: "كعكة الليمون المنعشة", price: 4000, category: "others", img: "images/others-2.jpg" },
        { id: 11, name: "كعكة الليمون المنعشة", price: 9000, category: "others", img: "images/others-3.jpg" },

    ];

    // خريطة لأسماء الأقسام باللغة العربية
    const categoryNames = {
        "strawberry": "فراولة",
        "vanilla": "فانيليا",
        "chocolate": "شوكولاتة",
        "dried-fruit": "فواكه مجففة",
        "others": "أخرى"
    };

    const productGrid = document.getElementById('product-grid');

    // دالة مسؤولة عن رسم وعرض المنتجات مقسمة إلى أقسام
    const renderProducts = (productsToRender) => {
        productGrid.innerHTML = '';
        
        // تجميع المنتجات حسب القسم
        const groupedProducts = productsToRender.reduce((acc, product) => {
            if (!acc[product.category]) acc[product.category] = [];
            acc[product.category].push(product);
            return acc;
        }, {});

        // عرض كل قسم على حدة
        for (const [category, products] of Object.entries(groupedProducts)) {
            // إنشاء عنوان القسم
            const sectionTitle = document.createElement('h3');
            sectionTitle.classList.add('category-title');
            sectionTitle.innerText = categoryNames[category] || category;
            
            // إنشاء حاوية لمنتجات هذا القسم
            const sectionGrid = document.createElement('div');
            sectionGrid.classList.add('category-grid');

            // إضافة المنتجات داخل القسم
            products.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                
                // إضافة معالج خطأ الصورة لعرض صورة بديلة (Placeholder) إذا لم يتم وضع الصور الحقيقية بعد
                card.innerHTML = `
                    <div class="product-img">
                        <img src="${product.img}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/500x500.png?text=Image+Not+Found'">
                        <button class="add-to-cart" data-id="${product.id}" aria-label="إضافة للسلة">
                            <i class="fa-solid fa-cart-shopping"></i>
                        </button>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">${product.price.toFixed(2)} ريال</p>
                    </div>
                `;
                sectionGrid.appendChild(card);
            });

            // إضافة عنوان القسم وحاوية المنتجات إلى الواجهة الرئيسية
            productGrid.appendChild(sectionTitle);
            productGrid.appendChild(sectionGrid);
        }
    };

    // عرض جميع المنتجات عند تحميل الصفحة لأول مرة
    renderProducts(productsData);

    /* ==========================================
       وظيفة تصفية (فلترة) المنتجات
       ========================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // إزالة التحديد (active) من جميع الأزرار
            filterBtns.forEach(button => button.classList.remove('active'));
            // إضافة التحديد للزر المضغوط
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            if (filterValue === 'all') {
                // إذا كان الفلتر "الكل"، اعرض القائمة كاملة
                renderProducts(productsData);
            } else {
                // تصفية المنتجات حسب القسم المختار (category)
                const filteredProducts = productsData.filter(product => product.category === filterValue);
                renderProducts(filteredProducts);
            }
        });
    });

    /* ==========================================
       تأثير التمرير السلس (Smooth Scrolling)
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    /* ==========================================
       وظائف سلة المشتريات (Shopping Cart)
       ========================================== */
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartBadge = document.getElementById('cart-badge');

    // فتح السلة
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });

    // إغلاق السلة
    const closeCart = () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    };
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // إضافة منتج للسلة (باستخدام Event Delegation لأن الأزرار تتولد ديناميكياً)
    productGrid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-to-cart');
        if (!addBtn) return; // إذا لم يكن العنصر المضغوط هو زر الإضافة، توقف

        const productId = parseInt(addBtn.getAttribute('data-id'));
        // البحث عن بيانات المنتج من المصفوفة الأصلية
        const product = productsData.find(p => p.id === productId);

        if (product) {
            // التحقق مما إذا كان المنتج موجود مسبقاً في السلة
            const existingItem = cart.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            updateCartUI();
            
            // فتح السلة تلقائياً ليرى المستخدم أنه تم الإضافة بنجاح
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        }
    });

    // تحديث واجهة السلة (رسم العناصر وحساب المجموع)
    const updateCartUI = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">سلة المشتريات فارغة</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                totalItems += item.quantity;

                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price.toFixed(2)} ريال</div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn decrease-qty" data-id="${item.id}">-</button>
                            <span class="qty-number">${item.quantity}</span>
                            <button class="qty-btn increase-qty" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}" aria-label="إزالة"><i class="fa-solid fa-trash-can"></i></button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        // تحديث المجموع ورقم الشارة (Badge)
        cartTotalPrice.innerText = `${total.toFixed(2)} ريال`;
        cartBadge.innerText = totalItems;

        // حفظ السلة في التخزين المحلي (Local Storage)
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // إدارة أحداث (الزيادة، النقصان، والحذف) داخل السلة
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = parseInt(target.getAttribute('data-id'));

        if (target.classList.contains('increase-qty')) {
            const item = cart.find(item => item.id === id);
            item.quantity += 1;
            updateCartUI();
        } 
        else if (target.classList.contains('decrease-qty')) {
            const item = cart.find(item => item.id === id);
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // إذا كانت الكمية 1، احذف المنتج
                cart = cart.filter(item => item.id !== id);
            }
            updateCartUI();
        } 
        else if (target.classList.contains('remove-item')) {
            cart = cart.filter(item => item.id !== id);
            updateCartUI();
        }
    });

    // رسم الواجهة الأولية عند تحميل الصفحة (تحديث بيانات السلة السابقة إن وجدت)
    updateCartUI();
});