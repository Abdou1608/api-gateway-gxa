
import { create } from 'xmlbuilder2';
import { TIERS } from '../../Model/create_update_Tiers';
import { Tier } from '../../Model/tier.model';

/**
 * Helper to generate the correct <param ...> for one field
 */
function buildParamXml(name: string, value: any): any {
  if (value === null || value === undefined) {
    return { '@name': name, '@type': 'ptUnknown', '@is_null': 'true' };
  }
  if (typeof value === 'number' && Number.isInteger(value)) {
    return { '@name': name, '@type': 'ptInt', '@int_val': value.toString() };
  }
  if (typeof value === 'number') {
    return { '@name': name, '@type': 'ptFloat', '@float_val': value.toExponential(14) };
  }
  if (typeof value === 'boolean') {
    return { '@name': name, '@type': 'ptBool', '@bool_val': value ? 'true' : 'false' };
  }
  if (typeof value === 'string') {
    // date ISO
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return { '@name': name, '@type': 'ptDateTime', '@date_val': value };
    }
    return { '@name': name, '@type': 'ptString', '#': value };
  }
  return { '@name': name, '@type': 'ptString', '#': String(value) };
}

/**
 * Convert a plain object to <object typename=...><param/></object> structure
 */
function objectToXml(typename: string, obj: Record<string, any>) {
  return {
    'object': {
      '@typename': typename,
      'param': Object.entries(obj).map(([key, value]) => buildParamXml(key, value)),
    }
  };
}

/**
 * Convert ContModel to XML structure (string)
 */
export function tierModelToXml(model: Tier): string {
  const objects: any[] = [];
  if (model.input.objects.DPP) objects.push(objectToXml('DPP', model.input.objects.DPP));
  if (model.input.objects.TIERS) objects.push(objectToXml('TIERS', model.input.objects.TIERS));
  if (model.input.objects.adresse_insee) objects.push(objectToXml('adresse_insee', model.input.objects.adresse_insee));

  const root = {
    cont: {
      input: {
        objects: objects
      }
    }
  };
  return create({ version: '1.0' }).ele(root).end({ prettyPrint: true });
}

// Usage:
// import { contModelToXml } from './cont-to-xml';
// const xml = contModelToXml(obj);
