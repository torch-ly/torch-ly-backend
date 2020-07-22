import { ObjectID } from "mongodb";
import { GraphQLScalarType } from "graphql"; 
import { Kind } from "graphql/language";

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        
    return !!pattern.test(str);
}

export const resolvers = {
    Query: {
        totalPhotos: async (parent, args, { db }) => await db.collection("photos").estimatedDocumentCount(),
        allPhotos: async (parent, args, { db }) => await db.collection("photos").find().toArray(),
        getPhotoById: async (parent, args, { db }) => await db.collection("photos").findOne(ObjectID(args.id))
    },
    Mutation: {
        addPhoto: async (parent, args, { db }) => {
            let photo = {
                ...args,
            };
        
            const { insertedIds } = await db.collection("photos").insertOne(photo);
            photo.id = insertedIds;

            return photo;
        }
    },
    Photo: {
        id: parent => parent.id || parent._id
    },
    URL: new GraphQLScalarType({
        name: "URL",
        description: "A URL",
        parseValue: (value) => validURL(value) ? value : new Error("Invalid URL value"),
        serialize: (value) => value,
        parseLiteral: (ast) => {
            if (validURL(ast.value))
                return ast.value; 
            else 
                throw new Error("Invalid URL value");
        },
      })
};