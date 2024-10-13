
// @ts-ignore
global.doGet = (e) => {
    return HtmlService.createHtmlOutputFromFile('dist/index.html').setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle("GCPReactTemplate");
};

// @ts-ignore
global.SubmitNewEmailForm = (formData) => {
    const LABEL_NAME = "CSAutoArchived";
    const EMAIL_FILTER_PROP_KEY = 'EMAIL_FILTER_ID';

    const scriptProps = PropertiesService.getScriptProperties();

    const sheetId = String(scriptProps.getProperty('MAIN_SHEET_ID'));
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];

    const emailCountStr = scriptProps.getProperty('EMAIL_COUNT');
    let emailCount = 0
    if (emailCountStr) {
        emailCount = parseInt(String(emailCountStr));
    }

    const labels = Gmail.Users?.Labels?.list("me").labels?.filter(label => label.name == LABEL_NAME);
    let label = labels && labels.length > 0 ? labels[0] : undefined;
    if (!label) {
        label = Gmail.Users?.Labels?.create({
            name: LABEL_NAME
        }, "me");
    }

    const filterIdStr = scriptProps.getProperty(EMAIL_FILTER_PROP_KEY);
    if (filterIdStr) {
        Gmail.Users?.Settings?.Filters?.remove("me", filterIdStr);
        scriptProps.deleteProperty(EMAIL_FILTER_PROP_KEY);
    }
    console.log({filterIdStr});

    //TODO: Move the getExistingEmailData call to separate variable to add just created email entry into array list.
    const emailList = getExistingEmailData();
    console.log({formData}, [formData.email, formData.archived && formData.archived == "on"]);
    emailList.push([formData.email, formData.archived && formData.archived == "on"])
    const newFilter = Gmail.Users?.Settings?.Filters?.create({
        criteria: {
            to: `{${emailList.map(emailRow => Boolean(emailRow[1]) ? emailRow[0] : undefined).join(',')}}`
        },
        action: {
            addLabelIds: [
                label?.id || LABEL_NAME
            ],
            removeLabelIds: [
                'INBOX'
            ]
        }
    }, "me");
    console.log({newFilter});

    scriptProps.setProperty(EMAIL_FILTER_PROP_KEY, newFilter?.id || 'Filter Created');


    sheet.getRange(emailCount+1, 1).setValue(formData.email);
    sheet.getRange(emailCount+1, 2).setValue(formData.archived && formData.archived == "on");

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
    if (emailCount == 0) return [];

    const currentEmailValues = sheet.getRange(1, 1, emailCount, 2).getValues();
    return currentEmailValues;
}