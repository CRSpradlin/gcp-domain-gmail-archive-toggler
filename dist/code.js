function doGet(e) {}

function GetEmailList() {}

function SubmitNewEmailForm(formData) {}

function ToggleEmail(email) {}

 /******/ (() => {
    // webpackBootstrap
    /******/ "use strict";
    /******/ // The require scope
    /******/    var __webpack_require__ = {};
    /******/
    /************************************************************************/
    /******/ /* webpack/runtime/global */
    /******/    
    /******/ __webpack_require__.g = function() {
        /******/ if ("object" == typeof globalThis) return globalThis;
        /******/        try {
            /******/ return this || new Function("return this")();
            /******/        } catch (e) {
            /******/ if ("object" == typeof window) return window;
            /******/        }
        /******/    }();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    __webpack_require__.g.doGet = function(e) {
        return HtmlService.createHtmlOutputFromFile("dist/index.html").setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag("viewport", "width=device-width, initial-scale=1").setTitle("eArchiver");
    }, __webpack_require__.g.GetEmailList = function() {
        return getExistingEmailData();
    }, __webpack_require__.g.SubmitNewEmailForm = function(formData) {
        var scriptProps = PropertiesService.getScriptProperties(), sheetId = String(scriptProps.getProperty("MAIN_SHEET_ID")), sheet = SpreadsheetApp.openById(sheetId).getSheets()[0], emailCountStr = scriptProps.getProperty("EMAIL_COUNT"), emailCount = 0;
        emailCountStr && (emailCount = parseInt(String(emailCountStr)));
        var emailList = getExistingEmailData();
        return console.log({
            formData
        }, [ formData.email, formData.archived && "on" == formData.archived ]), emailList.push([ formData.email, formData.archived && "on" == formData.archived ]), 
        updateGmailFilter(emailList), sheet.getRange(emailCount + 1, 1).setValue(formData.email), 
        sheet.getRange(emailCount + 1, 2).setValue(!(!formData.archived || "on" != formData.archived)), 
        scriptProps.setProperty("EMAIL_COUNT", String(emailCount + 1)), emailList;
    };
    var updateGmailFilter = function(emailList) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, scriptProps = PropertiesService.getScriptProperties(), labels = null === (_c = null === (_b = null === (_a = Gmail.Users) || void 0 === _a ? void 0 : _a.Labels) || void 0 === _b ? void 0 : _b.list("me").labels) || void 0 === _c ? void 0 : _c.filter((function(label) {
            return "CSAutoArchived" == label.name;
        })), label = labels && labels.length > 0 ? labels[0] : undefined;
        label || (label = null === (_e = null === (_d = Gmail.Users) || void 0 === _d ? void 0 : _d.Labels) || void 0 === _e ? void 0 : _e.create({
            name: "CSAutoArchived"
        }, "me"));
        var filterIdStr = scriptProps.getProperty("EMAIL_FILTER_ID");
        filterIdStr && (null === (_h = null === (_g = null === (_f = Gmail.Users) || void 0 === _f ? void 0 : _f.Settings) || void 0 === _g ? void 0 : _g.Filters) || void 0 === _h || _h.remove("me", filterIdStr), 
        scriptProps.deleteProperty("EMAIL_FILTER_ID")), console.log({
            filterIdStr
        });
        var newFilter = null === (_l = null === (_k = null === (_j = Gmail.Users) || void 0 === _j ? void 0 : _j.Settings) || void 0 === _k ? void 0 : _k.Filters) || void 0 === _l ? void 0 : _l.create({
            criteria: {
                to: "{".concat(emailList.filter((function(emailRow) {
                    return 0 == Boolean(emailRow[1]);
                })).map((function(emailRow) {
                    return emailRow[0];
                })).join(","), "}")
            },
            action: {
                addLabelIds: [ (null == label ? void 0 : label.id) || "CSAutoArchived" ],
                removeLabelIds: [ "INBOX" ]
            }
        }, "me");
        scriptProps.setProperty("EMAIL_FILTER_ID", (null == newFilter ? void 0 : newFilter.id) || "Filter Created");
    };
    __webpack_require__.g.ToggleEmail = function(email) {
        var response = toggleEmail(email);
        return console.log({
            toggleResponse: response
        }), response;
    };
    var toggleEmail = function(emailToFind) {
        var emailData = getExistingEmailData();
        for (var rowIndex in emailData) {
            var email = String(emailData[rowIndex][0]), toggled = Boolean(emailData[rowIndex][1]);
            email == emailToFind && (emailData[rowIndex][1] = !toggled);
        }
        return updateGmailFilter(emailData), saveEmailData(emailData), emailData;
    }, getExistingEmailData = function() {
        var scriptProps = PropertiesService.getScriptProperties(), sheetId = String(scriptProps.getProperty("MAIN_SHEET_ID")), sheet = SpreadsheetApp.openById(sheetId).getSheets()[0], emailCount = parseInt(String(scriptProps.getProperty("EMAIL_COUNT")));
        if (0 == emailCount) return [];
        var currentEmailValues = sheet.getRange(2, 1, emailCount, 2).getValues();
        return currentEmailValues.sort((function(a, b) {
            return a[0] == b[0] ? 0 : a[0] > b[0] ? 1 : -1;
        })), currentEmailValues;
    }, saveEmailData = function(data) {
        var scriptProps = PropertiesService.getScriptProperties(), sheetId = String(scriptProps.getProperty("MAIN_SHEET_ID")), sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
        return scriptProps.setProperty("EMAIL_COUNT", data.length), 0 == data.length ? [] : sheet.getRange(2, 1, data.length, 2).setValues(data);
    };
    for (var i in __webpack_exports__) this[i] = __webpack_exports__[i];
    __webpack_exports__.__esModule && Object.defineProperty(this, "__esModule", {
        value: !0
    })
    /******/;
})();