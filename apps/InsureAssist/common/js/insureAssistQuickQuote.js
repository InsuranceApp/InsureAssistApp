/**
 * 
 */

$(window).load(function() {
	WL.Logger.debug("here");
		$('.insureAssistButton').css('background-color', '#0088b8');
	});
	function invokeQuickQuoteAPI(){
	
		var rtoLocation =  document.getElementById("rtoLocationSelector").value;
		var regDate = document.getElementById("regdate").value; 
		var manufacturer = document.getElementById("manufacturer").value;
		var model = document.getElementById("model").value;
		alert("I am here alert");
		var invocationData = {
        adapter : 'InsureAssistQuickQuoteRestAdapter', 
        procedure : 'getInsureAssistQuickQuoteRestAdapter', 
        parameters : []
        
        };
        
        var options = {
        onSuccess : loadSuccess,
		onFailure : loadFailure
        }
    
        WL.Client.invokeProcedure(invocationData,options);
		
}
function loadSuccess(result){
	WL.Logger.info("result");
}

function loadFailure(){
	WL.Logger.error("Retrieve failure");
}