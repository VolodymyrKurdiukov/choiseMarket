"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
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

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
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

// Функция перемещения
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

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
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

function ibg() {
	let ibg = document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
		}
	}
}
ibg();


let mainSlider = document.querySelectorAll('.main');
if (mainSlider.length > 0) {
	let mainSlider = new Swiper('.main', {
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
	let brandsSlider = new Swiper('.our-brands__wrapper', {
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
				spaceBetween: 15,
				allowTouchMove: true,
			},
			575: {
				centeredSlides: true,
				allowTouchMove: false,
			},
		}
	});
};

let topSlider = document.querySelectorAll('.top__wrapper-top');
if (topSlider.length > 0) {
	let topSlider = new Swiper('.top__wrapper-top', {
		wrapperClass: "top__body-top",
		slideClass: "top__item",
		slidesPerView: 'auto',
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		loop: true,
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
	let topBottomSlider = new Swiper('.top__wrapper-bottom', {
		wrapperClass: "top__body-bottom",
		slideClass: "top__item",
		slidesPerView: 'auto',
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		loop: true,
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
	let sliderCards = new Swiper('.slider-cards__wrapper', {
		wrapperClass: "slider-cards__body",
		slideClass: "slider-cards__item",
		slidesPerView: 'auto',
		watchOverFlow: true,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		speed: 1000,
		loop: true,
	});
};

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

let cards = document.querySelectorAll('.cards');
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

	if ($(window).width() < 991.98) {
		$('.menu__link-arrow').click(function (event) {
			$(this).toggleClass('active').next().slideToggle(300);
		});
	}
});