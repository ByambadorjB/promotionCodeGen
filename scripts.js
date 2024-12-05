
// Function to calculate a checksum
function calculateChecksum(code) {
    let sum = 0;
    for (let i = 0; i < code.length; i++) {
        sum += code.charCodeAt(i) * (i + 1); // Weight each character by position
    }
    return (sum % 36).toString(36); // Convert to base36 for compactness
}

// Function to generate the unique short code
function generateShortCode(storeId, transactionId) {
    if (storeId < 0 || storeId > 200) throw new Error("Invalid store ID");
    if (transactionId < 1 || transactionId > 10000) throw new Error("Invalid transaction ID");

    const date = new Date();
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000); // Calculate day of the year

    // Convert all parts to base36 for compact encoding
    const storePart = storeId.toString(36).padStart(2, "0");
    const transactionPart = transactionId.toString(36).padStart(3, "0");
    const datePart = dayOfYear.toString(36).padStart(2, "0");

    const rawCode = `${storePart}${datePart}${transactionPart}`;
    // Add a simple checksum
    const checksum = calculateChecksum(rawCode);

    return `${rawCode}${checksum}`;

}


// Function to decode the unique short code
function decodeShortCode(shortCode) {
    if (shortCode.length > 9) {
        throw new Error("Invalid code length");
    }

    const rawCode = shortCode.slice(0, -1); // Exclude the checksum
    console.log(`Rawcode: ${rawCode}`)
    const checksum = shortCode.slice(-1); // Last character is the checksum
    console.log(`checksum: ${checksum}`)

    // Validate the checksum
    if (calculateChecksum(rawCode) !== checksum) {
        throw new Error("Invalid code: checksum mismatch");
    }

    const storePart = shortCode.slice(0, 2);
    const datePart = shortCode.slice(2, 4);
    const transactionPart = shortCode.slice(4, 7);

    const storeId = parseInt(storePart, 36);
    const dayOfYear = parseInt(datePart, 36);
    const transactionId = parseInt(transactionPart, 36);

    const year = new Date().getFullYear();
    const shopDate = new Date(year, 0, dayOfYear); // Convert day of the year back to a date

    return {
        storeId,
        shopDate,
        transactionId,
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
            // Append result to test-results with the length of shortCode
            $("#test-results").append(`
                <div>
                    ${storeId} - ${transactionId}: ${shortCode} : ${shortCode.length}
                </div>
            `);
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