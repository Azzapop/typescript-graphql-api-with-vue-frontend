import { logger } from "@libs/logger"
import { Prisma } from "@prisma/client"
import { GqlPainterInput } from "@services/graphql/types"
import { PainterInputSchema } from "@services/graphql/validations"

const GqlToPrisma = PainterInputSchema().transform(({ name, country, techniques }: GqlPainterInput): Prisma.PainterCreateInput => {
  return {
    name,
    country,
    painterTechniques: { create: techniques.map((techniqueId) => ({ techniqueId })) },
  }
})

export const transformPainterInput = (input: GqlPainterInput): Prisma.PainterCreateInput | null => {
  const result = GqlToPrisma.safeParse(input);

  if (result.success) {
    return result.data;
  } else {
    logger.error('Failed to parse correct input params.')
    return null;
  }
}
