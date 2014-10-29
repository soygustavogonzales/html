$(document).ready(function(){
	
	$window=$(window);
	$('section[data-type="background"]').each(function(){
		var $bgobj=$(this);
		$(window).scroll(function(){
			var yPos=($window.scrollTop()/$bgobj.data('speed'));

			var coords='50'+yPos+"px";
			$bgobj.css({"backgroundPosition":coords});
		});//window scrool end


	});//end each on section

});//end document ready
/*

A continuacion creo las etiquetas, section y article que
no son sopotadas por navegadores antiguos(ie6)

var article=document.createElement("article");
var section=document.createElement("section");
document.document.appendChild(article);
document.document.appendChild(section);
*/