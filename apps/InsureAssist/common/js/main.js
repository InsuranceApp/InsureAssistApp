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
var mobileNo = 0;
var emailId = null;
var username = null;
var cubicCapacity = "cubicCapacity";
var exShowRoomPrice = "exShowRoomPrice";

function wlCommonInit(){
	if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
	    path = "www/default/";
	}
	
	$("#pagePort").load(path + "pages/insureAssistLogin.html", function(){
			if (currentPage.init) {
				currentPage.init();
			WL.Logger.info("inside main.js");
		}
	});
}

$(window).load(function() {
    $('.insureAssistButton').css('background-color','#0088b8'); 
    $('#logIn').css('background-color','#0088b8'); 
});
/*
 * 
 * onClick of GetQuote from login page
 * CityAndManufacturerAPI is invoked
 * 
 */

function submit(){
	username = $('#LoginId').val();
	pagesHistory.push(path + "pages/insureAssistLogin.html");
	/*
	 * InsureAssistQuickQuote page is loaded and callCityAndManufacturerAPI is invoked
	 * 
	 */
	$("#pagePort").load(path + "pages/InsureAssistQuickQuote.html");
	callCityAndManufacturerAPI();
}

function callCityAndManufacturerAPI(){
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
}
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
		var selManufacturer=$('#manufacturer').val();
		
		WL.Logger.info("Models adapter is invoked"+model);
          var invocationData = {
                  adapter : 'InsureAssistHTTPAdapter',
                  procedure : 'getModelsInsureAssistHTTPAdapter',
                  parameters : [selManufacturer]
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
	options = $("#model").append('<option>Model</option>');
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
	var result = quickQuoteerrorcheck();
	if(result == true){
		pagesHistory.push(path + "pages/InsureAssistQuickQuote.html");
		regCity = $('#rtoLocationSelector').val();
		regManufacturer = $('#manufacturer').val();
		regModel = $('#model').val();
		regDate = $('#regdate').val();
		mobileNo = $('#mobileNumber').val();
		emailId = $('#email').val();
		WL.Logger.info("rtoLocationSelector: "+regCity+" manufacturer: "+regManufacturer+" model: "+regModel);
		$("#pagePort").load(path + "pages/InsureAssistQuoteResult.html");
		callAPI();
	}
}
	



	function callAPI(){
		try{
		
		var body = { city: regCity,
				maufacturer: regManufacturer,
				model: regModel,
				date: regDate,
				mobileNumber: mobileNo,
				email: emailId
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
	var responseText=result['responseText'];
	var responseText = responseText.replace("/*-secure-","");
	var responseText = responseText.replace("*/","");
	WL.Logger.info("success"+responseText);
	var responseText = JSON.parse(responseText);
	var array = responseText['array'];
	var array = array[0];
	var price = array['price'];
	var idv = array['idv'];
	var labelYearlyPremium=document.getElementById("getYearlyPremiumWrapper");
	var labelRegDate=document.getElementById("regDate");
	var labelRTOLocation=document.getElementById("regRTOLoc");
	var labelManufacturer=document.getElementById("regManufacturer");
	labelYearlyPremium.innerHTML= "Yearly Premium: "+ price;
	labelManufacturer.innerHTML = "Manufacturer: "+ regManufacturer;
	labelRTOLocation.innerHTML = "RTO Location: "+ regCity;
	labelRegDate.innerHTML = "Registration Date: "+regDate;
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
	pagesHistory.push(path + "pages/InsureAssistInsuranceDetails.html");
	$("#pagePort").load(path + "pages/InsureAssistExpandableList.html", function getPersonalDetails(){
		document.getElementById("regusername").value=username;
		document.getElementById("regdatetime").setAttribute("value", regDate);
		document.getElementById("regManufacturer").setAttribute("value", regManufacturer);
		document.getElementById("registeredModelEx").setAttribute("value", regModel);
		document.getElementById("cubicCapacity").setAttribute("value", cubicCapacity); //TODO
		document.getElementById("exShowroomPrice").setAttribute("value", exShowroomPrice); //TODO
		document.getElementById("mobileNum").setAttribute("value", mobileNo);
		document.getElementById("emailId").setAttribute("value", emailId);
	} );
}

function onBuyQuote(){
	result = BuyQuoteerrorcheck();
	if(result == true){
		pagesHistory.push(path + "pages/InsureAssistExpandableList.html");
		$("#pagePort").load(path + "pages/InsureAssistAdditionalDetails.html");
	}
}

function callInsuranceDetails(){
	pagesHistory.push(path + "pages/InsureAssistQuoteResult.html");
	$("#pagePort").load(path + "pages/InsureAssistInsuranceDetails.html");
}

function previousPage(){
	
	var page=pagesHistory.pop();
	$("#pagePort").load(page, function(){
		if (currentPage.init) 
			currentPage.init();
		if(page == path + "pages/InsureAssistQuickQuote.html" ){
			WL.Logger.info("value is:::"+document.getElementById("regdate"));
			document.getElementById("regdate").value=regDate;
			document.getElementById("mobileNumber").value=mobileNo;
			document.getElementById("email").value=emailId;
			callCityAndManufacturerAPI();
			 
		}
		else if (page == path + "pages/InsureAssistQuoteResult.html" ){
			WL.Logger.info("inside callAPI"+pagesHistory.length);
			callAPI();
		}
		else if (page == path + "pages/InsureAssistExpandableList.html"){
			document.getElementById("regusername").value=username;
			document.getElementById("regdatetime").setAttribute("value", regDate);
			document.getElementById("regManufacturer").setAttribute("value", regManufacturer);
			document.getElementById("registeredModelEx").setAttribute("value", regModel);
			document.getElementById("cubicCapacity").setAttribute("value", cubicCapacity); //TODO
			document.getElementById("exShowroomPrice").setAttribute("value", exShowroomPrice); //TODO
			document.getElementById("mobileNum").setAttribute("value", mobileNo);
			document.getElementById("emailId").setAttribute("value", emailId);
		}
	});
	
	
}

function termsandconditions()
{  
	$('#myModal').show();
	//$('#myModal').css("display","block");
}


//error check of quickquote page
function quickQuoteerrorcheck()
{
	var regdate=document.getElementById("regdate").value;
	var dateerrorcheck = validatedate(regdate);
	
	if(document.getElementById("rtoLocationSelector").value == "Select RTO Location") {
		    document.getElementById("rtolocationerror").style.display="block";
		    document.getElementById("rtoLocationSelector").style.borderColor = "red !important";
		    document.getElementById("regdateerror").style.display="none";
		    document.getElementById("manufacturererror").style.display="none";
		    document.getElementById("modelerror").style.display="none";
		    document.getElementById("termserror").style.display="none";
		    document.getElementById("regEmailError").style.display="none";
		    document.getElementById("regMobileNumberError").style.display="none";
		    return false;
	}
	else if(document.getElementById("manufacturer").value == "Manufacturer") {
		    document.getElementById("manufacturererror").style.display="block";
		    document.getElementById("manufacturer").style.borderColor = "red";
		    document.getElementById("rtoLocationSelector").style.display="none";
		    document.getElementById("regdateerror").style.display="none";
		    document.getElementById("modelerror").style.display="none";
		    document.getElementById("termserror").style.display="none";
		    document.getElementById("regEmailError").style.display="none";
		    document.getElementById("regMobileNumberError").style.display="none";
		    return false;
	}
	 else if(document.getElementById("model").value == "Model") {
		    document.getElementById("modelerror").style.display="block";
		    document.getElementById("model").style.borderColor = "red";
		    document.getElementById("rtoLocationSelector").style.display="none";
		    document.getElementById("regdateerror").style.display="none";
		    document.getElementById("manufacturererror").style.display="none";
		    document.getElementById("termserror").style.display="none";
		    document.getElementById("regEmailError").style.display="none";
		    document.getElementById("regMobileNumberError").style.display="none";
		    return false;
	}
	 else if (dateerrorcheck == false || regdate == ""){
		    document.getElementById("regdateerror").style.display="block";
		    document.getElementById("regdate").style.borderColor = "red";
		    document.getElementById("rtoLocationSelector").style.display="none";
		    document.getElementById("manufacturererror").style.display="none";
		    document.getElementById("modelerror").style.display="none";
		    document.getElementById("termserror").style.display="none";
		    document.getElementById("regEmailError").style.display="none";
		    document.getElementById("regMobileNumberError").style.display="none";
		    return false;
	}
	 else  if(document.getElementById("mobileNumber").value == "" || (document.getElementById("mobileNumber").value).length != 10)  {
		 	document.getElementById("regMobileNumberError").style.display="block";
		    document.getElementById("mobileNumber").style.borderColor = "red";
		    document.getElementById("rtoLocationSelector").style.display="none";
		    document.getElementById("regdateerror").style.display="none";
		    document.getElementById("manufacturererror").style.display="none";
		    document.getElementById("modelerror").style.display="none";
		    document.getElementById("regEmailError").style.display="none";
		    return false;
	}
	 else  if(document.getElementById("email").value == "" || (!(document.getElementById("email").value).contains("@")))  {
		    document.getElementById("regEmailError").style.display="block";
		    document.getElementById("email").style.borderColor = "red";
		    document.getElementById("rtoLocationSelector").style.display="none";
		    document.getElementById("regdateerror").style.display="none";
		    document.getElementById("manufacturererror").style.display="none";
		    document.getElementById("modelerror").style.display="none";
		    document.getElementById("regMobileNumberError").style.display="none";
		    return false;
	}
	 else  if(document.getElementById("terms").checked == false)  {
		    document.getElementById("termserror").style.display="block";
		    document.getElementById("terms").style.borderColor = "red";
		    document.getElementById("rtoLocationSelector").style.display="none";
		    document.getElementById("regdateerror").style.display="none";
		    document.getElementById("manufacturererror").style.display="none";
		    document.getElementById("modelerror").style.display="none";
		    document.getElementById("regEmailError").style.display="none";
		    document.getElementById("regMobileNumberError").style.display="none";
		    return false;
	}
	 else  {
		 	document.getElementById("rtoLocationSelector").style.display="none";
		    document.getElementById("regdateerror").style.display="none";
		    document.getElementById("manufacturererror").style.display="none";
		    document.getElementById("modelerror").style.display="none";
		    document.getElementById("termserror").style.display="none";
		    document.getElementById("regEmailError").style.display="none";
		    document.getElementById("regMobileNumberError").style.display="none";
		    return true;
		 }
}



function validatedate(inputText)  
{  
	
var dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;  
// Match the date format through regular expression 


if(dateformat.test(inputText))  
{  

//Test which seperator is used '/' or '-'  
var opera1 = inputText.split('/');  
var opera2 = inputText.split('-');  
lopera1 = opera1.length;  
lopera2 = opera2.length;  
// Extract the string into month, date and year  
if (lopera1>1)  
{  
var pdate = inputText.split('/');  
}  
else if (lopera2>1)  
{  
var pdate = inputText.split('-');  
}  
var mm  = parseInt(pdate[0]);  
var dd = parseInt(pdate[1]);  
var yy = parseInt(pdate[2]);  
// Create list of days of a month [assume there is no leap year by default]  
var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];  
if (mm==1 || mm>2)  
{  
if (dd>ListofDays[mm-1])  
{  
return false;  
}  
}  
if (mm==2)  
{  
var lyear = false;  
if ( (!(yy % 4) && yy % 100) || !(yy % 400))   
{  
lyear = true;  
}  
if ((lyear==false) && (dd>=29))  
{  
return false;  
}  
if ((lyear==true) && (dd>29))  
{  
return false;  
}  
}  
}  
else  
{  
   
return false;  
}  
}  

//datevalidation ends
function hideTermsAndConditions(){
	$('#myModal').hide();
}

function renewPolicy(){
	$('#ifYesOrNo').show();	
}


function renewPolicyPremium(){
	pagesHistory.push(path + "pages/InsureAssistInsuranceDetails.html");
	$("#pagePort").load(path + "pages/InsureAssistCalcPremiumForRenew.html");
}


function BuyQuoteerrorcheck(){
	if(document.getElementById("occupation").value == "1")
	{
	    $('#occupationerror').show();
	    WL.Logger.info("inside error");
	    document.getElementById("occupation").style.borderColor = "red !important";
	    return false;
	}
else
	    {
	    	document.getElementById("occupationerror").style.display="none";
		    document.getElementById("occupation").style.borderColor = "none";
		    if(document.getElementById("familySize").value == "1")
		    {
		    	
			    document.getElementById("familySizeerror").style.display="block";
			    document.getElementById("familySize").style.borderColor = "red";
			    return false;
		    }
		    else
		    {
		    	document.getElementById("familySizeerror").style.display="none";
			    document.getElementById("familySize").style.borderColor = "none";
			    if(document.getElementById("maritalStatus").value == "1")
			    {
			    	 document.getElementById("maritalStatuserror").style.display="block";
			 	    document.getElementById("maritalStatus").style.borderColor = "red !important";
			 	    return false;
			    }
			    else
			    {
			    	document.getElementById("maritalStatuserror").style.display="none";
				    document.getElementById("maritalStatus").style.borderColor = "none";
				    if(document.getElementById("familyMembers").value == "1")
				    {
				    	document.getElementById("familyMemberserror").style.display="block";
				 	    document.getElementById("familyMembers").style.borderColor = "red !important";
				 	    return false;
				    }
				    else
				    	{
				    	document.getElementById("familyMemberserror").style.display="none";
					    document.getElementById("familyMembers").style.borderColor = "none";
					    if(document.getElementById("monthlyMileages").value == "1")
					    {
					    	document.getElementById("monthlyMileageserror").style.display="block";
					 	    document.getElementById("monthlyMileages").style.borderColor = "red !important";
					 	    return false;
					    }
					    {
					    	document.getElementById("monthlyMileageserror").style.display="none";
						    document.getElementById("monthlyMileages").style.borderColor = "none";
						    return true;
				    	}
				    	}
			    }
		    }
	    }
}

function onAdditionalCoverages(){
	pagesHistory.push(path + "pages/InsureAssistAdditionalDetails.html");
	$("#pagePort").load(path + "pages/FinalPremium.html");
	
}

function callRecalculate(){
	pagesHistory.push(path + "pages/FinalPremium.html");
	$("#pagePort").load(path + "pages/InsureAssistQuickQuote.html");
}

function callAdditionalDetails(){
	result = AdditionalDetailsErrorcheck();
	if(result == true)
	{
	pagesHistory.push(path + "pages/InsureAssistCalcPremiumForRenew.html");
	$("#pagePort").load(path + "pages/InsureAssistAdditionalDetails.html");
	}
}

function AdditionalDetailsErrorcheck(){
	if(document.getElementById("policyNumber").value == "")
	{
	    $('#policyNumbererror').show();
	    document.getElementById("policyNumber").style.borderColor = "red !important";
	    document.getElementById("engineChasiserror").style.display="none";
	    document.getElementById("engineChasis").style.borderColor = "none";
	    document.getElementById("Confirmatonerror").style.display="none";
	    document.getElementById("Confirmaton").style.borderColor = "none";
	    return false;
	}
	else if(document.getElementById("engineChasis").value == ""){
	 $('#engineChasiserror').show();
	 document.getElementById("engineChasis").style.borderColor = "red !important";
	    document.getElementById("policyNumbererror").style.display="none";
	    document.getElementById("policyNumber").style.borderColor = "none";
	    document.getElementById("Confirmatonerror").style.display="none";
	    document.getElementById("Confirmaton").style.borderColor = "none";
	    return false;
}
	else if(document.getElementById("Confirmaton").value == "1"){
		$('#Confirmatonerror').show();
		 document.getElementById("Confirmaton").style.borderColor = "red !important";
		document.getElementById("policyNumbererror").style.display="none";
	    document.getElementById("policyNumber").style.borderColor = "none";
	    document.getElementById("engineChasiserror").style.display="none";
	    document.getElementById("engineChasis").style.borderColor = "none";
	}
	else return true;
}