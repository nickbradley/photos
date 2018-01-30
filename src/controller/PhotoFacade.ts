import * as fs from "fs";
import * as fspath from "path";
import Log from "../Util";
import {IPhotoFacade, Photo, PhotoResponse} from "./IPhotoFacade";

const photos: {[id: string]: Photo} = {};

/**
 * This is the main programmatic entry point for the project.
 */
export default class PhotoFacade implements IPhotoFacade {

    constructor() {
        const files: string[] = fs.readdirSync(`./cache`);
        for (const file of files) {
            const id: string = fspath.basename(file, `.json`);
            photos[id] = JSON.parse(fs.readFileSync(file).toString());
        }
    }

    public addPhoto(id: string, photo: Photo): Promise<PhotoResponse> {
        return new Promise<PhotoResponse>((resolve, reject) => {
            let replaced: boolean = false;
            if (Object.keys(photos).includes(id)) {
                replaced = true;
            }
            photos[id] = photo;

            fs.writeFile(`./cache/${id}.json`, photo, (err) => {
                if (err !== undefined) {
                    reject({code: 400, body: { error: err.message }});
                } else if (replaced === true) {
                    resolve({code: 201, body: { result: `replaced` }});
                } else {
                    resolve({code: 204, body: { result: `new` }});
                }
            });
        });
    }

    public listPhotos(): Promise<PhotoResponse> {
        return new Promise<PhotoResponse>((resolve, reject) => {
            resolve({code: 200, body: { result: Object.keys(photos) }});
        });
    }

    public removePhoto(id: string): Promise<PhotoResponse> {
        return new Promise<PhotoResponse>((resolve, reject) => {
            if (Object.keys(photos).includes(id)) {
                try {
                    delete photos[id];
                    fs.unlink(`./cache/${id}.json`, (err) => {
                        if (err !== undefined) {
                            reject({code: 404, body: { error: `Not found` }});
                        } else {
                            resolve({code: 200, body: { result: `OK` }});
                        }
                    });
                } catch (err) {
                    reject({code: 404, body: { error: `Not found` }});
                }
            }
        });
    }

    // public performQuery(query: any): Promise <InsightResponse> {
    //     return Promise.reject({code: -1, body: null});
    // }
}
