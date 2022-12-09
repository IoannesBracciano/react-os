export interface ApplicationManifest {
    /**
     * A comma-separated list of the authors' names and emails.
     * 
     * @example
     * ```
     * Oscar Carter Mild <oscar.cmild@gmail.com>,Next Consulting <info@nextconsulting.com>
     * ```
     */
    authors?: string | undefined
    /**
     * A short description.
     */
    description?: string | undefined
    /**
     * A relative path or remote URL to an svg file.
     */
    icon: string
    /**
     * A unique identifier.
     */
    id: string
    /**
     * The application name.
     * This is how users will find the application on the store and on
     * their desktop after installing it.
     */
    name: string
    /**
     * A unique version identifier.
     * Three numbered versioning (`major.minor.patch`) is recommended
     * but not enforced.
     */
    version: string
}

export interface ApplicationConfiguration {
    
}
