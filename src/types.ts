
/**
 * Represents a request for a product placement in a project.
 *
 * @property {string} product_id - The unique identifier for the product being requested.
 * @property {string} title - The title or name of the product placement request.
 * @property {string} sent_to - The recipient or intended recipient of the product placement request.
 * @property {string} files - A reference or path to any associated files related to the product request.
 * @property {string} brand - The brand associated with the product.
 * @property {string} response - The status or response to the product placement request (e.g., approved, denied, pending).
 */
export interface productPlacementRequestType {
    product_id: string,
    title: string,
    sent_to: string,
    files: string,
    brand: string,
    response: string
}

/**
 * Interface representing a desired product placement within a scene or set.
 *
 * @property {string} product_placement_id - Unique identifier for the product placement.
 * @property {string} title - Title or name of the product placement.
 * @property {string} scene_description - Detailed description of the scene where the product is placed.
 * @property {string} product_category - Category to which the product belongs.
 * @property {productPlacementRequestType[]} product_requests - Array of requests related to this product placement, detailing actions or interactions involving this product.
 */
export interface ProductPlacementType {
    product_placement_id: string,
    title: string;
    scene_description: string;
    product_category: string;
    product_requests: productPlacementRequestType[];
}


/**
 * Represents a product with detailed attributes.
 *
 * @property {string} name - The name of the product.
 * @property {string} type - The type of the product.
 * @property {string | undefined} description - A brief description of the product. This may be undefined if no description is provided.
 * @property {string[]} tags - A list of tags associated with the product
 * @property {string} image - The path to an image representing the product.
 */
export interface ProductType {
    name: string,
    type: string,
    description: string | undefined,
    tags: string[]
    image: string,
}


/**
 * Represents a request to use a product with associated details, used to manage product placements and responses.
 *
 * @property {string} product_id - Unique identifier for the requested product.
 * @property {string} product_placement_id - Unique identifier for the product placement location or scene.
 * @property {string} response - Status or feedback related to the product request, such as approval or rejection.
 * @property {string} image - URL to the product image associated with the request.
 * @property {string} title - Title or name of the product being requested.
 * @property {string} scene_description - Description of the scene or context where the product is placed.
 * @property {string} sent_to - Person who the request is sent to (Brand Manager or Set Designer).
 */
export interface productRequestType {
    product_id: string,
    product_placement_id: string,
    response: string,
    image: string,
    title: string,
    scene_description: string,
    sent_to: string,
}

/**
 * Represents full information of a product available in the store.
 *
 * @property {string} id - Unique identifier for the product.
 * @property {string} title - Name or title of the product.
 * @property {string} description - Detailed description of the product's features and specifications.
 * @property {string} restrictions - Any usage restrictions associated with the product.
 * @property {number} price - Price of the product in the store's currency.
 * @property {string[]} files - Array of urls to images associated with the product).
 * @property {string} category_name - Category to which the product belongs.
 * @property {string} brand_name - Name of the brand associated with the product.
 */
export interface productType {
    id: string,
    title: string,
    description: string,
    restrictions: string,
    price: number,
    files: string[],
    category_name: string,
    brand_name: string,
}


/**
 * Represents a product in the products explore section.
 *
 * @property {string} id - The unique identifier for the product.
 * @property {string} files - The associated image for the product.
 * @property {string} title - The title or name of the product.
 * @property {string} brand_name - The name of the brand that owns or manufactures the product.
 */
export interface productsExploreType {
    id: string,
    files: string,
    title: string,
    brand_name: string,
}

/**
 * Represents the data structure for a project in the explore section.
 *
 * @property {string} id - The unique identifier for the project.
 * @property {string} image - The URL to the project's image.
 * @property {string} name - The name of the project.
 * @property {string} type - The type/category of the project.
 */
export interface projectsExploreType {
    id: string,
    image: string,
    name: string,
    type: string,
}


/**
 * Represents the structure for product placement with only its name
 *
 * @property {string} id - A unique identifier for the product placement.
 * @property {string} name - The name of the product placement.
 */
export interface productPlacementNamesType {
    id: string,
    name: string
}