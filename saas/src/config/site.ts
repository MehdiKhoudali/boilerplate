export type SiteConfig = {
    name: string
    description: string
    url: string
    ogImage: string
    links: {
        twitter: string
        github: string
    }
}

export const siteConfig: SiteConfig = {
    name: "Boilerbay",
    description:
        "Focus on your business, not boilerplate code.",
    url: "",
    ogImage: "",
    links: {
        twitter: "https://twitter.com/Boilerbay_",
        github: "https://github.com/itaimoorhas",
    },
}