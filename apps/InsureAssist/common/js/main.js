/*
 * COPYRIGHT LICENSE: This information contains sample code provided in source code form. You may copy, modify, and distribute
 * these sample programs in any form without payment to IBM® for the purposes of developing, using, marketing or distributing
 * application programs conforming to the application programming interface for the operating platform for which the sample code is written.
 * Notwithstanding anything to the contrary, IBM PROVIDES THE SAMPLE SOURCE CODE ON AN "AS IS" BASIS AND IBM DISCLAIMS ALL WARRANTIES,
 * EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTIES OR CONDITIONS OF MERCHANTABILITY, SATISFACTORY QUALITY,
 * FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND ANY WARRANTY OR CONDITION OF NON-INFRINGEMENT. IBM SHALL NOT BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR OPERATION OF THE SAMPLE SOURCE CODE.
 * IBM HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS OR MODIFICATIONS TO THE SAMPLE SOURCE CODE.
 */
var pagesHistory = [];
var currentPage = {};
var path = "";

function wlCommonInit(){
	// Special case for Windows Phone 8 only.
	if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
	    path = "www/default/";
	}
	
	$("#pagePort").load(path + "pages/insureAssistLogin.html", function(){
		$.getScript(path + "js/main.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
			WL.Logger.info("inside main.js");
		});
	});
}



function submit(){
	pagesHistory.push(path + "pages/insureAssistLogin.html");
	$("#pagePort").load(path + "pages/InsureAssistQuickQuote.html");
};

function quickQuote(){
	pagesHistory.push(path + "pages/InsureAssistQuickQuote.html");
	$("#pagePort").load(path + "pages/InsureAssistQuoteResult.html", function callAPI(){
			try{
			WL.Logger.info("adapter is invoked");
		          var invocationData = {
		                  adapter : 'InsureAssistQuickQuoteRestAdapter',
		                  procedure : 'getInsureAssistQuickQuoteRestAdapter',
		                  parameters : []
		              };

		          WL.Client.invokeProcedure(invocationData,{
		              onSuccess : getAPICallSuccess,
		              onFailure : getAPICallFailure,
		          });
			}
			catch(e){
				console.log(e instanceof TypeError);
				console.log(e.message);
			}
		 
	});
};






function getAPICallSuccess(result){
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	WL.Logger.info("success"+responseText);
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	var array = array[0];
	var price = array['price'];
	var idv = array['idv'];
	alert("price is: "+price+" idv is: "+idv);
	var label=document.getElementById("yearlyPremium");
	label.setAttribute("value", price)
	WL.Logger.info("after label"+label.getAttribute("value"));
	//document.getElementById('yearlyPremium').valueOf(price);
	
	WL.Logger.info("after");
}

function getAPICallFailure(){
	alert("failure");
}


