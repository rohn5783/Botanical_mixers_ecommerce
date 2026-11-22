import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryHistory {
  changeAmount: number;
  reason: string;
  performedBy?: mongoose.Types.ObjectId;
  timestamp: Date;
}

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;
  variantSku: string;
  availableStock: number;
  reservedStock: number;
  lowStockThreshold: number;
  reorderPoint: number;
  history: IInventoryHistory[];
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    variantSku: { type: String, required: true, index: true },
    availableStock: { type: Number, required: true, default: 100 },
    reservedStock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 20 },
    reorderPoint: { type: Number, default: 50 },
    history: [
      {
        changeAmount: { type: Number, required: true },
        reason: { type: String, required: true },
        performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
