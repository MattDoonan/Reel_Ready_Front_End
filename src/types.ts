

export interface productPlacementRequestType {
    product_id: string,
    title: string,
    sent_to: string,
    files: string,
    brand: string,
    response: string
}
export interface ProductPlacementType {
    product_placement_id: string,
    title: string;
    scene_description: string;
    product_category: string;
    product_requests: productPlacementRequestType[];
}

export interface ProductType {
    name: string,
    type: string,
    description: string | undefined,
    tags: string[]
    image: string,
}

export interface productRequestType {
    product_id: string,
    product_placement_id: string,
    response: string,
    image: string,
    title: string,
    scene_description: string,
    sent_to: string,
}

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

export interface productsExploreType {
    id: string,
    files: string,
    title: string,
    brand_name: string,
}

export interface projectsExploreType {
    id: string,
    image: string,
    name: string,
    type: string,
}

export interface productPlacementNamesType {
    id: string,
    name: string
}