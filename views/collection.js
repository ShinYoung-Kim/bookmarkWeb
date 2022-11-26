$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});




$('.accordian__item').on('click', function() {
	$(this).addClass('active').siblings().removeClass('active');
});