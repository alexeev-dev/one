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
	$('.responsive-menu').click(function(){
		$('.main-menu > ul').toggleClass('active');

		return false;
	});

	//things-menu
	$('.buy-nav-resp').click(function(){
		$('.buy-nav > ul, .buy-nav-resp').toggleClass('active');

		return false;
	});

	//filter
	$('.filter-resp').click(function(){
		$('.filter-resp, .search-block .search-area, .filter > .select-area, .filter .search-block .price').toggleClass('active');

		return false;
	});


	//profile tabs
	$('.my-menu').click(function(){
		$('.profile-tabs > ul, .my-menu').toggleClass('active');

		return false;
	});

	
	
});