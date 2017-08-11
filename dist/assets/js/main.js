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
	
});