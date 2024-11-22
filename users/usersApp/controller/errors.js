var initializer = {};

initializer.errors = function(numError){
    let resultError=[];
    resultError[0]="ERROR: It is required to be a manufacturer or a token valid";
    resultError[1]="ERROR: It must not contain empty values";
    resultError[2]="ERROR: It is not possible to establish connection with blockchain network";
    //resultError[3]="ERROR: It is not possible to deploy the contract";
    resultError[4]="ERROR: It is not possible to find the method";
    resultError[5]="ERROR: maybe out of gas";
    resultError[6]="ERROR: from is undefined";
    resultError[7]="ERROR: it was not possible to mint";
    resultError[8]="ERROR: ErrorNetwork";
    resultError[9]="ERROR: it loses connection with the blockchain network";
    resultError[10]="ERROR: it is not identified yet 2";
    resultError[11]="ERROR: internal error found";
    return resultError[numError];
}

initializer.anyEmpty = function(objVarJSON){
    var objVar = objVarJSON;
    //console.log(objVar);
    objVar.array.forEach(element => {
      if(element === null || element.match(/^ *$/) !== null){
        return true;
      }  
    });
    return false;
}

initializer.someFieldIsEmpty = function(ob){
	var obj = ob.body;
	var n = Object.keys(obj).length;
	for(var i=0;i<n;i++){
		var field=Object.keys(obj)[i];
		var fieldV= obj[field];
		if(fieldV==""){
			return 1; // it means that an empty field was found
		}
	}
	return 0;	
}

initializer.connectionError = function(e,from){  
    const errNum = (e==="9")?9:10; 
    y = {
      Result: "Error",
      Num: errNum.toString(),
      from:from,
      Description : initializer.errors(errNum)
    }
    return y;
}

initializer.handlingErrorOrNot = function(resul,from){ //from2:
  //console.log("Entré handling Error");
  let r = resul.Result;
  var y;
  const from2 = resul.from;
  switch(r){
    case "Error":
      console.log("Error: " + from);
    case "ErrRare":
      console.log("ErrRare:" + from);
    case "Success":
      if(from.toUpperCase()!==from2.toUpperCase()){
        console.log("*******\n ESTO ES MUY EXTRAÑO \n *******");
        resul.Result = "ErrRare";        
      }				
      y= resul;				
      break;
    case "Pending":
      console.log("Pending status: " + from );
      y = resul;
      break;
    case "ErrorNetwork":
      console.log("Otra opción sending request from: " + from);
      errNum = "8"; 
      error = {
        Result: "Error",
        Num: errNum,
        from:from,
        Description : initializer.errors(errNum)
      }
      //res.send(error); //because of that this line is required						
      y = error;
      break;
    default:
      console.log("Default: " + from);
      y = resul;
  }
  return y;
}


module.exports = initializer;