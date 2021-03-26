import {IIdentifiable} from "../../Shared/models/interfaces/identifiable.interface";
import {IHasOwner} from "../../Shared/models/interfaces/has-owner.interface";
import {IDatabaseAccessService} from "../services/database-access.interface";
import { Request, Response } from 'express';

export class DatabaseController<T extends IIdentifiable & IHasOwner>{
    constructor(private databaseAccess:IDatabaseAccessService<T>){
    }

    public async createEntry(request:Request,response:Response){
        const owner : IIdentifiable = JSON.parse(request.params.user);
        const data:T = request.body;
        data.ownerID = owner.id;
        try{
            const toReturn = await this.databaseAccess.createEntryAsync(data)
            return response.status(200).send(toReturn)
        }catch(error){
            request.log.error(error);
            return response.sendStatus(500);
        }
    }

    public async retrieveEntries(request:Request,response:Response){
        const owner : IIdentifiable = JSON.parse(request.params.user);
        try{
            const result = await this.databaseAccess.retrieveEntriesByFilterAsync({ownerID:owner.id});
            return response.status(200).send(result);
        }catch(error){
            request.log.error(error);
            return response.sendStatus(500);
        }
    }

    public async updateEntry(request:Request,response:Response){
        const owner : IIdentifiable = JSON.parse(request.params.user);
        const data:T = request.body;
        try{
            const original = await this.databaseAccess.retrieveEntryByIDAsync(data.id);
            if(original.ownerID === owner.id)
            {
                await this.databaseAccess.updateEntryAsync(data)
                return response.status(200).send(data);
            }else
                return response.status(401).send("Access Denied!");
        }catch(error){
            request.log.error(error);
            return response.sendStatus(500);
        }
    }

    public async deleteEntries(request:Request,response:Response){
        const owner : IIdentifiable = JSON.parse(request.params.user);
        const id:string = request.params.id;
        try{
            const original = await this.databaseAccess.retrieveEntryByIDAsync(id);
            if(original.ownerID === owner.id)
            {
                await this.databaseAccess.deleteEntryAsync(id);
                return response.status(200).send();
            }else
                return response.status(401).send("Access Denied!");
        }catch(error){
            request.log.error(error);
            return response.sendStatus(404);
        }
    }
}