import { painters, paintings } from './database';

export const resolvers = {
  Query: {
    painters: (): any => {
      console.log({ painters });
      return painters;
    },
    paintings: (): any => paintings,
    painter(_: any, { name }: any): any {
      return painters.find((painter) => painter.name === name);
    },
    painting(_: any, { title }: any): any {
      return paintings.find((painting) => painting.title === title);
    },
  },
  Mutation: {
    createPainter(_: any, { input: painter }: any): any {
      painters.push(painter);
      return painter;
    },
    createPainting(_: any, { input: painting }: any): any {
      paintings.push(painting);
      return painting;
    },
  },
};
