import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'product name must be provided'],
    },
    price: {
      type: Number,
      required: [true, 'product price must be provided'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    company: {
      type: String,
      enum: {
        values: ['ikea', 'liddy', 'caressa', 'macros'],
        message: '{VALUE} is not supported',
      },
      //   enum: ['ikea', 'liddy', 'caressa', 'macros'],
    },
  },
  {
    timestamps: true,
  }
);

export default model('Product', productSchema);
