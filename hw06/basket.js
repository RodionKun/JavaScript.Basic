var pathBigImg = "img/catalog/big/";
var pathSmallImg = "img/catalog/small/";

function createCatalog(products) {
    var $catalog = document.getElementById('catalog');
    var $posters = document.getElementById('posters');
    for (var i = 0; i < products.length; i++) {
        var $poster = $posters.children[0].cloneNode(true);
        $poster.querySelector('.poster__footer__name').textContent = products[i].product.toUpperCase();
        $poster.querySelector('.poster__footer__price').textContent = products[i].price + ' ₽';
        $poster.querySelector('.bigImg').href = pathBigImg + products[i].product + '2.jpg';
        $poster.querySelector('.bigImg').name = products[i].countImg;
        $poster.querySelector('.smallImg').src = pathSmallImg + products[i].product + '.jpg';
        $poster.querySelector('.smallImg').alt = products[i].product;
        $poster.querySelector('.buy').setAttribute('id', 'buy_' + i);
        $poster.querySelector('.buy').textContent = 'Купить';

        $catalog.appendChild($poster);
    }
}

function createCart(cart) {
    var $cart = document.getElementById('cart');
    var col = ['product', 'price', 'quantity', 'total', 'action'];
    var $field;

    for (var i = 0; i < col.length; i++) {
        $field = document.createElement('div');
        $field.textContent = col[i];
        $cart.appendChild($field);
    }
    if (cart.length > 0) {
        for (var i = 0; i < cart.length; i++) {
            for (var j = 0; j < col.length; j++) {
                $field = document.createElement('div');
                if (j < 3) {
                    $field.textContent = cart[i][col[j]];
                } else if (col[j] === 'total') {
                    $field.textContent = cart[i].total();
                } else {
                    $field.textContent = cart[i][col[j]];
                    $cart.appendChild($field);
                    var $btn = document.createElement('button');
                    $btn.classList.add('buy');
                    $btn.classList.add('action');
                    $btn.setAttribute('id', 'del_' + i);
                    $btn.textContent = 'X';
                    $field.appendChild($btn);
                }
                $cart.appendChild($field);
            }
        }
        $field = document.createElement('div');
        $field.classList.add('total');
        $field.textContent = 'В корзине: ' + countCart(cart) + ' товаров на сумму ' + sumCart(cart) + ' рублей';
        $cart.appendChild($field);
        $field = document.createElement('button');
        $field.classList.add('buy');
        $field.setAttribute('id', 'removeCart');
        $field.textContent = 'Очистить корзину';
        $cart.appendChild($field);
    } else {
        $field = document.createElement('div');
        $field.classList.add('total');
        $field.textContent = 'Корзина пуста';
        $cart.appendChild($field);

    }
}

function removeCart() {
    var $cart = document.getElementById('cart');

    while ($cart.firstChild) {
        $cart.removeChild($cart.firstChild);
    }
}

function totalSum() {
    return this.price * this.quantity;
}

function sumCart(cart) {
    var sum = 0;
    for (var i = 0; i < cart.length; i++) {
        sum += cart[i].total();
    }
    return sum;
}

function countCart(cart) {
    var count = 0;
    for (var i = 0; i < cart.length; i++) {
        count += cart[i].quantity;
    }
    return count;
}

function idProduct(tId) {
    var tProd = tId + '';
    tProd = +tProd.substring(tProd.indexOf('_') + 1, tProd.length);
    return tProd;
}

function addProductCart(tProd, products, cart) {
    if (cart.length != 0) {
        for (var key in cart) {
            if (products[tProd].product === cart[key].product) {
                ++cart[key].quantity
                return;
            }
        }
        cart.push({
            product: products[tProd].product,
            price: products[tProd].price,
            quantity: 1,
            total: totalSum,
            action: ''
        });
    } else {
        cart.push({
            product: products[tProd].product,
            price: products[tProd].price,
            quantity: 1,
            total: totalSum,
            action: ''
        });
    }
}

function del(tId) {
    var tProd = tId + '';
    if (tProd.indexOf('del') === 0)
        return true;
    else
        return false;
}

function delProductCart(tProd, cart) {
    cart.splice(tProd, 1);
}

function init() {
    createCatalog(products);
    createCart(cart);
}

function initClick() {
    var $container = document.getElementById('container');
    var $myModal = document.getElementById('myModal');

    $container.addEventListener('click', handleButtonClick);
    $myModal.addEventListener('click', handleLinkClick);
}

function handleButtonClick(event) {
    event.preventDefault();
    if (event.target.tagName === 'IMG') {
        var $prev = document.getElementById('prev');
        var $next = document.getElementById('next');
        $prev.style.display = "none";
        $next.style.display = "none";

        var $a = event.target.parentElement;
        var path = $a.href;

        var $image = document.createElement('img');
        $image.src = path
        $image.alt = event.target.alt;

        var $preview = document.getElementById('preview');
        $preview.innerHTML = '';
        $preview.appendChild($image);

        if (+$a.name > 1) {
            $prev.name = $a.name;
            $next.name = $a.name;
            $prev.style.display = "block";
            $next.style.display = "block";
        }

        var $modal = document.getElementById('myModal');
        var $span = document.getElementsByClassName("close")[0];

        $modal.style.display = "block";
        $span.onclick = function () {
            $modal.style.display = "none";
        }
    } else {
        if (event.target.tagName === 'BUTTON') {
            if (event.target.id === 'removeCart')
                cart = [];
            else if (del(event.target.id)) {
                delProductCart(idProduct(event.target.id), cart);
            } else
                addProductCart(idProduct(event.target.id), products, cart);
        }
        removeCart();
        createCart(cart);
    }
}

function handleLinkClick(event) {
    event.preventDefault();
    if (event.target.tagName === 'A') {
        var $image = document.getElementById('preview').children[0];
        var k = +$image.src[$image.src.length - 5];
        var kmax = +event.target.name;
        if (event.target.id === 'prev') {
            if ((k - 1) === 0)
                k = kmax;
            else
                k--;
        }
        if (event.target.id === 'next') {
            if ((k + 1) > kmax)
                k = 1;
            else
                k++;
        }

        var path = pathBigImg + $image.alt + String(k) + '.jpg';
        var $imageNew = document.createElement('img');
        $imageNew.src = path;
        $imageNew.alt = $image.alt;

        var $preview = document.getElementById('preview');
        $preview.innerHTML = '';
        $preview.appendChild($imageNew);

    }
}

var products = [
    { product: "Latte", price: 50, countImg: 2 },
    { product: "Espresso", price: 65, countImg: 2 },
    { product: "Tea", price: 55, countImg: 1 },
    { product: "Capuchino", price: 60, countImg: 1 },
    { product: "Frappe", price: 70, countImg: 3 },
    { product: "Makiato", price: 65, countImg: 1 },
];

var cart = [];

window.addEventListener('load', init);
window.addEventListener('load', initClick);