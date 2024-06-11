export const load = async ({ params, url }) => {
    return {
        targetAccountType:params.slug
    }
}