import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUsersSubscription } from '../controllers/subscription.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({ title: 'get all subscriptions' });
});

subscriptionRouter.get('/:id', (req, res) => {
    res.send({ title: 'get a subscription by id' });
});

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => {
    res.send({ title: 'update a subscription' });
});

subscriptionRouter.delete('/', (req, res) => {
    res.send({ title: 'delete a subcription' });
});

subscriptionRouter.get('/user/:id', authorize, getUsersSubscription);

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({ title: 'Get upcoming renewals' });
});

export default subscriptionRouter;