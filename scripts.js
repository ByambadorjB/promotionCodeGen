// TODO: Modify this function
function generateShortCode(storeId, transactionId, customDate) {
    // Logic goes here
    // var d = new Date();
    if(storeId < 0 || storeId > 200) 
        throw new Error ("Invalid Store ID");
    if(transactionId < 1 || transactionId > 10000)
        throw new Error ("Invalid Store ID");


    let d = customDate ? new Date(customDate) : new Date();
    // alert(d);
    let day=d.getDate();
    let hexDay =day.toString(32);
    let hexstoreId = storeId.toString(32);
    let hextransactionId = transactionId.toString(32);

    
    let uniquecode=`${hexstoreId}s${hextransactionId}t${hexDay}`
   
return uniquecode;
}

// TODO: Modify this function
function decodeShortCode(shortCode) {
    // Logic goes here

    storeid=shortCode.substring(0,shortCode.indexOf("s"));        
    transaction=shortCode.substring(shortCode.indexOf("s")+1,shortCode.indexOf("t")); 
    date=shortCode.substring(shortCode.indexOf("t")+1);


    storeid=parseInt(storeid,32);
    transaction=parseInt(transaction,32);
    day=parseInt(date,32);

    // Decode and simulate the shop date
    let today = new Date();
    today.setDate(day); // Set day, may cause overflow (e.g., 32/12) 

    return {
        storeId: storeid, // store id goes here,
        shopDate: today,  // the date the customer shopped,
        transactionId: transaction, // transaction id goes here
    };

}


// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {

    var storeIds = [175, 42, 0, 9]
    var transactionIds = [9675, 23, 123, 7]

    storeIds.forEach(function (storeId) {
        transactionIds.forEach(function (transactionId) {
            var shortCode = generateShortCode(storeId, transactionId);
            var decodeResult = decodeShortCode(shortCode);
            $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
            AddTestResult("Length <= 9", shortCode.length <= 9);
            AddTestResult("Is String", (typeof shortCode === 'string'));
            AddTestResult("Is Today", IsToday(decodeResult.shopDate));
            AddTestResult("StoreId", storeId === decodeResult.storeId);
            AddTestResult("TransId", transactionId === decodeResult.transactionId);
        })
    })
}

function IsToday(inputDate) {
    // Get today's date
    var todaysDate = new Date();
    // call setHours to take the time out of the comparison
    return (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0));
}

function AddTestResult(testName, testResult) {
    var div = $("#test-results").append("<div class='" + (testResult ? "pass" : "fail") + "'><span class='tname'>- " + testName + "</span><span class='tresult'>" + testResult + "</span></div>");
}