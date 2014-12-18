//Follow Button Effect

$(document).ready(

	function iniciar(){
		$('.follow').on("click", function(){
			$('.follow').css('background-color','#34CF7A');
			$('.follow').html('<div class="icon-ok"></div> Following');
		});	
	}

);