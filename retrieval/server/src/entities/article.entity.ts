import { EntitySchema } from "@mikro-orm/core"
import * as model from "src/common/model"

export const ArticleSchema = new EntitySchema({
  class: model.Article,
  properties: {
    id: { primary: true, type: "integer" },
    title: { type: "string", nullable: true },
    office: { type: "string", nullable: true },
    lawProperty: { type: "string", nullable: true },
    timeliness: { type: "string", nullable: true },
    releaseDate: { type: "string", nullable: true },
    mainText: { type: "string", nullable: true },
  },
})
