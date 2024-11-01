import { dataFactory } from '#test/utils';
import { PainterSchema } from '~libs/prisma-validators';

export const createPainter = dataFactory(PainterSchema);
