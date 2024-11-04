import { Pipe, PipeTransform } from '@angular/core';
import { TypeComponent } from '../models/components/type-component.enum';

@Pipe({
  name: 'typeComponentOrder'
})
export class TypeComponentOrderPipe implements PipeTransform {

  transform(components: TypeComponent[]): TypeComponent[] {    
    return components.sort((a, b) => this.compareTypeComponents(a, b));
  }

  private compareTypeComponents(a: TypeComponent, b: TypeComponent): number {
    const order = [
      TypeComponent.StartFlow,
      TypeComponent.SubFlow,
      TypeComponent.EndFlow,
      TypeComponent.GoToStep,
      TypeComponent.GoToFlow,
      TypeComponent.Request,
      TypeComponent.Response,
      TypeComponent.Mapper,
      TypeComponent.Filter,
      TypeComponent.CallApi,
      TypeComponent.File,
      TypeComponent.Decision,
      TypeComponent.BackToParent,
      TypeComponent.Anotation,
      TypeComponent.SendMessage,
      TypeComponent.Wait
    ];
    return order.indexOf(a) - order.indexOf(b);
  }

}
