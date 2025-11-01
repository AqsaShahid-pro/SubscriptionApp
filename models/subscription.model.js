import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['PKR', 'USD', 'EUR', 'GBP', 'JPY'],
        default: 'PKR',
    },
    frequence: {
        type: String,
        enum: ['Monthly', 'Yearly', 'Weekly', 'Daily'],
    },
    category: {
        type: String,
        enum: ['Entertainment', 'Education', 'Productivity', 'Health', 'Technology', 'Sports', 'Other'],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Cancelled', 'Pending', 'Expired'],
        default: 'Active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date cannot be in the future'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true });

//autocalculate renewal date if it is missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            Daily: 1,
            Weekly: 7,
            Monthly: 30,
            Yearly: 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    };

    //auto update the ststus if the renewal date is passed
    if (this.renewalDate < new Date()) {
        this.status = 'Expired';
    }

    next();
});

const Subscription = new mongoose.model('Subscription', subscriptionSchema);

export default Subscription;