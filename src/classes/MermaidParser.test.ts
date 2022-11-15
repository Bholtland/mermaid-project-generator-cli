import {MermaidParser} from "./MermaidParser";

describe("", () => {
  it("Should return a MermaidDoc object from a mermaid document", async () => {
    const mmdFile = `
      classDiagram
  
      class IAnimal {
      %% module: Animal
          <<Interface>>
          + getName(): string
          + pet(food: string): void
      }
      
      class Animal {
      %% module: Animal
          <<Abstract>>
          - name: string
          + getName(): string
          + pet(food: string)
      }
      
      class Dog {
      %% module: Animal
          + bark(): string
          + feed(): void
      }
      
      class Labrador {
      %% module: Animal
          + labrawoof()
      }
      
      class SpottedLabrador {
      %% module: Animal
          - yes
      }
      
      class IHouse {
      %% module: House
          <<Interface>>
          live(): void
      }
      
      class Barn {
      %% module: House
          stackHay(hay: string): HayStack
      }
      
      Animal ..|> IAnimal
      Animal <|-- Dog
      Dog <|-- Labrador
      Labrador <|-- SpottedLabrador
      
      Barn ..|> IHouse
      Dog <.. Barn
    `

    const mermaidParser = new MermaidParser(mmdFile)

    const mermaidDoc = mermaidParser.parse()

    expect(mermaidDoc).toBeDefined()

    const {IAnimal, Animal, Dog, Labrador, SpottedLabrador, IHouse, Barn} = mermaidDoc.classes

    expect(IAnimal.type).toBe('interface')
    expect(IAnimal.genericTypes).toBeUndefined()
    expect(IAnimal.name).toMatchObject({
      default: 'IAnimal',
      kebab: 'ianimal',
      pascalCase: 'IAnimal',
      camelCase: 'ianimal'
    })
    expect(IAnimal.properties).toHaveLength(0)
    expect(IAnimal.methods).toHaveLength(2)
    expect(IAnimal.primaryDependencies).toHaveLength(0)
    expect(IAnimal.foreignDependencies).toHaveLength(0)
    expect(IAnimal.realizedFromInterfaces).toHaveLength(0)
    expect(IAnimal.superClasses).toHaveLength(0)

    expect(Animal.primaryDependencies).toHaveLength(0)
    expect(Animal.foreignDependencies).toHaveLength(0)
    expect(Animal.realizedFromInterfaces).toHaveLength(1)
    expect(Animal.superClasses).toHaveLength(0)

    expect(Dog.primaryDependencies).toHaveLength(1)
    expect(Dog.foreignDependencies).toHaveLength(0)
    expect(Dog.realizedFromInterfaces).toHaveLength(0)
    expect(Dog.superClasses).toHaveLength(1)

    expect(Labrador.primaryDependencies).toHaveLength(0)
    expect(Labrador.foreignDependencies).toHaveLength(1)
    expect(Labrador.realizedFromInterfaces).toHaveLength(0)
    expect(Labrador.superClasses).toHaveLength(1)

    expect(SpottedLabrador.primaryDependencies).toHaveLength(0)
    expect(SpottedLabrador.foreignDependencies).toHaveLength(1)
    expect(SpottedLabrador.realizedFromInterfaces).toHaveLength(0)
    expect(SpottedLabrador.superClasses).toHaveLength(1)

    expect(IHouse.primaryDependencies).toHaveLength(0)
    expect(IHouse.foreignDependencies).toHaveLength(0)
    expect(IHouse.realizedFromInterfaces).toHaveLength(0)
    expect(IHouse.superClasses).toHaveLength(0)

    expect(Barn.primaryDependencies).toHaveLength(0)
    expect(Barn.foreignDependencies).toHaveLength(0)
    expect(Barn.realizedFromInterfaces).toHaveLength(1)
    expect(Barn.superClasses).toHaveLength(0)
  });
});
