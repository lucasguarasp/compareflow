import { Injectable } from '@angular/core';
import * as jmespath from 'jmespath';

@Injectable({
  providedIn: 'root'
})
export class DataFilterService {

  constructor() { }

  async filterData(data: Object, expression: string): Promise<any> {
    data = await this.transformData(data);
    return await jmespath.search(data, expression);
  }

  private transformData(data: Object): Object {
    const keys = Object.keys(data);

    if (keys.length === 1) {
      const firstKey = keys[0]; // Pega a primeira (e única) chave do objeto
      return Object(data)[firstKey]!; // Retorna o valor associado a essa chave
    }
    return data;
  }

  async validateExpressionJMESPath(expression: string): Promise<boolean> {
    try {
      await this.filterData([], expression);
      return true; // A expressão é válida
    } catch (error) {
      return false; // A expressão é inválida
    }
  }
}
