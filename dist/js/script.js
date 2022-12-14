"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	this.nodes = document.querySelectorAll("[data-da]");
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();

//========================================================================================================================================================
//popups
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 300;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock-popup');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock-popup');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});

(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();
//========================================================================================================================================================

function ibg() {
	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}
ibg();

//========================================================================================================================================================

let mainSlider = document.querySelectorAll('.main');
if (mainSlider.length > 0) {
	mainSlider = new Swiper('.main', {
		wrapperClass: "main__wrapper",
		slideClass: "main__screen",
		slidesPerView: 1,
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		centeredSlides: true,
		navigation: {
			nextEl: ".main__next",
			prevEl: ".main__prev",
		},
		scrollbar: {
			el: '.main__scrollbar',
			dragClass: "main__drag-scroll"
		}
	});
};

let brandsSlider = document.querySelectorAll('.our-brands__wrapper');
if (brandsSlider.length > 0) {
	brandsSlider = new Swiper('.our-brands__wrapper', {
		wrapperClass: "our-brands__body",
		slideClass: "our-brands__item",
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		loop: true,
		slidesPerView: 'auto',
		autoplay: {
			delay: 2500,
		},
		navigation: {
			nextEl: ".our-brands__controls",
		},
		breakpoints: {
			320: {
				centeredSlides: false,
				allowTouchMove: true,
			},
			575.98: {
				centeredSlides: true,
			},
			1199.98: {
				centeredSlides: true,
				allowTouchMove: false,
			},
		}
	});
};

let topSlider = document.querySelectorAll('.top__wrapper-top');
if (topSlider.length > 0) {
	topSlider = new Swiper('.top__wrapper-top', {
		wrapperClass: "top__body-top",
		slideClass: "top__item",
		slidesPerView: 'auto',
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		autoplay: {
			delay: 2500,
		},
		// loop: true,
		scrollbar: {
			el: '.top__scrollbar-top',
			dragClass: "top__drag-scroll-top",
			draggable: true,
			dragSize: 100,
		},
	});
};

let topBottomSlider = document.querySelectorAll('.top__wrapper-bottom');
if (topBottomSlider.length > 0) {
	topBottomSlider = new Swiper('.top__wrapper-bottom', {
		wrapperClass: "top__body-bottom",
		slideClass: "top__item",
		slidesPerView: 'auto',
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		autoplay: {
			delay: 2500,
		},
		// loop: true,
		scrollbar: {
			el: '.top__scrollbar-bottom',
			dragClass: "top__drag-scroll-bottom",
			draggable: true,
			dragSize: 100,
		},
	});
};

let sliderCards = document.querySelectorAll('.slider-cards__wrapper');
if (sliderCards.length > 0) {
	sliderCards = new Swiper('.slider-cards__wrapper', {
		wrapperClass: "slider-cards__body",
		slideClass: "slider-cards__item",
		slidesPerView: 'auto',
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		loop: true,
		autoplay: {
			delay: 2500,
		},
	});
};

let businessSlider = document.querySelectorAll('.business__wrapper');
if (businessSlider.length > 0) {
	businessSlider = new Swiper('.business__wrapper', {
		wrapperClass: "business__body",
		slideClass: "business__item",
		direction: 'vertical',
		slidesPerView: 'auto',
		speed: 500,
		mousewheel: {
			sensitivity: 1,
		},
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		scrollbar: {
			el: '.business__scroll',
			dragClass: "business__drag-scroll",
			draggable: true,
			dragSize: 40,
		},
	});
};


let productCardSlider = document.querySelectorAll('.product-card__sliders');
if (productCardSlider.length > 0) {
	let productCardSubSlider = new Swiper(".sub-slider-product-card", {
		wrapperClass: "slider-product-card__body",
		slideClass: "slider-product-card__item",
		spaceBetween: 10,
		slidesPerView: 4,
		freeMode: true,
		watchSlidesProgress: true,
		breakpoints: {
			320.98: {
				slidesPerView: 5,
			},
			575.98: {
				slidesPerView: 6,
			},
			767.98: {
				slidesPerView: 3,
			},
			991.98: {
				slidesPerView: 4,
			},
		}
	});
	let productCardMainSlider = new Swiper(".main-slider-product-card", {
		wrapperClass: "slider-product-card__body",
		slideClass: "slider-product-card__item",
		spaceBetween: 10,
		thumbs: {
			swiper: productCardSubSlider,
		},
	});
};

let similarSlider = document.querySelectorAll('.similar__wrapper');
if (similarSlider.length > 0) {
	similarSlider = new Swiper('.similar__wrapper', {
		wrapperClass: "similar__body",
		slideClass: "similar__item",
		slidesPerView: 'auto',
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		loop: true,
		scrollbar: {
			el: '.similar__scrollbar',
			dragClass: "similar__drag-scroll",
			draggable: true,
			dragSize: 100,
		},
	});
};

let testimonialsSlider = document.querySelectorAll('.testimonials__wrapper');
if (testimonialsSlider.length > 0) {
	testimonialsSlider = new Swiper('.testimonials__wrapper', {
		wrapperClass: "testimonials__body",
		slideClass: "testimonials__item",
		direction: 'vertical',
		slidesPerView: 'auto',
		speed: 500,
		mousewheel: {
			sensitivity: 1,
		},
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		scrollbar: {
			el: '.testimonials__scroll',
			dragClass: "testimonials__drag-scroll",
			draggable: true,
			dragSize: 40,
		},
		navigation: {
			nextEl: ".testimonials__rounded",
		},
	});
};

let otherBrandsSlider = document.querySelectorAll('.other-brands__wrapper');
if (otherBrandsSlider.length > 0) {
	otherBrandsSlider = new Swiper('.other-brands__wrapper', {
		wrapperClass: "other-brands__body",
		slideClass: "other-brands__item",
		slidesPerView: 'auto',
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		loop: true,
		autoplay: {
			delay: 2500,
		},
		scrollbar: {
			el: '.other-brands__scrollbar',
			dragClass: "other-brands__drag-scroll",
			draggable: true,
			dragSize: 100,
		},
	});
};

let saleSlider = document.querySelectorAll('.sale__wrapper');
if (saleSlider.length > 0) {
	saleSlider = new Swiper('.sale__wrapper', {
		wrapperClass: "sale__body",
		slideClass: "sale__item",
		slidesPerView: 1,
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		centeredSlides: true,
		navigation: {
			nextEl: ".sale__button-next",
			prevEl: ".sale__button-prev",
		},
		scrollbar: {
			el: '.sale__scrollbar',
			dragClass: "sale__drag-scroll"
		}
	});
};

let cartSlider = document.querySelectorAll('.cart__wrapper');
if (cartSlider.length > 0) {
	cartSlider = new Swiper('.cart__wrapper', {
		wrapperClass: "cart__body",
		slideClass: "cart__item",
		direction: 'vertical',
		slidesPerView: 'auto',
		speed: 500,
		mousewheel: {
			sensitivity: 1,
		},
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		scrollbar: {
			el: '.cart__scroll',
			dragClass: "cart__drag-scroll",
			draggable: true,
			dragSize: 40,
		},
	});
};


//========================================================================================================================================================

let news = document.querySelectorAll('.news');
if (news.length > 0) {
	if (document.documentElement.clientWidth > 991.98) {
		document.addEventListener('mousemove', e => {
			move.style.left = e.pageX + "px";
			move.style.top = e.pageY + "px";

			move2.style.left = e.pageX + "px";
			move2.style.top = e.pageY + "px";

			move3.style.left = e.pageX + "px";
			move3.style.top = e.pageY + "px";

			move4.style.left = e.pageX + "px";
			move4.style.top = e.pageY + "px";
		});
	}
};

let newsMore = document.querySelectorAll('.news-company');
if (newsMore.length > 0) {
	if (document.documentElement.clientWidth > 991.98) {
		document.addEventListener('mousemove', e => {
			move.style.left = e.pageX + "px";
			move.style.top = e.pageY + "px";

			move2.style.left = e.pageX + "px";
			move2.style.top = e.pageY + "px";

			move3.style.left = e.pageX + "px";
			move3.style.top = e.pageY + "px";

			move4.style.left = e.pageX + "px";
			move4.style.top = e.pageY + "px";

			move5.style.left = e.pageX + "px";
			move5.style.top = e.pageY + "px";

			move6.style.left = e.pageX + "px";
			move6.style.top = e.pageY + "px";

			move7.style.left = e.pageX + "px";
			move7.style.top = e.pageY + "px";

			move8.style.left = e.pageX + "px";
			move8.style.top = e.pageY + "px";
		});
	}
};

let cards = document.querySelectorAll('.cards-main');
if (cards.length > 0) {
	if (document.documentElement.clientWidth > 991.98) {
		document.addEventListener('mousemove', e => {
			moreCards01.style.left = e.pageX + "px";
			moreCards01.style.top = e.pageY + "px";

			moreCards02.style.left = e.pageX + "px";
			moreCards02.style.top = e.pageY + "px";

			moreCards03.style.left = e.pageX + "px";
			moreCards03.style.top = e.pageY + "px";

			moreCards04.style.left = e.pageX + "px";
			moreCards04.style.top = e.pageY + "px";
		});
	}
};

let cardsPrograms = document.querySelectorAll('.cards-programs');
if (cardsPrograms.length > 0) {
	if (document.documentElement.clientWidth > 991.98) {
		document.addEventListener('mousemove', e => {
			moreCardsPrograms01.style.left = e.pageX + "px";
			moreCardsPrograms01.style.top = e.pageY + "px";

			moreCardsPrograms02.style.left = e.pageX + "px";
			moreCardsPrograms02.style.top = e.pageY + "px";

			moreCardsPrograms03.style.left = e.pageX + "px";
			moreCardsPrograms03.style.top = e.pageY + "px";
		});
	}
};


let cardsPopupsStore = document.querySelectorAll('.popup-cards-store');
if (cardsPopupsStore.length > 0) {
	if (document.documentElement.clientWidth > 991.98) {
		let item01 = document.querySelector("#popupCards01");
		let item02 = document.querySelector("#popupCards02");
		let item03 = document.querySelector("#popupCards03");
		let item04 = document.querySelector("#popupCards04");

		let cardsWrapper01 = document.querySelector("#cardsWrapper01");
		let cardsWrapper02 = document.querySelector("#cardsWrapper02");
		let cardsWrapper03 = document.querySelector("#cardsWrapper03");
		let cardsWrapper04 = document.querySelector("#cardsWrapper04");

		cardsWrapper01.onmousemove = function (e) {
			item01.style.position = 'fixed';
			item01.style.left = e.clientX + 'px';
			item01.style.top = e.clientY + 'px';
		};
		cardsWrapper02.onmousemove = function (e) {
			item02.style.position = 'fixed';
			item02.style.left = e.clientX + 'px';
			item02.style.top = e.clientY + 'px';
		};
		cardsWrapper03.onmousemove = function (e) {
			item03.style.position = 'fixed';
			item03.style.left = e.clientX + 'px';
			item03.style.top = e.clientY + 'px';
		};
		cardsWrapper04.onmousemove = function (e) {
			item04.style.position = 'fixed';
			item04.style.left = e.clientX + 'px';
			item04.style.top = e.clientY + 'px';
		};
	}
};

let cardsPopupsCompany = document.querySelectorAll('.popup-cards-company');
if (cardsPopupsCompany.length > 0) {
	if (document.documentElement.clientWidth > 991.98) {
		let item01 = document.querySelector("#popupCardsCompany01");
		let item02 = document.querySelector("#popupCardsCompany02");
		let item03 = document.querySelector("#popupCardsCompany03");
		let item04 = document.querySelector("#popupCardsCompany04");

		let cardsWrapper01 = document.querySelector("#cardsWrapperCompany01");
		let cardsWrapper02 = document.querySelector("#cardsWrapperCompany02");
		let cardsWrapper03 = document.querySelector("#cardsWrapperCompany03");
		let cardsWrapper04 = document.querySelector("#cardsWrapperCompany04");

		cardsWrapper01.onmousemove = function (e) {
			item01.style.position = 'fixed';
			item01.style.left = e.clientX + 'px';
			item01.style.top = e.clientY + 'px';
		};
		cardsWrapper02.onmousemove = function (e) {
			item02.style.position = 'fixed';
			item02.style.left = e.clientX + 'px';
			item02.style.top = e.clientY + 'px';
		};
		cardsWrapper03.onmousemove = function (e) {
			item03.style.position = 'fixed';
			item03.style.left = e.clientX + 'px';
			item03.style.top = e.clientY + 'px';
		};
		cardsWrapper04.onmousemove = function (e) {
			item04.style.position = 'fixed';
			item04.style.left = e.clientX + 'px';
			item04.style.top = e.clientY + 'px';
		};
	}
};
//========================================================================================================================================================

let selecton = document.querySelectorAll('.filter');
if (selecton.length > 0) {
	//Select
	let selects = document.getElementsByTagName('select');
	if (selects.length > 0) {
		selects_init();
	}
	function selects_init() {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			select_init(select);
		}
		//select_callback();
		document.addEventListener('click', function (e) {
			selects_close(e);
		});
		document.addEventListener('keydown', function (e) {
			if (e.which == 27) {
				selects_close(e);
			}
		});
	}
	function selects_close(e) {
		const selects = document.querySelectorAll('.select');
		if (!e.target.closest('.select')) {
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				const select_body_options = select.querySelector('.select__options');
				select.classList.remove('_active');
				_slideUp(select_body_options, 100);
			}
		}
	}
	function select_init(select) {
		const select_parent = select.parentElement;
		const select_modifikator = select.getAttribute('class');
		const select_selected_option = select.querySelector('option:checked');
		select.setAttribute('data-default', select_selected_option.value);
		select.style.display = 'none';

		select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

		let new_select = select.parentElement.querySelector('.select');
		new_select.appendChild(select);
		select_item(select);
	}
	function select_item(select) {
		const select_parent = select.parentElement;
		const select_items = select_parent.querySelector('.select__item');
		const select_options = select.querySelectorAll('option');
		const select_selected_option = select.querySelector('option:checked');
		const select_selected_text = select_selected_option.text;
		const select_type = select.getAttribute('data-type');

		if (select_items) {
			select_items.remove();
		}

		let select_type_content = '';
		if (select_type == 'input') {
			select_type_content = '<div class="select__value"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
		} else {
			select_type_content = '<div class="select__value"><span>' + select_selected_text + '</span></div>';
		}

		select_parent.insertAdjacentHTML('beforeend',
			'<div class="select__item">' +
			'<div class="select__title">' + select_type_content + '</div>' +
			'<div class="select__options">' + select_get_options(select_options) + '</div>' +
			'</div></div>');

		select_actions(select, select_parent);
	}
	function select_actions(original, select) {
		const select_item = select.querySelector('.select__item');
		const select_body_options = select.querySelector('.select__options');
		const select_options = select.querySelectorAll('.select__option');
		const select_type = original.getAttribute('data-type');
		const select_input = select.querySelector('.select__input');

		select_item.addEventListener('click', function () {
			let selects = document.querySelectorAll('.select');
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				const select_body_options = select.querySelector('.select__options');
				if (select != select_item.closest('.select')) {
					select.classList.remove('_active');
					_slideUp(select_body_options, 100);
				}
			}
			_slideToggle(select_body_options, 100);
			select.classList.toggle('_active');
		});

		for (let index = 0; index < select_options.length; index++) {
			const select_option = select_options[index];
			const select_option_value = select_option.getAttribute('data-value');
			const select_option_text = select_option.innerHTML;

			if (select_type == 'input') {
				select_input.addEventListener('keyup', select_search);
			} else {
				if (select_option.getAttribute('data-value') == original.value) {
					select_option.style.display = 'none';
				}
			}
			select_option.addEventListener('click', function () {
				for (let index = 0; index < select_options.length; index++) {
					const el = select_options[index];
					el.style.display = 'block';
				}
				if (select_type == 'input') {
					select_input.value = select_option_text;
					original.value = select_option_value;
				} else {
					select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
					original.value = select_option_value;
					select_option.style.display = 'none';
				}
			});
		}
	}
	function select_get_options(select_options) {
		if (select_options) {
			let select_options_content = '';
			for (let index = 0; index < select_options.length; index++) {
				const select_option = select_options[index];
				const select_option_value = select_option.value;
				if (select_option_value != '') {
					const select_option_text = select_option.text;
					select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
				}
			}
			return select_options_content;
		}
	}
	function select_search(e) {
		let select_block = e.target.closest('.select ').querySelector('.select__options');
		let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
		let select_search_text = e.target.value.toUpperCase();

		for (let i = 0; i < select_options.length; i++) {
			let select_option = select_options[i];
			let select_txt_value = select_option.textContent || select_option.innerText;
			if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
				select_option.style.display = "";
			} else {
				select_option.style.display = "none";
			}
		}
	}
	function selects_update_all() {
		let selects = document.querySelectorAll('select');
		if (selects) {
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				select_item(select);
			}
		}
	}


	let _slideUp = (target, duration = 500) => {
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.style.display = 'none';
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
	let _slideDown = (target, duration = 500) => {
		target.style.removeProperty('display');
		let display = window.getComputedStyle(target).display;
		if (display === 'none')
			display = 'block';

		target.style.display = display;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
	let _slideToggle = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (window.getComputedStyle(target).display === 'none') {
				return _slideDown(target, duration);
			} else {
				return _slideUp(target, duration);
			}
		}
	}
};





let selectonTwo = document.querySelectorAll('.form-edit-order');
if (selectonTwo.length > 0) {
	//Select
	let selects = document.getElementsByTagName('select');
	if (selects.length > 0) {
		selects_init();
	}
	function selects_init() {
		for (let index = 0; index < selects.length; index++) {
			const select = selects[index];
			select_init(select);
		}
		//select_callback();
		document.addEventListener('click', function (e) {
			selects_close(e);
		});
		document.addEventListener('keydown', function (e) {
			if (e.which == 27) {
				selects_close(e);
			}
		});
	}
	function selects_close(e) {
		const selects = document.querySelectorAll('.select');
		if (!e.target.closest('.select')) {
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				const select_body_options = select.querySelector('.select__options');
				select.classList.remove('_active');
				_slideUp(select_body_options, 100);
			}
		}
	}
	function select_init(select) {
		const select_parent = select.parentElement;
		const select_modifikator = select.getAttribute('class');
		const select_selected_option = select.querySelector('option:checked');
		select.setAttribute('data-default', select_selected_option.value);
		select.style.display = 'none';

		select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

		let new_select = select.parentElement.querySelector('.select');
		new_select.appendChild(select);
		select_item(select);
	}
	function select_item(select) {
		const select_parent = select.parentElement;
		const select_items = select_parent.querySelector('.select__item');
		const select_options = select.querySelectorAll('option');
		const select_selected_option = select.querySelector('option:checked');
		const select_selected_text = select_selected_option.text;
		const select_type = select.getAttribute('data-type');

		if (select_items) {
			select_items.remove();
		}

		let select_type_content = '';
		if (select_type == 'input') {
			select_type_content = '<div class="select__value"><input autocomplete="off" type="text" name="form[]" value="' + select_selected_text + '" data-error="Ошибка" data-value="' + select_selected_text + '" class="select__input"></div>';
		} else {
			select_type_content = '<div class="select__value"><span>' + select_selected_text + '</span></div>';
		}

		select_parent.insertAdjacentHTML('beforeend',
			'<div class="select__item">' +
			'<div class="select__title">' + select_type_content + '</div>' +
			'<div class="select__options">' + select_get_options(select_options) + '</div>' +
			'</div></div>');

		select_actions(select, select_parent);
	}
	function select_actions(original, select) {
		const select_item = select.querySelector('.select__item');
		const select_body_options = select.querySelector('.select__options');
		const select_options = select.querySelectorAll('.select__option');
		const select_type = original.getAttribute('data-type');
		const select_input = select.querySelector('.select__input');

		select_item.addEventListener('click', function () {
			let selects = document.querySelectorAll('.select');
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				const select_body_options = select.querySelector('.select__options');
				if (select != select_item.closest('.select')) {
					select.classList.remove('_active');
					_slideUp(select_body_options, 100);
				}
			}
			_slideToggle(select_body_options, 100);
			select.classList.toggle('_active');
		});

		for (let index = 0; index < select_options.length; index++) {
			const select_option = select_options[index];
			const select_option_value = select_option.getAttribute('data-value');
			const select_option_text = select_option.innerHTML;

			if (select_type == 'input') {
				select_input.addEventListener('keyup', select_search);
			} else {
				if (select_option.getAttribute('data-value') == original.value) {
					select_option.style.display = 'none';
				}
			}
			select_option.addEventListener('click', function () {
				for (let index = 0; index < select_options.length; index++) {
					const el = select_options[index];
					el.style.display = 'block';
				}
				if (select_type == 'input') {
					select_input.value = select_option_text;
					original.value = select_option_value;
				} else {
					select.querySelector('.select__value').innerHTML = '<span>' + select_option_text + '</span>';
					original.value = select_option_value;
					select_option.style.display = 'none';
				}
			});
		}
	}
	function select_get_options(select_options) {
		if (select_options) {
			let select_options_content = '';
			for (let index = 0; index < select_options.length; index++) {
				const select_option = select_options[index];
				const select_option_value = select_option.value;
				if (select_option_value != '') {
					const select_option_text = select_option.text;
					select_options_content = select_options_content + '<div data-value="' + select_option_value + '" class="select__option">' + select_option_text + '</div>';
				}
			}
			return select_options_content;
		}
	}
	function select_search(e) {
		let select_block = e.target.closest('.select ').querySelector('.select__options');
		let select_options = e.target.closest('.select ').querySelectorAll('.select__option');
		let select_search_text = e.target.value.toUpperCase();

		for (let i = 0; i < select_options.length; i++) {
			let select_option = select_options[i];
			let select_txt_value = select_option.textContent || select_option.innerText;
			if (select_txt_value.toUpperCase().indexOf(select_search_text) > -1) {
				select_option.style.display = "";
			} else {
				select_option.style.display = "none";
			}
		}
	}
	function selects_update_all() {
		let selects = document.querySelectorAll('select');
		if (selects) {
			for (let index = 0; index < selects.length; index++) {
				const select = selects[index];
				select_item(select);
			}
		}
	}


	let _slideUp = (target, duration = 500) => {
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.style.display = 'none';
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
	let _slideDown = (target, duration = 500) => {
		target.style.removeProperty('display');
		let display = window.getComputedStyle(target).display;
		if (display === 'none')
			display = 'block';

		target.style.display = display;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
	let _slideToggle = (target, duration = 500) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			if (window.getComputedStyle(target).display === 'none') {
				return _slideDown(target, duration);
			} else {
				return _slideUp(target, duration);
			}
		}
	}
};

//========================================================================================================================================================

let quantityButtons = document.querySelectorAll('.quantity-product-card__button');
if (quantityButtons.length > 0) {
	for (let index = 0; index < quantityButtons.length; index++) {
		const quantityButton = quantityButtons[index];
		quantityButton.addEventListener("click", function (e) {
			let value = parseInt(quantityButton.closest('.quantity-product-card').querySelector('input').value);
			if (quantityButton.classList.contains('quantity-product-card__button-plus')) {
				value++;
			} else {
				value = value - 1;
				if (value < 1) {
					value = 1
				}
			}
			quantityButton.closest('.quantity-product-card').querySelector('input').value = value;
		});
	}
}
//========================================================================================================================================================

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			document.querySelectorAll('.partners__heart').forEach((link) => {
				if (link.getAttribute('href').replace('#', '') === entry.target.id) {
					link.classList.add('active');
				} else {
					link.classList.remove('active');
				}
			});
			document.querySelectorAll('.partners__column-ukraine').forEach((link) => {
				if (link.getAttribute('href').replace('#', '') === entry.target.id) {
					link.classList.add('active');
				} else {
					link.classList.remove('active');
				}
			});
			document.querySelectorAll('.partners__label').forEach((link) => {
				if (link.getAttribute('href').replace('#', '') === entry.target.id) {
					link.classList.add('active');
				} else {
					link.classList.remove('active');
				}
			});
		}
	});
}, {
	threshold: 1,
});
document.querySelectorAll('section').forEach(
	(section) => observer.observe(section),
);


//========================================================================================================================================================


//========================================================================================================================================================

$(document).ready(function () {

	$('.actions-top-header__lang').click(function (event) {
		$(this).toggleClass('active').next().toggleClass('active');
	});

	$('.menu__icon').click(function (event) {
		$('.menu__icon,.menu__body').toggleClass('active');
		$('body').toggleClass('lock');
	});

	$('.side__link-arrow').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$(".product-tabs__item").not(":first").hide();
	$(".product-tabs__wrapper .product-tabs__tab").click(function () {
		$(".product-tabs__wrapper .product-tabs__tab").removeClass("active").eq($(this).index()).addClass("active");
		$(".product-tabs__item").hide().eq($(this).index()).fadeIn();
	}).eq(0).addClass("active");

	$('.item-testimonials__more').click(function (event) {
		$(this).toggleClass('active').prev().slideToggle(300);
	});

	$('.item-testimonials__more').click(function () {
		if ($(this).attr('data-show') === "true") {
			$(this).html("Скрыть");
			$(this).attr('data-show', "false");
		}
		else {
			$(this).html("Cмотреть весь");
			$(this).attr('data-show', "true");
		}
	});

	$(".tabs-brand-page__item").not(":first").hide();
	$(".tabs-brand-page__wrapper .tabs-brand-page__tab").click(function () {
		$(".tabs-brand-page__wrapper .tabs-brand-page__tab").removeClass("active").eq($(this).index()).addClass("active");
		$(".tabs-brand-page__item").hide().eq($(this).index()).fadeIn();
	}).eq(0).addClass("active");

	$('.item-authorization__label').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$('.delivery-ordering__item-curier').click(function (event) {
		$(this).addClass('active');
		$('.delivery-ordering__address-wrapper-curier').addClass('active');
		$('.delivery-ordering__address-wrapper-delivery').removeClass('active');
	});

	$('.delivery-ordering__item').not('.delivery-ordering__item-curier').click(function (event) {
		$(this).addClass('active');
		$('.delivery-ordering__address-wrapper-curier').removeClass('active');
		$('.delivery-ordering__address-wrapper-delivery').addClass('active');
	});



	$('.form-edit-order__item-curier').click(function (event) {
		$(this).addClass('active');
		$('.form-edit-order__address-delivery-curier').addClass('active');
		$('.form-edit-order__address-delivery-address').removeClass('active');
	});

	$('.form-edit-order__item').not('.form-edit-order__item-curier').click(function (event) {
		$(this).addClass('active');
		$('.form-edit-order__address-delivery-curier').removeClass('active');
		$('.form-edit-order__address-delivery-address').addClass('active');
	});

	$('.item-orders').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$('.orders__link').click(function () {
		if ($(this).attr('data-show') === "true") {
			$(this).html("Скрыть");
			$(this).attr('data-show', "false");
			$('.orders__body-more').slideToggle(300);
		}
		else {
			$(this).html("смотреть БОЛЬШЕ");
			$(this).attr('data-show', "true");
			$('.orders__body-more').slideToggle(300);
		}
	});

	$('.popup-authorization__form').validate({
		rules: {
			popupAuthorizationLogin: {
				required: true,
				email: true
			},
			popupAuthorizationPassword: "required"
		},
		messages: {
			popupAuthorizationLogin: {
				required: "Введите логин",
				email: "Такой логин не найден"
			},
			popupAuthorizationPassword: "Введите пароль"
		},
	});

	$('.popup-registration__form-validate').validate({
		rules: {
			popupRegistrationTel: {
				required: true,
				number: true
			}
		},
		messages: {
			popupRegistrationTel: {
				required: "Не корректный телефон"
			}
		},
	});


	$('.item-unit-mobile').click(function (event) {
		$(this).toggleClass('active').next().slideToggle(300);
	});

	$(window).scroll(function () {
		let top = $(document).scrollTop();
		if (top > 50) {

			$(".top-header").css({
				boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
				transition: ' all 0.3s ease'
			});


		} else {
			$(".top-header").css({
				boxShadow: 'none',
				transition: ' all 0.3s ease'
			});
		}
	});


});
jQuery(($) => {
	// if ($(window).width() < 991.98) {
	// 	$('.menu__link-arrow-mobile').click(function (event) {
	// 		$(this).toggleClass('active').next().slideToggle(300);
	// 	});
	// }
	if ($(window).width() > 991.98) {
		$(window).scroll(function () {
			let top = $(document).scrollTop();
			if (top > 50) {

				$(".bottom-header-main,.menu__sub-list-main").css({
					background: '#aaaaaa'
				});

				$(".bottom-header").css({
					opacity: '0',
					visibility: 'hidden',
					transition: ' all 0.3s ease'
				});
			} else {

				$(".bottom-header-main,.menu__sub-list-main").css({
					background: 'rgba(42, 42, 42, 0.4)',
					transition: ' all 0.3s ease'
				});

				$(".bottom-header").css({
					opacity: '1',
					visibility: 'visible',
					transition: ' all 0.3s ease'
				});
			}
		});
	}
});


let topHeader = document.querySelector('.top-header');
let bottomHeader = document.querySelector('.bottom-header');

topHeader.addEventListener('mouseenter', function () {
	bottomHeader.style.opacity = '1';
	bottomHeader.style.visibility = 'visible';
	topHeader.style.boxShadow = 'none';
});

