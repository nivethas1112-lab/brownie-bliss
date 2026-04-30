import ShippingZone from '../models/ShippingZone.js';

// GET /shipping/zones
export const getShippingZones = async (req, res, next) => {
  try {
    const zones = await ShippingZone.find()
      .sort({ priority: 1, name: 1 })
      .lean();

    res.json({ zones });
  } catch (error) {
    next(error);
  }
};

// POST /shipping/zones
export const createShippingZone = async (req, res, next) => {
  try {
    const zone = await ShippingZone.create(req.body);
    res.status(201).json({ zone });
  } catch (error) {
    next(error);
  }
};

// PUT /shipping/zones/:id
export const updateShippingZone = async (req, res, next) => {
  try {
    const zone = await ShippingZone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!zone) {
      return res.status(404).json({ message: 'Shipping zone not found' });
    }

    res.json({ zone });
  } catch (error) {
    next(error);
  }
};

// DELETE /shipping/zones/:id
export const deleteShippingZone = async (req, res, next) => {
  try {
    const zone = await ShippingZone.findByIdAndDelete(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Shipping zone not found' });
    }

    res.json({ message: 'Shipping zone deleted successfully' });
  } catch (error) {
    next(error);
  }
};
