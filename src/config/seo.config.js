const SITE_NAME = "Bank | JS"

export const getTitle = (title) => {
    console.log(title);
    return title ? `${title} | ${SITE_NAME}` : SITE_NAME
}