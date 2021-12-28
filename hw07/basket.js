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
    var $compCart = document.getElementById('compCart');
    var $removeCart = document.getElementById('removeCart');
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
        $compCart.textContent = 'Cостав корзины: ' + countCart(cart) + ' товаров на сумму ' + sumCart(cart) + ' рублей';
        $removeCart.style.display = 'block';
    } else {
        $compCart.textContent = 'Cостав корзины: корзина пуста';
        $removeCart.style.display = 'none';
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
    if (cart[tProd].quantity > 1) {
        cart[tProd].quantity--;
    } else {
        if (confirm('Удалить из корзины товар ' + cart[tProd].product.toUpperCase() + '?'))
            cart.splice(tProd, 1);
    }
}

function init() {
    createCatalog(products);
    createCart(cart);
}

function initClick() {
    var $container = document.getElementById('container');
    var $catalog = document.getElementById('catalog');
    var $cart = document.getElementById('cart');
    var $compCart = document.getElementById('compCart');
    var $address = document.getElementById('address');
    var $comments = document.getElementById('comments');
    var $myModal = document.getElementById('myModal');
    var $removeCart = document.getElementById('removeCart');
    var $productOrder = document.getElementById("productOrder");

    caseAccordion($compCart);

    $catalog.addEventListener('click', function () {
        if (event.target.tagName === 'BUTTON') {
            addProductCart(idProduct(event.target.id), products, cart);
            removeCart();
            createCart(cart);
        }
    });

    $cart.addEventListener('click', function () {
        if (event.target.tagName === 'BUTTON') {
            delProductCart(idProduct(event.target.id), cart);
            removeCart();
            createCart(cart);
        }
    });

    $container.addEventListener('click', function () {
        event.preventDefault();
        if (event.target.tagName === 'IMG') {
            var $prev = document.getElementById('prev');
            var $next = document.getElementById('next');
            $prev.style.display = 'none';
            $next.style.display = 'none';

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
                $prev.style.display = 'block';
                $next.style.display = 'block';
            }

            var $modal = document.getElementById('myModal');
            var $span = document.getElementsByClassName('close')[0];

            $modal.style.display = 'block';
            $span.onclick = function () {
                $modal.style.display = 'none';
            }
        }
    });

    $removeCart.addEventListener('click', function () {
        if (confirm('Удалить все товары из корзины?')) {
            cart = [];
            removeCart();
            createCart(cart);
        }
    });

    $myModal.addEventListener('click', function () {
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
    });

    window.addEventListener('keydown', function () {
        if (event.keyCode === 37 || event.keyCode === 39) {
            var $image = document.getElementById('preview').children[0];
            var k = +$image.src[$image.src.length - 5];
            var kmax = +event.target.name;
            if (event.keyCode === 37) {
                if ((k - 1) === 0)
                    k = kmax;
                else
                    k--;
            }
            if (event.keyCode === 39) {
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
    });

    function caseAccordion(acc) {
        switch (acc.id) {
            case 'compCart':
                $address.classList.remove('active');
                $address.nextElementSibling.style.display = 'none';
                $comments.classList.remove('active');
                $comments.nextElementSibling.style.display = 'none';
                break;
            case 'address':
                $compCart.classList.remove('active');
                $compCart.nextElementSibling.style.display = 'none';
                $comments.classList.remove('active');
                $comments.nextElementSibling.style.display = 'none';
                break;
            case 'comments':
                $compCart.classList.remove('active');
                $compCart.nextElementSibling.style.display = 'none';
                $address.classList.remove('active');
                $address.nextElementSibling.style.display = 'none';
                break;
        }
        acc.classList.toggle('active');
        var panel = acc.nextElementSibling;
        if (panel.style.display === 'block') {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    }

    $productOrder.addEventListener("click", function () {
        if (event.target.classList.contains('accordion')) {
            console.log(event.target);
            caseAccordion(event.target);
        } else if (event.target.tagName === 'A') {
            if (event.target.classList.contains('nextAccord')) {
                caseAccordion(event.target.parentElement.nextElementSibling);
            }
            if (event.target.classList.contains('prevAccord')) {
                caseAccordion(event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling);
            }
        }
    });

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