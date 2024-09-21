import type {
  MutationCreatePainterArgs,
  MutationCreatePaintingArgs,
  Painter,
  PainterInput,
  Painting,
  PaintingInput,
} from '@services/graphql/types';
import { painters, paintings } from './database';

export const resolvers = {
  Query: {
    painters: (): Painter[] => {
      return painters;
    },
    paintings: (): Painting[] => paintings,
    painter(_: unknown, { name }: PainterInput): Painter | undefined {
      return painters.find((painter) => painter.name === name);
    },
    painting(_: unknown, { title }: PaintingInput): Painting | undefined {
      return paintings.find((painting) => painting.title === title);
    },
  },
  Mutation: {
    createPainter(
      _: unknown,
      { input: painter }: MutationCreatePainterArgs
    ): Painter {
      painters.push(painter);
      return painter;
    },
    createPainting(
      _: unknown,
      { input: painting }: MutationCreatePaintingArgs
    ): Painting {
      paintings.push(painting);
      return painting;
    },
  },
};
