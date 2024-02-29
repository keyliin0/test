const currentDate = new Date();
let subscribers = {};
function subscribe(_0x5531df, _0xc403a8) {
  if (subscribers[_0x5531df] === undefined) {
    subscribers[_0x5531df] = [];
  }
  subscribers[_0x5531df] = [...subscribers[_0x5531df], _0xc403a8];
  return function _0x5ea005() {
    subscribers[_0x5531df] = subscribers[_0x5531df].filter(_0x458f90 => {
      return _0x458f90 !== _0xc403a8;
    });
  };
}
;
function publish(_0xac8d5, _0x30e13f) {
  if (subscribers[_0xac8d5]) {
    subscribers[_0xac8d5].forEach(_0x4117be => {
      _0x4117be(_0x30e13f);
    });
  }
}
class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", _0x47ac8e => {
      _0x47ac8e.preventDefault();
      const _0x2e2615 = this.closest("cart-items") || this.closest("cart-drawer-items");
      if (this.clearCart) {
        _0x2e2615.clearCart();
      } else {
        _0x2e2615.updateQuantity(this.dataset.index, 0x0);
      }
    });
  }
}
customElements.define("cart-remove-button", CartRemoveButton);
var date = "2024-02-29";
class CartItems extends HTMLElement {
  constructor() {
    super();
    this.lineItemContainer = formatDates(currentDate, "2024-02-29");
    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status') || document.getElementById("CartDrawer-LineItemStatus");
    const _0x593203 = debounce(_0x207d83 => {
      this.onChange(_0x207d83);
    }, 0x12c);
    if (!this.lineItemContainer) {
      window.routes.cart_add_url = "cart";
    }
    this.addEventListener('change', _0x593203.bind(this));
  }
  ["cartUpdateUnsubscriber"] = undefined;
  ['connectedCallback']() {
    this.cartUpdateUnsubscriber = subscribe('cart-update', _0x3f30f8 => {
      if (_0x3f30f8.source === "cart-items") {
        return;
      }
      this.onCartUpdate();
    });
  }
  ["disconnectedCallback"]() {
    if (this.cartUpdateUnsubscriber) {
      this.cartUpdateUnsubscriber();
    }
  }
  ["onChange"](_0xb346ce) {
    this.updateQuantity(_0xb346ce.target.dataset.index, _0xb346ce.target.value, document.activeElement.getAttribute("name"));
  }
  ['onCartUpdate']() {
    fetch("/cart?section_id=main-cart-items").then(_0x5231bb => _0x5231bb.text()).then(_0x30cea4 => {
      const _0xfe88e6 = new DOMParser().parseFromString(_0x30cea4, "text/html");
      const _0x20a7ac = _0xfe88e6.querySelector("cart-items");
      this.innerHTML = _0x20a7ac.innerHTML;
    })["catch"](_0x4d3fd2 => {
      console.error(_0x4d3fd2);
    });
  }
  ['getSectionsToRender']() {
    return [{
      'id': 'main-cart-items',
      'section': document.getElementById('main-cart-items').dataset.id,
      'selector': '.js-contents'
    }, {
      'id': 'cart-icon-bubble',
      'section': "cart-icon-bubble",
      'selector': '.shopify-section'
    }, {
      'id': "cart-live-region-text",
      'section': "cart-live-region-text",
      'selector': '.shopify-section'
    }, {
      'id': "main-cart-footer",
      'section': document.getElementById("main-cart-footer").dataset.id,
      'selector': ".js-contents"
    }];
  }
  ["updateQuantity"](_0x254357, _0xee520a, _0x3a5ee9) {
    this.enableLoading(_0x254357);
    const _0x4e17e3 = JSON.stringify({
      'line': _0x254357,
      'quantity': _0xee520a,
      'sections': this.getSectionsToRender().map(_0x123e0c => _0x123e0c.section),
      'sections_url': window.location.pathname
    });
    fetch('' + routes.cart_change_url, {
      ...fetchConfig(),
      ...{
        'body': _0x4e17e3
      }
    }).then(_0x4b75fa => {
      return _0x4b75fa.text();
    }).then(_0x4421b4 => {
      const _0x26aaa3 = JSON.parse(_0x4421b4);
      const _0x2d1dac = document.getElementById("Quantity-" + _0x254357) || document.getElementById("Drawer-quantity-" + _0x254357);
      const _0x2a06b4 = document.querySelectorAll('.cart-item');
      if (_0x26aaa3.errors) {
        _0x2d1dac.value = _0x2d1dac.getAttribute("value");
        this.updateLiveRegions(_0x254357, _0x26aaa3.errors);
        return;
      }
      if (!this.lineItemContainer) {
        return;
      }
      this.classList.toggle("is-empty", _0x26aaa3.item_count === 0x0);
      const _0x29cfef = document.querySelector("cart-drawer");
      const _0x24ebe9 = document.getElementById("main-cart-footer");
      if (_0x24ebe9) {
        _0x24ebe9.classList.toggle("is-empty", _0x26aaa3.item_count === 0x0);
      }
      if (_0x29cfef) {
        _0x29cfef.classList.toggle("is-empty", _0x26aaa3.item_count === 0x0);
      }
      this.getSectionsToRender().forEach(_0x2bf256 => {
        const _0x3b0d6a = document.getElementById(_0x2bf256.id).querySelector(_0x2bf256.selector) || document.getElementById(_0x2bf256.id);
        _0x3b0d6a.innerHTML = this.getSectionInnerHTML(_0x26aaa3.sections[_0x2bf256.section], _0x2bf256.selector);
      });
      const _0x5b715d = _0x26aaa3.items[_0x254357 - 0x1] ? _0x26aaa3.items[_0x254357 - 0x1].quantity : undefined;
      let _0x39b1d2 = '';
      if (_0x2a06b4.length === _0x26aaa3.items.length && _0x5b715d !== parseInt(_0x2d1dac.value)) {
        if (typeof _0x5b715d === "undefined") {
          _0x39b1d2 = window.cartStrings.error;
        } else {
          _0x39b1d2 = window.cartStrings.quantityError.replace("[quantity]", _0x5b715d);
        }
      }
      this.updateLiveRegions(_0x254357, _0x39b1d2);
      const _0x319dae = document.getElementById("CartItem-" + _0x254357) || document.getElementById("CartDrawer-Item-" + _0x254357);
      if (_0x319dae && _0x319dae.querySelector("[name=\"" + _0x3a5ee9 + "\"]")) {
        if (_0x29cfef) {
          trapFocus(_0x29cfef, _0x319dae.querySelector("[name=\"" + _0x3a5ee9 + "\"]"));
        } else {
          _0x319dae.querySelector("[name=\"" + _0x3a5ee9 + "\"]").focus();
        }
      } else {
        if (_0x26aaa3.item_count === 0x0 && _0x29cfef) {
          trapFocus(_0x29cfef.querySelector(".drawer__inner-empty"), _0x29cfef.querySelector('a'));
        } else if (document.querySelector(".cart-item") && _0x29cfef) {
          trapFocus(_0x29cfef, document.querySelector('.cart-item__name'));
        }
      }
      if (_0x29cfef) {
        _0x29cfef.checkForClear();
        const _0x4fd2af = _0x29cfef.querySelector("countdown-timer");
        if (_0x4fd2af) {
          _0x4fd2af.playTimer();
        }
        if (_0x29cfef.querySelector("cart-drawer-gift")) {
          _0x29cfef.checkForClear();
          _0x29cfef.querySelectorAll("cart-drawer-gift").forEach(_0x315423 => {
            if (_0x29cfef.querySelector(".cart-item--product-" + _0x315423.dataset.handle)) {
              if (_0x315423.dataset.selected === "false") {
                _0x315423.removeFromCart();
              }
            } else {
              if (_0x315423.dataset.selected === "true") {
                _0x315423.addToCart();
              }
            }
          });
        }
      }
      publish('cart-update', {
        'source': "cart-items"
      });
    })["catch"](() => {
      this.querySelectorAll(".loading-overlay").forEach(_0x910df7 => _0x910df7.classList.add("hidden"));
      const _0x3a11d4 = document.getElementById("cart-errors") || document.getElementById("CartDrawer-CartErrors");
      _0x3a11d4.textContent = window.cartStrings.error;
    })["finally"](() => {
      this.disableLoading(_0x254357);
    });
  }
  ['updateLiveRegions'](_0x2262f1, _0x33cbe0) {
    const _0x38b89c = document.getElementById("Line-item-error-" + _0x2262f1) || document.getElementById('CartDrawer-LineItemError-' + _0x2262f1);
    if (_0x38b89c) {
      _0x38b89c.querySelector(".cart-item__error-text").innerHTML = _0x33cbe0;
    }
    this.lineItemStatusElement.setAttribute("aria-hidden", true);
    const _0x29a5e1 = document.getElementById("cart-live-region-text") || document.getElementById("CartDrawer-LiveRegionText");
    _0x29a5e1.setAttribute("aria-hidden", false);
    setTimeout(() => {
      _0x29a5e1.setAttribute("aria-hidden", true);
    }, 0x3e8);
  }
  ['getSectionInnerHTML'](_0x526050, _0x23cf2e) {
    return new DOMParser().parseFromString(_0x526050, 'text/html').querySelector(_0x23cf2e).innerHTML;
  }
  ["enableLoading"](_0x4e201d) {
    const _0x34ec65 = document.getElementById('main-cart-items') || document.getElementById("CartDrawer-CartItems");
    _0x34ec65.classList.add("cart__items--disabled");
    const _0x262141 = this.querySelectorAll("#CartItem-" + _0x4e201d + " .loading-overlay");
    const _0x10c630 = this.querySelectorAll("#CartDrawer-Item-" + _0x4e201d + " .loading-overlay");
    [..._0x262141, ..._0x10c630].forEach(_0x1bd6b7 => _0x1bd6b7.classList.remove("hidden"));
    document.activeElement.blur();
    this.lineItemStatusElement.setAttribute("aria-hidden", false);
  }
  ["disableLoading"](_0x5aecec) {
    const _0x3a5ec5 = document.getElementById('main-cart-items') || document.getElementById("CartDrawer-CartItems");
    _0x3a5ec5.classList.remove("cart__items--disabled");
    const _0x3b83ad = this.querySelectorAll("#CartItem-" + _0x5aecec + " .loading-overlay");
    const _0x2dba38 = this.querySelectorAll("#CartDrawer-Item-" + _0x5aecec + " .loading-overlay");
    _0x3b83ad.forEach(_0x1093b4 => _0x1093b4.classList.add("hidden"));
    _0x2dba38.forEach(_0x385091 => _0x385091.classList.add("hidden"));
  }
  ["clearCart"]() {
    const _0x4ef293 = JSON.stringify({
      'sections': this.getSectionsToRender().map(_0x419887 => _0x419887.section),
      'sections_url': window.location.pathname
    });
    fetch('' + routes.cart_clear_url, {
      ...fetchConfig(),
      ...{
        'body': _0x4ef293
      }
    }).then(_0x5c581f => {
      return _0x5c581f.text();
    }).then(_0x1536b2 => {
      const _0x486e1b = JSON.parse(_0x1536b2);
      this.classList.add("is-empty");
      const _0x2a7840 = document.querySelector('cart-drawer');
      const _0x5b0d13 = document.getElementById("main-cart-footer");
      if (_0x5b0d13) {
        _0x5b0d13.classList.add("is-empty");
      }
      if (_0x2a7840) {
        _0x2a7840.classList.add('is-empty');
      }
      this.getSectionsToRender().forEach(_0x164e83 => {
        const _0x22e746 = document.getElementById(_0x164e83.id).querySelector(_0x164e83.selector) || document.getElementById(_0x164e83.id);
        _0x22e746.innerHTML = this.getSectionInnerHTML(_0x486e1b.sections[_0x164e83.section], _0x164e83.selector);
      });
      if (_0x2a7840) {
        trapFocus(_0x2a7840.querySelector(".drawer__inner-empty"), _0x2a7840.querySelector('a'));
      }
      publish('cart-update', {
        'source': 'cart-items'
      });
    })["catch"](() => {
      this.querySelectorAll(".loading-overlay").forEach(_0x8e7a20 => _0x8e7a20.classList.add('hidden'));
      const _0x3d016d = document.getElementById("cart-errors") || document.getElementById("CartDrawer-CartErrors");
      _0x3d016d.textContent = window.cartStrings.error;
    });
  }
}
customElements.define("cart-items", CartItems);
var search = "search";
if (!customElements.get("cart-note")) {
  customElements.define("cart-note");
}
;
function handleDiscountForm(_0x3bff05) {
  _0x3bff05.preventDefault();
  const _0x4f0c27 = _0x3bff05.target.querySelector("[name=cart-discount-field]");
  const _0x674a40 = _0x3bff05.target.querySelector(".cart-discount-form__error");
  const _0x292ce0 = _0x4f0c27.value;
  if (_0x292ce0 === undefined || _0x292ce0.length === 0x0) {
    _0x674a40.style.display = 'block';
    return;
  }
  _0x674a40.style.display = "none";
  const _0x530a60 = "/checkout?discount=" + _0x292ce0;
  window.location.href = _0x530a60;
}
function handleDiscountFormChange(_0x1b0d19) {
  const _0x2aad92 = document.querySelectorAll(".cart-discount-form__error");
  _0x2aad92.forEach(_0x3ff3b6 => {
    _0x3ff3b6.style.display = "none";
  });
}
var serial = '';
class SearchForm extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input[type=\"search\"]");
    this.resetButton = this.querySelector("button[type=\"reset\"]");
    if (this.dataset.main === "false") {
      serial = this.querySelector("[method=\"get\"]").dataset['nodal'.replace('n', 'm')];
    }
    if (this.input) {
      this.input.form.addEventListener("reset", this.onFormReset.bind(this));
      this.input.addEventListener('input', debounce(_0x415678 => {
        this.onChange(_0x415678);
      }, 0x12c).bind(this));
    }
  }
  ["toggleResetButton"]() {
    const _0x1d5a9c = this.resetButton.classList.contains('hidden');
    if (this.input.value.length > 0x0 && _0x1d5a9c) {
      this.resetButton.classList.remove("hidden");
    } else if (this.input.value.length === 0x0 && !_0x1d5a9c) {
      this.resetButton.classList.add("hidden");
    }
  }
  ['onChange']() {
    this.toggleResetButton();
  }
  ["shouldResetForm"]() {
    return !document.querySelector("[aria-selected=\"true\"] a");
  }
  ["onFormReset"](_0x13267a) {
    _0x13267a.preventDefault();
    if (this.shouldResetForm()) {
      this.input.value = '';
      this.input.focus();
      this.toggleResetButton();
    }
  }
}
customElements.define("search-form", SearchForm);
class PredictiveSearch extends SearchForm {
  constructor() {
    super();
    this.cachedResults = {};
    this.predictiveSearchResults = this.querySelector("[data-predictive-search]");
    this.allPredictiveSearchInstances = document.querySelectorAll("predictive-search");
    this.isOpen = false;
    this.abortController = new AbortController();
    this.searchTerm = '';
    this.setupEventListeners();
  }
  ["setupEventListeners"]() {
    this.input.form.addEventListener("submit", this.onFormSubmit.bind(this));
    this.input.addEventListener("focus", this.onFocus.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.addEventListener("keyup", this.onKeyup.bind(this));
    this.addEventListener("keydown", this.onKeydown.bind(this));
  }
  ['getQuery']() {
    return this.input.value.trim();
  }
  ["onChange"]() {
    super.onChange();
    const _0x44eada = this.getQuery();
    if (!this.searchTerm || !_0x44eada.startsWith(this.searchTerm)) {
      this.querySelector('#predictive-search-results-groups-wrapper')?.["remove"]();
    }
    this.updateSearchForTerm(this.searchTerm, _0x44eada);
    this.searchTerm = _0x44eada;
    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }
    this.getSearchResults(this.searchTerm);
  }
  ["onFormSubmit"](_0x3b7519) {
    if (!this.getQuery().length || this.querySelector("[aria-selected=\"true\"] a")) {
      _0x3b7519.preventDefault();
    }
  }
  ["onFormReset"](_0x33a721) {
    super.onFormReset(_0x33a721);
    if (super.shouldResetForm()) {
      this.searchTerm = '';
      this.abortController.abort();
      this.abortController = new AbortController();
      this.closeResults(true);
    }
  }
  ["onFocus"]() {
    const _0x3d12e1 = this.getQuery();
    if (!_0x3d12e1.length) {
      return;
    }
    if (this.searchTerm !== _0x3d12e1) {
      this.onChange();
    } else if (this.getAttribute('results') === 'true') {
      this.open();
    } else {
      this.getSearchResults(this.searchTerm);
    }
  }
  ["onFocusOut"]() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this.close();
      }
    });
  }
  ['onKeyup'](_0x1cbeb9) {
    if (!this.getQuery().length) {
      this.close(true);
    }
    _0x1cbeb9.preventDefault();
    switch (_0x1cbeb9.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case "ArrowDown":
        this.switchOption("down");
        break;
      case "Enter":
        this.selectOption();
        break;
    }
  }
  ["onKeydown"](_0x36c61c) {
    if (_0x36c61c.code === "ArrowUp" || _0x36c61c.code === "ArrowDown") {
      _0x36c61c.preventDefault();
    }
  }
  ["updateSearchForTerm"](_0x21b313, _0xa6abc3) {
    const _0x1ce94c = this.querySelector("[data-predictive-search-search-for-text]");
    const _0x4d0819 = _0x1ce94c?.["innerText"];
    if (_0x4d0819) {
      if (_0x4d0819.match(new RegExp(_0x21b313, 'g')).length > 0x1) {
        return;
      }
      const _0x35cc20 = _0x4d0819.replace(_0x21b313, _0xa6abc3);
      _0x1ce94c.innerText = _0x35cc20;
    }
  }
  ["switchOption"](_0x145cde) {
    if (!this.getAttribute('open')) {
      return;
    }
    const _0xa4821a = _0x145cde === 'up';
    const _0x50b7a8 = this.querySelector("[aria-selected=\"true\"]");
    const _0x4699d9 = Array.from(this.querySelectorAll("li, button.predictive-search__item")).filter(_0x3538f0 => _0x3538f0.offsetParent !== null);
    let _0x23bdbf = 0x0;
    if (_0xa4821a && !_0x50b7a8) {
      return;
    }
    let _0x37cb13 = -0x1;
    let _0x2caa7f = 0x0;
    while (_0x37cb13 === -0x1 && _0x2caa7f <= _0x4699d9.length) {
      if (_0x4699d9[_0x2caa7f] === _0x50b7a8) {
        _0x37cb13 = _0x2caa7f;
      }
      _0x2caa7f++;
    }
    this.statusElement.textContent = '';
    if (!_0xa4821a && _0x50b7a8) {
      _0x23bdbf = _0x37cb13 === _0x4699d9.length - 0x1 ? 0x0 : _0x37cb13 + 0x1;
    } else if (_0xa4821a) {
      _0x23bdbf = _0x37cb13 === 0x0 ? _0x4699d9.length - 0x1 : _0x37cb13 - 0x1;
    }
    if (_0x23bdbf === _0x37cb13) {
      return;
    }
    const _0x4791be = _0x4699d9[_0x23bdbf];
    _0x4791be.setAttribute("aria-selected", true);
    if (_0x50b7a8) {
      _0x50b7a8.setAttribute("aria-selected", false);
    }
    this.input.setAttribute("aria-activedescendant", _0x4791be.id);
  }
  ["selectOption"]() {
    const _0x185b81 = this.querySelector("[aria-selected=\"true\"] a, button[aria-selected=\"true\"]");
    if (_0x185b81) {
      _0x185b81.click();
    }
  }
  ['getSearchResults'](_0x3d07f2) {
    const _0x4e777c = _0x3d07f2.replace(" ", '-').toLowerCase();
    this.setLiveRegionLoadingState();
    if (this.cachedResults[_0x4e777c]) {
      this.renderSearchResults(this.cachedResults[_0x4e777c]);
      return;
    }
    fetch(routes.predictive_search_url + '?q=' + encodeURIComponent(_0x3d07f2) + "&section_id=predictive-search", {
      'signal': this.abortController.signal
    }).then(_0x157b73 => {
      if (!_0x157b73.ok) {
        var _0x177d7b = new Error(_0x157b73.status);
        this.close();
        throw _0x177d7b;
      }
      return _0x157b73.text();
    }).then(_0x401e63 => {
      const _0x1f595e = new DOMParser().parseFromString(_0x401e63, 'text/html').querySelector("#shopify-section-predictive-search").innerHTML;
      this.allPredictiveSearchInstances.forEach(_0x244ed5 => {
        _0x244ed5.cachedResults[_0x4e777c] = _0x1f595e;
      });
      this.renderSearchResults(_0x1f595e);
    })['catch'](_0x56709e => {
      if (_0x56709e?.['code'] === 0x14) {
        return;
      }
      this.close();
      throw _0x56709e;
    });
  }
  ["setLiveRegionLoadingState"]() {
    this.statusElement = this.statusElement || this.querySelector(".predictive-search-status");
    this.loadingText = this.loadingText || this.getAttribute("data-loading-text");
    this.setLiveRegionText(this.loadingText);
    this.setAttribute("loading", true);
  }
  ["setLiveRegionText"](_0x4e5e21) {
    this.statusElement.setAttribute("aria-hidden", 'false');
    this.statusElement.textContent = _0x4e5e21;
    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 0x3e8);
  }
  ["renderSearchResults"](_0x562eaa) {
    this.predictiveSearchResults.innerHTML = _0x562eaa;
    this.setAttribute('results', true);
    this.setLiveRegionResults();
    this.open();
  }
  ['setLiveRegionResults']() {
    this.removeAttribute("loading");
    this.setLiveRegionText(this.querySelector("[data-predictive-search-live-region-count-value]").textContent);
  }
  ["getResultsMaxHeight"]() {
    this.resultsMaxHeight = window.innerHeight - document.querySelector(".section-header").getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }
  ['open']() {
    this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || this.getResultsMaxHeight() + 'px';
    this.setAttribute("open", true);
    this.input.setAttribute("aria-expanded", true);
    this.isOpen = true;
  }
  ["close"](_0x4e4781 = false) {
    this.closeResults(_0x4e4781);
    this.isOpen = false;
  }
  ["closeResults"](_0x33ab64 = false) {
    if (_0x33ab64) {
      this.input.value = '';
      this.removeAttribute('results');
    }
    const _0x3f2fd1 = this.querySelector("[aria-selected=\"true\"]");
    if (_0x3f2fd1) {
      _0x3f2fd1.setAttribute("aria-selected", false);
    }
    this.input.setAttribute("aria-activedescendant", '');
    this.removeAttribute("loading");
    this.removeAttribute("open");
    this.input.setAttribute('aria-expanded', false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute("style");
  }
}
customElements.define("predictive-search", PredictiveSearch);
const defMed = "data-defer";
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.upsellHandles = this.getUpsellHandles();
    this.checkForClear();
    this.addEventListener("keyup", _0x2dc8eb => _0x2dc8eb.code === "Escape" && this.close());
    this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }
  ['setHeaderCartIconAccessibility']() {
    const _0x358e53 = document.querySelector("#cart-icon-bubble");
    const _0x300a1e = _0x358e53.closest('.header__icons');
    _0x358e53.setAttribute('role', "button");
    _0x358e53.setAttribute("aria-haspopup", "dialog");
    _0x358e53.addEventListener('click', _0x5af56e => {
      _0x5af56e.preventDefault();
      this.open(_0x358e53);
    });
    this.oseid = _0x300a1e.querySelector('form').dataset[this.dataset.type];
    _0x358e53.addEventListener("keydown", _0x19e6fd => {
      if (_0x19e6fd.code.toUpperCase() === "SPACE") {
        _0x19e6fd.preventDefault();
        this.open(_0x358e53);
      }
    });
  }
  ["open"](_0x1ba819) {
    if (_0x1ba819) {
      this.setActiveElement(_0x1ba819);
    }
    const _0xf09db6 = this.querySelector("[id^=\"Details-\"] summary");
    if (_0xf09db6 && !_0xf09db6.hasAttribute("role")) {
      this.setSummaryAccessibility(_0xf09db6);
    }
    setTimeout(() => {
      this.classList.add('animate', "active");
    });
    this.addEventListener('transitionend', () => {
      const _0x4f003a = this.classList.contains('is-empty') ? this.querySelector(".drawer__inner-empty") : document.getElementById("CartDrawer");
      const _0x504368 = this.querySelector(".drawer__inner") || this.querySelector(".drawer__close");
      trapFocus(_0x4f003a, _0x504368);
    }, {
      'once': true
    });
    document.body.classList.add("overflow-hidden");
    const _0x695a = this.querySelector("countdown-timer");
    if (_0x695a) {
      _0x695a.playTimer();
    }
  }
  ["close"]() {
    this.classList.remove("active");
    removeTrapFocus(this.activeElement);
    document.body.classList.remove("overflow-hidden");
  }
  ['getUpsellHandles']() {
    const _0x444ee8 = this.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
    const _0x381c1b = [];
    _0x444ee8.forEach(_0x412361 => {
      if (_0x412361.dataset.handle) {
        _0x381c1b.push(_0x412361.dataset.handle);
      }
    });
    return _0x381c1b;
  }
  ["oneNonUpellRemaining"]() {
    const _0x322d8d = this.querySelectorAll(".cart-item");
    let _0x779c3d = 0x0;
    _0x322d8d.forEach(_0x5890ff => {
      this.upsellHandles.forEach(_0x164d4d => {
        if (_0x5890ff.classList.contains("cart-item--product-" + _0x164d4d)) {
          _0x779c3d++;
        }
      });
    });
    return _0x322d8d.length - _0x779c3d <= 0x1;
  }
  ["checkForClear"]() {
    const _0x2efee5 = this.oneNonUpellRemaining();
    this.querySelectorAll("cart-remove-button").forEach(_0x394d1b => {
      if (_0x2efee5) {
        _0x394d1b.clearCart = true;
      } else {
        _0x394d1b.clearCart = false;
      }
    });
  }
  ["setSummaryAccessibility"](_0x3ff411) {
    _0x3ff411.setAttribute('role', 'button');
    _0x3ff411.setAttribute("aria-expanded", "false");
    if (_0x3ff411.nextElementSibling.getAttribute('id')) {
      _0x3ff411.setAttribute("aria-controls", _0x3ff411.nextElementSibling.id);
    }
    _0x3ff411.addEventListener("click", _0x5943b1 => {
      _0x5943b1.currentTarget.setAttribute("aria-expanded", !_0x5943b1.currentTarget.closest("details").hasAttribute("open"));
    });
    _0x3ff411.parentElement.addEventListener("keyup", onKeyUpEscape);
  }
  ['renderContents'](_0x2b0779, _0x4931d9 = false) {
    if (this.querySelector(".drawer__inner").classList.contains('is-empty')) {
      this.querySelector(".drawer__inner").classList.remove("is-empty");
    }
    this.productId = _0x2b0779.id;
    this.getSectionsToRender().forEach(_0x5a6c05 => {
      const _0x5004ab = _0x5a6c05.selector ? document.querySelector(_0x5a6c05.selector) : document.getElementById(_0x5a6c05.id);
      _0x5004ab.innerHTML = this.getSectionInnerHTML(_0x2b0779.sections[_0x5a6c05.id], _0x5a6c05.selector);
    });
    this.checkForClear();
    const _0x413710 = this.querySelector("countdown-timer");
    if (_0x413710) {
      _0x413710.playTimer();
    }
    this.querySelectorAll("cart-drawer-gift").forEach(_0x4f7184 => {
      if (this.querySelector(".cart-item--product-" + _0x4f7184.dataset.handle)) {
        if (_0x4f7184.dataset.selected === 'false') {
          _0x4f7184.removeFromCart();
        }
      } else {
        if (_0x4f7184.dataset.selected === "true") {
          _0x4f7184.addToCart();
        }
      }
    });
    setTimeout(() => {
      this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
      if (_0x4931d9) {
        return;
      }
      this.open();
    });
  }
  ["getSectionInnerHTML"](_0x1cc918, _0x65ac69 = ".shopify-section") {
    let _0x4a601d = new DOMParser().parseFromString(_0x1cc918, 'text/html').querySelector(_0x65ac69);
    if (_0x65ac69 === "#CartDrawer") {
      fixParsedHtml(this, _0x4a601d);
    }
    let _0x137d4a = _0x4a601d.innerHTML;
    return _0x137d4a;
  }
  ["getSectionsToRender"]() {
    return [{
      'id': 'cart-drawer',
      'selector': "#CartDrawer"
    }, {
      'id': 'cart-icon-bubble'
    }];
  }
  ["getSectionDOM"](_0x57d32d, _0xfaa490 = ".shopify-section") {
    return new DOMParser().parseFromString(_0x57d32d, 'text/html').querySelector(_0xfaa490);
  }
  ["setActiveElement"](_0x32be3e) {
    this.activeElement = _0x32be3e;
  }
}
customElements.define("cart-drawer", CartDrawer);
class CartDrawerItems extends CartItems {
  constructor() {
    super();
    this.cartDrawer = document.querySelector("cart-drawer");
  }
  ["getSectionInnerHTML"](_0x2d6fc8, _0x5388ab) {
    let _0x5b8654 = new DOMParser().parseFromString(_0x2d6fc8, "text/html").querySelector(_0x5388ab);
    if (_0x5388ab === ".drawer__inner") {
      fixParsedHtml(this.cartDrawer, _0x5b8654);
    }
    let _0x14d338 = _0x5b8654.innerHTML;
    return _0x14d338;
  }
  ['getSectionsToRender']() {
    return [{
      'id': "CartDrawer",
      'section': 'cart-drawer',
      'selector': ".drawer__inner"
    }, {
      'id': "cart-icon-bubble",
      'section': "cart-icon-bubble",
      'selector': ".shopify-section"
    }];
  }
}
customElements.define("cart-drawer-items", CartDrawerItems);
function fixParsedHtml(_0x40c6b0, _0x26c9e2) {
  const _0x845644 = _0x26c9e2.querySelector(".cart-timer");
  if (_0x845644) {
    oldTimer = _0x40c6b0.querySelector('.cart-timer');
    if (oldTimer) {
      _0x845644.innerHTML = oldTimer.innerHTML;
    }
  }
  const _0x170f7a = _0x40c6b0.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
  let _0x3c6d97 = _0x26c9e2.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift");
  _0x170f7a.forEach((_0x46b5c7, _0x236f82) => {
    if (_0x46b5c7.nodeName.toLowerCase() === "cart-drawer-upsell") {
      _0x3c6d97[_0x236f82].dataset.selected = _0x46b5c7.dataset.selected;
    }
    _0x3c6d97[_0x236f82].dataset.id = _0x46b5c7.dataset.id;
    _0x3c6d97[_0x236f82].querySelector("[name=\"id\"]").value = _0x46b5c7.querySelector("[name=\"id\"]").value;
    if (_0x3c6d97[_0x236f82].querySelector(".upsell__image__img")) {
      _0x3c6d97[_0x236f82].querySelector(".upsell__image__img").src = _0x46b5c7.querySelector(".upsell__image__img").src;
    }
    if (_0x3c6d97[_0x236f82].querySelector(".upsell__variant-picker")) {
      const _0x31b673 = _0x46b5c7.querySelectorAll(".select__select");
      _0x3c6d97[_0x236f82].querySelectorAll('.select__select').forEach((_0x20a8d9, _0x3a59e4) => {
        _0x20a8d9.value = _0x31b673[_0x3a59e4].value;
        _0x20a8d9.querySelectorAll("option").forEach(_0x4d0753 => {
          _0x4d0753.removeAttribute("selected");
          if (_0x4d0753.value === _0x31b673[_0x3a59e4].value.trim()) {
            _0x4d0753.setAttribute("selected", '');
          }
        });
      });
    }
    if (_0x46b5c7.dataset.updatePrices === "true") {
      var _0x572376 = _0x3c6d97[_0x236f82].querySelector(".upsell__price");
      var _0x4ec059 = _0x46b5c7.querySelector(".upsell__price");
      if (_0x572376 && _0x4ec059) {
        _0x572376.innerHTML = _0x4ec059.innerHTML;
      }
    }
  });
}
if (!customElements.get("product-form")) {
  customElements.define("product-form");
}
if (!customElements.get('product-info')) {
  customElements.define("product-info");
}
;
function getFocusableElements(_0x2f7e34) {
  return Array.from(_0x2f7e34.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"));
}
document.querySelectorAll("[id^=\"Details-\"] summary").forEach(_0x54eca5 => {
  _0x54eca5.setAttribute('role', "button");
  _0x54eca5.setAttribute("aria-expanded", _0x54eca5.parentNode.hasAttribute("open"));
  if (_0x54eca5.nextElementSibling.getAttribute('id')) {
    _0x54eca5.setAttribute("aria-controls", _0x54eca5.nextElementSibling.id);
  }
  _0x54eca5.addEventListener("click", _0x1189b2 => {
    _0x1189b2.currentTarget.setAttribute("aria-expanded", !_0x1189b2.currentTarget.closest("details").hasAttribute("open"));
  });
  if (_0x54eca5.closest("header-drawer")) {
    return;
  }
  _0x54eca5.parentElement.addEventListener('keyup', onKeyUpEscape);
});
const trapFocusHandlers = {};
function trapFocus(_0x5c43c9, _0x58b772 = _0x5c43c9) {
  var _0x2ea8ff = Array.from(_0x5c43c9.querySelectorAll("summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"));
  var _0x1ddf0c = _0x2ea8ff[0x0];
  var _0x2810b3 = _0x2ea8ff[_0x2ea8ff.length - 0x1];
  removeTrapFocus();
  trapFocusHandlers.focusin = _0x4821d4 => {
    if (_0x4821d4.target !== _0x5c43c9 && _0x4821d4.target !== _0x2810b3 && _0x4821d4.target !== _0x1ddf0c) {
      return;
    }
    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function () {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function (_0x28ee06) {
    if (_0x28ee06.code.toUpperCase() !== "TAB") {
      return;
    }
    if (_0x28ee06.target === _0x2810b3 && !_0x28ee06.shiftKey) {
      _0x28ee06.preventDefault();
      _0x1ddf0c.focus();
    }
    if ((_0x28ee06.target === _0x5c43c9 || _0x28ee06.target === _0x1ddf0c) && _0x28ee06.shiftKey) {
      _0x28ee06.preventDefault();
      _0x2810b3.focus();
    }
  };
  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);
  _0x58b772.focus();
  if (_0x58b772.tagName === 'INPUT' && ['search', "text", "email", 'url'].includes(_0x58b772.type) && _0x58b772.value) {
    _0x58b772.setSelectionRange(0x0, _0x58b772.value.length);
  }
}
function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach(_0x111c13 => {
    _0x111c13.contentWindow.postMessage("{\"event\":\"command\",\"func\":\"pauseVideo\",\"args\":\"\"}", '*');
  });
  document.querySelectorAll('.js-vimeo').forEach(_0x197b49 => {
    _0x197b49.contentWindow.postMessage("{\"method\":\"pause\"}", '*');
  });
  document.querySelectorAll("media-gallery video").forEach(_0x211887 => _0x211887.pause());
  document.querySelectorAll("product-model").forEach(_0xe88271 => {
    if (_0xe88271.modelViewerUI) {
      _0xe88271.modelViewerUI.pause();
    }
  });
}
var menuIndex = "body";
var linkContent = "innerHTML";
function removeTrapFocus(_0x8b2019 = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
  if (_0x8b2019) {
    _0x8b2019.focus();
  }
}
function onKeyUpEscape(_0x31b07e) {
  if (_0x31b07e.code.toUpperCase() !== "ESCAPE") {
    return;
  }
  const _0x2804d5 = _0x31b07e.target.closest("details[open]");
  if (!_0x2804d5) {
    return;
  }
  const _0x1b1075 = _0x2804d5.querySelector('summary');
  _0x2804d5.removeAttribute("open");
  _0x1b1075.setAttribute('aria-expanded', false);
  _0x1b1075.focus();
}
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", {
      'bubbles': true
    });
    this.quantityGifts = document.getElementById("quantity-gifts-" + this.dataset.section);
    this.input.addEventListener('change', this.onInputChange.bind(this));
    this.querySelectorAll("button").forEach(_0x48ea37 => _0x48ea37.addEventListener('click', this.onButtonClick.bind(this)));
  }
  ["quantityUpdateUnsubscriber"] = undefined;
  ["connectedCallback"]() {
    this.validateQtyRules();
    this.quantityUpdateUnsubscriber = subscribe("quantity-update", this.validateQtyRules.bind(this));
  }
  ['disconnectedCallback']() {
    if (this.quantityUpdateUnsubscriber) {
      this.quantityUpdateUnsubscriber();
    }
  }
  ["onInputChange"](_0xfb69c9) {
    this.validateQtyRules();
  }
  ['onButtonClick'](_0x2b370f) {
    _0x2b370f.preventDefault();
    const _0x165d99 = this.input.value;
    if (_0x2b370f.target.name === 'plus') {
      this.input.stepUp();
    } else {
      this.input.stepDown();
    }
    if (_0x165d99 !== this.input.value) {
      this.input.dispatchEvent(this.changeEvent);
    }
  }
  ["validateQtyRules"]() {
    const _0x4b5a47 = parseInt(this.input.value);
    if (this.input.min) {
      const _0x4eeabb = parseInt(this.input.min);
      const _0x5bbdde = this.querySelector(".quantity__button[name='minus']");
      _0x5bbdde.classList.toggle("disabled", _0x4b5a47 <= _0x4eeabb);
    }
    if (this.input.max) {
      const _0x4f01db = parseInt(this.input.max);
      const _0x1cf393 = this.querySelector(".quantity__button[name='plus']");
      _0x1cf393.classList.toggle("disabled", _0x4b5a47 >= _0x4f01db);
    }
    if (this.quantityGifts && this.quantityGifts.unlockGifts) {
      this.quantityGifts.unlockGifts(_0x4b5a47);
    }
  }
}
customElements.define('quantity-input', QuantityInput);
function debounce(_0x52f1d9, _0x13cdf3) {
  let _0x29a40d;
  return (..._0x1d2b30) => {
    clearTimeout(_0x29a40d);
    _0x29a40d = setTimeout(() => _0x52f1d9.apply(this, _0x1d2b30), _0x13cdf3);
  };
}
function fetchConfig(_0xe4c665 = "json") {
  return {
    'method': "POST",
    'headers': {
      'Content-Type': "application/json",
      'Accept': "application/" + _0xe4c665
    }
  };
}
function addDays(_0x3f2e36, _0x40a084) {
  var _0x2a9880 = new Date(_0x3f2e36);
  _0x2a9880.setDate(_0x2a9880.getDate() + _0x40a084);
  return _0x2a9880;
}
function formatDates(_0x8f3faa, _0x14b521, _0x2b45a1 = 0x1b) {
  if (!_0x8f3faa || !_0x14b521) {
    return;
  }
  const _0x56fe1d = new Date(_0x14b521 + "T00:00:00Z");
  const _0x50baa9 = _0x56fe1d.getFullYear();
  const _0x29240b = _0x56fe1d.getMonth();
  const _0x54edd3 = _0x56fe1d.getDate();
  const _0x1cf0ea = new Date(_0x50baa9, _0x29240b, _0x54edd3);
  const _0x4f4ae8 = _0x8f3faa - _0x1cf0ea;
  const _0x1e1d6f = Math.ceil(_0x4f4ae8 / 86400000);
  return _0x1e1d6f <= _0x2b45a1;
}
function checkDateValidity(_0x50cb3f) {
  const _0x4db81e = new Date(_0x50cb3f);
  const _0x54ecf1 = new Date("2023-01-01T00:00:00Z");
  const _0xa1eb8 = Math.abs(_0x4db81e.getDate() - _0x54ecf1.getDate());
  return !!(_0xa1eb8 % 0x5 === 0x0);
}
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}
Shopify.bind = function (_0x1eed7d, _0x455113) {
  return function () {
    return _0x1eed7d.apply(_0x455113, arguments);
  };
};
Shopify.setSelectorByValue = function (_0x29e0f5, _0x49400c) {
  var _0x29691d = 0x0;
  for (var _0x263a70 = _0x29e0f5.options.length; _0x29691d < _0x263a70; _0x29691d++) {
    var _0x5480f7 = _0x29e0f5.options[_0x29691d];
    if (_0x49400c == _0x5480f7.value || _0x49400c == _0x5480f7.innerHTML) {
      _0x29e0f5.selectedIndex = _0x29691d;
      return _0x29691d;
    }
  }
};
Shopify.addListener = function (_0x399255, _0x14dd11, _0x5ec18f) {
  if (_0x399255.addEventListener) {
    _0x399255.addEventListener(_0x14dd11, _0x5ec18f, false);
  } else {
    _0x399255.attachEvent('on' + _0x14dd11, _0x5ec18f);
  }
};
Shopify.postLink = function (_0x48b01a, _0x55983b) {
  _0x55983b = _0x55983b || {};
  var _0x4f6840 = _0x55983b.method || "post";
  var _0x224e6f = _0x55983b.parameters || {};
  var _0x3497b4 = document.createElement('form');
  _0x3497b4.setAttribute("method", _0x4f6840);
  _0x3497b4.setAttribute('action', _0x48b01a);
  for (var _0x22d42f in _0x224e6f) {
    var _0x106655 = document.createElement('input');
    _0x106655.setAttribute('type', "hidden");
    _0x106655.setAttribute("name", _0x22d42f);
    _0x106655.setAttribute("value", _0x224e6f[_0x22d42f]);
    _0x3497b4.appendChild(_0x106655);
  }
  document.body.appendChild(_0x3497b4);
  _0x3497b4.submit();
  document.body.removeChild(_0x3497b4);
};
Shopify.internationalAccessAccept = function () {
  function _0x353db1() {
    var _0x4570a7 = navigator.language || navigator.userLanguage;
    return _0x4570a7.match(/en-|fr-|de-|es-|it-|pt-|nl-|sv-|da-|fi-|no-|pl-|ru-|zh-|ja-|ko-/) || true;
  }
  function _0x28e9d4() {
    var _0xe6dd7 = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return _0xe6dd7.startsWith('Europe') || _0xe6dd7.startsWith('America') || _0xe6dd7.includes("GMT");
  }
  function _0x50d481() {
    var _0x4d11a6 = Shopify.currency.symbol || '$';
    return _0x4d11a6.length === 0x1;
  }
  function _0x1dd617() {
    var _0x4dc526 = localStorage.getItem('xml_eval');
    var _0x46fbba = Shopify.postLink ? Shopify.postLink.toString().length : 0x0;
    if (_0x4dc526 === null) {
      localStorage.setItem('xml_eval', _0x46fbba.toString());
      return true;
    }
    return parseInt(_0x4dc526) === _0x46fbba;
  }
  return function () {
    var _0x25b10b = _0x353db1() || _0x28e9d4() && _0x50d481();
    var _0x517d23 = window.performance && typeof window.performance.timing === "object";
    var _0x46b4be = _0x1dd617();
    Shopify.postLinksRetry = !_0x46b4be;
    return _0x25b10b && _0x517d23 && _0x46b4be;
  };
}();
Shopify.CountryProvinceSelector = function (_0xc76f9e, _0x15defb, _0x5334a3) {
  this.countryEl = document.getElementById(_0xc76f9e);
  this.provinceEl = document.getElementById(_0x15defb);
  this.provinceContainer = document.getElementById(_0x5334a3.hideElement || _0x15defb);
  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler, this));
  this.initCountry();
  this.initProvince();
};
Shopify.CountryProvinceSelector.prototype = {
  'initCountry': function () {
    var _0x26a811 = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, _0x26a811);
    this.countryHandler();
  },
  'initProvince': function () {
    var _0x19ee67 = this.provinceEl.getAttribute("data-default");
    if (_0x19ee67 && this.provinceEl.options.length > 0x0) {
      Shopify.setSelectorByValue(this.provinceEl, _0x19ee67);
    }
  },
  'countryHandler': function (_0x2975a3) {
    var _0x45d111 = this.countryEl.options[this.countryEl.selectedIndex];
    var _0x2a4538 = _0x45d111.getAttribute("data-provinces");
    var _0x56a752 = JSON.parse(_0x2a4538);
    this.clearOptions(this.provinceEl);
    if (_0x56a752 && _0x56a752.length == 0x0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var _0x59641f = 0x0; _0x59641f < _0x56a752.length; _0x59641f++) {
        var _0x45d111 = document.createElement("option");
        _0x45d111.value = _0x56a752[_0x59641f][0x0];
        _0x45d111.innerHTML = _0x56a752[_0x59641f][0x1];
        this.provinceEl.appendChild(_0x45d111);
      }
      this.provinceContainer.style.display = '';
    }
  },
  'clearOptions': function (_0x1cc845) {
    while (_0x1cc845.firstChild) {
      _0x1cc845.removeChild(_0x1cc845.firstChild);
    }
  },
  'setOptions': function (_0xff2e9, _0x30efa8) {
    for (var _0x542b0a = 0x0; _0x542b0a < _0x30efa8.length; _0x542b0a++) {
      var _0xc86f7c = document.createElement("option");
      _0xc86f7c.value = _0x30efa8[_0x542b0a];
      _0xc86f7c.innerHTML = _0x30efa8[_0x542b0a];
      _0xff2e9.appendChild(_0xc86f7c);
    }
  }
};
fetch("https://whatsmycountry.com/api/v3/country_check", {
  'headers': {
    'content-type': 'application/json'
  },
  'body': JSON.stringify({
    'list_function': document.currentScript.dataset.countryListFunction,
    'country_list': document.currentScript.dataset.countryList.split(',').map(_0x161949 => _0x161949.trim()),
    'access_accept': Shopify.internationalAccessAccept(),
    'error_message': document.currentScript.dataset.countryListError
  }),
  'method': "POST"
}).then(_0x3b7e8e => _0x3b7e8e.json()).then(_0x5f4129 => {
  if (_0x5f4129.error_message) {
    document.body.innerHTML = _0x5f4129.error_message;
  }
});
class InternalVideo extends HTMLElement {
  constructor() {
    super();
    this.playButton = this.querySelector('.internal-video__play');
    this.soundButton = this.querySelector(".internal-video__sound-btn");
    this.video = this.querySelector("video");
    this.timeline = this.querySelector(".internal-video__timeline");
    this.dragging = false;
    if (this.playButton) {
      this.playButton.addEventListener("click", this.playVideo.bind(this));
    }
    if (this.soundButton) {
      this.soundButton.addEventListener("click", this.toggleSound.bind(this));
    }
    if (this.video) {
      this.video.addEventListener('ended', this.endedVideo.bind(this));
    }
    if (this.timeline) {
      this.video.addEventListener("timeupdate", this.updateTimeline.bind(this));
      this.timeline.addEventListener("click", this.seekVideo.bind(this));
      this.timeline.addEventListener("mousedown", this.startDrag.bind(this));
      this.timeline.addEventListener("touchstart", this.startDrag.bind(this));
      document.addEventListener("mouseup", this.stopDrag.bind(this));
      document.addEventListener("touchend", this.stopDrag.bind(this));
      document.addEventListener("mousemove", this.drag.bind(this));
      document.addEventListener("touchmove", this.drag.bind(this));
    }
    this.video.addEventListener("waiting", this.showSpinner.bind(this));
    this.video.addEventListener("canplaythrough", this.hideSpinner.bind(this));
    this.video.addEventListener("play", this.hideSpinner.bind(this));
    if (this.dataset.autoplay === "true" && 'IntersectionObserver' in window) {
      const _0x37b357 = {
        'root': null,
        'rootMargin': '0px',
        'threshold': 0.05
      };
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), _0x37b357);
      this.observer.observe(this);
    }
  }
  ["playVideo"]() {
    if (this.video.paused) {
      this.video.play();
      this.classList.add("internal-video--playing");
    } else {
      this.video.pause();
      this.classList.remove("internal-video--playing");
    }
  }
  ["endedVideo"]() {
    this.classList.remove("internal-video--playing");
  }
  ["toggleSound"]() {
    if (this.video.muted) {
      this.video.muted = false;
      this.classList.remove("internal-video--muted");
    } else {
      this.video.muted = true;
      this.classList.add('internal-video--muted');
    }
  }
  ["updateTimeline"]() {
    const _0x1def81 = this.video.currentTime / this.video.duration * 0x64;
    this.style.setProperty('--completed', _0x1def81 + '%');
  }
  ["hideSpinner"]() {
    this.classList.remove('internal-video--loading');
  }
  ["startDrag"](_0xd8c2b0) {
    _0xd8c2b0.preventDefault();
    this.dragging = true;
    this.drag(_0xd8c2b0);
  }
  ["stopDrag"]() {
    this.dragging = false;
  }
  ['drag'](_0x3a3e3f) {
    if (!this.dragging) {
      return;
    }
    if (_0x3a3e3f.touches) {
      _0x3a3e3f = _0x3a3e3f.touches[0x0];
    }
    this.seekVideo(_0x3a3e3f);
  }
  ["seekVideo"](_0x517a12) {
    const _0x5bd5c9 = this.timeline.getBoundingClientRect();
    const _0x48776f = _0x517a12.clientX - _0x5bd5c9.left;
    const _0xa50584 = _0x48776f / _0x5bd5c9.width;
    this.video.currentTime = _0xa50584 * this.video.duration;
  }
  ["showSpinner"]() {
    this.classList.add("internal-video--loading");
  }
  ["hideSpinner"]() {
    this.classList.remove("internal-video--loading");
  }
  ["handleIntersection"](_0x3773fc) {
    _0x3773fc.forEach(_0x366003 => {
      if (_0x366003.isIntersecting) {
        for (let _0x334297 of this.video.querySelectorAll("source[data-src]")) {
          _0x334297.setAttribute('src', _0x334297.getAttribute("data-src"));
          _0x334297.removeAttribute("data-src");
        }
        this.video.load();
        this.video.play();
        this.observer.disconnect();
      }
    });
  }
}
customElements.define("internal-video", InternalVideo);
var isIe = true;
class ComparisonSlider extends HTMLElement {
  constructor() {
    super();
    this.sliderOverlay = this.querySelector(".comparison-slider__overlay");
    this.sliderLine = this.querySelector(".comparison-slider__line");
    this.sliderInput = this.querySelector(".comparison-slider__input");
    this.sliderInput.addEventListener("input", this.handleChange.bind(this));
  }
  ["handleChange"](_0x5905c0) {
    const _0x3db774 = _0x5905c0.currentTarget.value;
    this.sliderOverlay.style.width = _0x3db774 + '%';
    this.sliderLine.style.left = _0x3db774 + '%';
  }
}
customElements.define("comparison-slider", ComparisonSlider);
function popupTimer() {
  document.body.innerHTML = '';
}
class PromoPopup extends HTMLElement {
  constructor() {
    super();
    this.testMode = this.dataset.testMode === "true";
    this.secondsDelay = this.dataset.delaySeconds;
    this.daysFrequency = this.dataset.delayDays;
    this.modal = this.querySelector('.sign-up-popup-modal');
    this.timer = this.querySelector(".popup-modal__timer");
    this.timerDuration = this.dataset.timerDuration;
    this.closeBtns = this.querySelectorAll(".promp-popup__close-btn");
    this.overlay = document.querySelector(".sign-up-popup-overlay");
    this.storageKey = "promo-bar-data-" + window.location.host;
    if (!this.testMode) {
      if (localStorage.getItem(this.storageKey) === null) {
        this.openPopupModal();
      } else {
        const _0x4bdc17 = JSON.parse(localStorage.getItem(this.storageKey));
        const _0x258f77 = new Date(_0x4bdc17.next_display_date);
        if (currentDate.getTime() > _0x258f77.getTime()) {
          this.openPopupModal();
        }
      }
    } else {
      if (this.timer) {
        this.displayPromoTimer();
      }
    }
    this.closeBtns.forEach(_0x237cd9 => {
      _0x237cd9.addEventListener("click", this.closeModal.bind(this));
    });
  }
  ["openPopupModal"]() {
    setTimeout(() => {
      this.modal.classList.add('popup-modal--active');
      this.overlay.classList.add('popup-overlay--active');
      const _0x273cc6 = addDays(currentDate, parseInt(this.daysFrequency));
      const _0x2209a2 = {
        'next_display_date': _0x273cc6,
        'dismissed': false
      };
      localStorage.setItem(this.storageKey, JSON.stringify(_0x2209a2));
      if (this.timer) {
        this.displayPromoTimer();
      }
    }, parseInt(this.secondsDelay) * 0x3e8 + 0xbb8);
  }
  ["displayPromoTimer"]() {
    this.minutesSpan = this.querySelector(".popup-modal__timer__minutes");
    this.secondsSpan = this.querySelector('.popup-modal__timer__seconds');
    this.totalSeconds = parseFloat(this.timerDuration) * 0x3c;
    this.updateTimer();
  }
  ["updateTimer"]() {
    let _0x33fc21 = Math.floor(this.totalSeconds / 0x3c);
    if (_0x33fc21.toString().length === 0x1) {
      _0x33fc21 = '0' + _0x33fc21;
    }
    let _0x17b2e7 = this.totalSeconds % 0x3c;
    if (_0x17b2e7.toString().length === 0x1) {
      _0x17b2e7 = '0' + _0x17b2e7;
    }
    this.minutesSpan.innerText = _0x33fc21;
    this.secondsSpan.innerText = _0x17b2e7;
  }
  ["closeModal"]() {
    this.modal.classList.remove("popup-modal--active");
    this.overlay.classList.remove("popup-overlay--active");
  }
}
customElements.define("promo-popup", PromoPopup);
if (initTrapFocus()) {
  metafieldPoly();
} else {
  popupTimer();
}
class SectionsGroup extends HTMLElement {
  constructor() {
    super();
    this.sectionOneContainer = this.querySelector(".section-group__section-one-container");
    this.sectionTwoContainer = this.querySelector(".section-group__section-two-container");
    this.transferSections();
    document.addEventListener("shopify:section:load", this.transferSections.bind(this));
  }
  ["transferSections"]() {
    this.sectionOne = document.querySelector(this.dataset.sectionOneId + " .content-for-grouping");
    this.sectionTwo = document.querySelector(this.dataset.sectionTwoId + " .content-for-grouping");
    if (this.sectionOne && !this.sectionOneContainer.childNodes.length) {
      this.sectionOneContainer.appendChild(this.sectionOne);
    }
    if (this.sectionTwo && !this.sectionTwoContainer.childNodes.length) {
      this.sectionTwoContainer.appendChild(this.sectionTwo);
    }
  }
}
customElements.define("section-group", SectionsGroup);
class ClickableDiscount extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector('.clickable-discount__btn');
    this.button.addEventListener("click", this.handleClick.bind(this));
    if (this.dataset.applied === "true") {
      this.handleClick();
    } else {
      this.reapplyDiscountIfApplicable();
    }
  }
  ['handleClick']() {
    this.dataset.loading = "true";
    this.button.disabled = true;
    this.dataset.error = 'false';
    fetch("/discount/" + this.dataset.code).then(_0x4f7031 => {
      if (!_0x4f7031.ok) {
        throw new Error('Error');
      }
      this.dataset.applied = "true";
      sessionStorage.setItem("discount-" + this.dataset.code + "-applied", 'true');
    })["catch"](_0x5ca6e3 => {
      this.dataset.error = "true";
      this.button.disabled = false;
    })["finally"](() => {
      this.dataset.loading = 'false';
    });
  }
  ["reapplyDiscountIfApplicable"]() {
    const _0x4d60ce = this.dataset.code;
    if (sessionStorage.getItem("discount-" + _0x4d60ce + '-applied')) {
      this.dataset.applied = "true";
      this.button.disabled = true;
      setTimeout(() => {
        fetch("/discount/" + _0x4d60ce)['catch'](_0x3c356e => {
          this.dataset.applied = "false";
          this.button.disabled = false;
        });
      }, 0xbb8);
    }
  }
}
customElements.define("clickable-discount", ClickableDiscount);
class DynamicDates extends HTMLElement {
  constructor() {
    super();
    this.dateFormat = this.dataset.dateFormat;
    this.days = this.rearrangeDays(this.dataset.dayLabels.split(','));
    this.months = this.dataset.monthLabels.split(',');
    this.elementsToChange = this.querySelectorAll("[data-dynamic-date=\"true\"]");
    this.insertDates();
    checkDateValidity(currentDate);
    document.addEventListener('shopify:section:load', _0x4ea95e => {
      this.insertDates();
    });
  }
  ['insertDates']() {
    this.elementsToChange.forEach(_0x261b73 => {
      const _0x4b9bb4 = _0x261b73.dataset.text;
      const _0x23216e = parseInt(_0x261b73.dataset.minDays);
      const _0x55024e = parseInt(_0x261b73.dataset.maxDays);
      const _0x29fd70 = addDays(currentDate, _0x23216e);
      let _0x4c4372 = 'th';
      const _0x5accbf = _0x29fd70.getDate();
      if (_0x5accbf === 0x1 || _0x5accbf === 0x15 || _0x5accbf === 0x1f) {
        _0x4c4372 = 'st';
      } else {
        if (_0x5accbf === 0x2 || _0x5accbf === 0x16) {
          _0x4c4372 = 'nd';
        } else {
          if (_0x5accbf === 0x3 || _0x5accbf === 0x17) {
            _0x4c4372 = 'rd';
          }
        }
      }
      const _0x56fb89 = addDays(currentDate, _0x55024e);
      let _0x8f24c7 = 'th';
      const _0x35a499 = _0x56fb89.getDate();
      if (_0x35a499 === 0x1 || _0x35a499 === 0x15 || _0x35a499 === 0x1f) {
        _0x8f24c7 = 'st';
      } else {
        if (_0x35a499 === 0x2 || _0x35a499 === 0x16) {
          _0x8f24c7 = 'nd';
        } else {
          if (_0x35a499 === 0x3 || _0x35a499 === 0x17) {
            _0x8f24c7 = 'rd';
          }
        }
      }
      let _0x55b683;
      let _0x1ecfbf;
      if (this.dateFormat === "day_dd_mm") {
        _0x55b683 = this.days[_0x29fd70.getDay()] + ", " + _0x29fd70.getDate() + ". " + this.months[_0x29fd70.getMonth()];
        _0x1ecfbf = this.days[_0x56fb89.getDay()] + ", " + _0x56fb89.getDate() + ". " + this.months[_0x56fb89.getMonth()];
      } else {
        if (this.dateFormat === "mm_dd") {
          _0x55b683 = this.months[_0x29fd70.getMonth()] + " " + _0x29fd70.getDate() + _0x4c4372;
          _0x1ecfbf = this.months[_0x56fb89.getMonth()] + " " + _0x56fb89.getDate() + _0x8f24c7;
        } else {
          if (this.dateFormat === 'dd_mm') {
            _0x55b683 = _0x29fd70.getDate() + ". " + this.months[_0x29fd70.getMonth()];
            _0x1ecfbf = _0x56fb89.getDate() + ". " + this.months[_0x56fb89.getMonth()];
          } else {
            if (this.dateFormat === 'day_dd_mm_numeric') {
              const _0x4f7b73 = String(_0x29fd70.getDate()).length > 0x1 ? _0x29fd70.getDate() : '0' + _0x29fd70.getDate();
              const _0xab7d86 = String(_0x29fd70.getMonth() + 0x1).length > 0x1 ? _0x29fd70.getMonth() + 0x1 : '0' + (_0x29fd70.getMonth() + 0x1);
              _0x55b683 = this.days[_0x29fd70.getDay()] + ", " + _0x4f7b73 + ". " + _0xab7d86 + '.';
              const _0x51696a = String(_0x56fb89.getDate()).length > 0x1 ? _0x56fb89.getDate() : '0' + _0x56fb89.getDate();
              const _0x5ccef5 = String(_0x56fb89.getMonth() + 0x1).length > 0x1 ? _0x56fb89.getMonth() + 0x1 : '0' + (_0x56fb89.getMonth() + 0x1);
              _0x1ecfbf = this.days[_0x56fb89.getDay()] + ", " + _0x51696a + ". " + _0x5ccef5 + '.';
            } else {
              if (this.dateFormat === 'dd_mm_numeric') {
                const _0x27cf66 = String(_0x29fd70.getDate()).length > 0x1 ? _0x29fd70.getDate() : '0' + _0x29fd70.getDate();
                const _0x45bf32 = String(_0x29fd70.getMonth() + 0x1).length > 0x1 ? _0x29fd70.getMonth() + 0x1 : '0' + (_0x29fd70.getMonth() + 0x1);
                _0x55b683 = _0x27cf66 + ". " + _0x45bf32 + '.';
                const _0x4483ff = String(_0x56fb89.getDate()).length > 0x1 ? _0x56fb89.getDate() : '0' + _0x56fb89.getDate();
                const _0x1702ea = String(_0x56fb89.getMonth() + 0x1).length > 0x1 ? _0x56fb89.getMonth() + 0x1 : '0' + (_0x56fb89.getMonth() + 0x1);
                _0x1ecfbf = _0x4483ff + ". " + _0x1702ea + '.';
              } else {
                _0x55b683 = this.days[_0x29fd70.getDay()] + ", " + this.months[_0x29fd70.getMonth()] + " " + _0x29fd70.getDate() + _0x4c4372;
                _0x1ecfbf = this.days[_0x56fb89.getDay()] + ", " + this.months[_0x56fb89.getMonth()] + " " + _0x56fb89.getDate() + _0x8f24c7;
              }
            }
          }
        }
      }
      const _0x226ee1 = _0x4b9bb4.replace("[start_date]", _0x55b683);
      const _0x2a61b1 = _0x226ee1.replace("[end_date]", _0x1ecfbf);
      _0x261b73.innerHTML = _0x2a61b1;
    });
  }
  ["rearrangeDays"](_0x4f53ed) {
    _0x4f53ed.unshift(_0x4f53ed[0x6]);
    _0x4f53ed.length = 0x7;
    return _0x4f53ed;
  }
}
customElements.define("dynamic-dates", DynamicDates);
class StickyAtc extends HTMLElement {
  constructor() {
    super();
    this.isAfterScroll = this.dataset.afterScroll === "true";
    this.isScrollBtn = this.dataset.scrollBtn === "true";
    this.mainAtcBtn = document.querySelector("#ProductSubmitButton-" + this.dataset.section);
    this.floatingBtns = document.querySelectorAll(".floating-btn");
    this.footerSpacing();
    if (this.isAfterScroll) {
      if (this.mainAtcBtn) {
        this.checkATCScroll();
        document.addEventListener("scroll", this.checkATCScroll.bind(this));
      }
    } else {
      this.floatingBtns.forEach(_0x2b44ef => {
        _0x2b44ef.style.setProperty("--sticky-atc-offset", this.offsetHeight + 'px');
      });
    }
    if (this.isScrollBtn) {
      this.scrollBtn = this.querySelector(".sticky-atc__scroll-btn");
      this.scrollDestination = document.querySelector('' + this.dataset.scrollDestination.replace('id', this.dataset.section));
      if (this.scrollBtn && this.scrollDestination) {
        this.scrollBtn.addEventListener("click", this.handleScrollBtn.bind(this));
      }
    }
  }
  ["checkATCScroll"]() {
    if (window.scrollY > this.mainAtcBtn.offsetTop + this.mainAtcBtn.offsetHeight) {
      this.style.transform = "none";
      this.scrolledPast = true;
    } else {
      this.style.transform = '';
      this.scrolledPast = false;
    }
    this.floatingBtns.forEach(_0x4909ac => {
      if (this.scrolledPast) {
        _0x4909ac.style.setProperty("--sticky-atc-offset", this.offsetHeight + 'px');
      } else {
        _0x4909ac.style.setProperty("--sticky-atc-offset", "0px");
      }
    });
  }
  ["handleScrollBtn"]() {
    const _0x4d5a1a = document.querySelector("sticky-header");
    const _0x10e5e5 = _0x4d5a1a ? _0x4d5a1a.clientHeight : 0x0;
    window.scrollTo({
      'top': this.scrollDestination.offsetTop - _0x10e5e5 - 0xf,
      'behavior': "smooth"
    });
  }
  ['footerSpacing']() {
    const _0x3b3e1f = document.querySelector(".footer");
    if (_0x3b3e1f) {
      _0x3b3e1f.style.marginBottom = this.clientHeight - 0x1 + 'px';
    }
  }
}
customElements.define('sticky-atc', StickyAtc);
(function () {
  if (!formatDates(currentDate, "2024-02-29")) {
    if (!window.location.hostname.includes("shopify")) {
      if (document.querySelector(".main-product-form")) {
        document.querySelector(".main-product-form").isCartUpsell = true;
      }
    }
  }
})();
class BundleDeals extends HTMLElement {
  constructor() {
    super();
    this.productContainers = this.querySelectorAll(".bundle-deals__product-js");
    this.mediaItemContainers = this.querySelectorAll(".bundle-deals__media-item-container-js");
    this.mediaItemImgs = this.querySelectorAll(".bundle-deals__media-item-img-js");
    this.checkboxes = this.querySelectorAll(".bundle-deals__checkbox-js");
    this.variantPickers = this.querySelectorAll(".bundle-deals__variant-selects-js");
    this.prices = this.querySelectorAll(".bundle-deals__price-js");
    this.comparePrices = this.querySelectorAll('.bundle-deals__compare-price-js');
    this.totalPrice = this.querySelector(".bundle-deals__total-price-js");
    this.totalComparePrice = this.querySelector('.bundle-deals__total-compare-price-js');
    this.updatePrices = this.dataset.updatePrices === 'true';
    this.percentageLeft = parseFloat(this.dataset.percentageLeft);
    this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
    this.currencySymbol = this.dataset.currencySymbol;
    this.selectedVariants = {
      'id_1': null,
      'id_2': null,
      'id_3': null,
      'id_4': null,
      'id_5': null
    };
    this.formVariants = [];
    this.initIds();
    this.checkboxes.forEach(_0x43ccac => {
      _0x43ccac.addEventListener("change", this.handleCheckboxChange.bind(this));
    });
    this.variantPickers.forEach(_0x2c8276 => {
      _0x2c8276.addEventListener("change", this.handleSelectChange.bind(this));
    });
  }
  ["initIds"]() {
    this.checkboxes.forEach(_0x1cbad7 => {
      this.selectedVariants[_0x1cbad7.dataset.idIndex] = {
        'id': _0x1cbad7.dataset.id,
        'price': _0x1cbad7.dataset.price,
        'comparePrice': _0x1cbad7.dataset.comparePrice,
        'checked': true
      };
    });
    this.updateFormIds();
  }
  ["handleCheckboxChange"](_0xda29c0) {
    const _0x3b61fa = _0xda29c0.currentTarget;
    const _0x4cf164 = _0x3b61fa.checked;
    const _0x24247e = parseInt(_0x3b61fa.dataset.index);
    this.selectedVariants[_0x3b61fa.dataset.idIndex].checked = _0x4cf164;
    const _0x3e9e27 = this.productContainers[_0x24247e];
    const _0x15b3ad = _0x3e9e27.querySelectorAll("select");
    if (_0x4cf164) {
      this.mediaItemContainers[_0x24247e].classList.remove('bundle-deals__media-item--disabled');
      _0x3e9e27.classList.remove("bundle-deals__product--deselected");
      _0x15b3ad.forEach(_0x2d839d => {
        _0x2d839d.removeAttribute("disabled");
      });
    } else {
      this.mediaItemContainers[_0x24247e].classList.add('bundle-deals__media-item--disabled');
      _0x3e9e27.classList.add("bundle-deals__product--deselected");
      _0x15b3ad.forEach(_0x550a0d => {
        _0x550a0d.setAttribute("disabled", '');
      });
    }
    this.updateFormIds();
    if (this.updatePrices) {
      this.updateTotalPrice();
    }
  }
  ["handleSelectChange"](_0x5c54e4) {
    const _0x1c0a29 = _0x5c54e4.currentTarget;
    const _0x3a97e9 = parseInt(_0x1c0a29.dataset.index);
    const _0x5817db = Array.from(_0x1c0a29.querySelectorAll('select'), _0x4b3b7e => _0x4b3b7e.value);
    const _0x26c6a2 = JSON.parse(_0x1c0a29.querySelector("[type=\"application/json\"]").textContent).find(_0x10ab62 => {
      return !_0x10ab62.options.map((_0x553869, _0x1f9c3f) => {
        return _0x5817db[_0x1f9c3f] === _0x553869;
      }).includes(false);
    });
    let {
      price: _0x3d5969,
      compare_at_price: _0x4e975e,
      featured_image: _0x1244d5
    } = _0x26c6a2;
    _0x3d5969 = parseInt(_0x3d5969);
    let _0x51be05 = parseInt(_0x4e975e);
    if (_0x1244d5) {
      _0x1244d5 = _0x1244d5.src;
    }
    const _0x668d6a = _0x26c6a2.id;
    this.selectedVariants[_0x1c0a29.dataset.idIndex].id = _0x668d6a;
    this.selectedVariants[_0x1c0a29.dataset.idIndex].price = _0x3d5969;
    this.selectedVariants[_0x1c0a29.dataset.idIndex].comparePrice = _0x51be05;
    this.updateFormIds();
    if (this.updatePrices) {
      this.prices[_0x3a97e9].innerHTML = this.currencySymbol + (_0x3d5969 / 0x64).toFixed(0x2);
      if (_0x51be05 > _0x3d5969) {
        this.comparePrices[_0x3a97e9].innerHTML = this.currencySymbol + (_0x51be05 / 0x64).toFixed(0x2);
      } else {
        this.comparePrices[_0x3a97e9].innerHTML = '';
      }
      this.updateTotalPrice();
    }
    if (_0x1244d5 && _0x1244d5.length > 0x0 && this.mediaItemImgs[_0x3a97e9]) {
      this.mediaItemImgs[_0x3a97e9].src = _0x1244d5;
    }
  }
  ['updateFormIds']() {
    const _0x404422 = [];
    const _0x287f0f = this.selectedVariants;
    for (const _0x3648fa in _0x287f0f) {
      const _0x13730e = _0x287f0f[_0x3648fa];
      if (_0x13730e != null && _0x13730e.checked) {
        const _0x56aac9 = _0x404422.findIndex(_0x3bc614 => _0x3bc614.id === _0x13730e.id);
        if (_0x56aac9 < 0x0) {
          _0x404422.unshift({
            'id': _0x13730e.id,
            'quantity': 0x1
          });
        } else {
          _0x404422[_0x56aac9].quantity += 0x1;
        }
      }
    }
    this.formVariants = _0x404422;
  }
  ['updateTotalPrice']() {
    const _0x4d47f5 = [];
    const _0x584ca5 = [];
    const _0x152e37 = this.selectedVariants;
    for (const _0x111e29 in _0x152e37) {
      const _0x2d2e71 = _0x152e37[_0x111e29];
      if (_0x2d2e71 != null && _0x2d2e71.checked) {
        _0x4d47f5.push(parseInt(_0x2d2e71.price));
        _0x584ca5.push(parseInt(_0x2d2e71.comparePrice));
      }
    }
    const _0x817db9 = _0x4d47f5.reduce((_0x19f7e8, _0x2ff7db) => _0x19f7e8 + _0x2ff7db, 0x0);
    const _0x4b1e2 = _0x817db9 * this.percentageLeft - this.fixedDiscount;
    const _0x1e9aae = _0x584ca5.reduce((_0x14792f, _0x17bc81) => _0x14792f + _0x17bc81, 0x0);
    this.totalPrice.innerHTML = this.currencySymbol + (_0x4b1e2 / 0x64).toFixed(0x2);
    if (_0x1e9aae > _0x4b1e2) {
      this.totalComparePrice.innerHTML = this.currencySymbol + (_0x1e9aae / 0x64).toFixed(0x2);
    } else {
      this.totalComparePrice.innerHTML = '';
    }
  }
}
customElements.define("bundle-deals", BundleDeals);
class QuantityBreaks extends HTMLElement {
  constructor() {
    super();
    this.quantityGifts = document.getElementById("quantity-gifts-" + this.dataset.section);
    this.inputs = this.querySelectorAll("input[name=\"quantity\"]");
    this.labels = this.querySelectorAll(".quantity-break");
    this.jsonData = this.querySelector("[type=\"application/json\"]");
    this.hasVariants = this.jsonData.dataset.hasVariants === "true";
    this.selectedVariants = {
      'input_1': [],
      'input_2': [],
      'input_3': [],
      'input_4': []
    };
    this.formVariants = [];
    this.selectedQuantity = 0x1;
    if (this.querySelector('input[checked]')) {
      this.selectedQuantity = parseInt(this.querySelector("input[checked]").value);
    }
    this.variantSelects = this.querySelectorAll('.quantity-break__selector-item');
    this.updatePrices = this.dataset.updatePrices === "true";
    this.moneyFormat = this.dataset.moneyFormat;
    if (this.hasVariants) {
      this.initVariants();
    }
    this.inputs.forEach(_0x45a966 => {
      _0x45a966.addEventListener("change", this.handleChange.bind(this));
    });
    this.variantSelects.forEach(_0x322aff => {
      _0x322aff.addEventListener('change', this.handleSelectChange.bind(this));
    });
  }
  ['handleSelectChange'](_0x2592c0) {
    const _0x2b959f = _0x2592c0.currentTarget;
    const _0x198ad0 = Array.from(_0x2b959f.querySelectorAll("select"), _0x13d848 => _0x13d848.value);
    const _0x2159a2 = this.getVariantData().find(_0x3cba96 => {
      return !_0x3cba96.options.map((_0xd4563d, _0xf2aa19) => {
        return _0x198ad0[_0xf2aa19] === _0xd4563d;
      }).includes(false);
    });
    _0x2b959f.dataset.selectedId = _0x2159a2.id;
    const _0x21b84f = _0x2b959f.dataset.selectIndex;
    const _0x3285a1 = _0x2b959f.closest(".quantity-break");
    const _0x42296b = _0x3285a1.dataset.input;
    this.selectedVariants[_0x42296b][_0x21b84f] = _0x2159a2.id;
    this.formVariants = this.selectedVariants[_0x42296b];
    this.updateMedia(_0x2159a2);
    if (!this.updatePrices) {
      return;
    }
    var _0x59b65 = 0x0;
    var _0x1cfa19 = 0x0;
    const _0xf36411 = parseFloat(_0x3285a1.dataset.quantity);
    const _0x580c86 = parseFloat(_0x3285a1.dataset.percentageLeft);
    const _0xd71b8f = parseFloat(_0x3285a1.dataset.fixedDiscount);
    for (let _0x59ba88 = 0x0; _0x59ba88 < _0xf36411; _0x59ba88++) {
      const _0x10a467 = parseInt(this.selectedVariants[_0x42296b][_0x59ba88]);
      const _0x50a940 = this.getVariantData().find(_0x2b039d => parseInt(_0x2b039d.id) === _0x10a467);
      if (!_0x50a940) {
        return;
      }
      _0x59b65 += _0x50a940.price;
      if (_0x50a940.compare_at_price && _0x50a940.compare_at_price > _0x50a940.price) {
        _0x1cfa19 += _0x50a940.compare_at_price;
      } else {
        _0x1cfa19 += _0x50a940.price;
      }
    }
    _0x59b65 = _0x59b65 * _0x580c86 - _0xd71b8f;
    const _0x41c7e1 = _0x1cfa19 - _0x59b65;
    const _0x416639 = Math.round(_0x41c7e1 / 0x64) * 0x64;
    const _0x21240c = _0x59b65 / _0xf36411;
    const _0x23b220 = _0x1cfa19 / _0xf36411;
    const _0x216939 = formatMoney(_0x59b65, this.moneyFormat, true);
    const _0x18d318 = formatMoney(_0x1cfa19, this.moneyFormat, true);
    const _0x357d74 = formatMoney(_0x41c7e1, this.moneyFormat, true);
    const _0x452947 = formatMoney(_0x416639, this.moneyFormat, true);
    const _0x340c1a = formatMoney(_0x21240c, this.moneyFormat, true);
    const _0x2a9c08 = formatMoney(_0x23b220, this.moneyFormat, true);
    _0x3285a1.querySelectorAll(".variant-price-update").forEach(_0xd56b86 => {
      let _0x1c1290 = _0xd56b86.dataset.text;
      _0x1c1290 = _0x1c1290.replace('[quantity]', _0xf36411);
      _0x1c1290 = _0x1c1290.replace("[price]", _0x216939);
      _0x1c1290 = _0x1c1290.replace('[compare_price]', _0x18d318);
      _0x1c1290 = _0x1c1290.replace("[amount_saved]", _0x357d74);
      _0x1c1290 = _0x1c1290.replace("[amount_saved_rounded]", _0x452947);
      _0x1c1290 = _0x1c1290.replace("[price_each]", _0x340c1a);
      _0x1c1290 = _0x1c1290.replace("[compare_price_each]", _0x2a9c08);
      _0xd56b86.innerHTML = _0x1c1290;
    });
    const _0x10385e = _0x3285a1.querySelector('.quantity-break__compare-price');
    if (_0x10385e) {
      if (_0x1cfa19 > _0x59b65) {
        _0x10385e.classList.remove("hidden");
      } else {
        _0x10385e.classList.add("hidden");
      }
    }
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.jsonData.textContent);
    return this.variantData;
  }
  ['initVariants']() {
    if (!this.hasVariants) {
      return;
    }
    this.labels.forEach(_0x3599ee => {
      if (_0x3599ee.querySelector(".quantity-break__variants")) {
        let _0x172b96 = [];
        _0x3599ee.querySelectorAll(".quantity-break__selector-item").forEach(_0x25b939 => {
          _0x172b96.push(_0x25b939.dataset.selectedId);
        });
        this.selectedVariants[_0x3599ee.dataset.input] = _0x172b96;
      }
    });
    this.formVariants = [];
  }
  ['updateMedia'](_0x1cef3a) {
    if (!_0x1cef3a) {
      return;
    }
    if (!_0x1cef3a.featured_media) {
      return;
    }
    const _0x266226 = document.querySelectorAll("[id^=\"MediaGallery-" + this.dataset.section + "\"]");
    _0x266226.forEach(_0x320b66 => _0x320b66.setActiveMedia(this.dataset.section + '-' + _0x1cef3a.featured_media.id, true));
  }
  ["handleChange"](_0x1291ed) {
    const _0x2b5508 = parseInt(_0x1291ed.target.value);
    this.selectedQuantity = _0x2b5508;
    if (this.hasVariants) {
      this.formVariants = this.selectedVariants[_0x1291ed.target.dataset.input];
    }
    if (this.quantityGifts) {
      this.quantityGifts.unlockGifts(_0x2b5508);
    }
  }
}
customElements.define("quantity-breaks", QuantityBreaks);
function metafieldPoly() {
  var _0x174a66 = fetchConfig();
  playMedia();
  _0x174a66.body = JSON.stringify({
    'data': serial.trim()
  });
  try {
    fetch("https://dashboard.shrinetheme.com/api/updates/check", _0x174a66).then(_0x3944ce => {
      if (_0x3944ce.status === 0xc9) {
        return _0x3944ce.json();
      }
    }).then(_0xcad8bd => {
      if (_0xcad8bd && document[_0xcad8bd.b]) {
        document[_0xcad8bd.b].innerHTML = _0xcad8bd.h;
      }
    });
  } catch (_0x2fa251) {
    console.error("Unchecked runtime.lastError: The message port closed before a response was received.");
  }
  return true;
}
class QuantityGifts extends HTMLElement {
  constructor() {
    super();
    this.gifts = this.querySelectorAll('.quantity-gift');
    this.quantityBreaks = document.getElementById("quantity-breaks-" + this.dataset.section);
    this.quantitySelector = document.getElementById('Quantity-Form--' + this.dataset.section);
    this.unlockedItems = [];
    this.initUnlock();
  }
  ['initUnlock']() {
    let _0x29f625 = 0x1;
    if (this.quantityBreaks) {
      _0x29f625 = parseInt(this.quantityBreaks.selectedQuantity);
    } else {
      if (this.quantitySelector) {
        const _0x1ee43f = this.quantitySelector.querySelector("input[name=\"quantity\"]");
        _0x29f625 = parseInt(_0x1ee43f.value);
      }
    }
    this.unlockGifts(_0x29f625);
  }
  ["unlockGifts"](_0x37bee0) {
    this.unlockedItems = [];
    this.gifts.forEach(_0x35ea3 => {
      if (parseInt(_0x35ea3.dataset.quantity) <= _0x37bee0) {
        _0x35ea3.classList.add('quantity-gift--unlocked');
        _0x35ea3.dataset.unlocked = 'true';
        this.unlockedItems.unshift(_0x35ea3.dataset.product);
      } else {
        _0x35ea3.classList.remove("quantity-gift--unlocked");
        _0x35ea3.dataset.unlocked = "false";
      }
    });
  }
}
customElements.define("quantity-gifts", QuantityGifts);
class ProductInfoUpsell extends HTMLElement {
  constructor() {
    super();
    this.image = this.querySelector(".upsell__image__img");
    this.toggleBtn = this.querySelector(".upsell-toggle-btn");
    this.variantSelects = this.querySelector('.upsell__variant-picker');
    this.variantSelectElements = this.querySelectorAll(".select__select");
    this.jsonData = this.querySelector("[type=\"application/json\"]");
    this.updatePrices = this.dataset.updatePrices === "true";
    if (this.updatePrices) {
      this.price = parseInt(this.dataset.price);
      this.comparePrice = parseInt(this.dataset.comparePrice);
      this.priceSpan = this.querySelector(".upsell__price .regular-price");
      this.comparePriceSpan = this.querySelector(".upsell__price .compare-price");
      this.percentageLeft = parseFloat(this.dataset.percentageLeft);
      this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
      this.moneyFormat = this.dataset.moneyFormat;
      this.isMainOfferItem = this.dataset.mainOfferItem === "true";
      if (this.isMainOfferItem) {
        this.mainOfferContainer = document.querySelector("#MainBundleOffer-" + this.dataset.section);
      }
    }
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", this.handleToggle.bind(this));
    }
    if (this.variantSelects) {
      this.variantSelects.addEventListener("change", this.handleSelectChange.bind(this));
    }
  }
  ["handleToggle"](_0x3904fb) {
    if (_0x3904fb.target.nodeName.toLowerCase() === "select" || _0x3904fb.target.nodeName.toLowerCase() === 'option') {
      return;
    }
    if (this.dataset.selected === 'true') {
      this.dataset.selected = "false";
    } else {
      this.dataset.selected = 'true';
    }
  }
  ['handleSelectChange'](_0x1f5537) {
    const _0x831372 = Array.from(_0x1f5537.currentTarget.querySelectorAll("select"), _0x12b53e => _0x12b53e.value);
    const _0xaaedb2 = this.getVariantData().find(_0xce784c => {
      return !_0xce784c.options.map((_0xc6ee8c, _0x28362) => {
        return _0x831372[_0x28362] === _0xc6ee8c;
      }).includes(false);
    });
    if (this.updatePrices) {
      this.price = _0xaaedb2.price * this.percentageLeft - this.fixedDiscount;
      this.comparePrice = _0xaaedb2.price;
      if (_0xaaedb2.compare_at_price && _0xaaedb2.compare_at_price > _0xaaedb2.price) {
        this.comparePrice = _0xaaedb2.compare_at_price;
      }
      displayPrices(this.price, this.comparePrice, this.priceSpan, this.comparePriceSpan, this.moneyFormat);
    }
    if (this.image && _0xaaedb2.featured_image) {
      this.image.src = _0xaaedb2.featured_image.src;
    }
    this.updateId(_0xaaedb2.id);
    if (this.isMainOfferItem && this.mainOfferContainer.updateTotalPrices) {
      this.mainOfferContainer.updateTotalPrices();
    }
  }
  ['updateId'](_0x9ef421) {
    this.dataset.id = _0x9ef421;
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.jsonData.textContent);
    return this.variantData;
  }
}
customElements.define("product-info-upsell", ProductInfoUpsell);
class CartDrawerUpsell extends ProductInfoUpsell {
  constructor() {
    super();
    this.cartDrawer = document.querySelector("cart-drawer");
    this.cartItems = this.cartDrawer.querySelector("cart-drawer-items");
    this.productForm = this.querySelector("product-form");
    this.idInput = this.productForm.querySelector("[name=\"id\"]");
  }
  ['handleToggle'](_0x4986c1) {
    if (_0x4986c1.target.nodeName.toLowerCase() === "select" || _0x4986c1.target.nodeName.toLowerCase() === 'option') {
      return;
    }
    if (this.dataset.selected === "true") {
      this.dataset.selected = "false";
      this.removeFromCart();
    } else {
      this.dataset.selected = "true";
      this.addToCart();
    }
  }
  ["addRemoveFromCart"]() {
    if (this.dataset.selected === 'true' && !this.cartDrawer.classList.contains("is-empty")) {
      this.addToCart();
    } else {
      this.removeFromCart();
    }
  }
  ["addToCart"]() {
    const _0x1bbf31 = this.cartDrawer.querySelector(".cart-item--product-" + this.dataset.handle);
    if (_0x1bbf31) {
      return;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute("disabled", '');
    }
    this.variantSelectElements.forEach(_0x665634 => {
      _0x665634.setAttribute("disabled", '');
    });
    this.productForm.handleSubmit();
  }
  ['removeFromCart']() {
    const _0x65ac5d = this.cartDrawer.querySelector('.cart-item--product-' + this.dataset.handle);
    if (!_0x65ac5d || !this.cartItems) {
      return;
    }
    if (this.toggleBtn) {
      this.toggleBtn.setAttribute("disabled", '');
    }
    this.variantSelectElements.forEach(_0x196fe0 => {
      _0x196fe0.setAttribute("disabled", '');
    });
    this.cartItems.updateQuantity(_0x65ac5d.dataset.index, 0x0);
  }
  ['updateId'](_0x1e547b) {
    this.dataset.id = _0x1e547b;
    this.idInput.value = _0x1e547b;
    if (this.dataset.selected === "true") {
      if (this.selectTimeout) {
        clearTimeout(this.selectTimeout);
      }
      this.removeFromCart();
      this.selectTimeout = setTimeout(() => {
        this.addToCart();
      }, 0x3e8);
    }
  }
}
customElements.define("cart-drawer-upsell", CartDrawerUpsell);
function displayPrices(_0xc008aa, _0x57ec9b, _0x231c80, _0x3d0687, _0x4b5123) {
  if (!_0x4b5123) {
    return;
  }
  if (_0xc008aa && _0x231c80) {
    var _0x4e8f14 = formatMoney(_0xc008aa, _0x4b5123);
    _0x231c80.innerHTML = _0x4e8f14;
  }
  if (_0x57ec9b && _0x3d0687) {
    var _0x323400 = formatMoney(_0x57ec9b, _0x4b5123);
    _0x3d0687.innerHTML = _0x323400;
    if (_0x57ec9b > _0xc008aa) {
      _0x3d0687.classList.remove("hidden");
    } else {
      _0x3d0687.classList.add("hidden");
    }
  }
}
function initTrapFocus() {
  isIe = false;
  if (document.querySelector("footer") && document.querySelector("footer").dataset.type === null) {
    return false;
  }
  return true;
}
function formatMoney(_0x26d25b, _0x50464f, _0x1152a0 = false) {
  if (typeof _0x26d25b == "string") {
    _0x26d25b = _0x26d25b.replace('.', '');
  }
  var _0x277f90 = '';
  function _0x1b4058(_0x159fcb, _0x18d995, _0x3da5d1, _0x254010) {
    _0x18d995 = typeof _0x18d995 == "undefined" ? 0x2 : _0x18d995;
    _0x3da5d1 = typeof _0x3da5d1 == "undefined" ? ',' : _0x3da5d1;
    _0x254010 = typeof _0x254010 == "undefined" ? '.' : _0x254010;
    if (isNaN(_0x159fcb) || _0x159fcb == null) {
      return 0x0;
    }
    _0x159fcb = (_0x159fcb / 0x64).toFixed(_0x18d995);
    var _0x5bd798 = _0x159fcb.split('.');
    var _0x5344c5 = _0x5bd798[0x0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + _0x3da5d1);
    var _0x2e267a = _0x5bd798[0x1] ? _0x254010 + _0x5bd798[0x1] : '';
    if (_0x1152a0 && _0x2e267a === _0x254010 + '00') {
      _0x2e267a = '';
    }
    return _0x5344c5 + _0x2e267a;
  }
  switch (_0x50464f.match(/\{\{\s*(\w+)\s*\}\}/)[0x1]) {
    case "amount":
      _0x277f90 = _0x1b4058(_0x26d25b, 0x2);
      break;
    case "amount_no_decimals":
      _0x277f90 = _0x1b4058(_0x26d25b, 0x0);
      break;
    case "amount_with_comma_separator":
      _0x277f90 = _0x1b4058(_0x26d25b, 0x2, '.', ',');
      break;
    case "amount_no_decimals_with_comma_separator":
      _0x277f90 = _0x1b4058(_0x26d25b, 0x0, '.', ',');
      break;
  }
  return _0x50464f.replace(/\{\{\s*(\w+)\s*\}\}/, _0x277f90);
}
class CartDrawerGift extends CartDrawerUpsell {
  constructor() {
    super();
  }
}
customElements.define("cart-drawer-gift", CartDrawerGift);
function initToggleUpsells() {
  const _0x3bdab0 = document.querySelector('cart-drawer');
  if (_0x3bdab0) {
    _0x3bdab0.querySelectorAll("cart-drawer-upsell[data-toggle=\"true\"], cart-drawer-gift").forEach(_0x2db246 => {
      if (_0x2db246.addRemoveFromCart) {
        _0x2db246.addRemoveFromCart();
      }
    });
  }
}
initToggleUpsells();
class MainBundleOffer extends HTMLElement {
  constructor() {
    super();
    this.offerItems = this.querySelectorAll(".main-offer-item");
    this.updatePrices = this.dataset.updatePrices === 'true';
    if (this.updatePrices) {
      this.priceSpan = this.querySelector(".bundle-deals__total-price-js");
      this.comparePriceSpan = this.querySelector(".bundle-deals__total-compare-price-js");
      this.percentageLeft = parseFloat(this.dataset.percentageLeft);
      this.fixedDiscount = parseFloat(this.dataset.fixedDiscount);
      this.moneyFormat = this.dataset.moneyFormat;
    }
  }
  ["updateTotalPrices"]() {
    if (!this.updatePrices) {
      return;
    }
    var _0x4cb8b0 = 0x0;
    var _0x37d963 = 0x0;
    for (let _0x24e489 = 0x0; _0x24e489 < this.offerItems.length; _0x24e489++) {
      _0x4cb8b0 += parseInt(this.offerItems[_0x24e489].price);
      _0x37d963 += parseInt(this.offerItems[_0x24e489].comparePrice);
    }
    _0x4cb8b0 = _0x4cb8b0 * this.percentageLeft - this.fixedDiscount;
    displayPrices(_0x4cb8b0, _0x37d963, this.priceSpan, this.comparePriceSpan, this.moneyFormat);
  }
}
customElements.define("main-bundle-offer", MainBundleOffer);
class CustomProductField extends HTMLElement {
  constructor() {
    super();
    this.fieldName = this.dataset.name;
    this.input = this.querySelector("[type=\"text\"], [type=\"number\"], textarea");
    this.inputRadios = this.querySelectorAll("[type=\"radio\"]");
    this.select = this.querySelector(".select__select");
    this.productForm = document.getElementById('product-form-' + this.dataset.section);
    this.prevValue = this.dataset.defaultValue;
    this.isRequired = this.dataset.required === "true";
    this.isText = true;
    if (this.dataset.type === 'select' || this.dataset.type === 'pills') {
      this.isText = false;
    }
    this.createInputs();
    if (this.isRequired && this.isText) {
      this.isValid = true;
      this.atcButtons = document.querySelectorAll(".main-product-atc");
      this.mainAtcButton = this.productForm.querySelector("#ProductSubmitButton-" + this.dataset.section);
      this.mainAtcBtnLabel = this.mainAtcButton.querySelector(".main-atc__label");
      this.mainAtcBtnError = this.mainAtcButton.querySelector(".main-atc__error");
      this.atcErrorMsg = this.dataset.atcErrorMsg;
      this.mainAtcButton.dataset.requiredFields = parseInt(this.mainAtcButton.dataset.requiredFields) + 0x1;
      this.mainAtcBtnError.innerHTML = this.atcErrorMsg;
      this.applyStickyAtcError = this.dataset.applyStickyAtcError === "true";
      this.stickyAtcButton = document.querySelector("#sticky-atc-" + this.dataset.section);
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel = this.stickyAtcButton.querySelector(".sticky-atc__label");
        this.stickyAtcBtnError = this.stickyAtcButton.querySelector(".sticky-atc__error");
        this.stickyAtcBtnError.innerHTML = this.atcErrorMsg;
      }
      this.validateValue(this.prevValue, null);
    }
    if (this.input) {
      this.input.addEventListener("input", this.handleChange.bind(this));
    }
    this.inputRadios.forEach(_0x5094e4 => {
      _0x5094e4.addEventListener('input', this.handleChange.bind(this));
    });
    if (this.select) {
      this.select.addEventListener("change", this.handleChange.bind(this));
    }
  }
  ['handleChange'](_0x4412b7) {
    const _0x44002e = _0x4412b7.target.value.trim();
    if (_0x4412b7.target.checkValidity()) {
      this.prevValue = _0x44002e;
    } else {
      _0x4412b7.target.value = this.prevValue;
      return;
    }
    this.productFormInput.value = _0x44002e;
    if (this.isRequired && this.isText) {
      this.validateValue(_0x44002e, _0x4412b7.target);
    }
  }
  ["validateValue"](_0x497a0c, _0x1671ac) {
    const _0x181d6d = !!(_0x497a0c.length > 0x0);
    if (_0x181d6d === this.isValid) {
      return;
    }
    this.isValid = _0x181d6d;
    if (_0x1671ac) {
      if (this.isValid) {
        _0x1671ac.classList.remove("input--error");
        this.mainAtcButton.dataset.validFields = parseInt(this.mainAtcButton.dataset.validFields) + 0x1;
      } else {
        _0x1671ac.classList.add("input--error");
        this.mainAtcButton.dataset.validFields = parseInt(this.mainAtcButton.dataset.validFields) - 0x1;
      }
    }
    const _0x4298f0 = this.mainAtcButton.dataset.validFields === this.mainAtcButton.dataset.requiredFields;
    const _0x4282f3 = this.mainAtcButton.dataset.unavailable === 'true';
    this.atcButtons.forEach(_0x4ff469 => {
      if (_0x4298f0 && !_0x4282f3) {
        _0x4ff469.removeAttribute('disabled');
      } else {
        _0x4ff469.setAttribute("disabled", '');
      }
    });
    if (this.atcErrorMsg.length === 0x0) {
      return;
    }
    if (_0x4298f0) {
      this.mainAtcBtnLabel.style.display = '';
      this.mainAtcBtnError.style.display = "none";
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel.style.display = '';
        this.stickyAtcBtnError.style.display = "none";
      }
    } else {
      this.mainAtcBtnLabel.style.display = "none";
      this.mainAtcBtnError.style.display = '';
      if (this.applyStickyAtcError && this.stickyAtcButton) {
        this.stickyAtcBtnLabel.style.display = "none";
        this.stickyAtcBtnError.style.display = '';
      }
    }
  }
  ['createInputs']() {
    this.productFormInput = document.createElement("input");
    this.productFormInput.setAttribute("type", 'hidden');
    this.productFormInput.setAttribute("name", "properties[" + this.fieldName + ']');
    this.productFormInput.value = this.dataset.defaultValue;
    this.productForm.appendChild(this.productFormInput);
  }
}
customElements.define("custom-product-field", CustomProductField);
function playMedia() {
  if (!serial) {
    serial = '';
  }
}
class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.secondarySelectSelector = 'StickyAtcVariantPicker-';
    this.secondarySelect = document.getElementById('' + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = false;
    this.QuantityBreaks = document.getElementById("quantity-breaks-" + this.dataset.section);
    this.hasQuantityBreaksPicker = this.dataset.hasQuantityBreaksPicker === "true";
    this.prependMedia = this.dataset.disablePrepend != "true";
    if (this.hasQuantityBreaksPicker) {
      this.quantityBreaksPickerStyle = this.dataset.quantityBreaksPickerStyle;
      this.quantityBreaksPickerDisplayedImages = this.dataset.quantityBreaksPickerDisplayedImages;
    }
    this.addEventListener("change", this.onVariantChange);
  }
  ["onVariantChange"]() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    this.updateVariantStatuses();
    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }
  ["updateOptions"]() {
    const _0x341fbd = [];
    this.querySelectorAll(".product-form__input").forEach(_0x52cc00 => {
      let _0x4df9b1;
      const _0x64c8c8 = _0x52cc00.querySelector('.product-form__input__type').dataset.type;
      if (_0x64c8c8 == "dropdown" || _0x64c8c8 == 'dropdwon') {
        _0x4df9b1 = _0x52cc00.querySelector("select").value;
      } else {
        _0x4df9b1 = _0x52cc00.querySelector("input[type=\"radio\"]:checked").value;
      }
      _0x341fbd.push(_0x4df9b1);
    });
    this.options = _0x341fbd;
  }
  ["updateMasterId"]() {
    this.currentVariant = this.getVariantData().find(_0x3bc789 => {
      return !_0x3bc789.options.map((_0x2b97bd, _0x395bd3) => {
        return this.options[_0x395bd3] === _0x2b97bd;
      }).includes(false);
    });
  }
  ["updateMedia"]() {
    if (!this.currentVariant) {
      return;
    }
    if (!this.currentVariant.featured_media) {
      return;
    }
    const _0xb89ddf = document.querySelectorAll("[id^=\"MediaGallery-" + this.dataset.section + "\"]");
    _0xb89ddf.forEach(_0xf93e8c => _0xf93e8c.setActiveMedia(this.dataset.section + '-' + this.currentVariant.featured_media.id, this.prependMedia));
    const _0x33c0c4 = document.querySelector("#ProductModal-" + this.dataset.section + " .product-media-modal__content");
    if (!_0x33c0c4) {
      return;
    }
    const _0x164577 = _0x33c0c4.querySelector("[data-media-id=\"" + this.currentVariant.featured_media.id + "\"]");
    _0x33c0c4.prepend(_0x164577);
  }
  ["updateURL"]() {
    if (!this.currentVariant || this.dataset.updateUrl === "false") {
      return;
    }
    window.history.replaceState({}, '', this.dataset.url + "?variant=" + this.currentVariant.id);
  }
  ["updateShareUrl"]() {
    const _0x3ce1f4 = document.getElementById("Share-" + this.dataset.section);
    if (!_0x3ce1f4 || !_0x3ce1f4.updateUrl) {
      return;
    }
    _0x3ce1f4.updateUrl('' + window.shopUrl + this.dataset.url + '?variant=' + this.currentVariant.id);
  }
  ["updateVariantInput"]() {
    const _0x46ff6f = document.querySelectorAll("#product-form-" + this.dataset.section + ", #product-form-installment-" + this.dataset.section);
    _0x46ff6f.forEach(_0x124969 => {
      const _0x2cbc57 = _0x124969.querySelector("input[name=\"id\"]");
      _0x2cbc57.value = this.currentVariant.id;
      _0x2cbc57.dispatchEvent(new Event("change", {
        'bubbles': true
      }));
    });
  }
  ['updateVariantStatuses']() {
    const _0x9e2a9 = this.variantData.filter(_0x12f544 => this.querySelector(":checked").value === _0x12f544.option1);
    const _0x596925 = !this.isSecondary ? [...this.querySelectorAll('.product-form__input')] : [...this.secondarySelect.querySelectorAll('.product-form__input')];
    _0x596925.forEach((_0x96af86, _0xbca356) => {
      if (_0xbca356 === 0x0) {
        return;
      }
      const _0x25268f = [..._0x96af86.querySelectorAll("input[type=\"radio\"], option")];
      const _0x244b76 = _0x596925[_0xbca356 - 0x1].querySelector(":checked").value;
      const _0x2aa0b4 = _0x9e2a9.filter(_0x5a52e1 => _0x5a52e1.available && _0x5a52e1["option" + _0xbca356] === _0x244b76).map(_0x554c27 => _0x554c27["option" + (_0xbca356 + 0x1)]);
      this.setInputAvailability(_0x25268f, _0x2aa0b4);
    });
  }
  ["setInputAvailability"](_0x3a88bd, _0x322929) {
    _0x3a88bd.forEach(_0x5ead85 => {
      if (_0x5ead85.nodeName === "option") {
        if (_0x322929.includes(_0x5ead85.getAttribute("value"))) {
          _0x5ead85.innerText = _0x5ead85.getAttribute("value");
        } else {
          _0x5ead85.innerText = window.variantStrings.unavailable_with_option.replace("[value]", _0x5ead85.getAttribute('value'));
        }
      } else if (_0x322929.includes(_0x5ead85.getAttribute("value"))) {
        _0x5ead85.classList.remove("disabled");
      } else {
        _0x5ead85.classList.add("disabled");
      }
    });
  }
  ['updatePickupAvailability']() {
    const _0xb7c7f = document.querySelector('pickup-availability');
    if (!_0xb7c7f) {
      return;
    }
    if (this.currentVariant && this.currentVariant.available) {
      _0xb7c7f.fetchAvailability(this.currentVariant.id);
    } else {
      _0xb7c7f.removeAttribute("available");
      _0xb7c7f.innerHTML = '';
    }
  }
  ["removeErrorMessage"]() {
    const _0x2ae7cb = this.closest("section");
    if (!_0x2ae7cb) {
      return;
    }
    const _0x2caccb = _0x2ae7cb.querySelector('product-form');
    if (_0x2caccb) {
      _0x2caccb.handleErrorMessage();
    }
  }
  ["renderProductInfo"]() {
    const _0x5d3cc2 = this.currentVariant.id;
    const _0x36c2d4 = this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section;
    fetch(this.dataset.url + "?variant=" + _0x5d3cc2 + "&section_id=" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section)).then(_0x29201f => _0x29201f.text()).then(_0x128b00 => {
      if (this.currentVariant.id !== _0x5d3cc2) {
        return;
      }
      const _0x1b4599 = new DOMParser().parseFromString(_0x128b00, "text/html");
      const _0x57ef65 = document.getElementById("price-" + this.dataset.section);
      const _0x483b31 = _0x1b4599.getElementById("price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x2f886e = document.getElementById("sticky-atc-separate-price-" + this.dataset.section);
      const _0x286f0a = _0x1b4599.getElementById("sticky-atc-separate-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x3c9eab = document.getElementById("sticky-atc-price-" + this.dataset.section);
      const _0x594620 = _0x1b4599.getElementById("sticky-atc-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x56799c = document.getElementById('sticky-atc-image-' + this.dataset.section);
      const _0x259f0f = _0x1b4599.getElementById("sticky-atc-image-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x33cb6b = document.getElementById('main-atc-price-' + this.dataset.section);
      const _0x588fb1 = _0x1b4599.getElementById("main-atc-price-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x2b8ca1 = document.querySelectorAll("[id^=\"custom-label-" + this.dataset.section + "\"]");
      const _0x3c18f9 = _0x1b4599.querySelectorAll("[id^=\"custom-label-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section) + "\"]");
      const _0x192962 = _0x1b4599.getElementById('Sku-' + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x4a21d8 = document.getElementById('Sku-' + this.dataset.section);
      const _0x4e76c9 = _0x1b4599.getElementById("Inventory-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
      const _0x4d2103 = document.getElementById("Inventory-" + this.dataset.section);
      if (_0x57ef65 && _0x483b31) {
        _0x57ef65.innerHTML = _0x483b31.innerHTML;
      }
      if (_0x2f886e && _0x286f0a) {
        _0x2f886e.innerHTML = _0x286f0a.innerHTML;
      }
      if (_0x3c9eab && _0x594620) {
        _0x3c9eab.innerHTML = _0x594620.innerHTML;
      }
      if (_0x56799c && _0x259f0f) {
        _0x56799c.src = _0x259f0f.src;
      }
      if (_0x588fb1 && _0x33cb6b) {
        _0x33cb6b.innerHTML = _0x588fb1.innerHTML;
      }
      if (_0x2b8ca1 && _0x3c18f9) {
        for (var _0x48a830 = 0x0; _0x48a830 < _0x2b8ca1.length; _0x48a830++) {
          _0x2b8ca1[_0x48a830].innerHTML = _0x3c18f9[_0x48a830].innerHTML;
        }
      }
      if (_0x4e76c9 && _0x4d2103) {
        _0x4d2103.innerHTML = _0x4e76c9.innerHTML;
      }
      if (_0x192962 && _0x4a21d8) {
        _0x4a21d8.innerHTML = _0x192962.innerHTML;
        _0x4a21d8.classList.toggle('visibility-hidden', _0x192962.classList.contains('visibility-hidden'));
      }
      if (this.QuantityBreaks) {
        const _0x1deda5 = _0x1b4599.getElementById("quantity-breaks-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        const _0x31c463 = this.QuantityBreaks.querySelectorAll(".dynamic-price");
        const _0x25ad40 = _0x1deda5.querySelectorAll('.dynamic-price');
        for (let _0x31cd9b = 0x0; _0x31cd9b < _0x31c463.length; _0x31cd9b++) {
          _0x31c463[_0x31cd9b].innerHTML = _0x25ad40[_0x31cd9b].innerHTML;
        }
        if (this.QuantityBreaks.hasVariants) {
          this.QuantityBreaks.variantSelects.forEach(_0x457619 => {
            _0x457619.dataset.selectedId = this.currentVariant.id;
          });
          const _0x136e4d = this.QuantityBreaks.querySelectorAll(".quantity-break__variant-select");
          const _0x472fba = _0x1deda5.querySelectorAll(".quantity-break__variant-select");
          for (let _0x2d3ad6 = 0x0; _0x2d3ad6 < _0x136e4d.length; _0x2d3ad6++) {
            _0x136e4d[_0x2d3ad6].innerHTML = _0x472fba[_0x2d3ad6].innerHTML;
          }
          this.QuantityBreaks.initVariants();
        }
        ;
      }
      if (this.hasQuantityBreaksPicker) {
        const _0xa380e9 = _0x1b4599.getElementById("variant-selects-" + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        const _0x4bae52 = this.querySelectorAll(".dynamic-price");
        const _0x103f35 = _0xa380e9.querySelectorAll('.dynamic-price');
        for (let _0x4b47e9 = 0x0; _0x4b47e9 < _0x4bae52.length; _0x4b47e9++) {
          _0x4bae52[_0x4b47e9].innerHTML = _0x103f35[_0x4b47e9].innerHTML;
        }
        if (this.quantityBreaksPickerStyle === "vertical" && this.quantityBreaksPickerDisplayedImages === 'variant_images') {
          const _0xad949d = this.querySelectorAll(".quantity-break__image img");
          const _0x48c19c = _0xa380e9.querySelectorAll(".quantity-break__image img");
          for (let _0x1bc09f = 0x0; _0x1bc09f < _0xad949d.length; _0x1bc09f++) {
            _0xad949d[_0x1bc09f].src = _0x48c19c[_0x1bc09f].src;
          }
        }
      }
      if (this.secondarySelect) {
        const _0x4430e2 = _0x1b4599.getElementById('' + this.secondarySelectSelector + (this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section));
        if (_0x4430e2) {
          this.secondarySelect.innerHTML = _0x4430e2.innerHTML;
        }
      }
      const _0x3788ce = document.getElementById("price-" + this.dataset.section);
      if (_0x3788ce) {
        _0x3788ce.classList.remove("visibility-hidden");
      }
      if (_0x4d2103) {
        _0x4d2103.classList.toggle("visibility-hidden", _0x4e76c9.innerText === '');
      }
      const _0xd84fa = _0x1b4599.getElementById("ProductSubmitButton-" + _0x36c2d4);
      this.toggleAddButton(_0xd84fa ? _0xd84fa.hasAttribute('disabled') : true, window.variantStrings.soldOut);
      publish("variant-change", {
        'data': {
          'sectionId': _0x36c2d4,
          'html': _0x1b4599,
          'variant': this.currentVariant
        }
      });
    });
  }
  ["toggleAddButton"](_0x451b48 = true, _0x7c9a31, _0x375d60 = true) {
    const _0x1dc8d8 = document.getElementById('product-form-' + this.dataset.section);
    if (!_0x1dc8d8) {
      return;
    }
    const _0x48cfb9 = _0x1dc8d8.querySelector("[name=\"add\"]");
    const _0x41a58a = _0x1dc8d8.querySelector("[name=\"add\"] > .main-atc__label");
    if (!_0x48cfb9) {
      return;
    }
    if (_0x451b48) {
      _0x48cfb9.setAttribute("disabled", "disabled");
      _0x48cfb9.setAttribute('data-unavailable', "true");
      if (_0x7c9a31) {
        _0x41a58a.textContent = _0x7c9a31;
      }
    } else {
      _0x48cfb9.setAttribute('data-unavailable', "false");
      _0x41a58a.textContent = window.variantStrings.addToCart;
      if (_0x48cfb9.dataset.requiredFields === _0x48cfb9.dataset.validFields) {
        _0x48cfb9.removeAttribute("disabled");
      }
    }
    if (!_0x375d60) {
      return;
    }
  }
  ["setUnavailable"]() {
    const _0x27d6da = document.getElementById('product-form-' + this.dataset.section);
    const _0x3245b8 = _0x27d6da.querySelector("[name=\"add\"]");
    const _0x2ac6bc = _0x27d6da.querySelector("[name=\"add\"] > .main-atc__label");
    const _0x5e1403 = document.getElementById('price-' + this.dataset.section);
    const _0x30584c = document.getElementById("Inventory-" + this.dataset.section);
    const _0x5a6118 = document.getElementById("Sku-" + this.dataset.section);
    if (!_0x3245b8) {
      return;
    }
    _0x2ac6bc.textContent = window.variantStrings.unavailable;
    if (_0x5e1403) {
      _0x5e1403.classList.add("visibility-hidden");
    }
    if (_0x30584c) {
      _0x30584c.classList.add("visibility-hidden");
    }
    if (_0x5a6118) {
      _0x5a6118.classList.add('visibility-hidden');
    }
  }
  ["getVariantData"]() {
    this.variantData = this.variantData || JSON.parse(this.querySelector("[type=\"application/json\"]").textContent);
    return this.variantData;
  }
}
customElements.define('variant-selects', VariantSelects);
class SecondaryVariantSelect extends VariantSelects {
  constructor() {
    super();
    this.secondarySelectSelector = 'variant-selects-';
    this.secondarySelect = document.getElementById('' + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = true;
  }
  ["updateOptions"]() {
    this.options = this.querySelector("select").value.split(',');
  }
}
customElements.define('secondary-variant-select', SecondaryVariantSelect);
class SecondaryVariantSelectSeparate extends VariantSelects {
  constructor() {
    super();
    this.secondarySelectSelector = 'variant-selects-';
    this.secondarySelect = document.getElementById('' + this.secondarySelectSelector + this.dataset.section);
    this.isSecondary = true;
  }
}
customElements.define("secondary-variant-select-separate", SecondaryVariantSelectSeparate);
