/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 *  WL.Server.invokeHttp(parameters) accepts the following json object as an argument:
 *  
 *  {
 *  	// Mandatory 
 *  	method : 'get' , 'post', 'delete' , 'put' or 'head' 
 *  	path: value,
 *  	
 *  	// Optional 
 *  	returnedContentType: any known mime-type or one of "json", "css", "csv", "plain", "xml", "html"  
 *  	returnedContentEncoding : 'encoding', 
 *  	parameters: {name1: value1, ... }, 
 *  	headers: {name1: value1, ... }, 
 *  	cookies: {name1: value1, ... }, 
 *  	body: { 
 *  		contentType: 'text/xml; charset=utf-8' or similar value, 
 *  		content: stringValue 
 *  	}, 
 *  	transformation: { 
 *  		type: 'default', or 'xslFile', 
 *  		xslFile: fileName 
 *  	} 
 *  } 
 */

/**
 * 
 * @returns json list of items
 */
function getIDVAndPriceInsureAssistHTTPAdapters(request) {
		var input = {
	    method : 'post',
	    returnedContentType : 'json',
	    path : 'api/createquote',
	    body : {
	    	content: request,
            contentType: 'application/json'
	    		}
	   
	};
	var result = WL.Server.invokeHttp(input);
	var res=JSON.stringify(result);
	return result;
}

function getAllCitiesInsureAssistHTTPAdapter() {
	
	var input = {
		    method : 'get',
		    returnedContentType : 'json',
		    path : 'api/getallcities',
		   
		};
		var response = WL.Server.invokeHttp(input);
		return response;
	
}


function getAllManufacturersInsureAssistHTTPAdapter() {
	
	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : 'api/getallmanufacturers'
	};
	
	
	return WL.Server.invokeHttp(input);
}


function getModelsInsureAssistHTTPAdapter(model) {
	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : 'api/getModel/'+model,
	};
	
	
	return WL.Server.invokeHttp(input);
}


