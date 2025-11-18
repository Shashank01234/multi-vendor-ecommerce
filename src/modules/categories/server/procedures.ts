import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ({ ctx }) => {
        const data = await ctx.db.find({
            collection: 'categories',
            depth: 1, // Pouplate subcategories, subcategories.[0] will be of type Category
             pagination: false,
            where: {
                parent: {
                    exists: false,
                },
            },

            sort: 'name',
        });

        const formattedData = data.docs.map((doc) => ({
            ...doc,
            subcategories: (doc.subcategories ?.docs ??  []).map((doc) => ({
                // Because of "depth: 1" above, subcategories are populated, we are confident "doc" is of type Category
                ...(doc as Category),
            }))
        }));

        return formattedData;
    }),
});