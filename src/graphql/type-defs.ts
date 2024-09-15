export const typeDefs = `
  type Painter {
    name: String!
    country: String!
    techniques: [String]!
  }

  type Painting {
    author: String!
    title: String!
    technique: String!
    date: String!
  }

  input PainterInput {
    name: String!
    country: String!
    techniques: [String]!
  }

  input PaintingInput {
    author: String!
    title: String!
    technique: String!
    date: String!
  }

  type Mutation {
    createPainter(input: PainterInput!): Painter!
    createPainting(input: PaintingInput!): Painting!
  }

  type Query {
    painters: [Painter]! # get all painters
    paintings: [Painting]! # get all paintings
    painter(name: String): Painter # get a painter by name
    painting(title: String): Painting # get a painting by title
  }
`;