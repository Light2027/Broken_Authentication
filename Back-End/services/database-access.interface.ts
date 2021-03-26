import {IIdentifiable} from "../../Shared/models/interfaces/identifiable.interface";

export interface IDatabaseAccessService<T extends IIdentifiable>{
    
    
    /**
     * Tries to initialize the database and/or the table should it not exist.
     * @return {Promise<void>}  {Promise<void>}
     * @memberof IDatabaseAccessService
     */
    tryInitialize():Promise<void>;
    
    createEntryAsync(element:T):Promise<T>;
    
    retrieveEntriesAsync(): Promise<Array<T>>;
    retrieveEntryByIDAsync(id:string):Promise<T>;
    retrieveEntriesByFilterAsync(filterObject:any):Promise<Array<T>>;
    
    updateEntryAsync(updatedElement:T):Promise<void>;

    deleteEntryAsync(id:string):Promise<void>;
}