"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiOBjectHelper = void 0;
//import { formatDate, DatePipe } from '@angular/common';
const Xpath = __importStar(require("xpath"));
class BaiOBjectHelper {
    static GetStringValue(xmlNode, name) {
        let val = Xpath.select(`param[@name = '${name}']`, xmlNode);
        if (val.length > 0) {
            if (val[0].getAttribute('is_null') === "true")
                return "";
            else
                return String(val[0].textContent);
        }
        return "";
    }
    static GetNumberValue(xmlNode, name) {
        let val = Xpath.select(`param[@name = '${name}']`, xmlNode);
        if (val.length > 0) {
            if (val[0].getAttribute('is_null') === "true")
                return 0;
            else {
                if (val[0].getAttribute("float_val") != null)
                    return Number(val[0].getAttribute("float_val"));
                else if (val[0].getAttribute("int_val") != null)
                    return Number(val[0].getAttribute("int_val"));
                else
                    return 0;
            }
        }
        return 0;
    }
    static GetBoolValue(xmlNode, name) {
        let val = Xpath.select(`param[@name = '${name}']`, xmlNode);
        if (val.length > 0) {
            if (val[0].getAttribute('is_null') === "true")
                return false;
            else {
                if (val[0].getAttribute('bool_val') == 'true')
                    return true;
                else
                    return false;
            }
        }
        return false;
    }
    static GetDateValue(xmlNode, name) {
        let val = Xpath.select(`param[@name = '${name}']`, xmlNode);
        if (val.length > 0) {
            if (val[0].getAttribute('is_null') === "true")
                return null;
            else
                return new Date(String(val[0].getAttribute('date_val')));
        }
        return null;
    }
    static SetStringValue(xmlDoc, parentNode, name, value) {
        let xmlNode = xmlDoc.createElement("param");
        xmlNode.setAttribute("name", name);
        xmlNode.setAttribute("type", "ptString");
        if ((value !== undefined) && (value !== null))
            xmlNode.textContent = value;
        else
            xmlNode.setAttribute("is_null", "true");
        parentNode.appendChild(xmlNode);
    }
    static SetIntValue(xmlDoc, parentNode, name, value) {
        let xmlNode = xmlDoc.createElement("param");
        xmlNode.setAttribute("name", name);
        xmlNode.setAttribute("type", "ptInt");
        if ((value !== undefined) && (value !== null))
            xmlNode.setAttribute("int_val", value.toString());
        else
            xmlNode.setAttribute("is_null", "true");
        parentNode.appendChild(xmlNode);
    }
    static SetFloatValue(xmlDoc, parentNode, name, value) {
        let xmlNode = xmlDoc.createElement("param");
        xmlNode.setAttribute("name", name);
        xmlNode.setAttribute("type", "ptFloat");
        if ((value !== undefined) && (value !== null))
            xmlNode.setAttribute("float_val", value.toString());
        else
            xmlNode.setAttribute("is_null", "true");
        parentNode.appendChild(xmlNode);
    }
    static SetBoolValue(xmlDoc, parentNode, name, value) {
        let xmlNode = xmlDoc.createElement("param");
        xmlNode.setAttribute("name", name);
        xmlNode.setAttribute("type", "ptBool");
        if ((value !== undefined) && (value !== null))
            xmlNode.setAttribute("bool_val", value.toString());
        else
            xmlNode.setAttribute("is_null", "true");
        parentNode.appendChild(xmlNode);
    }
    static SetDateValue(xmlDoc, parentNode, name, value) {
        let xmlNode = xmlDoc.createElement("param");
        xmlNode.setAttribute("name", name);
        xmlNode.setAttribute("type", "ptDateTime");
        if ((value !== undefined) && (value !== null))
            // const str=new Date(value,'dd/MM/yyyy', 'fr')
            xmlNode.setAttribute("date_val", new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).format(value));
        else
            xmlNode.setAttribute("is_null", "true");
        parentNode.appendChild(xmlNode);
    }
}
exports.BaiOBjectHelper = BaiOBjectHelper;
