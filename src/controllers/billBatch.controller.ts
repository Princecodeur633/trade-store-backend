import { Request, Response } from "express";
import { BillBatch } from "../models";

export const getAllBillBatches = async (req: Request, res: Response) => {
  try {
    const batches = await BillBatch.findAll();
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createBillBatch = async (req: Request, res: Response) => {
  try {
    const batch = await BillBatch.create(req.body);
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la création" });
  }
};
