import { Request, Response } from "express";
import { Bill } from "../models";

export const getAllBills = async (req: Request, res: Response) => {
  try {
    const bills = await Bill.findAll();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getBillById = async (req: Request, res: Response) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill non trouvé" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createBill = async (req: Request, res: Response) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la création" });
  }
};

export const updateBill = async (req: Request, res: Response) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill non trouvé" });

    await bill.update(req.body);
    res.json(bill);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la mise à jour" });
  }
};
