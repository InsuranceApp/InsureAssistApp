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
var regCity = "";
var regModel = "";

function wlCommonInit(){
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

/*
 * 
 * onClick of GetQuote from login page
 * CityAndManufacturerAPI is invoked
 * 
 */

function submit(){
	pagesHistory.push(path + "pages/insureAssistLogin.html");
	/*
	 * InsureAssistQuickQuote page is loaded and callCityAndManufacturerAPI is invoked
	 * 
	 */
	$("#pagePort").load(path + "pages/InsureAssistQuickQuote.html", function callCityAndManufacturerAPI(){
		try{
			WL.Logger.info("adapter is invoked");
	          var invocationData = {
	                  adapter : 'InsureAssistHTTPAdapter',
	                  procedure : 'getAllCitiesInsureAssistHTTPAdapter',
	                  parameters : []
	              };

	          WL.Client.invokeProcedure(invocationData,{
	              onSuccess : getCitiesCallSuccess,
	              onFailure : getCitiesCallFailure,
	          });
		
		}
		catch(e){
		}
	});
};

/*
 * onSuccess of Cities call
 */

function getCitiesCallSuccess(result){
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	WL.Logger.info("success response for array"+array.length);
	var options="";
	 for(var i=0; i< array.length; i++){
		 var arrayPos = array[i];
		 options = $('<option/>').html(arrayPos.city_name);
         $("#rtoLocationSelector").append(options);
         WL.Logger.info("array[i]"+arrayPos.city_name);
     }
     
     //after successfull cities call manufacturer API will be invoked
     callManufactureAPI();
}

/*
 * on failure of cities call
 */
function getCitiesCallFailure(){
	alert("failure");
}

/*
 * call to manufacturer API
 */

function callManufactureAPI(){
	try{
		WL.Logger.info("callManufactureAPI adapter is invoked");
	          var invocationData = {
	                  adapter : 'InsureAssistHTTPAdapter',
	                  procedure : 'getAllManufacturersInsureAssistHTTPAdapter',
	                  parameters : []
	              };

	          WL.Client.invokeProcedure(invocationData,{
	              onSuccess : getManufacturersAPICallSuccess,
	              onFailure : getManufacturersAPICallFailure,
	          });
		}
		catch(e){
			console.log(e.message);
		}
}

/*
 * onSuccess of Manufacturer API call
 */

function getManufacturersAPICallSuccess(result){
	WL.Logger.info("response from manufacturer is "+result);
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	WL.Logger.info("success response for array"+array.length);
	var options = "";
	 for(var i=0; i< array.length; i++){
		 var arrayPos = array[i];
		 options = $('<option/>').html(arrayPos.manufacturer_name);
		 $("#manufacturer").append(options);
         WL.Logger.info("array[i]"+arrayPos.manufacturer_name);
     }
	 
}
/*
 * onFailure of Manufacturer API call
 */
function getManufacturersAPICallFailure(){
	WL.Logger.info("response from manufacturer is failed ");
}
/*
 * call to models API
 */
function callModelsAPI(){
	try{
		var model=$('#manufacturer').val();
		
		WL.Logger.info("Models adapter is invoked"+model);
          var invocationData = {
                  adapter : 'InsureAssistHTTPAdapter',
                  procedure : 'getModelsInsureAssistHTTPAdapter',
                  parameters : [model]
              };

          WL.Client.invokeProcedure(invocationData,{
              onSuccess : getModelsCallSuccess,
              onFailure : getModelsCallFailure,
          });
	
	}
	catch(e){
		
	}
}
/*
 * onSuccess of models API call
 */
function getModelsCallSuccess(result){
	WL.Logger.info("response from model is "+result);
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	WL.Logger.info("success response for array"+array.length);
	var options = "";
	$("#model").empty();
	for(var i=0; i< array.length; i++){
		 var arrayPos = array[i];
		 options = $('<option/>').html(arrayPos.model_name);
		 $("#model").append(options);
         WL.Logger.info(array[i]+arrayPos.model_name);
     }
	 
}
/*
 * onFailure of models API call 
 */
function getModelsCallFailure(){
	alert('failure');
}

/*
 * call to quickQuoteAPI
 */
function quickQuote(){
	pagesHistory.push(path + "pages/InsureAssistQuickQuote.html");
	regCity = $('#rtoLocationSelector').val();
	regManufacturer = $('#manufacturer').val();
	regModel = $('#model').val();
	regDate = $('#regdate').val();
	WL.Logger.info("rtoLocationSelector: "+regCity+" manufacturer: "+regManufacturer+" model: "+regModel);
	$("#pagePort").load(path + "pages/InsureAssistQuoteResult.html");
	setValues(regCity,regManufacturer,regDate);
	callAPI(regCity,regManufacturer,regDate,regModel);
}
	
function setValues(regCity,regManufacturer,regDate){
	var label = document.getElementById("quoteResultImageWrapper");
	WL.Logger.info("regRTOLoc : "+label);
}



	function callAPI(regCity,regManufacturer,regDate,regModel){
		try{
		WL.Logger.info("adapter is invoked and regCity "+regCity+" : and : "+regManufacturer);
		
		
		var body = { city: regCity,
				maufacturer: regManufacturer
		};
	          var invocationData = {
	                  adapter : 'InsureAssistHTTPAdapter',
	                  procedure : 'getIDVAndPriceInsureAssistHTTPAdapters',
	                  parameters : [body]
	              };
	          WL.Client.invokeProcedure(invocationData,{
	              onSuccess : getAPICallSuccess,
	              onFailure : getAPICallFailure
	          });
		}
		catch(e){
			console.log(e instanceof TypeError);
			console.log(e.message);
		}
	 
}

function getAPICallSuccess(result){
	var regCityLabel=document.getElementById("regRTOLoc");
	WL.Logger.info("rtoLocationSelector: "+regCity);
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	WL.Logger.info("success"+responseText);
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	var array = array[0];
	var price = array['price'];
	var idv = array['idv'];
	var label=document.getElementById("getYearlyPremiumWrapper");
	label.innerHTML= "Yearly Premium: "+ price;
	
	WL.Logger.info("after label"+label.innerHTML);
}

function getAPICallFailure(){
	alert("failure");
}

function checkTotal() {
	 WL.Logger.info("inside checkTotal");
    var sum = 0;
    for (i=0;i<document.addOnCoverPage.addOnCoverProduct.length;i++) {
		  if (document.addOnCoverPage.addOnCoverProduct[i].checked) {
		  	sum = sum + parseInt(document.addOnCoverPage.addOnCoverProduct[i].value);
		  }
		}
    var label=document.getElementById("getAddOnPremiumWrapper");
	label.innerHTML= "TotalAddOnCoverage: "+ sum;
    WL.Logger.info("total is"+sum);
}

function callExpandableList(){
	pagesHistory.push(path + "pages/InsureAssistQuoteResult.html");
	$("#pagePort").load(path + "pages/InsureAssistExpandableList.html");
}
function onBuyQuote(){
	pagesHistory.push(path + "pages/InsureAssistExpandableList.html");
	$("#pagePort").load(path + "pages/InsureAssistAdditionalDetails.html");
}
