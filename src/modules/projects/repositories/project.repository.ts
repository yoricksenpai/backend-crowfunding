import { MongoDatabase } from "src/database";
import { Project } from "../entities/project.entity";
import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";

@Injectable()
export class ProjectRepository {
    private database : MongoDatabase;
    constructor() { 
        this.database = MongoDatabase.getInstance()
    }
    async createProject(project: Project){
        const result = await (await this.collection()).insertOne(project);
        return {...project, _id: result.insertedId}
    }

    async findAll(queryOptions : QueryOptions){
    const {filter={}, sort, way='asc', limit=10, offset=0} = queryOptions;
    return (await this.collection())
    .find(filter)
    .sort({[sort]: way === 'asc' ? 1 : -1})
    .skip(offset)
    .limit(limit)
    .toArray() as unknown as Project[]
    }

    async findById(id: string){
        const _id = new ObjectId(id);
        return (await this.collection()).findOne({_id}) as unknown as Project;
    }

    async update(id:string, project: Partial<Project>){
        const _id = new ObjectId(id);
        return (await this.collection()).updateOne({_id}, {$set: project})
    }

    async delete(id: string){
        const _id = new ObjectId(id);
        return (await this.collection()).deleteOne({_id})
    }

    async updateRaiseAmount(id: string, amount: number){
        const _id = new ObjectId(id);
        return (await this.collection()).updateOne({_id}, {$inc: {raised: amount}})
    }

    async findOne(filter: QueryFilter){
        if('_id' in filter){
            filter._id = new ObjectId(filter._id);
        }
        const result = await (await this.collection()).findOne(filter);
        if(result){
            return result as unknown as Project
        }
    }

    private async collection(){
        return (await this.database.getDatabase()).collection('projects')
    }
}