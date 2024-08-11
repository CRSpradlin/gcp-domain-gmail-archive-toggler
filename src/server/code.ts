
// @ts-ignore
global.doGet = (e) => {
    return HtmlService.createHtmlOutputFromFile('dist/index.html').setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle("GCPReactTemplate");
};

// @ts-ignore
global.SubmitNewEmailForm = (formData) => {
    const scriptProps = PropertiesService.getScriptProperties();

    const sheetId = String(scriptProps.getProperty('MAIN_SHEET_ID'));
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];

    const emailCount = parseInt(String(scriptProps.getProperty('EMAIL_COUNT')));
    
    sheet.getRange(emailCount+1, 1).setValue(formData.email);
    sheet.getRange(emailCount+1, 2).setValue(false);

    scriptProps.setProperty('EMAIL_COUNT', String(emailCount+1));
}

// @ts-ignore
global.ToggleEmail = (formData) => {
    const response = toggleEmail(formData.email);
    if (response != -1) {
        return true;
    }
    return false;
}

const toggleEmail = (emailToFind) => {
    const scriptProps = PropertiesService.getScriptProperties();

    const sheetId = String(scriptProps.getProperty('MAIN_SHEET_ID'));
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];

    const emailData = getExistingEmailData();

    for (let rowIndex in emailData) {
        const email = String(emailData[rowIndex][0]);
        const toggled = Boolean(emailData[rowIndex][1]);
        
        if (email == emailToFind) {
            emailData[rowIndex][1] = String(!toggled);
        }
    }

    return -1;
}

const getExistingEmailData = () => {
    const scriptProps = PropertiesService.getScriptProperties();

    const sheetId = String(scriptProps.getProperty('MAIN_SHEET_ID'));
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    
    const emailCount = parseInt(String(scriptProps.getProperty('EMAIL_COUNT')));

    const currentEmailValues = sheet.getRange(1, 1, emailCount, 2).getValues();
    return currentEmailValues;
}