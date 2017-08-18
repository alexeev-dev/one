$(document).ready(function() {

	// new post page: project list
	$('.js-projectListToggle').click(function(){
		$('.js-projectList').toggleClass('active');

		return false;
	});
	
	$('.js-projectListAction li a').click(function(){
		$('.js-projectList').removeClass('active');

		return false;
	});

	//main-menu
	$('.my-menu').click(function(){
		$('.profile-tabs > ul, .my-menu').toggleClass('active');

		return false;
	});

	//profile tabs
	$('.responsive-menu').click(function(){
		$('.main-menu > ul').toggleClass('active');

		return false;
	});
	
});