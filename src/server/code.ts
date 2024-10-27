const LABEL_NAME = "CSAutoArchived";
const EMAIL_FILTER_PROP_KEY = 'EMAIL_FILTER_ID';

// @ts-ignore
global.doGet = (e) => {
    return HtmlService.createHtmlOutputFromFile('dist/index.html').setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle("GCPReactTemplate");
};

// @ts-ignore
global.GetEmailList = () => {
    return getExistingEmailData()
}

// @ts-ignore
global.SubmitNewEmailForm = (formData) => {
    const scriptProps = PropertiesService.getScriptProperties();

    const sheetId = String(scriptProps.getProperty('MAIN_SHEET_ID'));
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];

    const emailCountStr = scriptProps.getProperty('EMAIL_COUNT');
    let emailCount = 0
    if (emailCountStr) {
        emailCount = parseInt(String(emailCountStr));
    }

    const emailList = getExistingEmailData();
    console.log({formData}, [formData.email, formData.archived && formData.archived == "on"]);
    emailList.push([formData.email, formData.archived && formData.archived == "on"]);

    updateGmailFilter(emailList);

    sheet.getRange(emailCount+1, 1).setValue(formData.email);
    sheet.getRange(emailCount+1, 2).setValue(formData.archived && formData.archived == "on" ? true : false);

    scriptProps.setProperty('EMAIL_COUNT', String(emailCount+1));

    return emailList;
}

const updateGmailFilter = (emailList) => {
    const scriptProps = PropertiesService.getScriptProperties();

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
    const newFilter = Gmail.Users?.Settings?.Filters?.create({
        criteria: {
            to: `{${emailList.filter(emailRow => Boolean(emailRow[1])==false).map(emailRow => emailRow[0]).join(',')}}`
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

    scriptProps.setProperty(EMAIL_FILTER_PROP_KEY, newFilter?.id || 'Filter Created');
} 

// @ts-ignore
global.ToggleEmail = (email) => {
    const response = toggleEmail(email);
    console.log({toggleResponse: response});
    return response;
}

const toggleEmail = (emailToFind) => {
    const emailData = getExistingEmailData();

    for (let rowIndex in emailData) {
        const email = String(emailData[rowIndex][0]);
        const toggled = Boolean(emailData[rowIndex][1]);
        
        if (email == emailToFind) {
            emailData[rowIndex][1] = !toggled;
        }
    }

    updateGmailFilter(emailData);
    saveEmailData(emailData);

    return emailData;
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

const saveEmailData = (data) => {
    const scriptProps = PropertiesService.getScriptProperties();

    const sheetId = String(scriptProps.getProperty('MAIN_SHEET_ID'));
    const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
    
    scriptProps.setProperty('EMAIL_COUNT', data.length);
    if (data.length == 0) return [];

    return sheet.getRange(1, 1, data.length, 2).setValues(data);
}