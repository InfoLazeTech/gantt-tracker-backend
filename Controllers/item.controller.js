const mongoose = require('mongoose');
const Item = require("../Models/item.model");
const Recipe = require('../Models/recipe.model');
const { getAllItemsService } = require('../services/itemService');

// Get all items, populate recipes and processes.processObjId
exports.getAllItems = async (req, res) => {
    try {
        const result = await Item.find()
            .populate('recipeId')
            .populate('processes.processId');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single item by itemId, populate recipes and processes.processObjId
exports.getItemById = async (req, res) => {
    try {
        const { itemId } = req.params;
        const item = await Item.findOne({ itemId })
            .populate('recipeId')
            .populate('processes.processObjId');
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create item with all fields, including processes
exports.createItem = async (req, res) => {
    try {
        const {
            customerName,
            PONumber,
            startDate,
            estimatedEndDate,
            description,
            recipeId,
            processes
        } = req.body;
        // Validate recipe
        if (recipeId && !mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ error: 'Invalid recipe ID.' });
        }
        // Validate processes (processObjId)
        if (processes && Array.isArray(processes)) {
            for (const proc of processes) {
                if (!mongoose.Types.ObjectId.isValid(proc.processId)) {
                    return res.status(400).json({ error: 'Invalid processObjId in processes.' });
                }
            }
        }
        const item = new Item({
            customerName,
            PONumber,
            startDate,
            estimatedEndDate,
            description,
            recipeId,
            processes
        });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update item (full update or PATCH for process dates)
exports.updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const {
            customerName,
            PONumber,
            startDate,
            estimatedEndDate,
            description,
            recipeId,
            processes,
        } = req.body;

        if (!itemId) {
            return res.status(400).json({ error: "Invalid item ID." });
        }

        // Validate recipeId
        if (recipeId && !mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ error: "Invalid recipe ID." });
        }

        if (processes && Array.isArray(processes)) {
            for (const proc of processes) {
                if (!mongoose.Types.ObjectId.isValid(proc.processId)) {
                    return res.status(400).json({ error: 'Invalid processId  in processes.' });
                }
            }
        }


        const updatedItem = await Item.findOneAndUpdate(
            { itemId: itemId },
            {
                customerName,
                PONumber,
                startDate,
                estimatedEndDate,
                description,
                recipeId,
                processes,
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        )
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateProcessItem = async (req, res) => {
    try {
        const { itemId, processId } = req.params;
        console.log("itemId", itemId);
        console.log("processId", processId);

        const { startDateTime, endDateTime } = req.body;

        const updatedItem = await Item.findOneAndUpdate(
            {
                _id: itemId,
                "processes.processId": processId
            },
            {
                $set: {
                    "processes.$.startDateTime": startDateTime,
                    "processes.$.endDateTime": endDateTime
                }
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item or process not found" });
        }

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Update failed", error });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const deleteItem = await Item.findOneAndDelete({ itemId });
        if (!deleteItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
};


exports.getItemByReference = async (req, res) => {
    try {
        const { PONumber, RefNumber } = req.query;

        if (!PONumber && !RefNumber) {
            return res.status(400).json({ message: "PONumber or RefNumber is required." });
        }

        const query = {};
        if (PONumber) query.PONumber = PONumber;
        if (RefNumber) query.RefNumber = RefNumber;

        const item = await Item.findOne(query)
            .populate('recipeId')           // optionally populate recipe
            .populate('processes.processId'); // optionally populate processes

        if (!item) {
            return res.status(404).json({ message: "Item not found." });
        }

        res.json(item);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ message: "Server error." });
    }
};
