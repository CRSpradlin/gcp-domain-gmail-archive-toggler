function doGet(e) {}

function SubmitNewEmailForm(formData) {}

function ToggleEmail(formData) {}

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
        return HtmlService.createHtmlOutputFromFile("dist/index.html").setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag("viewport", "width=device-width, initial-scale=1").setTitle("GCPReactTemplate");
    }, __webpack_require__.g.SubmitNewEmailForm = function(formData) {
        var scriptProps = PropertiesService.getScriptProperties(), sheetId = String(scriptProps.getProperty("MAIN_SHEET_ID")), sheet = SpreadsheetApp.openById(sheetId).getSheets()[0], emailCount = parseInt(String(scriptProps.getProperty("EMAIL_COUNT")));
        sheet.getRange(emailCount + 1, 1).setValue(formData.email), sheet.getRange(emailCount + 1, 2).setValue(!1), 
        scriptProps.setProperty("EMAIL_COUNT", String(emailCount + 1));
    }, __webpack_require__.g.ToggleEmail = function(formData) {
        return -1 != toggleEmail(formData.email);
    };
    var toggleEmail = function(emailToFind) {
        var scriptProps = PropertiesService.getScriptProperties(), sheetId = String(scriptProps.getProperty("MAIN_SHEET_ID")), emailData = (SpreadsheetApp.openById(sheetId).getSheets()[0], 
        getExistingEmailData());
        for (var rowIndex in emailData) {
            var email = String(emailData[rowIndex][0]), toggled = Boolean(emailData[rowIndex][1]);
            email == emailToFind && (emailData[rowIndex][1] = String(!toggled));
        }
        return -1;
    }, getExistingEmailData = function() {
        var scriptProps = PropertiesService.getScriptProperties(), sheetId = String(scriptProps.getProperty("MAIN_SHEET_ID")), sheet = SpreadsheetApp.openById(sheetId).getSheets()[0], emailCount = parseInt(String(scriptProps.getProperty("EMAIL_COUNT")));
        return sheet.getRange(1, 1, emailCount, 2).getValues();
    };
    for (var i in __webpack_exports__) this[i] = __webpack_exports__[i];
    __webpack_exports__.__esModule && Object.defineProperty(this, "__esModule", {
        value: !0
    })
    /******/;
})();