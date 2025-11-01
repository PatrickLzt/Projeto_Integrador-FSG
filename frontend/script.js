// ===== Dados dos Produtos =====
const products = [
    {
        id: 1,
        name: 'Cupcake de Chocolate',
        description: 'Delicioso cupcake de chocolate com cobertura cremosa',
        price: 8.50,
        category: 'chocolate',
        featured: true,
        image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&h=500&fit=crop'
    },
    {
        id: 2,
        name: 'Cupcake de Morango',
        description: 'Massa suave com recheio de morango fresco',
        price: 9.00,
        category: 'frutas',
        featured: true,
        image: 'https://images.unsplash.com/photo-1587241321921-91a834d82b01?w=500&h=500&fit=crop'
    },
    {
        id: 3,
        name: 'Cupcake Red Velvet',
        description: 'O clássico red velvet com cream cheese',
        price: 10.50,
        category: 'especiais',
        featured: true,
        image: 'https://images.unsplash.com/photo-1599785209796-786432b228bc?w=500&h=500&fit=crop'
    },
    {
        id: 4,
        name: 'Cupcake de Baunilha',
        description: 'Clássico e irresistível com cobertura de baunilha',
        price: 8.00,
        category: 'especiais',
        featured: false,
        image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500&h=500&fit=crop'
    },
    {
        id: 5,
        name: 'Cupcake de Limão',
        description: 'Refrescante sabor cítrico com cobertura leve',
        price: 8.50,
        category: 'frutas',
        featured: false,
        image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&h=500&fit=crop'
    },
    {
        id: 6,
        name: 'Cupcake de Chocolate Branco',
        description: 'Suave chocolate branco com raspas',
        price: 9.50,
        category: 'chocolate',
        featured: false,
        image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=500&h=500&fit=crop'
    },
    {
        id: 7,
        name: 'Cupcake de Nutella',
        description: 'Recheado com Nutella e cobertura de avelã',
        price: 11.00,
        category: 'chocolate',
        featured: true,
        image: 'https://images.unsplash.com/photo-1426869884541-df7117556757?w=500&h=500&fit=crop'
    },
    {
        id: 8,
        name: 'Cupcake de Frutas Vermelhas',
        description: 'Mix de frutas vermelhas frescas',
        price: 10.00,
        category: 'frutas',
        featured: false,
        image: 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=500&h=500&fit=crop'
    },
    {
        id: 9,
        name: 'Cupcake Brigadeiro',
        description: 'O favorito brasileiro em formato de cupcake',
        price: 9.50,
        category: 'chocolate',
        featured: false,
        image: 'https://images.unsplash.com/photo-1558326567-98ae2405596b?w=500&h=500&fit=crop'
    },
    {
        id: 10,
        name: 'Cupcake de Coco',
        description: 'Massa de coco com cobertura cremosa',
        price: 8.50,
        category: 'especiais',
        featured: false,
        image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500&h=500&fit=crop'
    },
    {
        id: 11,
        name: 'Cupcake Cookies & Cream',
        description: 'Oreo triturado na massa e cobertura',
        price: 10.50,
        category: 'especiais',
        featured: true,
        image: 'https://images.unsplash.com/photo-1587241321921-91a834d82b01?w=500&h=500&fit=crop'
    },
    {
        id: 12,
        name: 'Cupcake de Doce de Leite',
        description: 'Recheado com doce de leite argentino',
        price: 9.00,
        category: 'especiais',
        featured: false,
        image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&h=500&fit=crop'
    }
];

// ===== Cupons de Desconto =====
const coupons = {
    'DOCURA10': { discount: 0.10, description: '10% de desconto' },
    'PRIMEIRA': { discount: 0.15, description: '15% de desconto' },
    'CUPOM20': { discount: 0.20, description: '20% de desconto' }
};

// ===== Gerenciamento do Carrinho =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon')) || null;

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Salvar cupom no localStorage
function saveCoupon() {
    localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
}

// Atualizar contador do carrinho
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Adicionar produto ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`${product.name} adicionado ao carrinho!`);
}

// Remover produto do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

// Atualizar quantidade no carrinho
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        renderCart();
    }
}

// Calcular subtotal
function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Calcular desconto
function calculateDiscount(subtotal) {
    if (!appliedCoupon) return 0;
    return subtotal * appliedCoupon.discount;
}

// Calcular total
function calculateTotal() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    return subtotal - discount;
}

// Formatar moeda
function formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// Notificação temporária
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-message';
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.animation = 'fadeIn 0.3s ease-in-out';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ===== Página Inicial =====
function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featuredProducts = products.filter(p => p.featured).slice(0, 6);

    container.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatCurrency(product.price)}</span>
                    <button class="btn btn-primary btn-add-cart" onclick="addToCart(${product.id})">
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Página de Cardápio =====
let currentFilter = 'all';

function renderProducts(filter = 'all') {
    const container = document.getElementById('products-grid');
    if (!container) return;

    currentFilter = filter;
    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatCurrency(product.price)}</span>
                    <button class="btn btn-primary btn-add-cart" onclick="addToCart(${product.id})">
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });
}

// ===== Página de Carrinho =====
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
        return;
    }

    cartItemsContainer.style.display = 'block';
    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="cart-item-price">${formatCurrency(item.price)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <p class="cart-item-subtotal">${formatCurrency(item.price * item.quantity)}</p>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const total = calculateTotal();

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('total').textContent = formatCurrency(total);

    const discountRow = document.getElementById('discount-row');
    if (appliedCoupon) {
        discountRow.style.display = 'flex';
        document.getElementById('discount-amount').textContent = `- ${formatCurrency(discount)}`;
    } else {
        discountRow.style.display = 'none';
    }
}

function applyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const couponCode = couponInput.value.trim().toUpperCase();

    if (!couponCode) {
        alert('Digite um código de cupom');
        return;
    }

    if (coupons[couponCode]) {
        appliedCoupon = {
            code: couponCode,
            ...coupons[couponCode]
        };
        saveCoupon();
        updateCartSummary();
        showNotification(`Cupom "${couponCode}" aplicado com sucesso! ${coupons[couponCode].description}`);
        couponInput.value = '';
    } else {
        alert('Cupom inválido');
    }
}

function setupCartPage() {
    renderCart();

    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }
}

// ===== Página de Checkout =====
function renderOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    if (!orderItemsContainer) return;

    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-info">
                <p class="order-item-name">${item.name}</p>
                <p class="order-item-quantity">Qtd: ${item.quantity}</p>
            </div>
            <p class="order-item-price">${formatCurrency(item.price * item.quantity)}</p>
        </div>
    `).join('');

    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const deliveryOption = document.querySelector('input[name="delivery-option"]:checked')?.value;
    const deliveryFee = deliveryOption === 'delivery' ? 8.00 : 0;
    const total = subtotal - discount + deliveryFee;

    document.getElementById('checkout-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('checkout-total').textContent = formatCurrency(total);

    const checkoutDiscountRow = document.getElementById('checkout-discount-row');
    if (appliedCoupon) {
        checkoutDiscountRow.style.display = 'flex';
        document.getElementById('checkout-discount').textContent = `- ${formatCurrency(discount)}`;
    } else {
        checkoutDiscountRow.style.display = 'none';
    }

    // Atualizar taxa de entrega
    const deliveryFeeRow = document.getElementById('delivery-fee-row');
    if (deliveryOption === 'delivery') {
        deliveryFeeRow.style.display = 'flex';
        document.getElementById('delivery-fee').textContent = formatCurrency(deliveryFee);
    } else {
        deliveryFeeRow.style.display = 'none';
    }
}

function setupCheckoutPage() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio');
        window.location.href = 'cardapio.html';
        return;
    }

    renderOrderSummary();

    // Toggle endereço de entrega
    const deliveryOptions = document.querySelectorAll('input[name="delivery-option"]');
    const deliveryAddressSection = document.getElementById('delivery-address-section');

    deliveryOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            if (e.target.value === 'delivery') {
                deliveryAddressSection.style.display = 'block';
                // Tornar campos obrigatórios
                deliveryAddressSection.querySelectorAll('input').forEach(input => {
                    if (!input.id.includes('complement')) {
                        input.required = true;
                    }
                });
            } else {
                deliveryAddressSection.style.display = 'none';
                // Remover obrigatoriedade
                deliveryAddressSection.querySelectorAll('input').forEach(input => {
                    input.required = false;
                });
            }
            updateCheckoutSummary();
        });
    });

    // Toggle campo de troco
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const cashChangeSection = document.getElementById('cash-change-section');

    paymentMethods.forEach(method => {
        method.addEventListener('change', (e) => {
            if (e.target.value === 'cash') {
                cashChangeSection.style.display = 'block';
            } else {
                cashChangeSection.style.display = 'none';
            }
        });
    });

    // Máscara de telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d*)/, '($1');
            }

            e.target.value = value;
        });
    }

    // Máscara de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d{0,3}).*/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    // Submit do formulário
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(checkoutForm);
            const orderData = {
                customer: {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                },
                deliveryOption: formData.get('delivery-option'),
                address: formData.get('delivery-option') === 'delivery' ? {
                    cep: formData.get('cep'),
                    street: formData.get('street'),
                    number: formData.get('number'),
                    complement: formData.get('complement'),
                    neighborhood: formData.get('neighborhood'),
                    city: formData.get('city')
                } : null,
                paymentMethod: formData.get('payment-method'),
                cashAmount: formData.get('cash-amount'),
                items: cart,
                coupon: appliedCoupon,
                subtotal: calculateSubtotal(),
                discount: calculateDiscount(calculateSubtotal()),
                deliveryFee: formData.get('delivery-option') === 'delivery' ? 8.00 : 0,
                total: calculateSubtotal() - calculateDiscount(calculateSubtotal()) +
                    (formData.get('delivery-option') === 'delivery' ? 8.00 : 0)
            };

            console.log('Pedido realizado:', orderData);

            // Limpar carrinho e cupom
            cart = [];
            appliedCoupon = null;
            saveCart();
            saveCoupon();
            updateCartCount();

            // Mostrar mensagem de sucesso
            alert('🎉 Pedido realizado com sucesso! Em breve você receberá a confirmação por e-mail.');
            window.location.href = 'index.html';
        });
    }
}

// ===== Inicialização =====
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Detectar página atual e inicializar
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'index.html':
        case '':
            renderFeaturedProducts();
            break;
        case 'cardapio.html':
            renderProducts();
            setupFilters();
            break;
        case 'carrinho.html':
            setupCartPage();
            break;
        case 'checkout.html':
            setupCheckoutPage();
            break;
    }
});

// Adicionar estilos de animação para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
