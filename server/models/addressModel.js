import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: [true, 'Please provide a full name'],
  },
  streetAddress: {
    type: String,
    required: [true, 'Please provide a street address'],
  },
  city: {
    type: String,
    required: [true, 'Please provide a city'],
  },
  state: {
    type: String,
    required: [true, 'Please provide a state'],
  },
  postalCode: {
    type: String,
    required: [true, 'Please provide a postal code'],
  },
  country: {
    type: String,
    default: 'India',
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Address = mongoose.model('Address', addressSchema);
export default Address;