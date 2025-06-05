import Address from '../models/addressModel.js';

// A simple async error handler wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
    const { fullName, streetAddress, city, state, postalCode, phoneNumber, isDefault } = req.body;

    // If the new address is default, unset the old default
    if (isDefault) {
        await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
        user: req.user._id,
        fullName,
        streetAddress,
        city,
        state,
        postalCode,
        phoneNumber,
        isDefault,
    });

    res.status(201).json(address);
});

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
});

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);

    if (!address) {
        res.status(404);
        throw new Error('Address not found');
    }

    // Make sure the address belongs to the logged-in user
    if (address.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }
    
    // If setting this one to default, unset others
    if (req.body.isDefault) {
       await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAddress);
});


// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);

     if (!address) {
        res.status(404);
        throw new Error('Address not found');
    }

    // Make sure the address belongs to the logged-in user
    if (address.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await address.deleteOne();
    res.json({ message: 'Address removed' });
});


// @desc    Set an address as default
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);

    if (!address || address.user.toString() !== req.user._id.toString()) {
        res.status(404);
        throw new Error('Address not found or not authorized');
    }

    // Unset current default
    await Address.updateMany({ user: req.user._id }, { isDefault: false });

    // Set new default
    address.isDefault = true;
    await address.save();

    res.json({ message: 'Default address updated' });
});

export {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
};