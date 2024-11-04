import { DrawflowExport } from "drawflow";

export class NodeDefaultImport {
    static varrerObjeto(obj: any): DrawflowExport | null {
        if (obj) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    try {

                        if (typeof obj[key] === 'object') {
                            const nestedResult = NodeDefaultImport.varrerObjeto(obj[key]);
                            if (nestedResult) {
                                return nestedResult;
                            }
                        }

                        const jsonStringCleaned = obj[key].replace(/\n/g, '').replace(/\s\s+/g, ' ');
                        const parsedObj = JSON.parse(jsonStringCleaned);
                        if (parsedObj.drawflow) {                            
                            for (const key in parsedObj.drawflow.Home.data) {
                                if (parsedObj.drawflow.Home.data.hasOwnProperty(key)) {
                                    const node = parsedObj.drawflow.Home.data[key];
                                    if (!node.data) {
                                        node.data = {};
                                    }
                                    if (!node.name && node.class) {
                                        node.name = node.class;
                                    }
                                }
                            }
                            return parsedObj as DrawflowExport;
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }
        }
        return null;
    }
}


