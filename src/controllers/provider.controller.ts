import { Request, Response } from "express";
import { Provider } from "../models";

export const getAllProviders = async (req: Request, res: Response) => {
  try {
    const providers = await Provider.findAll();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getProviderById = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    if (!provider) return res.status(404).json({ error: "Provider non trouvé" });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createProvider = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json(provider);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la création" });
  }
};

export const updateProvider = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    if (!provider) return res.status(404).json({ error: "Provider non trouvé" });

    await provider.update(req.body);
    res.json(provider);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la mise à jour" });
  }
};

export const deleteProvider = async (req: Request, res: Response) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    if (!provider) return res.status(404).json({ error: "Provider non trouvé" });

    await provider.destroy();
    res.json({ message: "Provider supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
