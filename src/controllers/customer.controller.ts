import { Request, Response } from "express";
import { Customer } from "../models";

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer non trouvé" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la création" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer non trouvé" });

    await customer.update(req.body);
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la mise à jour" });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer non trouvé" });

    await customer.destroy();
    res.json({ message: "Customer supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
