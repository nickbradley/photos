/*
 * This is the primary high-level API for the project. In this folder there should be:
 * A class called PhotoFacade, this should be in a file called PhotoFacade.ts.
 * You should not change this interface at all or the test suite will not work.
 */

export interface PhotoResponse {
    code: number;
    body: PhotoResponseSuccessBody | PhotoResponseErrorBody;
}

export interface PhotoResponseSuccessBody {
    result: any[] | string;
}

export interface PhotoResponseErrorBody {
    error: string;
}

interface Rectangle {
    length: number;
    width: number;
}

export interface Photo {
    content: string;  // compressed base64
    contentSize: number;  // size in bytes
    contentFormat: string;  // mime-type
    dateTaken: string;
    locationTaken: string;
    tags: string[];
    dimensions: Rectangle;
}

export interface IPhotoFacade {

    /**
     * Add a dataset to UBCPhoto.
     *
     * The promise should return an PhotoResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.
     *
     * After receiving the dataset, it should be processed into a data structure of
     * your design. The processed data structure should be persisted to disk; your
     * system should be able to load this persisted value into memory for answering
     * queries.
     *
     * Ultimately, a dataset must be added or loaded from disk before queries can
     * be successfully answered.
     *
     * Response codes:
     *
     * 201: the operation was successful and the id already existed (was added in
     * this session or was previously cached).
     * 204: the operation was successful and the id was new (not added in this
     * session or was previously cached).
     * 400: the operation failed. The body should contain {"error": "my text"}
     * to explain what went wrong.
     *
     * @param id  The id of the dataset being added.
     * @param content  The base64 content of the dataset. This content should be in the
     * form of a serialized zip file.
     */
    addPhoto(id: string, photo: Photo): Promise<PhotoResponse>;

    /**
     * Remove a dataset from UBCPhoto.
     *
     * The promise should return an PhotoResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.
     *
     * This will delete both disk and memory caches for the dataset for the id meaning
     * that subsequent queries for that id should fail unless a new addDataset happens first.
     *
     * Response codes:
     *
     * 204: the operation was successful.
     * 404: the operation was unsuccessful because the delete was for a resource that
     * was not previously added.
     *
     * @param id  The id of the dataset to remove.
     */
    removePhoto(id: string): Promise<PhotoResponse>;

    /**
     * Perform a query on UBCPhoto.
     *
     * The promise should return an PhotoResponse for both fulfill and reject.
     *
     * Fulfill should be for 2XX codes and reject for everything else.
     *
     * Return codes:
     *
     * 200: the query was successfully answered. The result should be sent in JSON according in the response body.
     * 400: the query failed; body should contain {"error": "my text"} providing extra detail.
     * 424: the query failed because of a missing dataset; body should contain {"error": "my text"} providing extra
     * detail.
     *
     * @param query  The query to be performed. This is the same as the body of the POST message.
     */
    // findPhotos(query: any): Promise<PhotoResponse>;

    listPhotos(): Promise<PhotoResponse>;
}
