$(function(){
	var img = $("img");
	var num = 0;
	img.each(function(i){
		var oImg = new Image();
		oImg.onload = function(){
			oImg.onload=null;
			num++;
			$("#loading b").html(parseInt(num/$("img").length*100)+'%')
			if(img.length==num){
				$("#loading").fadeOut();
			}
		}
		oImg.src = img[i].src;
	})
})