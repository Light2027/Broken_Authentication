import {IIdentifiable} from "../../Shared/models/interfaces/identifiable.interface";
import {r, Connection} from "rethinkdb-ts";
import { IDatabaseAccessService } from "./database-access.interface";

export class RethinkDBAccessService<T extends IIdentifiable> implements IDatabaseAccessService<T>{
    constructor(private host:string, private port:number, private database:string, private table:string){
    }

    public async tryInitialize():Promise<void>{
        let connection:Connection = undefined;
        try
        {
            connection = await this.connect();
        }
        catch(error)
        {
            throw new Error("Failed to connect to database.");
        }

        const dbExists = await r.dbList().contains(this.database).run(connection);
        if(!dbExists)
            await r.dbCreate(this.database).run(connection);

        const tableExists = await r.db(this.database).tableList().contains(this.table).run(connection);
        if(!tableExists)
            await r.db(this.database).tableCreate(this.table).run(connection);
    }

    public async createEntryAsync(element:T):Promise<T>{
        let connection:Connection = undefined;
        try
        {
            connection = await this.connect();
        }
        catch(error)
        {
            throw new Error("Failed to connect to database.");
        }

        // This is where the ids are assigned.
        element.id = await this.getUniqueIDAsync();
        let res = await r.db(this.database).table(this.table).insert(element).run(connection);
        if(res.inserted === 0) throw new Error("Failed to insert entry");
        return element;
    }

    public async retrieveEntriesAsync(): Promise<Array<T>>{
        let connection:Connection = undefined;
        try
        {
            connection = await this.connect();
        }
        catch(error)
        {
            throw new Error("Failed to connect to database.");
        }
        
        return await r.db(this.database).table<T>(this.table).run(connection);
    }

    public async retrieveEntryByIDAsync(id:string):Promise<T>{
        let connection = await this.connect();
        return await r.db(this.database).table(this.table).get(id).run(connection);
    }

    /*The filteObject must look like => example {age:30} if you wish to filter for object/s with an age property and with value of 30. */
    public async retrieveEntriesByFilterAsync(filterObject:any):Promise<Array<T>>{
        let connection = await this.connect();
        return await r.db(this.database).table<T>(this.table).filter(filterObject).run(connection);
    }

    public async updateEntryAsync(updatedElement:T):Promise<void>{
        let connection:Connection = undefined;
        try
        {
            connection = await this.connect();
        }
        catch(error)
        {
            throw new Error("Failed to connect to database.");
        }

        let res = await r.db(this.database).table(this.table).get(updatedElement.id).update(updatedElement).run(connection);
        if(res.changes?.length === 0) throw new Error("Failed to update entry.");
    }

    public async deleteEntryAsync(id:string):Promise<void>{
        let connection:Connection = undefined;
        try
        {
            connection = await this.connect();
        }
        catch(error)
        {
            throw new Error("Failed to connect to database.");
        }

        let res = await r.db(this.database).table(this.table).get(id).delete().run(connection);
        if(res.deleted === 0) throw new Error("Failed to update entry.");
    }


    private async connect():Promise<Connection>{
        return await r.connect({host: this.host, port: this.port});
    }

    private async getUniqueIDAsync():Promise<string>{
        let connection:Connection = undefined;
        try
        {
            connection = await this.connect();
        }
        catch(error)
        {
            throw new Error("Failed to connect to database.");
        }

        // Let the database generate a an unique ID and check if it is already part of the database or not.
        while(true){
            let tempID = await r.uuid().run(connection);
            let temp:T = await r.db(this.database).table(this.table).get(tempID).run(connection);
            if(temp === null){
                return tempID;
            }
        }
    }
}