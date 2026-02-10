import { dataFactory } from '#test/utils';
import { PainterSchema, TechniqueSchema } from '~libs/prisma-validators';

export const createPainter = dataFactory(PainterSchema);
export const createTechnique = dataFactory(TechniqueSchema);
