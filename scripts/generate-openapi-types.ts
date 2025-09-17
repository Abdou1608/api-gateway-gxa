import fs from 'fs';
import path from 'path';
import YAML from 'yamljs';

/*
  Simple generator: converts schemas into TS interfaces.
  Limitations: only handles object type with primitive props; arrays referencing other schemas; no oneOf/anyOf resolution.
*/

interface SchemaObject { [k: string]: any }

const OPENAPI_FILE = path.join(process.cwd(), 'openapi.fr.ex.custom.yaml');
const OUT_FILE = path.join(process.cwd(), 'src', 'types', 'api.ts');

function toPascal(name: string) {
  return name.replace(/(^|_|-)([a-zA-Z])/g, (_, __, c) => c.toUpperCase());
}

function renderSchema(name: string, schema: SchemaObject, all: Record<string, SchemaObject>): string {
  if (schema.type === 'object' || schema.properties) {
    const props = schema.properties || {};
    const required: string[] = schema.required || [];
    const lines = Object.entries(props).map(([prop, def]: [string, any]) => {
      let tsType = 'any';
      if (def.$ref) {
        const refName = def.$ref.split('/').pop()!;
        tsType = toPascal(refName);
      } else if (def.type === 'array') {
        if (def.items) {
          if (def.items.$ref) {
            tsType = toPascal(def.items.$ref.split('/').pop()!) + '[]';
          } else if (def.items.type) {
            tsType = mapPrimitive(def.items.type) + '[]';
          } else {
            tsType = 'any[]';
          }
        } else tsType = 'any[]';
      } else if (def.type) {
        tsType = mapPrimitive(def.type);
      } else {
        tsType = 'any';
      }
      const optional = required.includes(prop) ? '' : '?';
      return `  ${prop}${optional}: ${tsType};`;
    });
    return `export interface ${toPascal(name)} {\n${lines.join('\n')}\n}`;
  }
  if (schema.type === 'array') {
    let inner = 'any';
    if (schema.items) {
      if (schema.items.$ref) inner = toPascal(schema.items.$ref.split('/').pop()!);
      else if (schema.items.type) inner = mapPrimitive(schema.items.type);
    }
    return `export type ${toPascal(name)} = ${inner}[];`;
  }
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop()!;
    return `export type ${toPascal(name)} = ${toPascal(refName)};`;
  }
  if (schema.allOf) {
    const parts = schema.allOf.map((p: any) => {
      if (p.$ref) return toPascal(p.$ref.split('/').pop()!);
      return 'any';
    });
    return `export interface ${toPascal(name)} extends ${parts.join(', ')} {}`;
  }
  return `export type ${toPascal(name)} = any;`;
}

function mapPrimitive(t: string) {
  switch (t) {
    case 'integer':
    case 'number':
      return 'number';
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'object':
      return 'Record<string, any>';
    default:
      return 'any';
  }
}

function main() {
  if (!fs.existsSync(OPENAPI_FILE)) throw new Error('OpenAPI file not found');
  const doc: any = YAML.load(OPENAPI_FILE);
  const schemas: Record<string, SchemaObject> = doc.components?.schemas || {};
  const header = `/**\n * Generated from openapi.fr.ex.custom.yaml - DO NOT EDIT MANUALLY\n */\n`;
  const body = Object.entries(schemas)
    .map(([name, schema]) => renderSchema(name, schema as SchemaObject, schemas))
    .join('\n\n');
  const content = header + body + '\n';
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, content, 'utf8');
  // eslint-disable-next-line no-console
  console.log('Generated types to', OUT_FILE);
}

if (require.main === module) {
  main();
}
