
$(document).ready(function(){

	$('.date').mask('00/00/0000');
	$('.cpf').mask('000.000.000-00', {reverse: true});
	$('.phone').mask('(00) 00000-0000');


});

document.addEventListener('DOMContentLoaded', function() {

	$('.sidenav').sidenav();
	$('.collapsible').collapsible();
	$('select').formSelect();

})


