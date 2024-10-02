"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firebase = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)(require("../../google-service-key.json"))
});
//# sourceMappingURL=firebase.js.map