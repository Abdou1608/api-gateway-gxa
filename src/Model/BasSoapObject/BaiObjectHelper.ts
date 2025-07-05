//import { formatDate, DatePipe } from '@angular/common';
import * as Xpath from "xpath";

export class BaiOBjectHelper {

    public static GetStringValue(xmlNode: Node, name: string): string {
        let val: any = Xpath.select(`param[@name = '${name}']`, xmlNode);
        if (val.length > 0) {
            if ((val[0] as Element).getAttribute('is_null') === "true")
                return ""
            else
                return String((val[0] as Node).textContent);
        }
        return "";
    }

    public static GetNumberValue(xmlNode: Node, name: string): number {
        let val: any = Xpath.select(`param[@name = '${name}']`, xmlNode);
        if (val.length > 0) {
            if ((val[0] as Element).getAttribute('is_null') === "true")
                return 0
            else {
                if ((val[0] as Element).getAttribute("float_val") != null)
                    return Number((val[0] as Element).getAttribute("float_val"))
                else if ((val[0] as Element).getAttribute("int_val") != null)
                    return Number((val[0] as Element).getAttribute("int_val"))
                else
                    return 0;
            }
        }
        return 0;
    }

    public static GetBoolValue(xmlNode: Node, name: string): boolean {
        let val: any = Xpath.select(`param[@name = '${name}']`, xmlNode);
        if (val.length > 0) {
            if ((val[0] as Element).getAttribute('is_null') === "true")
                return false
            else {
                if ((val[0] as Element).getAttribute('bool_val') == 'true')
                    return true;
                else
                    return false;
            }
        }
        return false;
    }

    public static GetDateValue(xmlNode: Node, name: string): Date | null {
        let val: any = Xpath.select(`param[@name = '${name}']`, xmlNode);
        if (val.length > 0) {
            if ((val[0] as Element).getAttribute('is_null') === "true")
                return null
            else
                return new Date(String((val[0] as Element).getAttribute('date_val')));
        }
        return null;
    }

    public static SetStringValue(xmlDoc: XMLDocument, parentNode: Node,  name: string, value: string | null |  undefined): void {
        let xmlNode: Element = (xmlDoc.createElement("param") as Element);
        xmlNode.setAttribute("name", name);
        xmlNode.setAttribute("type", "ptString");
        if ((value !== undefined) && (value !== null))
            xmlNode.textContent = value;
        else
            xmlNode.setAttribute("is_null", "true");
        parentNode.appendChild(xmlNode);
    }

    public static SetIntValue(xmlDoc: XMLDocument, parentNode: Node, name: string, value: number | null | undefined): void {
        let xmlNode: Element = (xmlDoc.createElement("param") as Element);
        xmlNode.setAttribute("name", name);
        xmlNode.setAttribute("type", "ptInt");
        if ((value !== undefined) && (value !== null))
            xmlNode.setAttribute("int_val", value.toString());
        else
            xmlNode.setAttribute("is_null", "true");
        parentNode.appendChild(xmlNode);
    }

    public static SetFloatValue(xmlDoc: XMLDocument, parentNode: Node, name: string, value: number | null |  undefined): void {
        let xmlNode: Element = (xmlDoc.createElement("param") as Element);
        xmlNode.setAttribute("name", name);
        xmlNode.setAttribute("type", "ptFloat");
        if ((value !== undefined) && (value !== null))
            xmlNode.setAttribute("float_val", value.toString());
        else
            xmlNode.setAttribute("is_null", "true");
        parentNode.appendChild(xmlNode);
    }

    public static SetBoolValue(xmlDoc: XMLDocument, parentNode: Node, name: string, value: boolean | null |  undefined): void {
        let xmlNode: Element = (xmlDoc.createElement("param") as Element);
        xmlNode.setAttribute("name", name);
        xmlNode.setAttribute("type", "ptBool");
        if ((value !== undefined) && (value !== null))
            xmlNode.setAttribute("bool_val", value.toString());
        else
            xmlNode.setAttribute("is_null", "true");
        parentNode.appendChild(xmlNode);
    }

    public static SetDateValue(xmlDoc: XMLDocument, parentNode: Node, name: string, value: Date | null |  undefined): void {
        let xmlNode: Element = (xmlDoc.createElement("param") as Element);
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