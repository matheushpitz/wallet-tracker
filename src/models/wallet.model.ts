import mongoose, { Document, Model } from 'mongoose';

export interface IWalletDocument extends Document {
    label?: string,
    address: string,
    channelId: string,
    createdAt?: Date,
    createdBy: string
}

export interface IWalletModel extends Model<IWalletDocument> {
    findByAddressAndChannel(address: string, channelId: string): Promise<Array<IWalletDocument>>;
    findByLabelAndChannel(label: string, channelId: string): Promise<Array<IWalletDocument>>;
    findByIdentifierAndChannel(identifier: string, channelId: string): Promise<Array<IWalletDocument>>;
    findAllAddresses(): Promise<Array<IWalletDocument>>;
    findChannelAndLabelByAddress(address: string): Promise<Array<IWalletDocument>>;
}

const walletSchema = new mongoose.Schema({
    label: String,
    address: { type: String, required: true },
    channelId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    createdBy: { type: String, required: true }
});

walletSchema.statics.findByAddressAndChannel = function(address: string, channelId: string) {
    return this.find({ address, channelId });
}

walletSchema.statics.findByLabelAndChannel = function(label: string, channelId: string) {
    return this.find({ label, channelId });
}

walletSchema.statics.findByIdentifierAndChannel = function(identifier: string, channelId: string) {
    return this.find({ channelId, $or: [ { address: identifier }, { label: identifier } ] });
}

walletSchema.statics.findAllAddresses = function() {
    return this.find().select({ address: 1 });
}

walletSchema.statics.findChannelAndLabelByAddress = function(address: string) {
    return this.find({ address }).select({ channelId: 1, label: 1 });
}

export const Wallet = mongoose.model<IWalletDocument, IWalletModel>('Wallet', walletSchema);