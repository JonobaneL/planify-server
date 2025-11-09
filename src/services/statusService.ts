import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { UpdateStatusSchema } from "../validators/status.validator";
import { CustomError } from "../utils/customError";

class StatusService {
  /**
   * Retrieves a status by its id.
   *
   * @param id - The id of the status to retrieve.
   *
   * @returns The status if found, otherwise null.
   */
  async getStatus(id: string) {
    return await prisma.status.findUnique({
      where: {
        id,
      },
    });
  }

  async getStatuses(type?: string) {
    if (!type) {
      return await prisma.status.findMany();
    }
    return await prisma.status.findMany({
      where: {
        type,
      },
      orderBy: {
        orderIndex: "asc",
      },
    });
  }

  async createStatus(data: Prisma.StatusCreateInput) {
    //todo: add statuses limit(max:10)
    return await prisma.status.create({
      data,
    });
  }

  async updateStatus(id: string, data: Prisma.StatusUpdateInput) {
    const status = await this.getStatus(id);

    if (!status) {
      throw CustomError.NotFound(`Status with ID ${id} doesn't exist`);
    }

    return await prisma.status.update({
      where: {
        id,
      },
      data: data,
    });
  }

  async deleteStatus(id: string) {
    const status = await this.getStatus(id);

    if (!status) {
      throw CustomError.NotFound(`Status with ID ${id} doesn't exist`);
    }

    return await prisma.status.delete({
      where: {
        id,
      },
    });
  }
}

export default new StatusService();
