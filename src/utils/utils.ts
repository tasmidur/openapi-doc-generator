import * as fs from 'fs'
import * as path from 'path'
import pluralize from 'pluralize';

export function arrayIntersection<T>(arr1: T[], arr2: T[]): T[] {
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)
  return [...set1].filter((value) => set2.has(value))
}

export function snakeToCamel(str:string) {
  return str.replace(/_([a-z])/g, function(match, letter) {
      return letter.toUpperCase();
  });
}

export function toTitleCase(str:string) {
  // Replace underscores and capitalize each word
  let formattedString = str.replace(/_([a-z])/g, function(match, p1) {
    return p1.toUpperCase();
  });
  // Capitalize the first letter
  formattedString = formattedString.charAt(0).toUpperCase() + formattedString.slice(1);
  return toSingular(formattedString);
}

export function toUrlFormat(str:string){
   return toPlural(str).replace(/_/g, "-").toLowerCase();
}

export function toSingular(str:string){
  return pluralize.singular(str);
}

export function toPlural(str:string){
  return pluralize.plural(str);
}

export function getClassName(value: any, format: string) {
  const classNameCammelCase = format.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return value[key] !== undefined ? `${value[key]}` : match
  })
  return (
    classNameCammelCase.charAt(0).toUpperCase() + classNameCammelCase.slice(1)
  )
}

export const buildTemplateContent = (template: string, replacements: any) => {
  
  return Object.keys(replacements).reduce((result, key) => {
    const placeholder = `#__${key}__#`
    return result.replace(new RegExp(placeholder, 'g'), replacements[key])
  }, template)
}

export function storeFile(content: any, fileName: any, directory: string,extention:any='js') {
  const fullPath = path.join(process.cwd(), directory)
  if (!fs.existsSync(fullPath)) { 
    // If not, create the directory
    fs.mkdirSync(fullPath,{recursive: true})
  }
  return fs.writeFileSync(`${fullPath}/${fileName}.${extention}`, content)
}


export const initSchema=async()=>{
  const templateSource = fs.readFileSync(
    path.resolve(__dirname, '../templates/schema.config.template'),
    'utf8',
  )
  storeFile(templateSource, "schema.config","/")
}


export const getVersion = (swaggerObject:any) => {
  if (swaggerObject?.asyncapi) {
    return 'v4';
  }

  if (swaggerObject?.openapi) {
    return 'v3';
  }

  if (swaggerObject?.swagger) {
    return 'v2';
  }

  return 'v2';
};
