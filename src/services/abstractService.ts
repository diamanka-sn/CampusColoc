import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';

export abstract class AbstractService<T extends Document>{
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async getAll(
        filter: FilterQuery<T> = {},
        populate: string[] = [],
        page: number = 1,
        limit: number = 10
    ): Promise<{ data: T[], total: number }> {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.model.find(filter)
                .populate(populate.join(' '))
                .skip(skip)
                .limit(limit)
                .exec(),
            this.model.countDocuments(filter).exec()
        ]);

        return { data, total };
    }

    // async getById(id: string): Promise<T | null> {
    //     return this.model.findById(id).exec();
    // }

    async notExist(filter: FilterQuery<T>): Promise<boolean> {
        const count = await this.model.countDocuments(filter).exec();
        return count === 0;
    }

    async getByFilter(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter).exec();
    }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }

    async delete(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        await this.model.findByIdAndUpdate(id, data).exec();
        return this.model.findById(id).exec();
    }
}
