import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const PainterScalarFieldEnumSchema = z.enum(['id','name','country','createdAt','updatedAt']);

export const PaintingScalarFieldEnumSchema = z.enum(['id','authorId','title','techniqueId','date','createdAt','updatedAt']);

export const TechniqueScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export const PainterTechniqueScalarFieldEnumSchema = z.enum(['id','painterId','techniqueId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// PAINTER SCHEMA
/////////////////////////////////////////

export const PainterSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  country: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Painter = z.infer<typeof PainterSchema>

/////////////////////////////////////////
// PAINTING SCHEMA
/////////////////////////////////////////

export const PaintingSchema = z.object({
  id: z.string().cuid(),
  authorId: z.string(),
  title: z.string(),
  techniqueId: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Painting = z.infer<typeof PaintingSchema>

/////////////////////////////////////////
// TECHNIQUE SCHEMA
/////////////////////////////////////////

export const TechniqueSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Technique = z.infer<typeof TechniqueSchema>

/////////////////////////////////////////
// PAINTER TECHNIQUE SCHEMA
/////////////////////////////////////////

export const PainterTechniqueSchema = z.object({
  id: z.string().cuid(),
  painterId: z.string(),
  techniqueId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PainterTechnique = z.infer<typeof PainterTechniqueSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// PAINTER
//------------------------------------------------------

export const PainterIncludeSchema: z.ZodType<Prisma.PainterInclude> = z.object({
  painterTechniques: z.union([z.boolean(),z.lazy(() => PainterTechniqueFindManyArgsSchema)]).optional(),
  paintings: z.union([z.boolean(),z.lazy(() => PaintingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PainterCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PainterArgsSchema: z.ZodType<Prisma.PainterDefaultArgs> = z.object({
  select: z.lazy(() => PainterSelectSchema).optional(),
  include: z.lazy(() => PainterIncludeSchema).optional(),
}).strict();

export const PainterCountOutputTypeArgsSchema: z.ZodType<Prisma.PainterCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PainterCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PainterCountOutputTypeSelectSchema: z.ZodType<Prisma.PainterCountOutputTypeSelect> = z.object({
  painterTechniques: z.boolean().optional(),
  paintings: z.boolean().optional(),
}).strict();

export const PainterSelectSchema: z.ZodType<Prisma.PainterSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  country: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  painterTechniques: z.union([z.boolean(),z.lazy(() => PainterTechniqueFindManyArgsSchema)]).optional(),
  paintings: z.union([z.boolean(),z.lazy(() => PaintingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PainterCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PAINTING
//------------------------------------------------------

export const PaintingIncludeSchema: z.ZodType<Prisma.PaintingInclude> = z.object({
  author: z.union([z.boolean(),z.lazy(() => PainterArgsSchema)]).optional(),
  technique: z.union([z.boolean(),z.lazy(() => TechniqueArgsSchema)]).optional(),
}).strict()

export const PaintingArgsSchema: z.ZodType<Prisma.PaintingDefaultArgs> = z.object({
  select: z.lazy(() => PaintingSelectSchema).optional(),
  include: z.lazy(() => PaintingIncludeSchema).optional(),
}).strict();

export const PaintingSelectSchema: z.ZodType<Prisma.PaintingSelect> = z.object({
  id: z.boolean().optional(),
  authorId: z.boolean().optional(),
  title: z.boolean().optional(),
  techniqueId: z.boolean().optional(),
  date: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  author: z.union([z.boolean(),z.lazy(() => PainterArgsSchema)]).optional(),
  technique: z.union([z.boolean(),z.lazy(() => TechniqueArgsSchema)]).optional(),
}).strict()

// TECHNIQUE
//------------------------------------------------------

export const TechniqueIncludeSchema: z.ZodType<Prisma.TechniqueInclude> = z.object({
  painterTechniques: z.union([z.boolean(),z.lazy(() => PainterTechniqueFindManyArgsSchema)]).optional(),
  paintings: z.union([z.boolean(),z.lazy(() => PaintingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TechniqueCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TechniqueArgsSchema: z.ZodType<Prisma.TechniqueDefaultArgs> = z.object({
  select: z.lazy(() => TechniqueSelectSchema).optional(),
  include: z.lazy(() => TechniqueIncludeSchema).optional(),
}).strict();

export const TechniqueCountOutputTypeArgsSchema: z.ZodType<Prisma.TechniqueCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TechniqueCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TechniqueCountOutputTypeSelectSchema: z.ZodType<Prisma.TechniqueCountOutputTypeSelect> = z.object({
  painterTechniques: z.boolean().optional(),
  paintings: z.boolean().optional(),
}).strict();

export const TechniqueSelectSchema: z.ZodType<Prisma.TechniqueSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  painterTechniques: z.union([z.boolean(),z.lazy(() => PainterTechniqueFindManyArgsSchema)]).optional(),
  paintings: z.union([z.boolean(),z.lazy(() => PaintingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TechniqueCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PAINTER TECHNIQUE
//------------------------------------------------------

export const PainterTechniqueIncludeSchema: z.ZodType<Prisma.PainterTechniqueInclude> = z.object({
  painter: z.union([z.boolean(),z.lazy(() => PainterArgsSchema)]).optional(),
  technique: z.union([z.boolean(),z.lazy(() => TechniqueArgsSchema)]).optional(),
}).strict()

export const PainterTechniqueArgsSchema: z.ZodType<Prisma.PainterTechniqueDefaultArgs> = z.object({
  select: z.lazy(() => PainterTechniqueSelectSchema).optional(),
  include: z.lazy(() => PainterTechniqueIncludeSchema).optional(),
}).strict();

export const PainterTechniqueSelectSchema: z.ZodType<Prisma.PainterTechniqueSelect> = z.object({
  id: z.boolean().optional(),
  painterId: z.boolean().optional(),
  techniqueId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  painter: z.union([z.boolean(),z.lazy(() => PainterArgsSchema)]).optional(),
  technique: z.union([z.boolean(),z.lazy(() => TechniqueArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const PainterWhereInputSchema: z.ZodType<Prisma.PainterWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PainterWhereInputSchema),z.lazy(() => PainterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PainterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PainterWhereInputSchema),z.lazy(() => PainterWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueListRelationFilterSchema).optional(),
  paintings: z.lazy(() => PaintingListRelationFilterSchema).optional()
}).strict();

export const PainterOrderByWithRelationInputSchema: z.ZodType<Prisma.PainterOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueOrderByRelationAggregateInputSchema).optional(),
  paintings: z.lazy(() => PaintingOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PainterWhereUniqueInputSchema: z.ZodType<Prisma.PainterWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => PainterWhereInputSchema),z.lazy(() => PainterWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PainterWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PainterWhereInputSchema),z.lazy(() => PainterWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueListRelationFilterSchema).optional(),
  paintings: z.lazy(() => PaintingListRelationFilterSchema).optional()
}).strict());

export const PainterOrderByWithAggregationInputSchema: z.ZodType<Prisma.PainterOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PainterCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PainterMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PainterMinOrderByAggregateInputSchema).optional()
}).strict();

export const PainterScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PainterScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PainterScalarWhereWithAggregatesInputSchema),z.lazy(() => PainterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PainterScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PainterScalarWhereWithAggregatesInputSchema),z.lazy(() => PainterScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PaintingWhereInputSchema: z.ZodType<Prisma.PaintingWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PaintingWhereInputSchema),z.lazy(() => PaintingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaintingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaintingWhereInputSchema),z.lazy(() => PaintingWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  authorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  techniqueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  author: z.union([ z.lazy(() => PainterRelationFilterSchema),z.lazy(() => PainterWhereInputSchema) ]).optional(),
  technique: z.union([ z.lazy(() => TechniqueRelationFilterSchema),z.lazy(() => TechniqueWhereInputSchema) ]).optional(),
}).strict();

export const PaintingOrderByWithRelationInputSchema: z.ZodType<Prisma.PaintingOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  author: z.lazy(() => PainterOrderByWithRelationInputSchema).optional(),
  technique: z.lazy(() => TechniqueOrderByWithRelationInputSchema).optional()
}).strict();

export const PaintingWhereUniqueInputSchema: z.ZodType<Prisma.PaintingWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => PaintingWhereInputSchema),z.lazy(() => PaintingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaintingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaintingWhereInputSchema),z.lazy(() => PaintingWhereInputSchema).array() ]).optional(),
  authorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  techniqueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  author: z.union([ z.lazy(() => PainterRelationFilterSchema),z.lazy(() => PainterWhereInputSchema) ]).optional(),
  technique: z.union([ z.lazy(() => TechniqueRelationFilterSchema),z.lazy(() => TechniqueWhereInputSchema) ]).optional(),
}).strict());

export const PaintingOrderByWithAggregationInputSchema: z.ZodType<Prisma.PaintingOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PaintingCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PaintingMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PaintingMinOrderByAggregateInputSchema).optional()
}).strict();

export const PaintingScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PaintingScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PaintingScalarWhereWithAggregatesInputSchema),z.lazy(() => PaintingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaintingScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaintingScalarWhereWithAggregatesInputSchema),z.lazy(() => PaintingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  authorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  techniqueId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const TechniqueWhereInputSchema: z.ZodType<Prisma.TechniqueWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TechniqueWhereInputSchema),z.lazy(() => TechniqueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TechniqueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TechniqueWhereInputSchema),z.lazy(() => TechniqueWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueListRelationFilterSchema).optional(),
  paintings: z.lazy(() => PaintingListRelationFilterSchema).optional()
}).strict();

export const TechniqueOrderByWithRelationInputSchema: z.ZodType<Prisma.TechniqueOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueOrderByRelationAggregateInputSchema).optional(),
  paintings: z.lazy(() => PaintingOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TechniqueWhereUniqueInputSchema: z.ZodType<Prisma.TechniqueWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TechniqueWhereInputSchema),z.lazy(() => TechniqueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TechniqueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TechniqueWhereInputSchema),z.lazy(() => TechniqueWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueListRelationFilterSchema).optional(),
  paintings: z.lazy(() => PaintingListRelationFilterSchema).optional()
}).strict());

export const TechniqueOrderByWithAggregationInputSchema: z.ZodType<Prisma.TechniqueOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TechniqueCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TechniqueMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TechniqueMinOrderByAggregateInputSchema).optional()
}).strict();

export const TechniqueScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TechniqueScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TechniqueScalarWhereWithAggregatesInputSchema),z.lazy(() => TechniqueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TechniqueScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TechniqueScalarWhereWithAggregatesInputSchema),z.lazy(() => TechniqueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PainterTechniqueWhereInputSchema: z.ZodType<Prisma.PainterTechniqueWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PainterTechniqueWhereInputSchema),z.lazy(() => PainterTechniqueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PainterTechniqueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PainterTechniqueWhereInputSchema),z.lazy(() => PainterTechniqueWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  painterId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  techniqueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  painter: z.union([ z.lazy(() => PainterRelationFilterSchema),z.lazy(() => PainterWhereInputSchema) ]).optional(),
  technique: z.union([ z.lazy(() => TechniqueRelationFilterSchema),z.lazy(() => TechniqueWhereInputSchema) ]).optional(),
}).strict();

export const PainterTechniqueOrderByWithRelationInputSchema: z.ZodType<Prisma.PainterTechniqueOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  painterId: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  painter: z.lazy(() => PainterOrderByWithRelationInputSchema).optional(),
  technique: z.lazy(() => TechniqueOrderByWithRelationInputSchema).optional()
}).strict();

export const PainterTechniqueWhereUniqueInputSchema: z.ZodType<Prisma.PainterTechniqueWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => PainterTechniqueWhereInputSchema),z.lazy(() => PainterTechniqueWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PainterTechniqueWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PainterTechniqueWhereInputSchema),z.lazy(() => PainterTechniqueWhereInputSchema).array() ]).optional(),
  painterId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  techniqueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  painter: z.union([ z.lazy(() => PainterRelationFilterSchema),z.lazy(() => PainterWhereInputSchema) ]).optional(),
  technique: z.union([ z.lazy(() => TechniqueRelationFilterSchema),z.lazy(() => TechniqueWhereInputSchema) ]).optional(),
}).strict());

export const PainterTechniqueOrderByWithAggregationInputSchema: z.ZodType<Prisma.PainterTechniqueOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  painterId: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PainterTechniqueCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PainterTechniqueMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PainterTechniqueMinOrderByAggregateInputSchema).optional()
}).strict();

export const PainterTechniqueScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PainterTechniqueScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PainterTechniqueScalarWhereWithAggregatesInputSchema),z.lazy(() => PainterTechniqueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PainterTechniqueScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PainterTechniqueScalarWhereWithAggregatesInputSchema),z.lazy(() => PainterTechniqueScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  painterId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  techniqueId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PainterCreateInputSchema: z.ZodType<Prisma.PainterCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painterTechniques: z.lazy(() => PainterTechniqueCreateNestedManyWithoutPainterInputSchema).optional(),
  paintings: z.lazy(() => PaintingCreateNestedManyWithoutAuthorInputSchema).optional()
}).strict();

export const PainterUncheckedCreateInputSchema: z.ZodType<Prisma.PainterUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUncheckedCreateNestedManyWithoutPainterInputSchema).optional(),
  paintings: z.lazy(() => PaintingUncheckedCreateNestedManyWithoutAuthorInputSchema).optional()
}).strict();

export const PainterUpdateInputSchema: z.ZodType<Prisma.PainterUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUpdateManyWithoutPainterNestedInputSchema).optional(),
  paintings: z.lazy(() => PaintingUpdateManyWithoutAuthorNestedInputSchema).optional()
}).strict();

export const PainterUncheckedUpdateInputSchema: z.ZodType<Prisma.PainterUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUncheckedUpdateManyWithoutPainterNestedInputSchema).optional(),
  paintings: z.lazy(() => PaintingUncheckedUpdateManyWithoutAuthorNestedInputSchema).optional()
}).strict();

export const PainterCreateManyInputSchema: z.ZodType<Prisma.PainterCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PainterUpdateManyMutationInputSchema: z.ZodType<Prisma.PainterUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PainterUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PainterUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaintingCreateInputSchema: z.ZodType<Prisma.PaintingCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  author: z.lazy(() => PainterCreateNestedOneWithoutPaintingsInputSchema),
  technique: z.lazy(() => TechniqueCreateNestedOneWithoutPaintingsInputSchema)
}).strict();

export const PaintingUncheckedCreateInputSchema: z.ZodType<Prisma.PaintingUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  authorId: z.string(),
  title: z.string(),
  techniqueId: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaintingUpdateInputSchema: z.ZodType<Prisma.PaintingUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.lazy(() => PainterUpdateOneRequiredWithoutPaintingsNestedInputSchema).optional(),
  technique: z.lazy(() => TechniqueUpdateOneRequiredWithoutPaintingsNestedInputSchema).optional()
}).strict();

export const PaintingUncheckedUpdateInputSchema: z.ZodType<Prisma.PaintingUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  authorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  techniqueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaintingCreateManyInputSchema: z.ZodType<Prisma.PaintingCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  authorId: z.string(),
  title: z.string(),
  techniqueId: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaintingUpdateManyMutationInputSchema: z.ZodType<Prisma.PaintingUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaintingUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PaintingUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  authorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  techniqueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TechniqueCreateInputSchema: z.ZodType<Prisma.TechniqueCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painterTechniques: z.lazy(() => PainterTechniqueCreateNestedManyWithoutTechniqueInputSchema).optional(),
  paintings: z.lazy(() => PaintingCreateNestedManyWithoutTechniqueInputSchema).optional()
}).strict();

export const TechniqueUncheckedCreateInputSchema: z.ZodType<Prisma.TechniqueUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUncheckedCreateNestedManyWithoutTechniqueInputSchema).optional(),
  paintings: z.lazy(() => PaintingUncheckedCreateNestedManyWithoutTechniqueInputSchema).optional()
}).strict();

export const TechniqueUpdateInputSchema: z.ZodType<Prisma.TechniqueUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUpdateManyWithoutTechniqueNestedInputSchema).optional(),
  paintings: z.lazy(() => PaintingUpdateManyWithoutTechniqueNestedInputSchema).optional()
}).strict();

export const TechniqueUncheckedUpdateInputSchema: z.ZodType<Prisma.TechniqueUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUncheckedUpdateManyWithoutTechniqueNestedInputSchema).optional(),
  paintings: z.lazy(() => PaintingUncheckedUpdateManyWithoutTechniqueNestedInputSchema).optional()
}).strict();

export const TechniqueCreateManyInputSchema: z.ZodType<Prisma.TechniqueCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const TechniqueUpdateManyMutationInputSchema: z.ZodType<Prisma.TechniqueUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TechniqueUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TechniqueUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PainterTechniqueCreateInputSchema: z.ZodType<Prisma.PainterTechniqueCreateInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painter: z.lazy(() => PainterCreateNestedOneWithoutPainterTechniquesInputSchema),
  technique: z.lazy(() => TechniqueCreateNestedOneWithoutPainterTechniquesInputSchema)
}).strict();

export const PainterTechniqueUncheckedCreateInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  painterId: z.string(),
  techniqueId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PainterTechniqueUpdateInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painter: z.lazy(() => PainterUpdateOneRequiredWithoutPainterTechniquesNestedInputSchema).optional(),
  technique: z.lazy(() => TechniqueUpdateOneRequiredWithoutPainterTechniquesNestedInputSchema).optional()
}).strict();

export const PainterTechniqueUncheckedUpdateInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  painterId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  techniqueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PainterTechniqueCreateManyInputSchema: z.ZodType<Prisma.PainterTechniqueCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  painterId: z.string(),
  techniqueId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PainterTechniqueUpdateManyMutationInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PainterTechniqueUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  painterId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  techniqueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const PainterTechniqueListRelationFilterSchema: z.ZodType<Prisma.PainterTechniqueListRelationFilter> = z.object({
  every: z.lazy(() => PainterTechniqueWhereInputSchema).optional(),
  some: z.lazy(() => PainterTechniqueWhereInputSchema).optional(),
  none: z.lazy(() => PainterTechniqueWhereInputSchema).optional()
}).strict();

export const PaintingListRelationFilterSchema: z.ZodType<Prisma.PaintingListRelationFilter> = z.object({
  every: z.lazy(() => PaintingWhereInputSchema).optional(),
  some: z.lazy(() => PaintingWhereInputSchema).optional(),
  none: z.lazy(() => PaintingWhereInputSchema).optional()
}).strict();

export const PainterTechniqueOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PainterTechniqueOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaintingOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PaintingOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PainterCountOrderByAggregateInputSchema: z.ZodType<Prisma.PainterCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PainterMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PainterMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PainterMinOrderByAggregateInputSchema: z.ZodType<Prisma.PainterMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const PainterRelationFilterSchema: z.ZodType<Prisma.PainterRelationFilter> = z.object({
  is: z.lazy(() => PainterWhereInputSchema).optional(),
  isNot: z.lazy(() => PainterWhereInputSchema).optional()
}).strict();

export const TechniqueRelationFilterSchema: z.ZodType<Prisma.TechniqueRelationFilter> = z.object({
  is: z.lazy(() => TechniqueWhereInputSchema).optional(),
  isNot: z.lazy(() => TechniqueWhereInputSchema).optional()
}).strict();

export const PaintingCountOrderByAggregateInputSchema: z.ZodType<Prisma.PaintingCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaintingMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PaintingMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaintingMinOrderByAggregateInputSchema: z.ZodType<Prisma.PaintingMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TechniqueCountOrderByAggregateInputSchema: z.ZodType<Prisma.TechniqueCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TechniqueMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TechniqueMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TechniqueMinOrderByAggregateInputSchema: z.ZodType<Prisma.TechniqueMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PainterTechniqueCountOrderByAggregateInputSchema: z.ZodType<Prisma.PainterTechniqueCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  painterId: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PainterTechniqueMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PainterTechniqueMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  painterId: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PainterTechniqueMinOrderByAggregateInputSchema: z.ZodType<Prisma.PainterTechniqueMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  painterId: z.lazy(() => SortOrderSchema).optional(),
  techniqueId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PainterTechniqueCreateNestedManyWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueCreateNestedManyWithoutPainterInput> = z.object({
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema).array(),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PainterTechniqueCreateOrConnectWithoutPainterInputSchema),z.lazy(() => PainterTechniqueCreateOrConnectWithoutPainterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PainterTechniqueCreateManyPainterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PaintingCreateNestedManyWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingCreateNestedManyWithoutAuthorInput> = z.object({
  create: z.union([ z.lazy(() => PaintingCreateWithoutAuthorInputSchema),z.lazy(() => PaintingCreateWithoutAuthorInputSchema).array(),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaintingCreateOrConnectWithoutAuthorInputSchema),z.lazy(() => PaintingCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaintingCreateManyAuthorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PainterTechniqueUncheckedCreateNestedManyWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedCreateNestedManyWithoutPainterInput> = z.object({
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema).array(),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PainterTechniqueCreateOrConnectWithoutPainterInputSchema),z.lazy(() => PainterTechniqueCreateOrConnectWithoutPainterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PainterTechniqueCreateManyPainterInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PaintingUncheckedCreateNestedManyWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingUncheckedCreateNestedManyWithoutAuthorInput> = z.object({
  create: z.union([ z.lazy(() => PaintingCreateWithoutAuthorInputSchema),z.lazy(() => PaintingCreateWithoutAuthorInputSchema).array(),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaintingCreateOrConnectWithoutAuthorInputSchema),z.lazy(() => PaintingCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaintingCreateManyAuthorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const PainterTechniqueUpdateManyWithoutPainterNestedInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateManyWithoutPainterNestedInput> = z.object({
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema).array(),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PainterTechniqueCreateOrConnectWithoutPainterInputSchema),z.lazy(() => PainterTechniqueCreateOrConnectWithoutPainterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PainterTechniqueUpsertWithWhereUniqueWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUpsertWithWhereUniqueWithoutPainterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PainterTechniqueCreateManyPainterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PainterTechniqueUpdateWithWhereUniqueWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUpdateWithWhereUniqueWithoutPainterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PainterTechniqueUpdateManyWithWhereWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUpdateManyWithWhereWithoutPainterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PainterTechniqueScalarWhereInputSchema),z.lazy(() => PainterTechniqueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PaintingUpdateManyWithoutAuthorNestedInputSchema: z.ZodType<Prisma.PaintingUpdateManyWithoutAuthorNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaintingCreateWithoutAuthorInputSchema),z.lazy(() => PaintingCreateWithoutAuthorInputSchema).array(),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaintingCreateOrConnectWithoutAuthorInputSchema),z.lazy(() => PaintingCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaintingUpsertWithWhereUniqueWithoutAuthorInputSchema),z.lazy(() => PaintingUpsertWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaintingCreateManyAuthorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaintingUpdateWithWhereUniqueWithoutAuthorInputSchema),z.lazy(() => PaintingUpdateWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaintingUpdateManyWithWhereWithoutAuthorInputSchema),z.lazy(() => PaintingUpdateManyWithWhereWithoutAuthorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaintingScalarWhereInputSchema),z.lazy(() => PaintingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PainterTechniqueUncheckedUpdateManyWithoutPainterNestedInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedUpdateManyWithoutPainterNestedInput> = z.object({
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema).array(),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PainterTechniqueCreateOrConnectWithoutPainterInputSchema),z.lazy(() => PainterTechniqueCreateOrConnectWithoutPainterInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PainterTechniqueUpsertWithWhereUniqueWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUpsertWithWhereUniqueWithoutPainterInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PainterTechniqueCreateManyPainterInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PainterTechniqueUpdateWithWhereUniqueWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUpdateWithWhereUniqueWithoutPainterInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PainterTechniqueUpdateManyWithWhereWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUpdateManyWithWhereWithoutPainterInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PainterTechniqueScalarWhereInputSchema),z.lazy(() => PainterTechniqueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PaintingUncheckedUpdateManyWithoutAuthorNestedInputSchema: z.ZodType<Prisma.PaintingUncheckedUpdateManyWithoutAuthorNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaintingCreateWithoutAuthorInputSchema),z.lazy(() => PaintingCreateWithoutAuthorInputSchema).array(),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaintingCreateOrConnectWithoutAuthorInputSchema),z.lazy(() => PaintingCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaintingUpsertWithWhereUniqueWithoutAuthorInputSchema),z.lazy(() => PaintingUpsertWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaintingCreateManyAuthorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaintingUpdateWithWhereUniqueWithoutAuthorInputSchema),z.lazy(() => PaintingUpdateWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaintingUpdateManyWithWhereWithoutAuthorInputSchema),z.lazy(() => PaintingUpdateManyWithWhereWithoutAuthorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaintingScalarWhereInputSchema),z.lazy(() => PaintingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PainterCreateNestedOneWithoutPaintingsInputSchema: z.ZodType<Prisma.PainterCreateNestedOneWithoutPaintingsInput> = z.object({
  create: z.union([ z.lazy(() => PainterCreateWithoutPaintingsInputSchema),z.lazy(() => PainterUncheckedCreateWithoutPaintingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PainterCreateOrConnectWithoutPaintingsInputSchema).optional(),
  connect: z.lazy(() => PainterWhereUniqueInputSchema).optional()
}).strict();

export const TechniqueCreateNestedOneWithoutPaintingsInputSchema: z.ZodType<Prisma.TechniqueCreateNestedOneWithoutPaintingsInput> = z.object({
  create: z.union([ z.lazy(() => TechniqueCreateWithoutPaintingsInputSchema),z.lazy(() => TechniqueUncheckedCreateWithoutPaintingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TechniqueCreateOrConnectWithoutPaintingsInputSchema).optional(),
  connect: z.lazy(() => TechniqueWhereUniqueInputSchema).optional()
}).strict();

export const PainterUpdateOneRequiredWithoutPaintingsNestedInputSchema: z.ZodType<Prisma.PainterUpdateOneRequiredWithoutPaintingsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PainterCreateWithoutPaintingsInputSchema),z.lazy(() => PainterUncheckedCreateWithoutPaintingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PainterCreateOrConnectWithoutPaintingsInputSchema).optional(),
  upsert: z.lazy(() => PainterUpsertWithoutPaintingsInputSchema).optional(),
  connect: z.lazy(() => PainterWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PainterUpdateToOneWithWhereWithoutPaintingsInputSchema),z.lazy(() => PainterUpdateWithoutPaintingsInputSchema),z.lazy(() => PainterUncheckedUpdateWithoutPaintingsInputSchema) ]).optional(),
}).strict();

export const TechniqueUpdateOneRequiredWithoutPaintingsNestedInputSchema: z.ZodType<Prisma.TechniqueUpdateOneRequiredWithoutPaintingsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TechniqueCreateWithoutPaintingsInputSchema),z.lazy(() => TechniqueUncheckedCreateWithoutPaintingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TechniqueCreateOrConnectWithoutPaintingsInputSchema).optional(),
  upsert: z.lazy(() => TechniqueUpsertWithoutPaintingsInputSchema).optional(),
  connect: z.lazy(() => TechniqueWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TechniqueUpdateToOneWithWhereWithoutPaintingsInputSchema),z.lazy(() => TechniqueUpdateWithoutPaintingsInputSchema),z.lazy(() => TechniqueUncheckedUpdateWithoutPaintingsInputSchema) ]).optional(),
}).strict();

export const PainterTechniqueCreateNestedManyWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueCreateNestedManyWithoutTechniqueInput> = z.object({
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema).array(),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PainterTechniqueCreateOrConnectWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueCreateOrConnectWithoutTechniqueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PainterTechniqueCreateManyTechniqueInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PaintingCreateNestedManyWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingCreateNestedManyWithoutTechniqueInput> = z.object({
  create: z.union([ z.lazy(() => PaintingCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingCreateWithoutTechniqueInputSchema).array(),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaintingCreateOrConnectWithoutTechniqueInputSchema),z.lazy(() => PaintingCreateOrConnectWithoutTechniqueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaintingCreateManyTechniqueInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PainterTechniqueUncheckedCreateNestedManyWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedCreateNestedManyWithoutTechniqueInput> = z.object({
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema).array(),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PainterTechniqueCreateOrConnectWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueCreateOrConnectWithoutTechniqueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PainterTechniqueCreateManyTechniqueInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PaintingUncheckedCreateNestedManyWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingUncheckedCreateNestedManyWithoutTechniqueInput> = z.object({
  create: z.union([ z.lazy(() => PaintingCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingCreateWithoutTechniqueInputSchema).array(),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaintingCreateOrConnectWithoutTechniqueInputSchema),z.lazy(() => PaintingCreateOrConnectWithoutTechniqueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaintingCreateManyTechniqueInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PainterTechniqueUpdateManyWithoutTechniqueNestedInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateManyWithoutTechniqueNestedInput> = z.object({
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema).array(),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PainterTechniqueCreateOrConnectWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueCreateOrConnectWithoutTechniqueInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PainterTechniqueUpsertWithWhereUniqueWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUpsertWithWhereUniqueWithoutTechniqueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PainterTechniqueCreateManyTechniqueInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PainterTechniqueUpdateWithWhereUniqueWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUpdateWithWhereUniqueWithoutTechniqueInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PainterTechniqueUpdateManyWithWhereWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUpdateManyWithWhereWithoutTechniqueInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PainterTechniqueScalarWhereInputSchema),z.lazy(() => PainterTechniqueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PaintingUpdateManyWithoutTechniqueNestedInputSchema: z.ZodType<Prisma.PaintingUpdateManyWithoutTechniqueNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaintingCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingCreateWithoutTechniqueInputSchema).array(),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaintingCreateOrConnectWithoutTechniqueInputSchema),z.lazy(() => PaintingCreateOrConnectWithoutTechniqueInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaintingUpsertWithWhereUniqueWithoutTechniqueInputSchema),z.lazy(() => PaintingUpsertWithWhereUniqueWithoutTechniqueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaintingCreateManyTechniqueInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaintingUpdateWithWhereUniqueWithoutTechniqueInputSchema),z.lazy(() => PaintingUpdateWithWhereUniqueWithoutTechniqueInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaintingUpdateManyWithWhereWithoutTechniqueInputSchema),z.lazy(() => PaintingUpdateManyWithWhereWithoutTechniqueInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaintingScalarWhereInputSchema),z.lazy(() => PaintingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PainterTechniqueUncheckedUpdateManyWithoutTechniqueNestedInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedUpdateManyWithoutTechniqueNestedInput> = z.object({
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema).array(),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PainterTechniqueCreateOrConnectWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueCreateOrConnectWithoutTechniqueInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PainterTechniqueUpsertWithWhereUniqueWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUpsertWithWhereUniqueWithoutTechniqueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PainterTechniqueCreateManyTechniqueInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PainterTechniqueWhereUniqueInputSchema),z.lazy(() => PainterTechniqueWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PainterTechniqueUpdateWithWhereUniqueWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUpdateWithWhereUniqueWithoutTechniqueInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PainterTechniqueUpdateManyWithWhereWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUpdateManyWithWhereWithoutTechniqueInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PainterTechniqueScalarWhereInputSchema),z.lazy(() => PainterTechniqueScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PaintingUncheckedUpdateManyWithoutTechniqueNestedInputSchema: z.ZodType<Prisma.PaintingUncheckedUpdateManyWithoutTechniqueNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaintingCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingCreateWithoutTechniqueInputSchema).array(),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaintingCreateOrConnectWithoutTechniqueInputSchema),z.lazy(() => PaintingCreateOrConnectWithoutTechniqueInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaintingUpsertWithWhereUniqueWithoutTechniqueInputSchema),z.lazy(() => PaintingUpsertWithWhereUniqueWithoutTechniqueInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaintingCreateManyTechniqueInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaintingWhereUniqueInputSchema),z.lazy(() => PaintingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaintingUpdateWithWhereUniqueWithoutTechniqueInputSchema),z.lazy(() => PaintingUpdateWithWhereUniqueWithoutTechniqueInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaintingUpdateManyWithWhereWithoutTechniqueInputSchema),z.lazy(() => PaintingUpdateManyWithWhereWithoutTechniqueInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaintingScalarWhereInputSchema),z.lazy(() => PaintingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PainterCreateNestedOneWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.PainterCreateNestedOneWithoutPainterTechniquesInput> = z.object({
  create: z.union([ z.lazy(() => PainterCreateWithoutPainterTechniquesInputSchema),z.lazy(() => PainterUncheckedCreateWithoutPainterTechniquesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PainterCreateOrConnectWithoutPainterTechniquesInputSchema).optional(),
  connect: z.lazy(() => PainterWhereUniqueInputSchema).optional()
}).strict();

export const TechniqueCreateNestedOneWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.TechniqueCreateNestedOneWithoutPainterTechniquesInput> = z.object({
  create: z.union([ z.lazy(() => TechniqueCreateWithoutPainterTechniquesInputSchema),z.lazy(() => TechniqueUncheckedCreateWithoutPainterTechniquesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TechniqueCreateOrConnectWithoutPainterTechniquesInputSchema).optional(),
  connect: z.lazy(() => TechniqueWhereUniqueInputSchema).optional()
}).strict();

export const PainterUpdateOneRequiredWithoutPainterTechniquesNestedInputSchema: z.ZodType<Prisma.PainterUpdateOneRequiredWithoutPainterTechniquesNestedInput> = z.object({
  create: z.union([ z.lazy(() => PainterCreateWithoutPainterTechniquesInputSchema),z.lazy(() => PainterUncheckedCreateWithoutPainterTechniquesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PainterCreateOrConnectWithoutPainterTechniquesInputSchema).optional(),
  upsert: z.lazy(() => PainterUpsertWithoutPainterTechniquesInputSchema).optional(),
  connect: z.lazy(() => PainterWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PainterUpdateToOneWithWhereWithoutPainterTechniquesInputSchema),z.lazy(() => PainterUpdateWithoutPainterTechniquesInputSchema),z.lazy(() => PainterUncheckedUpdateWithoutPainterTechniquesInputSchema) ]).optional(),
}).strict();

export const TechniqueUpdateOneRequiredWithoutPainterTechniquesNestedInputSchema: z.ZodType<Prisma.TechniqueUpdateOneRequiredWithoutPainterTechniquesNestedInput> = z.object({
  create: z.union([ z.lazy(() => TechniqueCreateWithoutPainterTechniquesInputSchema),z.lazy(() => TechniqueUncheckedCreateWithoutPainterTechniquesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TechniqueCreateOrConnectWithoutPainterTechniquesInputSchema).optional(),
  upsert: z.lazy(() => TechniqueUpsertWithoutPainterTechniquesInputSchema).optional(),
  connect: z.lazy(() => TechniqueWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TechniqueUpdateToOneWithWhereWithoutPainterTechniquesInputSchema),z.lazy(() => TechniqueUpdateWithoutPainterTechniquesInputSchema),z.lazy(() => TechniqueUncheckedUpdateWithoutPainterTechniquesInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const PainterTechniqueCreateWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueCreateWithoutPainterInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  technique: z.lazy(() => TechniqueCreateNestedOneWithoutPainterTechniquesInputSchema)
}).strict();

export const PainterTechniqueUncheckedCreateWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedCreateWithoutPainterInput> = z.object({
  id: z.string().cuid().optional(),
  techniqueId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PainterTechniqueCreateOrConnectWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueCreateOrConnectWithoutPainterInput> = z.object({
  where: z.lazy(() => PainterTechniqueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema) ]),
}).strict();

export const PainterTechniqueCreateManyPainterInputEnvelopeSchema: z.ZodType<Prisma.PainterTechniqueCreateManyPainterInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PainterTechniqueCreateManyPainterInputSchema),z.lazy(() => PainterTechniqueCreateManyPainterInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PaintingCreateWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingCreateWithoutAuthorInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  technique: z.lazy(() => TechniqueCreateNestedOneWithoutPaintingsInputSchema)
}).strict();

export const PaintingUncheckedCreateWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingUncheckedCreateWithoutAuthorInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  techniqueId: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaintingCreateOrConnectWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingCreateOrConnectWithoutAuthorInput> = z.object({
  where: z.lazy(() => PaintingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaintingCreateWithoutAuthorInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema) ]),
}).strict();

export const PaintingCreateManyAuthorInputEnvelopeSchema: z.ZodType<Prisma.PaintingCreateManyAuthorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PaintingCreateManyAuthorInputSchema),z.lazy(() => PaintingCreateManyAuthorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PainterTechniqueUpsertWithWhereUniqueWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueUpsertWithWhereUniqueWithoutPainterInput> = z.object({
  where: z.lazy(() => PainterTechniqueWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PainterTechniqueUpdateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUncheckedUpdateWithoutPainterInputSchema) ]),
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutPainterInputSchema) ]),
}).strict();

export const PainterTechniqueUpdateWithWhereUniqueWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateWithWhereUniqueWithoutPainterInput> = z.object({
  where: z.lazy(() => PainterTechniqueWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PainterTechniqueUpdateWithoutPainterInputSchema),z.lazy(() => PainterTechniqueUncheckedUpdateWithoutPainterInputSchema) ]),
}).strict();

export const PainterTechniqueUpdateManyWithWhereWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateManyWithWhereWithoutPainterInput> = z.object({
  where: z.lazy(() => PainterTechniqueScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PainterTechniqueUpdateManyMutationInputSchema),z.lazy(() => PainterTechniqueUncheckedUpdateManyWithoutPainterInputSchema) ]),
}).strict();

export const PainterTechniqueScalarWhereInputSchema: z.ZodType<Prisma.PainterTechniqueScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PainterTechniqueScalarWhereInputSchema),z.lazy(() => PainterTechniqueScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PainterTechniqueScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PainterTechniqueScalarWhereInputSchema),z.lazy(() => PainterTechniqueScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  painterId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  techniqueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PaintingUpsertWithWhereUniqueWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingUpsertWithWhereUniqueWithoutAuthorInput> = z.object({
  where: z.lazy(() => PaintingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PaintingUpdateWithoutAuthorInputSchema),z.lazy(() => PaintingUncheckedUpdateWithoutAuthorInputSchema) ]),
  create: z.union([ z.lazy(() => PaintingCreateWithoutAuthorInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutAuthorInputSchema) ]),
}).strict();

export const PaintingUpdateWithWhereUniqueWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingUpdateWithWhereUniqueWithoutAuthorInput> = z.object({
  where: z.lazy(() => PaintingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PaintingUpdateWithoutAuthorInputSchema),z.lazy(() => PaintingUncheckedUpdateWithoutAuthorInputSchema) ]),
}).strict();

export const PaintingUpdateManyWithWhereWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingUpdateManyWithWhereWithoutAuthorInput> = z.object({
  where: z.lazy(() => PaintingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PaintingUpdateManyMutationInputSchema),z.lazy(() => PaintingUncheckedUpdateManyWithoutAuthorInputSchema) ]),
}).strict();

export const PaintingScalarWhereInputSchema: z.ZodType<Prisma.PaintingScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PaintingScalarWhereInputSchema),z.lazy(() => PaintingScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaintingScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaintingScalarWhereInputSchema),z.lazy(() => PaintingScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  authorId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  techniqueId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PainterCreateWithoutPaintingsInputSchema: z.ZodType<Prisma.PainterCreateWithoutPaintingsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painterTechniques: z.lazy(() => PainterTechniqueCreateNestedManyWithoutPainterInputSchema).optional()
}).strict();

export const PainterUncheckedCreateWithoutPaintingsInputSchema: z.ZodType<Prisma.PainterUncheckedCreateWithoutPaintingsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUncheckedCreateNestedManyWithoutPainterInputSchema).optional()
}).strict();

export const PainterCreateOrConnectWithoutPaintingsInputSchema: z.ZodType<Prisma.PainterCreateOrConnectWithoutPaintingsInput> = z.object({
  where: z.lazy(() => PainterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PainterCreateWithoutPaintingsInputSchema),z.lazy(() => PainterUncheckedCreateWithoutPaintingsInputSchema) ]),
}).strict();

export const TechniqueCreateWithoutPaintingsInputSchema: z.ZodType<Prisma.TechniqueCreateWithoutPaintingsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painterTechniques: z.lazy(() => PainterTechniqueCreateNestedManyWithoutTechniqueInputSchema).optional()
}).strict();

export const TechniqueUncheckedCreateWithoutPaintingsInputSchema: z.ZodType<Prisma.TechniqueUncheckedCreateWithoutPaintingsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUncheckedCreateNestedManyWithoutTechniqueInputSchema).optional()
}).strict();

export const TechniqueCreateOrConnectWithoutPaintingsInputSchema: z.ZodType<Prisma.TechniqueCreateOrConnectWithoutPaintingsInput> = z.object({
  where: z.lazy(() => TechniqueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TechniqueCreateWithoutPaintingsInputSchema),z.lazy(() => TechniqueUncheckedCreateWithoutPaintingsInputSchema) ]),
}).strict();

export const PainterUpsertWithoutPaintingsInputSchema: z.ZodType<Prisma.PainterUpsertWithoutPaintingsInput> = z.object({
  update: z.union([ z.lazy(() => PainterUpdateWithoutPaintingsInputSchema),z.lazy(() => PainterUncheckedUpdateWithoutPaintingsInputSchema) ]),
  create: z.union([ z.lazy(() => PainterCreateWithoutPaintingsInputSchema),z.lazy(() => PainterUncheckedCreateWithoutPaintingsInputSchema) ]),
  where: z.lazy(() => PainterWhereInputSchema).optional()
}).strict();

export const PainterUpdateToOneWithWhereWithoutPaintingsInputSchema: z.ZodType<Prisma.PainterUpdateToOneWithWhereWithoutPaintingsInput> = z.object({
  where: z.lazy(() => PainterWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PainterUpdateWithoutPaintingsInputSchema),z.lazy(() => PainterUncheckedUpdateWithoutPaintingsInputSchema) ]),
}).strict();

export const PainterUpdateWithoutPaintingsInputSchema: z.ZodType<Prisma.PainterUpdateWithoutPaintingsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUpdateManyWithoutPainterNestedInputSchema).optional()
}).strict();

export const PainterUncheckedUpdateWithoutPaintingsInputSchema: z.ZodType<Prisma.PainterUncheckedUpdateWithoutPaintingsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUncheckedUpdateManyWithoutPainterNestedInputSchema).optional()
}).strict();

export const TechniqueUpsertWithoutPaintingsInputSchema: z.ZodType<Prisma.TechniqueUpsertWithoutPaintingsInput> = z.object({
  update: z.union([ z.lazy(() => TechniqueUpdateWithoutPaintingsInputSchema),z.lazy(() => TechniqueUncheckedUpdateWithoutPaintingsInputSchema) ]),
  create: z.union([ z.lazy(() => TechniqueCreateWithoutPaintingsInputSchema),z.lazy(() => TechniqueUncheckedCreateWithoutPaintingsInputSchema) ]),
  where: z.lazy(() => TechniqueWhereInputSchema).optional()
}).strict();

export const TechniqueUpdateToOneWithWhereWithoutPaintingsInputSchema: z.ZodType<Prisma.TechniqueUpdateToOneWithWhereWithoutPaintingsInput> = z.object({
  where: z.lazy(() => TechniqueWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TechniqueUpdateWithoutPaintingsInputSchema),z.lazy(() => TechniqueUncheckedUpdateWithoutPaintingsInputSchema) ]),
}).strict();

export const TechniqueUpdateWithoutPaintingsInputSchema: z.ZodType<Prisma.TechniqueUpdateWithoutPaintingsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUpdateManyWithoutTechniqueNestedInputSchema).optional()
}).strict();

export const TechniqueUncheckedUpdateWithoutPaintingsInputSchema: z.ZodType<Prisma.TechniqueUncheckedUpdateWithoutPaintingsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painterTechniques: z.lazy(() => PainterTechniqueUncheckedUpdateManyWithoutTechniqueNestedInputSchema).optional()
}).strict();

export const PainterTechniqueCreateWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueCreateWithoutTechniqueInput> = z.object({
  id: z.string().cuid().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  painter: z.lazy(() => PainterCreateNestedOneWithoutPainterTechniquesInputSchema)
}).strict();

export const PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedCreateWithoutTechniqueInput> = z.object({
  id: z.string().cuid().optional(),
  painterId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PainterTechniqueCreateOrConnectWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueCreateOrConnectWithoutTechniqueInput> = z.object({
  where: z.lazy(() => PainterTechniqueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema) ]),
}).strict();

export const PainterTechniqueCreateManyTechniqueInputEnvelopeSchema: z.ZodType<Prisma.PainterTechniqueCreateManyTechniqueInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PainterTechniqueCreateManyTechniqueInputSchema),z.lazy(() => PainterTechniqueCreateManyTechniqueInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PaintingCreateWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingCreateWithoutTechniqueInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  author: z.lazy(() => PainterCreateNestedOneWithoutPaintingsInputSchema)
}).strict();

export const PaintingUncheckedCreateWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingUncheckedCreateWithoutTechniqueInput> = z.object({
  id: z.string().cuid().optional(),
  authorId: z.string(),
  title: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaintingCreateOrConnectWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingCreateOrConnectWithoutTechniqueInput> = z.object({
  where: z.lazy(() => PaintingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaintingCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema) ]),
}).strict();

export const PaintingCreateManyTechniqueInputEnvelopeSchema: z.ZodType<Prisma.PaintingCreateManyTechniqueInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PaintingCreateManyTechniqueInputSchema),z.lazy(() => PaintingCreateManyTechniqueInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PainterTechniqueUpsertWithWhereUniqueWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueUpsertWithWhereUniqueWithoutTechniqueInput> = z.object({
  where: z.lazy(() => PainterTechniqueWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PainterTechniqueUpdateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUncheckedUpdateWithoutTechniqueInputSchema) ]),
  create: z.union([ z.lazy(() => PainterTechniqueCreateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUncheckedCreateWithoutTechniqueInputSchema) ]),
}).strict();

export const PainterTechniqueUpdateWithWhereUniqueWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateWithWhereUniqueWithoutTechniqueInput> = z.object({
  where: z.lazy(() => PainterTechniqueWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PainterTechniqueUpdateWithoutTechniqueInputSchema),z.lazy(() => PainterTechniqueUncheckedUpdateWithoutTechniqueInputSchema) ]),
}).strict();

export const PainterTechniqueUpdateManyWithWhereWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateManyWithWhereWithoutTechniqueInput> = z.object({
  where: z.lazy(() => PainterTechniqueScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PainterTechniqueUpdateManyMutationInputSchema),z.lazy(() => PainterTechniqueUncheckedUpdateManyWithoutTechniqueInputSchema) ]),
}).strict();

export const PaintingUpsertWithWhereUniqueWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingUpsertWithWhereUniqueWithoutTechniqueInput> = z.object({
  where: z.lazy(() => PaintingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PaintingUpdateWithoutTechniqueInputSchema),z.lazy(() => PaintingUncheckedUpdateWithoutTechniqueInputSchema) ]),
  create: z.union([ z.lazy(() => PaintingCreateWithoutTechniqueInputSchema),z.lazy(() => PaintingUncheckedCreateWithoutTechniqueInputSchema) ]),
}).strict();

export const PaintingUpdateWithWhereUniqueWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingUpdateWithWhereUniqueWithoutTechniqueInput> = z.object({
  where: z.lazy(() => PaintingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PaintingUpdateWithoutTechniqueInputSchema),z.lazy(() => PaintingUncheckedUpdateWithoutTechniqueInputSchema) ]),
}).strict();

export const PaintingUpdateManyWithWhereWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingUpdateManyWithWhereWithoutTechniqueInput> = z.object({
  where: z.lazy(() => PaintingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PaintingUpdateManyMutationInputSchema),z.lazy(() => PaintingUncheckedUpdateManyWithoutTechniqueInputSchema) ]),
}).strict();

export const PainterCreateWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.PainterCreateWithoutPainterTechniquesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  paintings: z.lazy(() => PaintingCreateNestedManyWithoutAuthorInputSchema).optional()
}).strict();

export const PainterUncheckedCreateWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.PainterUncheckedCreateWithoutPainterTechniquesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  country: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  paintings: z.lazy(() => PaintingUncheckedCreateNestedManyWithoutAuthorInputSchema).optional()
}).strict();

export const PainterCreateOrConnectWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.PainterCreateOrConnectWithoutPainterTechniquesInput> = z.object({
  where: z.lazy(() => PainterWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PainterCreateWithoutPainterTechniquesInputSchema),z.lazy(() => PainterUncheckedCreateWithoutPainterTechniquesInputSchema) ]),
}).strict();

export const TechniqueCreateWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.TechniqueCreateWithoutPainterTechniquesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  paintings: z.lazy(() => PaintingCreateNestedManyWithoutTechniqueInputSchema).optional()
}).strict();

export const TechniqueUncheckedCreateWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.TechniqueUncheckedCreateWithoutPainterTechniquesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  paintings: z.lazy(() => PaintingUncheckedCreateNestedManyWithoutTechniqueInputSchema).optional()
}).strict();

export const TechniqueCreateOrConnectWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.TechniqueCreateOrConnectWithoutPainterTechniquesInput> = z.object({
  where: z.lazy(() => TechniqueWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TechniqueCreateWithoutPainterTechniquesInputSchema),z.lazy(() => TechniqueUncheckedCreateWithoutPainterTechniquesInputSchema) ]),
}).strict();

export const PainterUpsertWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.PainterUpsertWithoutPainterTechniquesInput> = z.object({
  update: z.union([ z.lazy(() => PainterUpdateWithoutPainterTechniquesInputSchema),z.lazy(() => PainterUncheckedUpdateWithoutPainterTechniquesInputSchema) ]),
  create: z.union([ z.lazy(() => PainterCreateWithoutPainterTechniquesInputSchema),z.lazy(() => PainterUncheckedCreateWithoutPainterTechniquesInputSchema) ]),
  where: z.lazy(() => PainterWhereInputSchema).optional()
}).strict();

export const PainterUpdateToOneWithWhereWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.PainterUpdateToOneWithWhereWithoutPainterTechniquesInput> = z.object({
  where: z.lazy(() => PainterWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PainterUpdateWithoutPainterTechniquesInputSchema),z.lazy(() => PainterUncheckedUpdateWithoutPainterTechniquesInputSchema) ]),
}).strict();

export const PainterUpdateWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.PainterUpdateWithoutPainterTechniquesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  paintings: z.lazy(() => PaintingUpdateManyWithoutAuthorNestedInputSchema).optional()
}).strict();

export const PainterUncheckedUpdateWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.PainterUncheckedUpdateWithoutPainterTechniquesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  paintings: z.lazy(() => PaintingUncheckedUpdateManyWithoutAuthorNestedInputSchema).optional()
}).strict();

export const TechniqueUpsertWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.TechniqueUpsertWithoutPainterTechniquesInput> = z.object({
  update: z.union([ z.lazy(() => TechniqueUpdateWithoutPainterTechniquesInputSchema),z.lazy(() => TechniqueUncheckedUpdateWithoutPainterTechniquesInputSchema) ]),
  create: z.union([ z.lazy(() => TechniqueCreateWithoutPainterTechniquesInputSchema),z.lazy(() => TechniqueUncheckedCreateWithoutPainterTechniquesInputSchema) ]),
  where: z.lazy(() => TechniqueWhereInputSchema).optional()
}).strict();

export const TechniqueUpdateToOneWithWhereWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.TechniqueUpdateToOneWithWhereWithoutPainterTechniquesInput> = z.object({
  where: z.lazy(() => TechniqueWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TechniqueUpdateWithoutPainterTechniquesInputSchema),z.lazy(() => TechniqueUncheckedUpdateWithoutPainterTechniquesInputSchema) ]),
}).strict();

export const TechniqueUpdateWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.TechniqueUpdateWithoutPainterTechniquesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  paintings: z.lazy(() => PaintingUpdateManyWithoutTechniqueNestedInputSchema).optional()
}).strict();

export const TechniqueUncheckedUpdateWithoutPainterTechniquesInputSchema: z.ZodType<Prisma.TechniqueUncheckedUpdateWithoutPainterTechniquesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  paintings: z.lazy(() => PaintingUncheckedUpdateManyWithoutTechniqueNestedInputSchema).optional()
}).strict();

export const PainterTechniqueCreateManyPainterInputSchema: z.ZodType<Prisma.PainterTechniqueCreateManyPainterInput> = z.object({
  id: z.string().cuid().optional(),
  techniqueId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaintingCreateManyAuthorInputSchema: z.ZodType<Prisma.PaintingCreateManyAuthorInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  techniqueId: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PainterTechniqueUpdateWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateWithoutPainterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  technique: z.lazy(() => TechniqueUpdateOneRequiredWithoutPainterTechniquesNestedInputSchema).optional()
}).strict();

export const PainterTechniqueUncheckedUpdateWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedUpdateWithoutPainterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  techniqueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PainterTechniqueUncheckedUpdateManyWithoutPainterInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedUpdateManyWithoutPainterInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  techniqueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaintingUpdateWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingUpdateWithoutAuthorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  technique: z.lazy(() => TechniqueUpdateOneRequiredWithoutPaintingsNestedInputSchema).optional()
}).strict();

export const PaintingUncheckedUpdateWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingUncheckedUpdateWithoutAuthorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  techniqueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaintingUncheckedUpdateManyWithoutAuthorInputSchema: z.ZodType<Prisma.PaintingUncheckedUpdateManyWithoutAuthorInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  techniqueId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PainterTechniqueCreateManyTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueCreateManyTechniqueInput> = z.object({
  id: z.string().cuid().optional(),
  painterId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PaintingCreateManyTechniqueInputSchema: z.ZodType<Prisma.PaintingCreateManyTechniqueInput> = z.object({
  id: z.string().cuid().optional(),
  authorId: z.string(),
  title: z.string(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PainterTechniqueUpdateWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueUpdateWithoutTechniqueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  painter: z.lazy(() => PainterUpdateOneRequiredWithoutPainterTechniquesNestedInputSchema).optional()
}).strict();

export const PainterTechniqueUncheckedUpdateWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedUpdateWithoutTechniqueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  painterId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PainterTechniqueUncheckedUpdateManyWithoutTechniqueInputSchema: z.ZodType<Prisma.PainterTechniqueUncheckedUpdateManyWithoutTechniqueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  painterId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaintingUpdateWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingUpdateWithoutTechniqueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.lazy(() => PainterUpdateOneRequiredWithoutPaintingsNestedInputSchema).optional()
}).strict();

export const PaintingUncheckedUpdateWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingUncheckedUpdateWithoutTechniqueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  authorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaintingUncheckedUpdateManyWithoutTechniqueInputSchema: z.ZodType<Prisma.PaintingUncheckedUpdateManyWithoutTechniqueInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  authorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const PainterFindFirstArgsSchema: z.ZodType<Prisma.PainterFindFirstArgs> = z.object({
  select: PainterSelectSchema.optional(),
  include: PainterIncludeSchema.optional(),
  where: PainterWhereInputSchema.optional(),
  orderBy: z.union([ PainterOrderByWithRelationInputSchema.array(),PainterOrderByWithRelationInputSchema ]).optional(),
  cursor: PainterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PainterScalarFieldEnumSchema,PainterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PainterFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PainterFindFirstOrThrowArgs> = z.object({
  select: PainterSelectSchema.optional(),
  include: PainterIncludeSchema.optional(),
  where: PainterWhereInputSchema.optional(),
  orderBy: z.union([ PainterOrderByWithRelationInputSchema.array(),PainterOrderByWithRelationInputSchema ]).optional(),
  cursor: PainterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PainterScalarFieldEnumSchema,PainterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PainterFindManyArgsSchema: z.ZodType<Prisma.PainterFindManyArgs> = z.object({
  select: PainterSelectSchema.optional(),
  include: PainterIncludeSchema.optional(),
  where: PainterWhereInputSchema.optional(),
  orderBy: z.union([ PainterOrderByWithRelationInputSchema.array(),PainterOrderByWithRelationInputSchema ]).optional(),
  cursor: PainterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PainterScalarFieldEnumSchema,PainterScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PainterAggregateArgsSchema: z.ZodType<Prisma.PainterAggregateArgs> = z.object({
  where: PainterWhereInputSchema.optional(),
  orderBy: z.union([ PainterOrderByWithRelationInputSchema.array(),PainterOrderByWithRelationInputSchema ]).optional(),
  cursor: PainterWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PainterGroupByArgsSchema: z.ZodType<Prisma.PainterGroupByArgs> = z.object({
  where: PainterWhereInputSchema.optional(),
  orderBy: z.union([ PainterOrderByWithAggregationInputSchema.array(),PainterOrderByWithAggregationInputSchema ]).optional(),
  by: PainterScalarFieldEnumSchema.array(),
  having: PainterScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PainterFindUniqueArgsSchema: z.ZodType<Prisma.PainterFindUniqueArgs> = z.object({
  select: PainterSelectSchema.optional(),
  include: PainterIncludeSchema.optional(),
  where: PainterWhereUniqueInputSchema,
}).strict() ;

export const PainterFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PainterFindUniqueOrThrowArgs> = z.object({
  select: PainterSelectSchema.optional(),
  include: PainterIncludeSchema.optional(),
  where: PainterWhereUniqueInputSchema,
}).strict() ;

export const PaintingFindFirstArgsSchema: z.ZodType<Prisma.PaintingFindFirstArgs> = z.object({
  select: PaintingSelectSchema.optional(),
  include: PaintingIncludeSchema.optional(),
  where: PaintingWhereInputSchema.optional(),
  orderBy: z.union([ PaintingOrderByWithRelationInputSchema.array(),PaintingOrderByWithRelationInputSchema ]).optional(),
  cursor: PaintingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaintingScalarFieldEnumSchema,PaintingScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaintingFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PaintingFindFirstOrThrowArgs> = z.object({
  select: PaintingSelectSchema.optional(),
  include: PaintingIncludeSchema.optional(),
  where: PaintingWhereInputSchema.optional(),
  orderBy: z.union([ PaintingOrderByWithRelationInputSchema.array(),PaintingOrderByWithRelationInputSchema ]).optional(),
  cursor: PaintingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaintingScalarFieldEnumSchema,PaintingScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaintingFindManyArgsSchema: z.ZodType<Prisma.PaintingFindManyArgs> = z.object({
  select: PaintingSelectSchema.optional(),
  include: PaintingIncludeSchema.optional(),
  where: PaintingWhereInputSchema.optional(),
  orderBy: z.union([ PaintingOrderByWithRelationInputSchema.array(),PaintingOrderByWithRelationInputSchema ]).optional(),
  cursor: PaintingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaintingScalarFieldEnumSchema,PaintingScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaintingAggregateArgsSchema: z.ZodType<Prisma.PaintingAggregateArgs> = z.object({
  where: PaintingWhereInputSchema.optional(),
  orderBy: z.union([ PaintingOrderByWithRelationInputSchema.array(),PaintingOrderByWithRelationInputSchema ]).optional(),
  cursor: PaintingWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PaintingGroupByArgsSchema: z.ZodType<Prisma.PaintingGroupByArgs> = z.object({
  where: PaintingWhereInputSchema.optional(),
  orderBy: z.union([ PaintingOrderByWithAggregationInputSchema.array(),PaintingOrderByWithAggregationInputSchema ]).optional(),
  by: PaintingScalarFieldEnumSchema.array(),
  having: PaintingScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PaintingFindUniqueArgsSchema: z.ZodType<Prisma.PaintingFindUniqueArgs> = z.object({
  select: PaintingSelectSchema.optional(),
  include: PaintingIncludeSchema.optional(),
  where: PaintingWhereUniqueInputSchema,
}).strict() ;

export const PaintingFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PaintingFindUniqueOrThrowArgs> = z.object({
  select: PaintingSelectSchema.optional(),
  include: PaintingIncludeSchema.optional(),
  where: PaintingWhereUniqueInputSchema,
}).strict() ;

export const TechniqueFindFirstArgsSchema: z.ZodType<Prisma.TechniqueFindFirstArgs> = z.object({
  select: TechniqueSelectSchema.optional(),
  include: TechniqueIncludeSchema.optional(),
  where: TechniqueWhereInputSchema.optional(),
  orderBy: z.union([ TechniqueOrderByWithRelationInputSchema.array(),TechniqueOrderByWithRelationInputSchema ]).optional(),
  cursor: TechniqueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TechniqueScalarFieldEnumSchema,TechniqueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TechniqueFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TechniqueFindFirstOrThrowArgs> = z.object({
  select: TechniqueSelectSchema.optional(),
  include: TechniqueIncludeSchema.optional(),
  where: TechniqueWhereInputSchema.optional(),
  orderBy: z.union([ TechniqueOrderByWithRelationInputSchema.array(),TechniqueOrderByWithRelationInputSchema ]).optional(),
  cursor: TechniqueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TechniqueScalarFieldEnumSchema,TechniqueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TechniqueFindManyArgsSchema: z.ZodType<Prisma.TechniqueFindManyArgs> = z.object({
  select: TechniqueSelectSchema.optional(),
  include: TechniqueIncludeSchema.optional(),
  where: TechniqueWhereInputSchema.optional(),
  orderBy: z.union([ TechniqueOrderByWithRelationInputSchema.array(),TechniqueOrderByWithRelationInputSchema ]).optional(),
  cursor: TechniqueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TechniqueScalarFieldEnumSchema,TechniqueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TechniqueAggregateArgsSchema: z.ZodType<Prisma.TechniqueAggregateArgs> = z.object({
  where: TechniqueWhereInputSchema.optional(),
  orderBy: z.union([ TechniqueOrderByWithRelationInputSchema.array(),TechniqueOrderByWithRelationInputSchema ]).optional(),
  cursor: TechniqueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TechniqueGroupByArgsSchema: z.ZodType<Prisma.TechniqueGroupByArgs> = z.object({
  where: TechniqueWhereInputSchema.optional(),
  orderBy: z.union([ TechniqueOrderByWithAggregationInputSchema.array(),TechniqueOrderByWithAggregationInputSchema ]).optional(),
  by: TechniqueScalarFieldEnumSchema.array(),
  having: TechniqueScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TechniqueFindUniqueArgsSchema: z.ZodType<Prisma.TechniqueFindUniqueArgs> = z.object({
  select: TechniqueSelectSchema.optional(),
  include: TechniqueIncludeSchema.optional(),
  where: TechniqueWhereUniqueInputSchema,
}).strict() ;

export const TechniqueFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TechniqueFindUniqueOrThrowArgs> = z.object({
  select: TechniqueSelectSchema.optional(),
  include: TechniqueIncludeSchema.optional(),
  where: TechniqueWhereUniqueInputSchema,
}).strict() ;

export const PainterTechniqueFindFirstArgsSchema: z.ZodType<Prisma.PainterTechniqueFindFirstArgs> = z.object({
  select: PainterTechniqueSelectSchema.optional(),
  include: PainterTechniqueIncludeSchema.optional(),
  where: PainterTechniqueWhereInputSchema.optional(),
  orderBy: z.union([ PainterTechniqueOrderByWithRelationInputSchema.array(),PainterTechniqueOrderByWithRelationInputSchema ]).optional(),
  cursor: PainterTechniqueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PainterTechniqueScalarFieldEnumSchema,PainterTechniqueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PainterTechniqueFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PainterTechniqueFindFirstOrThrowArgs> = z.object({
  select: PainterTechniqueSelectSchema.optional(),
  include: PainterTechniqueIncludeSchema.optional(),
  where: PainterTechniqueWhereInputSchema.optional(),
  orderBy: z.union([ PainterTechniqueOrderByWithRelationInputSchema.array(),PainterTechniqueOrderByWithRelationInputSchema ]).optional(),
  cursor: PainterTechniqueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PainterTechniqueScalarFieldEnumSchema,PainterTechniqueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PainterTechniqueFindManyArgsSchema: z.ZodType<Prisma.PainterTechniqueFindManyArgs> = z.object({
  select: PainterTechniqueSelectSchema.optional(),
  include: PainterTechniqueIncludeSchema.optional(),
  where: PainterTechniqueWhereInputSchema.optional(),
  orderBy: z.union([ PainterTechniqueOrderByWithRelationInputSchema.array(),PainterTechniqueOrderByWithRelationInputSchema ]).optional(),
  cursor: PainterTechniqueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PainterTechniqueScalarFieldEnumSchema,PainterTechniqueScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PainterTechniqueAggregateArgsSchema: z.ZodType<Prisma.PainterTechniqueAggregateArgs> = z.object({
  where: PainterTechniqueWhereInputSchema.optional(),
  orderBy: z.union([ PainterTechniqueOrderByWithRelationInputSchema.array(),PainterTechniqueOrderByWithRelationInputSchema ]).optional(),
  cursor: PainterTechniqueWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PainterTechniqueGroupByArgsSchema: z.ZodType<Prisma.PainterTechniqueGroupByArgs> = z.object({
  where: PainterTechniqueWhereInputSchema.optional(),
  orderBy: z.union([ PainterTechniqueOrderByWithAggregationInputSchema.array(),PainterTechniqueOrderByWithAggregationInputSchema ]).optional(),
  by: PainterTechniqueScalarFieldEnumSchema.array(),
  having: PainterTechniqueScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PainterTechniqueFindUniqueArgsSchema: z.ZodType<Prisma.PainterTechniqueFindUniqueArgs> = z.object({
  select: PainterTechniqueSelectSchema.optional(),
  include: PainterTechniqueIncludeSchema.optional(),
  where: PainterTechniqueWhereUniqueInputSchema,
}).strict() ;

export const PainterTechniqueFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PainterTechniqueFindUniqueOrThrowArgs> = z.object({
  select: PainterTechniqueSelectSchema.optional(),
  include: PainterTechniqueIncludeSchema.optional(),
  where: PainterTechniqueWhereUniqueInputSchema,
}).strict() ;

export const PainterCreateArgsSchema: z.ZodType<Prisma.PainterCreateArgs> = z.object({
  select: PainterSelectSchema.optional(),
  include: PainterIncludeSchema.optional(),
  data: z.union([ PainterCreateInputSchema,PainterUncheckedCreateInputSchema ]),
}).strict() ;

export const PainterUpsertArgsSchema: z.ZodType<Prisma.PainterUpsertArgs> = z.object({
  select: PainterSelectSchema.optional(),
  include: PainterIncludeSchema.optional(),
  where: PainterWhereUniqueInputSchema,
  create: z.union([ PainterCreateInputSchema,PainterUncheckedCreateInputSchema ]),
  update: z.union([ PainterUpdateInputSchema,PainterUncheckedUpdateInputSchema ]),
}).strict() ;

export const PainterCreateManyArgsSchema: z.ZodType<Prisma.PainterCreateManyArgs> = z.object({
  data: z.union([ PainterCreateManyInputSchema,PainterCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PainterCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PainterCreateManyAndReturnArgs> = z.object({
  data: z.union([ PainterCreateManyInputSchema,PainterCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PainterDeleteArgsSchema: z.ZodType<Prisma.PainterDeleteArgs> = z.object({
  select: PainterSelectSchema.optional(),
  include: PainterIncludeSchema.optional(),
  where: PainterWhereUniqueInputSchema,
}).strict() ;

export const PainterUpdateArgsSchema: z.ZodType<Prisma.PainterUpdateArgs> = z.object({
  select: PainterSelectSchema.optional(),
  include: PainterIncludeSchema.optional(),
  data: z.union([ PainterUpdateInputSchema,PainterUncheckedUpdateInputSchema ]),
  where: PainterWhereUniqueInputSchema,
}).strict() ;

export const PainterUpdateManyArgsSchema: z.ZodType<Prisma.PainterUpdateManyArgs> = z.object({
  data: z.union([ PainterUpdateManyMutationInputSchema,PainterUncheckedUpdateManyInputSchema ]),
  where: PainterWhereInputSchema.optional(),
}).strict() ;

export const PainterDeleteManyArgsSchema: z.ZodType<Prisma.PainterDeleteManyArgs> = z.object({
  where: PainterWhereInputSchema.optional(),
}).strict() ;

export const PaintingCreateArgsSchema: z.ZodType<Prisma.PaintingCreateArgs> = z.object({
  select: PaintingSelectSchema.optional(),
  include: PaintingIncludeSchema.optional(),
  data: z.union([ PaintingCreateInputSchema,PaintingUncheckedCreateInputSchema ]),
}).strict() ;

export const PaintingUpsertArgsSchema: z.ZodType<Prisma.PaintingUpsertArgs> = z.object({
  select: PaintingSelectSchema.optional(),
  include: PaintingIncludeSchema.optional(),
  where: PaintingWhereUniqueInputSchema,
  create: z.union([ PaintingCreateInputSchema,PaintingUncheckedCreateInputSchema ]),
  update: z.union([ PaintingUpdateInputSchema,PaintingUncheckedUpdateInputSchema ]),
}).strict() ;

export const PaintingCreateManyArgsSchema: z.ZodType<Prisma.PaintingCreateManyArgs> = z.object({
  data: z.union([ PaintingCreateManyInputSchema,PaintingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PaintingCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PaintingCreateManyAndReturnArgs> = z.object({
  data: z.union([ PaintingCreateManyInputSchema,PaintingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PaintingDeleteArgsSchema: z.ZodType<Prisma.PaintingDeleteArgs> = z.object({
  select: PaintingSelectSchema.optional(),
  include: PaintingIncludeSchema.optional(),
  where: PaintingWhereUniqueInputSchema,
}).strict() ;

export const PaintingUpdateArgsSchema: z.ZodType<Prisma.PaintingUpdateArgs> = z.object({
  select: PaintingSelectSchema.optional(),
  include: PaintingIncludeSchema.optional(),
  data: z.union([ PaintingUpdateInputSchema,PaintingUncheckedUpdateInputSchema ]),
  where: PaintingWhereUniqueInputSchema,
}).strict() ;

export const PaintingUpdateManyArgsSchema: z.ZodType<Prisma.PaintingUpdateManyArgs> = z.object({
  data: z.union([ PaintingUpdateManyMutationInputSchema,PaintingUncheckedUpdateManyInputSchema ]),
  where: PaintingWhereInputSchema.optional(),
}).strict() ;

export const PaintingDeleteManyArgsSchema: z.ZodType<Prisma.PaintingDeleteManyArgs> = z.object({
  where: PaintingWhereInputSchema.optional(),
}).strict() ;

export const TechniqueCreateArgsSchema: z.ZodType<Prisma.TechniqueCreateArgs> = z.object({
  select: TechniqueSelectSchema.optional(),
  include: TechniqueIncludeSchema.optional(),
  data: z.union([ TechniqueCreateInputSchema,TechniqueUncheckedCreateInputSchema ]),
}).strict() ;

export const TechniqueUpsertArgsSchema: z.ZodType<Prisma.TechniqueUpsertArgs> = z.object({
  select: TechniqueSelectSchema.optional(),
  include: TechniqueIncludeSchema.optional(),
  where: TechniqueWhereUniqueInputSchema,
  create: z.union([ TechniqueCreateInputSchema,TechniqueUncheckedCreateInputSchema ]),
  update: z.union([ TechniqueUpdateInputSchema,TechniqueUncheckedUpdateInputSchema ]),
}).strict() ;

export const TechniqueCreateManyArgsSchema: z.ZodType<Prisma.TechniqueCreateManyArgs> = z.object({
  data: z.union([ TechniqueCreateManyInputSchema,TechniqueCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TechniqueCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TechniqueCreateManyAndReturnArgs> = z.object({
  data: z.union([ TechniqueCreateManyInputSchema,TechniqueCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TechniqueDeleteArgsSchema: z.ZodType<Prisma.TechniqueDeleteArgs> = z.object({
  select: TechniqueSelectSchema.optional(),
  include: TechniqueIncludeSchema.optional(),
  where: TechniqueWhereUniqueInputSchema,
}).strict() ;

export const TechniqueUpdateArgsSchema: z.ZodType<Prisma.TechniqueUpdateArgs> = z.object({
  select: TechniqueSelectSchema.optional(),
  include: TechniqueIncludeSchema.optional(),
  data: z.union([ TechniqueUpdateInputSchema,TechniqueUncheckedUpdateInputSchema ]),
  where: TechniqueWhereUniqueInputSchema,
}).strict() ;

export const TechniqueUpdateManyArgsSchema: z.ZodType<Prisma.TechniqueUpdateManyArgs> = z.object({
  data: z.union([ TechniqueUpdateManyMutationInputSchema,TechniqueUncheckedUpdateManyInputSchema ]),
  where: TechniqueWhereInputSchema.optional(),
}).strict() ;

export const TechniqueDeleteManyArgsSchema: z.ZodType<Prisma.TechniqueDeleteManyArgs> = z.object({
  where: TechniqueWhereInputSchema.optional(),
}).strict() ;

export const PainterTechniqueCreateArgsSchema: z.ZodType<Prisma.PainterTechniqueCreateArgs> = z.object({
  select: PainterTechniqueSelectSchema.optional(),
  include: PainterTechniqueIncludeSchema.optional(),
  data: z.union([ PainterTechniqueCreateInputSchema,PainterTechniqueUncheckedCreateInputSchema ]),
}).strict() ;

export const PainterTechniqueUpsertArgsSchema: z.ZodType<Prisma.PainterTechniqueUpsertArgs> = z.object({
  select: PainterTechniqueSelectSchema.optional(),
  include: PainterTechniqueIncludeSchema.optional(),
  where: PainterTechniqueWhereUniqueInputSchema,
  create: z.union([ PainterTechniqueCreateInputSchema,PainterTechniqueUncheckedCreateInputSchema ]),
  update: z.union([ PainterTechniqueUpdateInputSchema,PainterTechniqueUncheckedUpdateInputSchema ]),
}).strict() ;

export const PainterTechniqueCreateManyArgsSchema: z.ZodType<Prisma.PainterTechniqueCreateManyArgs> = z.object({
  data: z.union([ PainterTechniqueCreateManyInputSchema,PainterTechniqueCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PainterTechniqueCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PainterTechniqueCreateManyAndReturnArgs> = z.object({
  data: z.union([ PainterTechniqueCreateManyInputSchema,PainterTechniqueCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PainterTechniqueDeleteArgsSchema: z.ZodType<Prisma.PainterTechniqueDeleteArgs> = z.object({
  select: PainterTechniqueSelectSchema.optional(),
  include: PainterTechniqueIncludeSchema.optional(),
  where: PainterTechniqueWhereUniqueInputSchema,
}).strict() ;

export const PainterTechniqueUpdateArgsSchema: z.ZodType<Prisma.PainterTechniqueUpdateArgs> = z.object({
  select: PainterTechniqueSelectSchema.optional(),
  include: PainterTechniqueIncludeSchema.optional(),
  data: z.union([ PainterTechniqueUpdateInputSchema,PainterTechniqueUncheckedUpdateInputSchema ]),
  where: PainterTechniqueWhereUniqueInputSchema,
}).strict() ;

export const PainterTechniqueUpdateManyArgsSchema: z.ZodType<Prisma.PainterTechniqueUpdateManyArgs> = z.object({
  data: z.union([ PainterTechniqueUpdateManyMutationInputSchema,PainterTechniqueUncheckedUpdateManyInputSchema ]),
  where: PainterTechniqueWhereInputSchema.optional(),
}).strict() ;

export const PainterTechniqueDeleteManyArgsSchema: z.ZodType<Prisma.PainterTechniqueDeleteManyArgs> = z.object({
  where: PainterTechniqueWhereInputSchema.optional(),
}).strict() ;