$(document).ready(function () {
	$('.actions-top-header__lang').click(function (event) {
		$(this).toggleClass('active').next().toggleClass('active');
	});
});