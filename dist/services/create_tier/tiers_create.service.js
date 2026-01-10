"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiers_create = tiers_create;
const BasParams_1 = require("../../Model/BasSoapObject/BasParams");
const tiers_details_service_1 = require("../detail_tier/tiers_details.service");
const soap_service_1 = require("../soap.service");
async function tiers_create(basec, typtiers, nature, numtiers, numdpp, data, ctx) {
    //const soapBody = {typtiers,nature,numtiers,numdpp,data}
    const params = new BasParams_1.BasParams();
    params.AddStr("BasSecurityContext", basec.ToSoapVar());
    numtiers ? params.AddInt("numtiers", numtiers) : null;
    numdpp ? params.AddInt("numdpp", numdpp) : null;
    nature ? params.AddString("nature", nature) : null;
    params.AddString("typtiers", typtiers);
    //if (data) {
    //	params.AddStr("data",tierModelToXml(data))	}
    const result = await (0, soap_service_1.sendSoapRequest)(params, "Tiers_Create", basec, "tiers", data, ctx);
    // `sendSoapRequest(..., sid="tiers")` is parsed via `parseSoapXmlToJson`, which can return:
    // - an object with { Numtiers }
    // - an array of objects (e.g. [{ typename: 'TIERS', Numtiers: ... }, ...])
    // Be defensive to avoid passing `undefined` into `tiers_details` (SOAP expects an integer).
    const pickNumtiers = (r) => {
        if (!r)
            return null;
        const direct = r?.Numtiers ?? r?.numtiers;
        if (typeof direct === 'number' && Number.isFinite(direct))
            return direct;
        if (typeof direct === 'string' && direct.trim() !== '') {
            const n = Number(direct);
            return Number.isFinite(n) ? n : null;
        }
        if (Array.isArray(r)) {
            for (const item of r) {
                const v = item?.Numtiers ?? item?.numtiers;
                if (typeof v === 'number' && Number.isFinite(v))
                    return v;
                if (typeof v === 'string' && v.trim() !== '') {
                    const n = Number(v);
                    if (Number.isFinite(n))
                        return n;
                }
            }
        }
        return null;
    };
    const createdNumtiers = pickNumtiers(result);
    if (createdNumtiers == null) {
        // Return raw result rather than triggering a misleading SOAP fault.
        return result;
    }
    const resp = await (0, tiers_details_service_1.tiers_details)(basec, createdNumtiers, true, true, ctx);
    return resp;
}
